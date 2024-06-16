from functools import wraps
from flask import redirect, url_for, request

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
        if token is None:
            return redirect(url_for('users_bp.external_login'))

        return f(token, *args, **kwargs)

    return decorated
