from src.models.session_model import Sessions
from src.database import db
from sqlalchemy import text

class SessionsService:
    @staticmethod
    def create_session(user_id):
        new_session = Sessions(user_id=user_id)

        db.session.add(new_session)
        db.session.commit()

        return new_session

    @staticmethod
    def delete_session(session_id):
        session = Sessions.query.filter_by(id=session_id).first()
        db.session.delete(session)
        db.session.commit()

    @staticmethod
    def find_session(session_id):
        session = Sessions.query.filter_by(id=session_id).first()
        return session.serialize() if session is not None else None
