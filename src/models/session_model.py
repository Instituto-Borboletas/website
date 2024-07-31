import uuid

from datetime import datetime, timedelta
from src.database import db

class InvalidSessionExeption(Exception):
    message = 'Invalid session'

class Sessions(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(db.UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow() + timedelta(hours=12))

    user = db.relationship('User', backref='sessions')

    def __init__(self, user_id):
        self.user_id = user_id

    def __repr__(self):
        return f'<Session {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'expires_at': self.expires_at
        }
