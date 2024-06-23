import hashlib

from src.models.users import InternalUser, ExternalUser
from src.services.sessions_service import SessionsService
from src.database import db

def hash_password(password):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(password.encode('utf-8'))
    return sha256_hash.hexdigest()

class InternalUserService:
    @staticmethod
    def create_user(current_user_token, name, email, password):
        # session = SessionsService.find_session(current_user_token)
        # if session is None:
        #     raise Exception('Invalid session')

        password_hash = hash_password(password)
        new_user = InternalUser(name=name, email=email, password_hash=password_hash)

        try:
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            if 'Duplicate entry' in str(e) and 'internal_users.users_email_index' in str(e):
                raise Exception('User already exists')
            raise e

        return new_user

    @staticmethod
    def login(email, password):
        password_hash = hash_password(password)
        user = InternalUser.query.filter_by(email=email, password_hash=password_hash).first()

        if user is None:
            return None, None

        session = SessionsService.create_session(user.id)
        return session, user

    @staticmethod
    def logout(token):
        SessionsService.delete_session(token)

    @staticmethod
    def list_users(token):
        session = SessionsService.find_session(token)
        if session is None:
            return None

        users = InternalUser.query.all()
        return [user.serialize_html for user in users]

    @staticmethod
    def get_dashboard_data(token):
        session = SessionsService.find_session(token)
        if session is None:
            return None

        user = InternalUser.query.get(session.user_id)
        if user is None:
            return None

        return {
            'user': user.serialize
        }

    @staticmethod
    def session_details(token):
        session = SessionsService.find_session(token)

        if session is None:
            return None

        return session.serialize
