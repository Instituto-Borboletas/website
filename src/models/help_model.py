
from datetime import datetime
from src.database import db

class HelpKindNotFoundException(Exception):
    message = 'Help kind not found'

class HelpKind(db.Model):
    __tablename__ = 'helps_kind'

    id = db.Column(db.String(36), primary_key=True, default=db.func.uuid())
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    enabled = db.Column(db.Boolean, nullable=True, default=True)
    created_by = db.Column(db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship('User', backref='help_kinds')

    def __init__(self, name, description, created_by):
        self.name = name
        self.description = description
        self.created_by = created_by

    def __repr__(self):
        return f'<HelpKind {self.name}>'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'description': self.description,
            'created_at': self.created_at,
            'created_by': self.created_by.timestamp(),
        }

class HelpRequestNotFoundExeption(Exception):
    message = 'Help request not found'

class HelpRequest(db.Model):
    __tablename__ = 'helps'

    id = db.Column(db.String(36), primary_key=True, default=db.func.uuid())
    description = db.Column(db.Text, nullable=False)
    kind_id = db.Column('help_kind_id', db.ForeignKey('helps_kind.id'), nullable=False)
    requested_by = db.Column(db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    help_kinds = db.relationship('HelpKind', backref='help_requests')
    user = db.relationship('User', backref='help_requests')

    def __init__(self, description, kind_id, requested_by):
        self.description = description
        self.kind_id = kind_id
        self.requested_by = requested_by

    def __repr__(self):
        return f'<HelpRequest {self.description}>'

    @property
    def serialize(self):
        return {
            'id': self.id,
            'description': self.description,
            'created_at': self.created_at.timestamp(),
            'requested_by': self.user,
            'kind': self.help_kinds
        }
