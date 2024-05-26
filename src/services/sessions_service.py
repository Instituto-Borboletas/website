from src.models.session_model import Sessions
from src.database import db

class SessionsService:
    @staticmethod
    def create_session(user_id):
        new_session = Sessions(user_id=user_id)

        db.session.add(new_session)
        db.session.commit()

        return new_session


    @staticmethod
    def find_session(token):
        session = Sessions.query.filter_by(token=token).first()
        return session
