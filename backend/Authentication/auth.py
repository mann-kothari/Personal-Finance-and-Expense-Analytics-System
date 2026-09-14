from flask import Blueprint, request
from database import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timedelta, timezone
from functools import wraps


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)

def generate_token(user_id, email):
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24)
    }

    token = jwt.encode(
        payload,
        os.getenv("JWT_SECRET_KEY"),
        algorithm="HS256"
    )

    return token

def token_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return {
                "status": "error",
                "message": "Authorization token is required"
            }, 401

        if not auth_header.startswith("Bearer "):
            return {
                "status": "error",
                "message": "Invalid authorization format"
            }, 401

        token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(
                token,
                os.getenv("JWT_SECRET_KEY"),
                algorithms=["HS256"]
            )

            request.user_id = payload.get("user_id")

            if not request.user_id:
                return {
                    "status": "error",
                    "message": "Invalid token payload"
                }, 401

        except jwt.ExpiredSignatureError:
            return {
                "status": "error",
                "message": "Token has expired"
            }, 401

        except jwt.InvalidTokenError:
            return {
                "status": "error",
                "message": "Invalid token"
            }, 401

        return f(*args, **kwargs)

    return decorated



@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user():

    connection = None
    cursor = None

    try:
        user_id = request.user_id

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                user_id,
                name,
                email,
                created_at
            FROM users
            WHERE user_id = %s
            """,
            (user_id,)
        )

        user = cursor.fetchone()

        if not user:
            return {
                "status": "error",
                "message": "User not found"
            }, 404

        return {
            "status": "success",
            "user": {
                "user_id": user[0],
                "name": user[1],
                "email": user[2],
                "created_at": user[3].isoformat()
            }
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

# test
@auth_bp.route("/protected", methods=["GET"])
@token_required
def protected():

    return {
        "status": "success",
        "message": "You are authenticated",
        "user_id": request.user_id
    }, 200

# ============================================================
# USER LOGIN
# ============================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return {
                "status": "error",
                "message": "Request body is required"
            }, 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {
                "status": "error",
                "message": "Email and password are required"
            }, 400

        email = email.strip().lower()

        connection = get_db_connection()
        cursor = connection.cursor()

        # Find user by email
        cursor.execute(
            """
            SELECT
                user_id,
                name,
                email,
                password_hash
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()

        # User does not exist
        if not user:
            return {
                "status": "error",
                "message": "Invalid email or password"
            }, 401

        # Verify password
        password_valid = check_password_hash(
            user[3],
            password
        )

        if not password_valid:
            return {
                "status": "error",
                "message": "Invalid email or password"
            }, 401

        # Generate JWT token
        token = generate_token(
            user[0],
            user[2]
        )

        return {
            "status": "success",
            "message": "Login successful",
            "token": token,
            "user": {
                "user_id": user[0],
                "name": user[1],
                "email": user[2]
            }
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
# USER REGISTRATION
# ============================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    connection = None
    cursor = None

    try:
        # Get JSON data from request
        data = request.get_json()

        if not data:
            return {
                "status": "error",
                "message": "Request body is required"
            }, 400

        # Read user information
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        # Validate required fields
        if not name or not email or not password:
            return {
                "status": "error",
                "message": "Name, email and password are required"
            }, 400

        # Clean input
        name = name.strip()
        email = email.strip().lower()

        # Basic password validation
        if len(password) < 6:
            return {
                "status": "error",
                "message": "Password must contain at least 6 characters"
            }, 400

        # Connect to database
        connection = get_db_connection()
        cursor = connection.cursor()

        # Check if email already exists
        cursor.execute(
            """
            SELECT user_id
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return {
                "status": "error",
                "message": "Email already registered"
            }, 409

        # Hash the password
        password_hash = generate_password_hash(password)

        # Insert new user
        cursor.execute(
            """
            INSERT INTO users
            (
                name,
                email,
                password_hash
            )
            VALUES (%s, %s, %s)
            RETURNING
                user_id,
                name,
                email,
                created_at
            """,
            (
                name,
                email,
                password_hash
            )
        )

        user = cursor.fetchone()

        # Get the newly created user's ID
        user_id = user[0]

        # Create default categories for this user
        default_categories = [
            ("Food", "EXPENSE"),
            ("Travel", "EXPENSE"),
            ("Shopping", "EXPENSE"),
            ("Bills", "EXPENSE"),
            ("Entertainment", "EXPENSE"),
            ("Salary", "INCOME"),
            ("Freelance", "INCOME"),
            ("Other Income", "INCOME")
        ]

        cursor.executemany(
            """
            INSERT INTO categories
            (
                user_id,
                category_name,
                category_type
            )
            VALUES (%s, %s, %s)
            """,
            [
                (user_id, category_name, category_type)
                for category_name, category_type in default_categories
            ]
        )

        # Save user + categories together
        connection.commit()

        return {
            "status": "success",
            "message": "User registered successfully",
            "user": {
                "user_id": user[0],
                "name": user[1],
                "email": user[2],
                "created_at": user[3].isoformat()
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