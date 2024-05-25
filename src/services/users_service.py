import hashlib

from src.models.users import InternalUser, ExternalUser
from src.database import db

def hash_password(password):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(password.encode('utf-8'))
    return sha256_hash.hexdigest()

class InternalUserService:
    @staticmethod
    def create_user(name, email, password):
        password_hash = hash_password(password)
        new_user = InternalUser(name=name, email=email, password_hash=password_hash)

        db.session.add(new_user)
        db.session.commit()

        return new_user

    @staticmethod
    def login(email, password):
        password_hash = hash_password(password)
        user = InternalUser.query.filter_by(email=email, password_hash=password_hash).first()
        return user
