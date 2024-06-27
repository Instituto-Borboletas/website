from functools import wraps
from flask import redirect, session, url_for, request, flash
from src.services.sessions_service import SessionsService

def token_required_internal(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('token')
        if token is None:
            return redirect(url_for('users_bp.internal_login'))

        return f(token, *args, **kwargs)

    return decorated

def token_required_external(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_path = request.path
        token = request.cookies.get('token')
        session_exists = None

        if token is not None:
            session_exists = SessionsService.exists_external(token)

        if not session_exists:
            if current_path == '/voluntario':
                flash('Você precisa estar logado para registrar seu interesse em ser voluntário', 'warning')
                return redirect(url_for('users_bp.external_login', next=request.url))

            if current_path == '/ajuda':
                flash('Você precisa estar logado para pedir ajuda', 'warning')
                return redirect(url_for('users_bp.external_login', next=request.url))

            return redirect(url_for('users_bp.external_login'))

        return f(token, *args, **kwargs)

    return decorated
