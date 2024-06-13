from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, make_response
from src.services.users_service import InternalUserService

users_bp = Blueprint('users_bp', __name__)

@users_bp.route('/users/internal', methods=['POST'])
def create_user():
    token = request.cookies.get('token')
    if token is None:
        return redirect(url_for('users_bp.internal_login'))

    request_json = request.get_json()
    name = request_json.get('name')
    email = request_json.get('email')
    password = request_json.get('password')

    try:
        user = InternalUserService.create_user(token, name, email, password)
        return jsonify(user.serialize), 201
    except Exception as e:
        if str(e) == 'Invalid session':
            return jsonify({'error': 'Invalid session'}), 401

        if str(e) == 'User already exists':
            return jsonify({'message': 'Já existe um usuário com esse email'}), 409

        return jsonify({'error': 'Internal server error'}), 500


@users_bp.route('/usuarios/interno/login', methods=['POST', 'GET'])
def internal_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        session, user = InternalUserService.login(email, password)

        if user is None:
            flash('Usuário ou senha inválidos', 'danger')
            return render_template('internal_login.html')

        if session is None:
            flash('Erro ao criar sessão', 'danger')
            return render_template('internal_login.html')

        response = make_response(redirect(url_for('users_bp.internal_dashboard')))
        response.set_cookie(
            'token',
            session.token,
            httponly=True,
            samesite='Strict',
            max_age=60 * 60 * 12
        )

        return response

    return render_template('internal_login.html')

@users_bp.route('/usuarios/interno/logout', methods=['GET'])
def internal_logout():
    token = request.cookies.get('token')

    if token is not None:
        InternalUserService.logout(token)

    response = make_response(redirect(url_for('users_bp.internal_login')))

    response.set_cookie(
        'token',
        '',
        httponly=True,
        samesite='Strict',
        max_age=0
    )

    return response

@users_bp.route('/interno', methods=['GET'])
def internal_dashboard():
    token = request.cookies.get('token')

    if token is None:
        return redirect(url_for('users_bp.internal_login'))

    data = InternalUserService.get_dashboard_data(token)

    if data is None:
        return redirect(url_for('users_bp.internal_login'))

    return render_template('internal_dashboard.html', data=data)

@users_bp.route('/interno/internos', methods=['GET'])
def internal_users_crud():
    token = request.cookies.get('token')

    if token is None:
        return redirect(url_for('users_bp.internal_login'))

    data = InternalUserService.list_users(token)
    if data is None:
        data = []

    return render_template('list_internal_users.html', data=data)

@users_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    print(user_id)
    return jsonify({'error': 'not implemented'}), 501
