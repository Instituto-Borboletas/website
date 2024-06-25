from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, make_response

from src.middlewares.auth_middleware import token_required_internal, token_required_external

pages_bp = Blueprint('pages_bp', __name__)

@pages_bp.route('/voluntario', methods=['GET'])
@token_required_external
def register_volunteer(token):
    print(token)
    return render_template('register_volunteer.html')
