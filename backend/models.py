from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    # role: "student" or "instructor" -> drives Role-Based Access Control
    role = db.Column(db.String(20), nullable=False, default="student")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    courses_taught = db.relationship("Course", backref="instructor", lazy=True)
    enrollments = db.relationship("Enrollment", backref="student", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat(),
        }


class Course(db.Model):
    __tablename__ = "courses"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, default="")
    instructor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    enrollments = db.relationship(
        "Enrollment", backref="course", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self, include_instructor=True):
        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "instructor_id": self.instructor_id,
            "created_at": self.created_at.isoformat(),
            "enrolled_count": len(self.enrollments),
        }
        if include_instructor and self.instructor:
            data["instructor_name"] = self.instructor.name
        return data


class Enrollment(db.Model):
    __tablename__ = "enrollments"
    __table_args__ = (
        db.UniqueConstraint("student_id", "course_id", name="uq_student_course"),
    )

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)

    progress = db.relationship(
        "Progress", backref="enrollment", uselist=False, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "course_id": self.course_id,
            "course_title": self.course.title if self.course else None,
            "enrolled_at": self.enrolled_at.isoformat(),
            "percent_complete": self.progress.percent_complete if self.progress else 0,
        }


class Progress(db.Model):
    __tablename__ = "progress"

    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(
        db.Integer, db.ForeignKey("enrollments.id"), nullable=False, unique=True
    )
    percent_complete = db.Column(db.Integer, default=0)
    last_updated = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "enrollment_id": self.enrollment_id,
            "percent_complete": self.percent_complete,
            "last_updated": self.last_updated.isoformat(),
        }
