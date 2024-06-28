from datetime import datetime
from src.database import db

class InternalUser(db.Model):
    __tablename__ = 'internal_users'

    id = db.Column(db.String(36), primary_key=True, default=db.func.uuid())
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    volunteer_kind = db.relationship('VolunteerKind', backref='internal_users')
    help_kind_ids = db.relationship('HelpKind', back_populates='internal_users')

    __table_args__ = (
        db.UniqueConstraint('email', name='users_email_index'),
        db.Index('users_email_password_hash_index', 'email', 'password_hash'),
    )

    def __init__(self, name, email, password_hash):
        self.name = name
        self.email = email
        self.password_hash = password_hash

    def __repr__(self):
        return f'<InternalUser {self.name}>'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }

    @property
    def serialize_html(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at.strftime('%d/%m/%Y %H:%M:%S'),
        }


class ExternalUser(db.Model):
    __tablename__ = 'external_users'

    id = db.Column(db.String(36), primary_key=True, default=db.func.uuid())
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    phone = db.Column(db.String(11), nullable=False, unique=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    volunteer = db.relationship('Volunteer', backref='external_users')
    help = db.relationship('Help', backref='external_users')

    __table_args__ = (
        db.UniqueConstraint('email', name='users_email_index'),
        db.Index('users_email_password_hash_index', 'email', 'password_hash'),
    )

    def __init__(self, name, email, phone, password_hash):
        self.name = name
        self.email = email
        self.phone = phone
        self.password_hash = password_hash

    def __repr__(self):
        return f'<User {self.name}>'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
