import uuid

from datetime import datetime, timedelta
from src.database import db

class Sessions(db.Model):
    __tablename__ = 'sessions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, nullable=False)
    token = db.Column(db.String(255), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow() + timedelta(hours=12))

    __table_args__ = (
        db.Index('session_token_index', 'token'),
    )

    def __init__(self, user_id):
        self.user_id = user_id
        self.token = str(uuid.uuid4())

    def __repr__(self):
        return f'<Session {self.token}>'

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'token': self.token,
            'expires_at': self.expires_at
        }
