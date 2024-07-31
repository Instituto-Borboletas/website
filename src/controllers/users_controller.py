from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, make_response
from src.models.users import UserType
from src.services.users_service import UserService
from src.services.helps_service import HelpsService, HelpRequest
from src.middlewares.auth_middleware import token_required_external, token_required_internal

users_bp = Blueprint('users_bp', __name__)

internal_user_service = UserService(UserType.internal)
external_user_service = UserService(UserType.external)

@users_bp.route('/usuarios/interno', methods=['POST'])
@token_required_internal
def create_user(session_token):
    request_json = request.get_json()
    name = request_json.get('name')
    email = request_json.get('email')
    password = request_json.get('password')

    try:
        user = internal_user_service.register_user(name, email, password)
        return jsonify(user.serialize), 201
    except Exception as e:
        if str(e) == 'User already exists':
            return jsonify({'message': 'Já existe um usuário com esse email'}), 409
        raise e

@users_bp.route('/usuarios/interno/login', methods=['POST', 'GET'])
def internal_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        session, user = internal_user_service.login(email, password)

        if user is None:
            flash('Usuário ou senha inválidos', 'danger')
            return render_template('internal_login.html')

        if session is None:
            flash('Erro ao criar sessão', 'danger')
            return render_template('internal_login.html')

        print(session.id)

        response = make_response(redirect(url_for('users_bp.internal_dashboard')))
        response.set_cookie(
            'token',
            str(session.id),
            httponly=True,
            samesite='Strict',
            max_age=60 * 60 * 12
        )

        return response

    return render_template('internal_login.html')

@users_bp.route('/usuarios/interno/logout', methods=['GET'])
@token_required_internal
def internal_logout(token):
    internal_user_service.logout(token)

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
@token_required_internal
def internal_dashboard(token):
    user = internal_user_service.find_user_by_session_token(token)

    if user is None:
        raise Exception('Invalid session')

    data = {
        'user': user.serialize,
    }

    return render_template('internal_dashboard.html', data=data)

@users_bp.route('/interno/usuarios/internos', methods=['GET'])
@token_required_internal
def internal_users_crud(token):
    data = internal_user_service.list_users()
    if data is None:
        data = []

    return render_template('list_internal_users.html', data=data)

# TODO: listagem de usuarios externos
# @users_bp.route('/interno/externos', methods=['GET'])
# @token_required_internal
# def internal_users_crud(token):

# @users_bp.route('/users/<int:user_id>', methods=['PUT'])
# @token_required_internal
# def update_user(token, user_id):
#     print(user_id)
#     return jsonify({'error': 'not implemented'}), 501

@users_bp.route('/eu', methods=['GET', 'POST'])
@token_required_external
def detail_session_user(token):
    session = internal_user_service.find_user_by_session_token(token)
    if session is None:
        raise Exception('Invalid session')

    user = None

    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        user = external_user_service.update_user(session.user_id, name, email)
    if request.method == 'GET':
        user = external_user_service.find_user_by_id(session.phone)

    if user is None:
        raise Exception('User not found')

    helps = HelpsService.list_user_requests(user)
    helps = [help.serialize for help in helps]
    # volunteers = external_user_service.list_volunteers_from_user(session['user_id'])

    return render_template('meus_dados.html', user=user.serialize, helps=helps)

@users_bp.route('/logout', methods=['POST', 'GET'])
def external_logout():
    response = make_response(redirect(url_for('index')))
    response.set_cookie(
        'token',
        '',
        httponly=True,
        samesite='Strict',
        max_age=0
    )

    return response

@users_bp.route('/login', methods=['POST', 'GET'])
def external_login():
    next_page = request.args.get('next')

    if request.method == 'POST':
        request_json = request.get_json()
        email = request_json.get('email')
        password = request_json.get('password')

        session, user = external_user_service.login(email, password)

        if user is None:
            flash('Usuário ou senha inválidos', 'danger')
            return render_template('external_login.html', next=next_page)

        if session is None:
            flash('Erro ao criar sessão', 'danger')
            return render_template('external_login.html', next=next_page)

        response = make_response(redirect(next_page or url_for('users_bp.detail_session_user')))
        response.set_cookie(
            'token',
            session.token,
            httponly=True,
            samesite='Strict',
            max_age=60 * 60 * 12
        )

        return response

    return render_template('external_login.html', next=next_page)

@users_bp.route('/cadastro', methods=['POST', 'GET'])
def external_register():
    next_page = request.args.get('next')

    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        phone = request.form.get('phone')
        password = request.form.get('password')

        data = {
            'name': name,
            'email': email,
            'phone': phone,
            'password': password,
        }

        if name is None or len(name) < 3:
            flash('Nome invalido, insira seu nome completo por favor', 'danger')
            return render_template('external_register.html', next=next_page, data=data)


        if phone is None or len(phone) < 10 or len(phone) > 11:
            flash('Telefone invalido, insira um telefone válido', 'danger')
            return render_template('external_register.html', next=next_page, data=data)

        try:
            user = external_user_service.register_user(name, email, password, phone)
            if user is None:
                flash('Erro ao cadastrar usuário, tente novamente mais tarde', 'danger')
                return render_template('external_register.html', next=next_page, data=data)

            return redirect(url_for('users_bp.external_login'))
        except Exception as e:
            if 'User already exists' in str(e):
                flash('Um usuário com esse mesmo email já existe', 'danger')
                return render_template('external_register.html', next=next_page, data=data)
            raise e

    return render_template('external_register.html', next=next_page, data={})
