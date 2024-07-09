from src.models.users import User, UserType, ExternalUserData
from src.services.sessions_service import SessionsService
from src.database import db

class UserService:
    def __init__(self, user_type: UserType):
        self.user_type = user_type

    def register_user(self, name, email, password, phone=None):
        pass

    def find_user_by_id(self, user_id):
        pass

    def find_user_by_session_token(self, token):
        pass

    def list_users(self, token):
        pass

    def update_user(self, user_id, name, email, phone):
        pass

    def deactivate_user(self, user_id):
        pass

    def login(self, email, password):
        pass

    def logout(self, token):
        pass
