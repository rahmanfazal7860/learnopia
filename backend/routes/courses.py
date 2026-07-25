from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Course
from auth_utils import role_required

courses_bp = Blueprint("courses", __name__, url_prefix="/api/courses")


@courses_bp.get("")
def list_courses():
    """Public: browse all courses. Supports ?page=&per_page= pagination."""
    page = request.args.get("page", 1, type=int)
    per_page = min(request.args.get("per_page", 10, type=int), 50)

    pagination = Course.query.order_by(Course.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    return jsonify(
        {
            "courses": [c.to_dict() for c in pagination.items],
            "total": pagination.total,
            "page": pagination.page,
            "pages": pagination.pages,
        }
    ), 200


@courses_bp.get("/<int:course_id>")
def get_course(course_id):
    course = Course.query.get_or_404(course_id)
    return jsonify(course.to_dict()), 200


@courses_bp.post("")
@jwt_required()
@role_required("instructor")
def create_course():
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()

    if not title:
        return jsonify({"error": "title is required"}), 400

    instructor_id = get_jwt_identity()
    course = Course(title=title, description=description, instructor_id=instructor_id)
    db.session.add(course)
    db.session.commit()
    return jsonify(course.to_dict()), 201


@courses_bp.put("/<int:course_id>")
@jwt_required()
@role_required("instructor")
def update_course(course_id):
    course = Course.query.get_or_404(course_id)
    instructor_id = get_jwt_identity()
    if str(course.instructor_id) != str(instructor_id):
        return jsonify({"error": "you can only edit your own courses"}), 403

    data = request.get_json(silent=True) or {}
    if "title" in data:
        course.title = data["title"].strip() or course.title
    if "description" in data:
        course.description = data["description"].strip()

    db.session.commit()
    return jsonify(course.to_dict()), 200


@courses_bp.delete("/<int:course_id>")
@jwt_required()
@role_required("instructor")
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    instructor_id = get_jwt_identity()
    if str(course.instructor_id) != str(instructor_id):
        return jsonify({"error": "you can only delete your own courses"}), 403

    db.session.delete(course)
    db.session.commit()
    return jsonify({"message": "course deleted"}), 200
