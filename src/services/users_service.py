import hashlib
from enum import Enum

from src.models.users import InternalUser, ExternalUser
from src.services.helps_service import HelpsService
from src.services.sessions_service import SessionsService
from src.database import db
from src.services.volunteers_service import VolunteerService

# TODO: change from sha256 hashing to a better one
def hash_password(password):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(password.encode('utf-8'))
    return sha256_hash.hexdigest()

class UserType(str, Enum):
    INTERNAL = 'internal'
    EXTERNAL = 'external'

class UserService:
    def __init__(self, user_type: UserType):
        self.user_type = user_type

    def create_user(self, name, email, password, phone=None):
        pass

    def update_user(self, user_id, name, email, phone):
        pass

    def deactivate_user(self, user_id):
        pass

    def find_user_by_id(self, user_id):
        pass

    def login(self, email, password):
        pass

    def logout(self, token):
        pass

    def list_users(self, token):
        pass

    def register_user(self, name, email, password, phone):
        pass
