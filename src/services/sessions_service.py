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
    def delete_session(token):
        session = Sessions.query.filter_by(token=token).first()
        db.session.delete(session)
        db.session.commit()

    @staticmethod
    def find_session(token):
        session = Sessions.query.filter_by(token=token).first()
        return session.serialize() if session is not None else None

    @staticmethod
    def exists_external(token):
        connection = db.session.connection()
        query = text(f"SELECT user_id FROM sessions WHERE token = '{token}'")
        result = connection.execute(query).fetchone()
        user_id = result[0] if result is not None else None
        if user_id is None:
            return False

        query = text(f"SELECT EXISTS(SELECT 1 FROM external_users e WHERE e.id = '{user_id}')")
        result = connection.execute(query).fetchone()
        if result is None:
            return False

        return result[0] == 1
