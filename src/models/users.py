import hashlib
from enum import Enum
from datetime import datetime
from src.database import db

# TODO: change from sha256 hashing to a better one
def hash_password(password):
    sha256_hash = hashlib.sha256()
    sha256_hash.update(password.encode('utf-8'))
    return sha256_hash.hexdigest()

class UserType(str, Enum):
    INTERNAL = 'internal'
    EXTERNAL = 'external'

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=db.func.uuid())
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.Enum(UserType), nullable=False)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    external_user_data = db.relationship('ExternalUserData', backref='users')
    volunteers_kind = db.relationship('VolunteerKind', backref='users')
    volunteers = db.relationship('Volunteer', backref='users')
    help_kinds = db.relationship('HelpKind', backref='users')
    help_requests = db.relationship('HelpRequest', backref='users')
    session = db.relationship('Sessions', backref='users')

    __table_args__ = (
        db.Index('users_email_password_hash_index', 'email', 'password_hash'),
        db.UniqueConstraint('email', 'user_type', name='users_email_user_type_index'),
    )

    def __init__(self, name, email, password, user_type):
        self.name = name
        self.email = email
        self.password_hash = hash_password(password)
        self.user_type = user_type

    def __repr__(self):
        return f'<User {self.name}>'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'user_type': self.user_type,
            'updated_at': self.updated_at.timestamp(),
            'created_at': self.created_at.timestamp(),
        }

class ExternalUserData(db.Model):
    user_id = db.Column(db.String(36), primary_key=True)
    cpf = db.Column(db.String(11), nullable=False)
    phone = db.Column(db.String(11), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    address_id = db.Column(db.String(36), db.ForeignKey('addresses.id'), nullable=False)

    __table_args__ = (
        db.ForeignKeyConstraint(['user_id'], ['users.id']),
    )

    def __init__(self, user_id, cpf, phone, birth_date, address_id):
        self.user_id = user_id
        self.cpf = cpf
        self.phone = phone
        self.birth_date = birth_date
        self.address_id = address_id

    def __repr__(self):
        return f'<ExternalUserData {self.user_id}>'

    @property
    def serialize(self):
        return {
            'user_id': self.user_id,
            'cpf': self.cpf,
            'phone': self.phone,
            'birth_date': self.birth_date,
            'address_id': self.address_id
        }
