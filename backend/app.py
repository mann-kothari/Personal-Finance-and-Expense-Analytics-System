from flask import Flask, request
from flask_cors import CORS
from database import get_db_connection

app = Flask(__name__)
CORS(app)


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():
    return "FinTrack Flask Backend is running"


# ============================================================
# TEST DATABASE CONNECTION
# ============================================================

@app.route("/test-db", methods=["GET"])
def test_db():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT version();")
        result = cursor.fetchone()

        return {
            "status": "success",
            "database": result[0]
        }, 200

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }, 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# ADD ACCOUNT
# ============================================================

@app.route("/api/accounts", methods=["POST"])
def add_account():
    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return {
                "status": "error",
                "message": "Request body is required"
            }, 400

        user_id = data.get("user_id")
        account_name = data.get("account_name")
        account_type = data.get("account_type")
        opening_balance = data.get("opening_balance")
        currency = data.get("currency", "INR")

        if (
            not user_id
            or not account_name
            or not account_type
            or opening_balance is None
        ):
            return {
                "status": "error",
                "message": "All required fields must be provided"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO accounts
            (
                user_id,
                account_name,
                account_type,
                opening_balance,
                currency
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING
                account_id,
                user_id,
                account_name,
                account_type,
                opening_balance,
                currency,
                created_at
        """

        cursor.execute(
            query,
            (
                user_id,
                account_name,
                account_type,
                opening_balance,
                currency
            )
        )

        account = cursor.fetchone()

        connection.commit()

        return {
            "status": "success",
            "message": "Account created successfully",
            "account": {
                "account_id": account[0],
                "user_id": account[1],
                "account_name": account[2],
                "account_type": account[3],
                "opening_balance": float(account[4]),
                "currency": account[5],
                "created_at": account[6].isoformat()
            }
        }, 201

    except Exception as e:

        if connection:
            connection.rollback()

        return {
            "status": "error",
            "message": str(e)
        }, 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# GET ALL ACCOUNTS
# ============================================================

@app.route("/api/accounts", methods=["GET"])
def get_accounts():
    connection = None
    cursor = None

    try:
        user_id = request.args.get("user_id")

        if not user_id:
            return {
                "status": "error",
                "message": "user_id is required"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            SELECT
                account_id,
                user_id,
                account_name,
                account_type,
                opening_balance,
                currency,
                created_at
            FROM accounts
            WHERE user_id = %s
            ORDER BY account_id
        """

        cursor.execute(query, (user_id,))

        rows = cursor.fetchall()

        accounts = []

        for row in rows:
            accounts.append({
                "account_id": row[0],
                "user_id": row[1],
                "account_name": row[2],
                "account_type": row[3],
                "opening_balance": float(row[4]),
                "currency": row[5],
                "created_at": row[6].isoformat()
            })

        return {
            "status": "success",
            "accounts": accounts
        }, 200

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }, 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# UPDATE ACCOUNT
# ============================================================

@app.route("/api/accounts/<int:account_id>", methods=["PUT"])
def update_account(account_id):
    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return {
                "status": "error",
                "message": "Request body is required"
            }, 400

        user_id = data.get("user_id")
        account_name = data.get("account_name")
        account_type = data.get("account_type")
        opening_balance = data.get("opening_balance")
        currency = data.get("currency", "INR")

        if (
            not user_id
            or not account_name
            or not account_type
            or opening_balance is None
        ):
            return {
                "status": "error",
                "message": "All required fields must be provided"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            UPDATE accounts
            SET
                account_name = %s,
                account_type = %s,
                opening_balance = %s,
                currency = %s
            WHERE
                account_id = %s
                AND user_id = %s
            RETURNING
                account_id,
                user_id,
                account_name,
                account_type,
                opening_balance,
                currency,
                created_at
        """

        cursor.execute(
            query,
            (
                account_name,
                account_type,
                opening_balance,
                currency,
                account_id,
                user_id
            )
        )

        account = cursor.fetchone()

        if not account:
            connection.rollback()

            return {
                "status": "error",
                "message": "Account not found"
            }, 404

        connection.commit()

        return {
            "status": "success",
            "message": "Account updated successfully",
            "account": {
                "account_id": account[0],
                "user_id": account[1],
                "account_name": account[2],
                "account_type": account[3],
                "opening_balance": float(account[4]),
                "currency": account[5],
                "created_at": account[6].isoformat()
            }
        }, 200

    except Exception as e:

        if connection:
            connection.rollback()

        return {
            "status": "error",
            "message": str(e)
        }, 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# DELETE ACCOUNT
# ============================================================

@app.route("/api/accounts/<int:account_id>", methods=["DELETE"])
def delete_account(account_id):
    connection = None
    cursor = None

    try:
        user_id = request.args.get("user_id")

        if not user_id:
            return {
                "status": "error",
                "message": "user_id is required"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            DELETE FROM accounts
            WHERE
                account_id = %s
                AND user_id = %s
            RETURNING account_id
        """

        cursor.execute(
            query,
            (
                account_id,
                user_id
            )
        )

        deleted_account = cursor.fetchone()

        if not deleted_account:
            connection.rollback()

            return {
                "status": "error",
                "message": "Account not found"
            }, 404

        connection.commit()

        return {
            "status": "success",
            "message": "Account deleted successfully",
            "account_id": deleted_account[0]
        }, 200

    except Exception as e:

        if connection:
            connection.rollback()

        return {
            "status": "error",
            "message": str(e)
        }, 500

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# RUN FLASK
# ============================================================

if __name__ == "__main__":
    app.run(debug=True)