from sqlalchemy.orm import joinedload
from src.models.help_model import Help, HelpKind
from src.services.sessions_service import SessionsService
from src.database import db

class HelpsService:
    @staticmethod
    def create_help_kind(current_user_token, name, description):
        session = SessionsService.find_session(current_user_token)
        if session is None:
            raise Exception('Invalid session')

        new_help_kind = HelpKind(name=name, description=description, created_by=session.user_id)

        try:
            db.session.add(new_help_kind)
            db.session.commit()
        except Exception as e:
            raise e

        return new_help_kind.serialize

    @staticmethod
    def list_help_kinds(token=None, check_enabled=True, check_session=False):
        if check_session:
            session = SessionsService.find_session(token)
            if session is None:
                return None

        volunteer_kinds = []
        if check_enabled:
            volunteer_kinds = HelpKind.query.filter(HelpKind.enabled == True).all()
        else:
            volunteer_kinds = HelpKind.query.all()

        return [volunteer_kind.serialize_html for volunteer_kind in volunteer_kinds]

    @staticmethod
    def create_help(current_user_token, title, description, kind_id):
        session = SessionsService.find_session(current_user_token)
        if session is None:
            raise Exception('Invalid session')

        new_help = Help(title=title, description=description, kind_id=kind_id, requested_by=session.user_id)

        try:
            db.session.add(new_help)
            db.session.commit()
        except Exception as e:
            raise e

        return new_help.serialize

    @staticmethod
    def list_helps(token):
        session = SessionsService.find_session(token)
        if session is None:
            return None

        # list all helps that have a HelpKind with `enabled` as true, return the helps in a list, each help should contain the relationed external user and HelpKind
        # helps = db.session.query(Help).join(HelpKind).filter(HelpKind.enabled == True).options(joinedload(Help.external_user), joinedload(Help.help_kinds)).all()
        # TODO: validate if helps with help_kind disabled should be listed
        helps = db.session.query(Help).join(HelpKind).options(joinedload(Help.external_user), joinedload(Help.help_kinds)).all()


        return [help.serialize_html_full for help in helps]
