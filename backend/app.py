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
            user_id is None
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
# ADD TRANSACTION
# ============================================================

@app.route("/api/transactions", methods=["POST"])
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

        user_id = data.get("user_id")
        account_id = data.get("account_id")
        category_id = data.get("category_id")
        transaction_type = data.get("transaction_type")
        amount = data.get("amount")
        description = data.get("description")
        transaction_date = data.get("transaction_date")

        if (
            user_id is None
            or account_id is None
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
def get_transactions():
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

        user_id = data.get("user_id")
        account_id = data.get("account_id")
        category_id = data.get("category_id")
        transaction_type = data.get("transaction_type")
        amount = data.get("amount")
        description = data.get("description")
        transaction_date = data.get("transaction_date")

        if (
            user_id is None
            or account_id is None
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
def delete_transaction(transaction_id):
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
# BUDGET MANAGEMENT
# ============================================================

@app.route("/api/budgets", methods=["POST"])
def create_budget():
    connection = None
    cursor = None

    try:
        data = request.get_json()

        user_id = data.get("user_id")
        category_id = data.get("category_id")
        budget_name = data.get("budget_name")
        amount = data.get("amount")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not user_id or not category_id or amount is None or not start_date or not end_date:
            return {
                "status": "error",
                "message": "user_id, category_id, amount, start_date and end_date are required"
            }, 400

        amount = float(amount)

        if amount <= 0:
            return {
                "status": "error",
                "message": "Budget amount must be greater than 0"
            }, 400

        if end_date < start_date:
            return {
                "status": "error",
                "message": "end_date cannot be before start_date"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO budgets
            (user_id, category_id, budget_name, amount, start_date, end_date)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING budget_id, user_id, category_id, budget_name,
                      amount, start_date, end_date, created_at
        """

        cursor.execute(query, (
            user_id,
            category_id,
            budget_name,
            amount,
            start_date,
            end_date
        ))

        budget = cursor.fetchone()
        connection.commit()

        return {
            "status": "success",
            "message": "Budget created successfully",
            "budget": {
                "budget_id": budget[0],
                "user_id": budget[1],
                "category_id": budget[2],
                "budget_name": budget[3],
                "amount": float(budget[4]),
                "start_date": str(budget[5]),
                "end_date": str(budget[6]),
                "created_at": str(budget[7])
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


@app.route("/api/budgets", methods=["GET"])
def get_budgets():
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
            SELECT budget_id, user_id, category_id, budget_name,
                   amount, start_date, end_date, created_at
            FROM budgets
            WHERE user_id = %s
            ORDER BY budget_id
        """

        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()

        budgets = []

        for row in rows:
            budgets.append({
                "budget_id": row[0],
                "user_id": row[1],
                "category_id": row[2],
                "budget_name": row[3],
                "amount": float(row[4]),
                "start_date": str(row[5]),
                "end_date": str(row[6]),
                "created_at": str(row[7])
            })

        return {
            "status": "success",
            "count": len(budgets),
            "budgets": budgets
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


@app.route("/api/budgets/<int:budget_id>", methods=["PUT"])
def update_budget(budget_id):
    connection = None
    cursor = None

    try:
        data = request.get_json()

        user_id = data.get("user_id")
        category_id = data.get("category_id")
        budget_name = data.get("budget_name")
        amount = data.get("amount")
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if not user_id or not category_id or amount is None or not start_date or not end_date:
            return {
                "status": "error",
                "message": "user_id, category_id, amount, start_date and end_date are required"
            }, 400

        amount = float(amount)

        if amount <= 0:
            return {
                "status": "error",
                "message": "Budget amount must be greater than 0"
            }, 400

        if end_date < start_date:
            return {
                "status": "error",
                "message": "end_date cannot be before start_date"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            UPDATE budgets
            SET category_id = %s,
                budget_name = %s,
                amount = %s,
                start_date = %s,
                end_date = %s
            WHERE budget_id = %s
              AND user_id = %s
            RETURNING budget_id, user_id, category_id, budget_name,
                      amount, start_date, end_date, created_at
        """

        cursor.execute(query, (
            category_id,
            budget_name,
            amount,
            start_date,
            end_date,
            budget_id,
            user_id
        ))

        budget = cursor.fetchone()

        if not budget:
            connection.rollback()

            return {
                "status": "error",
                "message": "Budget not found"
            }, 404

        connection.commit()

        return {
            "status": "success",
            "message": "Budget updated successfully",
            "budget": {
                "budget_id": budget[0],
                "user_id": budget[1],
                "category_id": budget[2],
                "budget_name": budget[3],
                "amount": float(budget[4]),
                "start_date": str(budget[5]),
                "end_date": str(budget[6]),
                "created_at": str(budget[7])
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


@app.route("/api/budgets/<int:budget_id>", methods=["DELETE"])
def delete_budget(budget_id):
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
            DELETE FROM budgets
            WHERE budget_id = %s
              AND user_id = %s
            RETURNING budget_id
        """

        cursor.execute(query, (budget_id, user_id))

        deleted_budget = cursor.fetchone()

        if not deleted_budget:
            connection.rollback()

            return {
                "status": "error",
                "message": "Budget not found"
            }, 404

        connection.commit()

        return {
            "status": "success",
            "message": "Budget deleted successfully",
            "budget_id": deleted_budget[0]
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
# SAVINGS GOALS MANAGEMENT
# ============================================================

@app.route("/api/goals", methods=["POST"])
def create_goal():
    connection = None
    cursor = None

    try:
        data = request.get_json()

        user_id = data.get("user_id")
        goal_name = data.get("goal_name")
        target_amount = data.get("target_amount")
        current_amount = data.get("current_amount", 0)
        target_date = data.get("target_date")
        description = data.get("description")
        status = data.get("status", "ACTIVE")

        if not user_id or not goal_name or target_amount is None:
            return {
                "status": "error",
                "message": "user_id, goal_name and target_amount are required"
            }, 400

        target_amount = float(target_amount)
        current_amount = float(current_amount)

        if target_amount <= 0:
            return {
                "status": "error",
                "message": "Target amount must be greater than 0"
            }, 400

        if current_amount < 0:
            return {
                "status": "error",
                "message": "Current amount cannot be negative"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO savings_goals
            (user_id, goal_name, target_amount, current_amount,
             target_date, description, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING goal_id, user_id, goal_name, target_amount,
                      current_amount, target_date, description,
                      status, created_at
        """

        cursor.execute(query, (
            user_id,
            goal_name,
            target_amount,
            current_amount,
            target_date,
            description,
            status
        ))

        goal = cursor.fetchone()
        connection.commit()

        return {
            "status": "success",
            "message": "Savings goal created successfully",
            "goal": {
                "goal_id": goal[0],
                "user_id": goal[1],
                "goal_name": goal[2],
                "target_amount": float(goal[3]),
                "current_amount": float(goal[4]),
                "target_date": str(goal[5]) if goal[5] else None,
                "description": goal[6],
                "status": goal[7],
                "created_at": str(goal[8])
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


@app.route("/api/goals", methods=["GET"])
def get_goals():
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
            SELECT goal_id, user_id, goal_name, target_amount,
                   current_amount, target_date, description,
                   status, created_at
            FROM savings_goals
            WHERE user_id = %s
            ORDER BY goal_id
        """

        cursor.execute(query, (user_id,))
        rows = cursor.fetchall()

        goals = []

        for row in rows:
            goals.append({
                "goal_id": row[0],
                "user_id": row[1],
                "goal_name": row[2],
                "target_amount": float(row[3]),
                "current_amount": float(row[4]),
                "target_date": str(row[5]) if row[5] else None,
                "description": row[6],
                "status": row[7],
                "created_at": str(row[8])
            })

        return {
            "status": "success",
            "count": len(goals),
            "goals": goals
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


@app.route("/api/goals/<int:goal_id>", methods=["PUT"])
def update_goal(goal_id):
    connection = None
    cursor = None

    try:
        data = request.get_json()

        user_id = data.get("user_id")
        goal_name = data.get("goal_name")
        target_amount = data.get("target_amount")
        current_amount = data.get("current_amount")
        target_date = data.get("target_date")
        description = data.get("description")
        status = data.get("status")

        if not user_id or not goal_name or target_amount is None or current_amount is None:
            return {
                "status": "error",
                "message": "user_id, goal_name, target_amount and current_amount are required"
            }, 400

        target_amount = float(target_amount)
        current_amount = float(current_amount)

        if target_amount <= 0:
            return {
                "status": "error",
                "message": "Target amount must be greater than 0"
            }, 400

        if current_amount < 0:
            return {
                "status": "error",
                "message": "Current amount cannot be negative"
            }, 400

        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            UPDATE savings_goals
            SET goal_name = %s,
                target_amount = %s,
                current_amount = %s,
                target_date = %s,
                description = %s,
                status = %s
            WHERE goal_id = %s
              AND user_id = %s
            RETURNING goal_id, user_id, goal_name, target_amount,
                      current_amount, target_date, description,
                      status, created_at
        """

        cursor.execute(query, (
            goal_name,
            target_amount,
            current_amount,
            target_date,
            description,
            status,
            goal_id,
            user_id
        ))

        goal = cursor.fetchone()

        if not goal:
            connection.rollback()

            return {
                "status": "error",
                "message": "Savings goal not found"
            }, 404

        connection.commit()

        return {
            "status": "success",
            "message": "Savings goal updated successfully",
            "goal": {
                "goal_id": goal[0],
                "user_id": goal[1],
                "goal_name": goal[2],
                "target_amount": float(goal[3]),
                "current_amount": float(goal[4]),
                "target_date": str(goal[5]) if goal[5] else None,
                "description": goal[6],
                "status": goal[7],
                "created_at": str(goal[8])
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


@app.route("/api/goals/<int:goal_id>", methods=["DELETE"])
def delete_goal(goal_id):
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
            DELETE FROM savings_goals
            WHERE goal_id = %s
              AND user_id = %s
            RETURNING goal_id
        """

        cursor.execute(query, (goal_id, user_id))

        deleted_goal = cursor.fetchone()

        if not deleted_goal:
            connection.rollback()

            return {
                "status": "error",
                "message": "Savings goal not found"
            }, 404

        connection.commit()

        return {
            "status": "success",
            "message": "Savings goal deleted successfully",
            "goal_id": deleted_goal[0]
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