
from datetime import datetime
from src.database import db

class HelpKind(db.Model):
    __tablename__ = 'helps_kind'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    enabled = db.Column(db.Boolean, nullable=True, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('internal_users.id'), nullable=False)

    help = db.relationship('Help', backref='help_kinds')
    internal_users = db.relationship('InternalUser', backref='help_kinds')


    def __init__(self, name, description, created_by):
        self.name = name
        self.description = description
        self.created_by = created_by

        self.created_at = datetime.utcnow()
        self.enabled = True

    def __repr__(self):
        return f'<HelpKind {self.name}>'

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


class Help(db.Model):
    __tablename__ = 'helps'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    kind_id = db.Column('help_kind_id', db.Integer, db.ForeignKey('helps_kind.id'), nullable=False)
    requested_by = db.Column(db.Integer, db.ForeignKey('external_users.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    external_user = db.relationship('ExternalUser', backref='helps')
    help_kind = db.relationship('HelpKind', backref='helps')

    def __init__(self, title, description, kind_id, requested_by):
        self.title = title
        self.description = description
        self.kind_id = kind_id
        self.requested_by = requested_by

        self.created_at = datetime.utcnow()

    def __repr__(self):
        return f'<Help {self.title}>'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at,
            'requested_by': self.requested_by,
        }

    @property
    def serialize_html(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at.strftime('%d/%m/%Y %H:%M:%S'),
            'requested_by': {
                'name': self.external_user.name,
                'email': self.external_user.email,
            },
            'kind': {
                'id': self.help_kinds.id,
                'name': self.help_kinds.name,
                'description': self.help_kinds.description
            }
        }
