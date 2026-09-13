from flask import Flask, request
from flask_cors import CORS
from database import get_db_connection
from Authentication.auth import auth_bp, token_required

app = Flask(__name__)
CORS(app)



app.register_blueprint(auth_bp)
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
@token_required
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

        user_id = request.user_id
        account_name = data.get("account_name")
        account_type = data.get("account_type")
        opening_balance = data.get("opening_balance")
        currency = data.get("currency", "INR")

        if (
            not account_name
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
@token_required
def get_accounts():
    connection = None
    cursor = None

    try:
        user_id = request.user_id

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
@token_required
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

        user_id = request.user_id
        account_name = data.get("account_name")
        account_type = data.get("account_type")
        opening_balance = data.get("opening_balance")
        currency = data.get("currency", "INR")

        if (
            not account_name
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
@token_required
def delete_account(account_id):
    connection = None
    cursor = None

    try:
        user_id = request.user_id

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
# ADD TRANSACTION
# ============================================================

@app.route("/api/transactions", methods=["POST"])
@token_required

def add_transaction():
    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return {
                "status": "error",
                "message": "Request body is required"
            }, 400

        user_id = request.user_id
        account_id = data.get("account_id")
        category_id = data.get("category_id")
        transaction_type = data.get("transaction_type")
        amount = data.get("amount")
        description = data.get("description")
        transaction_date = data.get("transaction_date")

        if (
            account_id is None
            or category_id is None
            or not transaction_type
            or amount is None
            or not transaction_date
        ):
            return {
                "status": "error",
                "message": "All required fields must be provided"
            }, 400

        transaction_type = transaction_type.upper()

        if transaction_type not in ["INCOME", "EXPENSE"]:
            return {
                "status": "error",
                "message": "transaction_type must be INCOME or EXPENSE"
            }, 400

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            return {
                "status": "error",
                "message": "Amount must be a valid number"
            }, 400

        if amount <= 0:
            return {
                "status": "error",
                "message": "Amount must be greater than 0"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()
        # Verify that the account belongs to the logged-in user
        cursor.execute(
            """
            SELECT account_id
            FROM accounts
            WHERE account_id = %s
            AND user_id = %s
            """,
            (account_id, user_id)
        )

        account = cursor.fetchone()

        if not account:
            return {
                "status": "error",
                "message": "Account does not belong to the authenticated user"
            }, 403

        cursor.execute(
        """
            SELECT category_id
            FROM categories
            WHERE category_id = %s
            AND user_id = %s
            """,
            (category_id, user_id)
        )

        category = cursor.fetchone()

        if not category:
            return {
                "status": "error",
                "message": "Category does not belong to the authenticated user"
            }, 403

        query = """
            INSERT INTO transactions
            (
                user_id,
                account_id,
                category_id,
                transaction_type,
                amount,
                description,
                transaction_date
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING
                transaction_id,
                user_id,
                account_id,
                category_id,
                transaction_type,
                amount,
                description,
                transaction_date,
                created_at
        """

        cursor.execute(
            query,
            (
                user_id,
                account_id,
                category_id,
                transaction_type,
                amount,
                description,
                transaction_date
            )
        )

        transaction = cursor.fetchone()

        connection.commit()

        return {
            "status": "success",
            "message": "Transaction created successfully",
            "transaction": {
                "transaction_id": transaction[0],
                "user_id": transaction[1],
                "account_id": transaction[2],
                "category_id": transaction[3],
                "transaction_type": transaction[4],
                "amount": float(transaction[5]),
                "description": transaction[6],
                "transaction_date": transaction[7].isoformat(),
                "created_at": transaction[8].isoformat()
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
# GET ALL TRANSACTIONS
# ============================================================

@app.route("/api/transactions", methods=["GET"])
@token_required
def get_transactions():
    connection = None
    cursor = None

    try:
        user_id = request.user_id

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            SELECT
                transaction_id,
                user_id,
                account_id,
                category_id,
                transaction_type,
                amount,
                description,
                transaction_date,
                created_at
            FROM transactions
            WHERE user_id = %s
            ORDER BY transaction_date DESC, transaction_id DESC
        """

        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()

        transactions = []

        for row in rows:
            transactions.append({
                "transaction_id": row[0],
                "user_id": row[1],
                "account_id": row[2],
                "category_id": row[3],
                "transaction_type": row[4],
                "amount": float(row[5]),
                "description": row[6],
                "transaction_date": row[7].isoformat(),
                "created_at": row[8].isoformat() if row[8] else None
            })

        return {
            "status": "success",
            "count": len(transactions),
            "transactions": transactions
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
# UPDATE TRANSACTION
# ============================================================

@app.route("/api/transactions/<int:transaction_id>", methods=["PUT"])
@token_required
def update_transaction(transaction_id):
    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return {
                "status": "error",
                "message": "Request body is required"
            }, 400

        user_id = request.user_id
        account_id = data.get("account_id")
        category_id = data.get("category_id")
        transaction_type = data.get("transaction_type")
        amount = data.get("amount")
        description = data.get("description")
        transaction_date = data.get("transaction_date")

        if (
            account_id is None
            or category_id is None
            or not transaction_type
            or amount is None
            or not transaction_date
        ):
            return {
                "status": "error",
                "message": "All required fields must be provided"
            }, 400

        transaction_type = transaction_type.upper()

        if transaction_type not in ["INCOME", "EXPENSE"]:
            return {
                "status": "error",
                "message": "transaction_type must be INCOME or EXPENSE"
            }, 400

        try:
            amount = float(amount)
        except (TypeError, ValueError):
            return {
                "status": "error",
                "message": "Amount must be a valid number"
            }, 400

        if amount <= 0:
            return {
                "status": "error",
                "message": "Amount must be greater than 0"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            UPDATE transactions
            SET
                account_id = %s,
                category_id = %s,
                transaction_type = %s,
                amount = %s,
                description = %s,
                transaction_date = %s
            WHERE
                transaction_id = %s
                AND user_id = %s
            RETURNING
                transaction_id,
                user_id,
                account_id,
                category_id,
                transaction_type,
                amount,
                description,
                transaction_date,
                created_at
        """

        cursor.execute(
            query,
            (
                account_id,
                category_id,
                transaction_type,
                amount,
                description,
                transaction_date,
                transaction_id,
                user_id
            )
        )

        transaction = cursor.fetchone()

        if not transaction:
            connection.rollback()

            return {
                "status": "error",
                "message": "Transaction not found"
            }, 404

        connection.commit()

        return {
            "status": "success",
            "message": "Transaction updated successfully",
            "transaction": {
                "transaction_id": transaction[0],
                "user_id": transaction[1],
                "account_id": transaction[2],
                "category_id": transaction[3],
                "transaction_type": transaction[4],
                "amount": float(transaction[5]),
                "description": transaction[6],
                "transaction_date": transaction[7].isoformat(),
                "created_at": transaction[8].isoformat()
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
# DELETE TRANSACTION
# ============================================================

@app.route("/api/transactions/<int:transaction_id>", methods=["DELETE"])
@token_required
def delete_transaction(transaction_id):
    connection = None
    cursor = None

    try:
        user_id = request.user_id

        if not user_id:
            return {
                "status": "error",
                "message": "user_id is required"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            DELETE FROM transactions
            WHERE
                transaction_id = %s
                AND user_id = %s
            RETURNING transaction_id
        """

        cursor.execute(
            query,
            (
                transaction_id,
                user_id
            )
        )

        deleted_transaction = cursor.fetchone()

        if not deleted_transaction:
            connection.rollback()

            return {
                "status": "error",
                "message": "Transaction not found"
            }, 404

        connection.commit()

        return {
            "status": "success",
            "message": "Transaction deleted successfully",
            "transaction_id": deleted_transaction[0]
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