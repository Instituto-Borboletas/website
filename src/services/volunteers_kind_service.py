from src.models.volunteer_model import VolunteerKind
from src.services.sessions_service import SessionsService
from src.database import db

class VolunteerKindService:
    @staticmethod
    def create_volunteer_kind(current_user_token, name, description):
        session = SessionsService.find_session(current_user_token)
        if session is None:
            raise Exception('Invalid session')

        new_volunteer_kind = VolunteerKind(name=name, description=description, created_by=session.user_id)

        try:
            db.session.add(new_volunteer_kind)
            db.session.commit()
        except Exception as e:
            raise e

        return new_volunteer_kind

    @staticmethod
    def list_volunteer_kinds(token=None, check_enabled=False, check_session=True):
        if check_session:
            session = SessionsService.find_session(token)
            if session is None:
                return None

        volunteer_kinds = []
        if check_enabled:
            volunteer_kinds = VolunteerKind.query.filter(VolunteerKind.enabled == True).all()
        else:
            volunteer_kinds = VolunteerKind.query.all()

        return [volunteer_kind.serialize_html for volunteer_kind in volunteer_kinds]
