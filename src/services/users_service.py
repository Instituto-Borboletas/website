from src.models.users import User, UserType, ExternalUserData, UserNotFoundException, hash_password
from src.services.sessions_service import SessionsService
from src.database import db

class UserService:
    def __init__(self, user_type: UserType):
        self.user_type = user_type

    def register_user(self, name, email, password, phone=None):
        user = User(name=name, email=email, password=password, user_type=self.user_type)
        db.session.add(user)
        db.session.commit()

        return user

    def find_user_by_id(self, user_id):
        return User.query.filter_by(id=user_id).first()

    def find_user_by_session_token(self, token):
        session = SessionsService.find_session(token)
        if session is None:
            return None

        return self.find_user_by_id(session.user_id)

    def list_users(self):
        return User.query.all()

    def update_user(self, user_id, name, email, phone=None):
        user = self.find_user_by_id(user_id)
        if user is None:
            raise UserNotFoundException

        if name is not None:
            user.name = name
        if email is not None:
            user.email = email
        if phone is not None:
            user.phone = phone

        db.session.commit()
        return user

    def deactivate_user(self, user_id):
        user = self.find_user_by_id(user_id)
        if user is None:
            raise UserNotFoundException

        user.active = False
        db.session.commit()

    def login(self, email, password):
        user = User.query.filter_by(email=email, password_hash=hash_password(password)).first()
        if user is None:
            return None, None

        session = SessionsService.create_session(user.id)
        return session

    def logout(self, token):
        SessionsService.delete_session(token)

