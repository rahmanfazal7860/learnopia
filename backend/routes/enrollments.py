from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Course, Enrollment, Progress
from auth_utils import role_required

enrollments_bp = Blueprint("enrollments", __name__, url_prefix="/api/enrollments")


@enrollments_bp.post("")
@jwt_required()
@role_required("student")
def enroll():
    data = request.get_json(silent=True) or {}
    course_id = data.get("course_id")
    student_id = get_jwt_identity()

    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "course not found"}), 404

    existing = Enrollment.query.filter_by(student_id=student_id, course_id=course_id).first()
    if existing:
        return jsonify({"error": "already enrolled in this course"}), 409

    enrollment = Enrollment(student_id=student_id, course_id=course_id)
    db.session.add(enrollment)
    db.session.flush()  # get enrollment.id before commit

    progress = Progress(enrollment_id=enrollment.id, percent_complete=0)
    db.session.add(progress)
    db.session.commit()

    return jsonify(enrollment.to_dict()), 201


@enrollments_bp.get("/me")
@jwt_required()
@role_required("student")
def my_enrollments():
    student_id = get_jwt_identity()
    enrollments = Enrollment.query.filter_by(student_id=student_id).all()
    return jsonify([e.to_dict() for e in enrollments]), 200


@enrollments_bp.patch("/<int:enrollment_id>/progress")
@jwt_required()
@role_required("student")
def update_progress(enrollment_id):
    student_id = get_jwt_identity()
    enrollment = Enrollment.query.get_or_404(enrollment_id)

    if str(enrollment.student_id) != str(student_id):
        return jsonify({"error": "you can only update your own progress"}), 403

    data = request.get_json(silent=True) or {}
    percent = data.get("percent_complete")

    if percent is None or not isinstance(percent, (int, float)) or not (0 <= percent <= 100):
        return jsonify({"error": "percent_complete must be a number between 0 and 100"}), 400

    if not enrollment.progress:
        enrollment.progress = Progress(enrollment_id=enrollment.id)

    enrollment.progress.percent_complete = int(percent)
    db.session.commit()

    return jsonify(enrollment.to_dict()), 200
