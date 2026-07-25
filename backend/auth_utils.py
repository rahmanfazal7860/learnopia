from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt


def role_required(*allowed_roles):
    """Decorator enforcing Role-Based Access Control on a route.

    Usage:
        @role_required("instructor")
        def create_course(): ...
    Must be used together with @jwt_required() (applied first).
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            role = claims.get("role")
            if role not in allowed_roles:
                return jsonify({"error": "Forbidden: insufficient permissions"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator
