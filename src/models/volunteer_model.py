from datetime import datetime
from src.database import db
from src.models.users import User

class VolunterKindNotFound(Exception):
    message = 'Volunteer kind not found'

class VolunteerKind(db.Model):
    __tablename__ = 'volunteers_kind'

    id = db.Column(db.String(36), primary_key=True, default=db.func.uuid())
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    enabled = db.Column(db.Boolean, nullable=True, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', backref='volunteers_kind')

    def __init__(self, name, description, created_by):
        self.name = name
        self.description = description
        self.created_by = created_by

    def __repr__(self):
        return f'<VolunteerKind {self.name}>'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at,
            'created_by': self.created_by.timestamp(),
        }

class VolunterNotFound(Exception):
    message = 'Volunteer kind not found'

class Volunteer(db.Model):
    __tablename__ = 'volunteers'

    id = db.Column(db.String(36), primary_key=True, default=db.func.uuid())
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(11), nullable=False)
    kind_id = db.Column(db.ForeignKey('volunteers_kind.id'), nullable=False)
    registered_by = db.Column(db.ForeignKey('external_users.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    volunteer_kind = db.relationship('VolunteerKind', backref='volunteers')
    user = db.relationship('User', backref='volunteers')

    def __init__(self, name, email, phone, kind_id, registered_by):
        self.name = name
        self.email = email
        self.phone = phone
        self.kind_id = kind_id
        self.registered_by = registered_by

    def __repr__(self):
        return f'<Volunteer {self.name}>'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at,
            'registered_by': self.registered_by,
        }

    @property
    def serialize_full(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.timestamp(),
            'kind': {
                'name': self.volunteer_kind.name,
            },
            'registered_by': {
                'name': self.user.name,
                'email': self.user.email,
            },
        }
