from flask import Blueprint, request, jsonify, render_template, flash
from src.services.users_service import InternalUserService

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/users/internal', methods=['POST'])
def create_user():
    request_json = request.get_json()
    name = request_json.get('name')
    email = request_json.get('email')
    password = request_json.get('password')

    user = InternalUserService.create_user(name, email, password)

    return jsonify(user.serialize), 201


@users_bp.route('/usuarios/interno/login', methods=['POST', 'GET'])
def internal_login():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')

        user = InternalUserService.login(email, password)

        if user is None:
            flash('Usuário ou senha inválidos', 'danger')
            return render_template('internal_login.html')

        return jsonify(user.serialize), 201

    return render_template('internal_login.html')

@users_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    print(user_id)
    return jsonify({'error': 'not implemented'}), 501
