from datetime import datetime
from src.database import db

class VolunteerKind(db.Model):
    __tablename__ = 'volunteers_kind'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    enabled = db.Column(db.Boolean, nullable=True, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('internal_users.id'), nullable=False)

    volunteer = db.relationship('Volunteer', backref='volunteer_kinds')
    internal_user = db.relationship('InternalUser', backref='volunteer_kinds')

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
            'description': self.description,
            'created_at': self.created_at,
            'created_by': self.created_by,
        }

    @property
    def serialize_html(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_by': self.created_by,
            'created_at': self.created_at.strftime('%d/%m/%Y %H:%M:%S'),
        }

    @property
    def serialize_for_select(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.name,
        }


class Volunteer(db.Model):
    __tablename__ = 'volunteers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(11), nullable=False)
    kind_id = db.Column(db.Integer, db.ForeignKey('volunteers_kind.id'), nullable=False)
    registered_by = db.Column(db.Integer, db.ForeignKey('external_users.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    volunteer_kind = db.relationship('VolunteerKind', backref='volunteers')
    external_user = db.relationship('ExternalUser', backref='volunteers')

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
    def serialize_html(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'registered_by': self.registered_by,
            'created_at': self.created_at.strftime('%d/%m/%Y %H:%M:%S'),
        }

    @property
    def serialize_html_full(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.strftime('%d/%m/%Y %H:%M:%S'),
            'kind': {
                'name': self.volunteer_kind.name,
            },
            'registered_by': {
                'name': self.external_user.name,
                'email': self.external_user.email,
            },

        }
