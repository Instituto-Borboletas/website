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
        return Sessions.query.filter_by(id=session_id).first()

    @staticmethod
    def exists_external(session_token):
        query = text(f"SELECT users.id FROM users LEFT JOIN sessions ON users.id = sessions.user_id WHERE sessions.id = '{session_token}' AND users.user_type = 'external'")
        connection = db.session.connection()
        result = connection.execute(query).fetchone()

        return result is not None

