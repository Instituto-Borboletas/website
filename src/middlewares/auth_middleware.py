from functools import wraps
from flask import redirect, url_for, request, flash

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
        token = request.cookies.get('token')
        current_path = request.path
        print(request)

        if token is None:
            if current_path == '/voluntario':
                flash('Você precisa estar logado para registrar seu interesse em ser voluntário', 'warning')
                return redirect(url_for('users_bp.external_login', next=request.url))

            return redirect(url_for('users_bp.external_login'))

        return f(token, *args, **kwargs)

    return decorated
