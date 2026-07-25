import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # For local dev without MySQL set up, SQLite is used automatically.
    # To use MySQL, set DATABASE_URL, e.g.:
    # mysql+pymysql://<user>:<password>@localhost:3306/learnopia
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(basedir, 'learnopia.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-this-secret-in-production")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=6)

    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
