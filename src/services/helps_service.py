from sqlalchemy.orm import joinedload
from src.models.help_model import Help, HelpKind
from src.services.sessions_service import SessionsService
from src.database import db

class HelpsService:
    @staticmethod
    def find_by_id(help_id):
        help = Help.query.filter_by(id=help_id).first()
        return help

    @staticmethod
    def delete_from_id(help_id):
        help = HelpsService.find_by_id(help_id)
        if help is None:
            raise Exception('Help not found')

        try:
            db.session.delete(help)
            db.session.commit()
        except Exception as e:
            raise e

    @staticmethod
    def create_help_kind(current_user_token, name, description):
        session = SessionsService.find_session(current_user_token)
        if session is None:
            raise Exception('Invalid session')

        new_help_kind = HelpKind(name=name, description=description, created_by=session['user_id'])

        try:
            db.session.add(new_help_kind)
            db.session.commit()
        except Exception as e:
            raise e

        return new_help_kind.serialize

    @staticmethod
    def find_help_kind_by_id(help_kind_id):
        help_kind = HelpKind.query.filter_by(id=help_kind_id).first()
        return help_kind

    @staticmethod
    def uptade_help_kind(current_user_token, help_kind_id, name, description):
        session = SessionsService.find_session(current_user_token)
        if session is None:
            raise Exception('Invalid session')

        help_kind = HelpsService.find_help_kind_by_id(help_kind_id)
        if help_kind is None:
            raise Exception('Help kind not found')

        if name is not None:
            help_kind.name = name

        if description is not None:
            help_kind.description = description

        try:
            db.session.commit()
        except Exception as e:
            raise e

    @staticmethod
    def delete_help_kind(current_user_token, help_kind_id):
        session = SessionsService.find_session(current_user_token)
        if session is None:
            raise Exception('Invalid session')

        help_kind = HelpsService.find_help_kind_by_id(help_kind_id)
        if help_kind is None:
            raise Exception('Help kind not found')

        try:
            db.session.delete(help_kind)
            db.session.commit()
        except Exception as e:
            raise e

        return help_kind.serialize

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

        return volunteer_kinds

    @staticmethod
    def create_help(current_user_token, title, description, kind_id):
        session = SessionsService.find_session(current_user_token)
        if session is None:
            raise Exception('Invalid session')

        new_help = Help(title=title, description=description, kind_id=kind_id, requested_by=session['user_id'])

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

        # TODO: validate if helps with help_kind disabled should be listed
        helps = db.session.query(Help).join(HelpKind).options(joinedload(Help.external_user), joinedload(Help.help_kinds)).all()


        return [help.serialize_html for help in helps]

    @staticmethod
    def list_helps_from_user(user_id):
        helps = Help.query.filter_by(requested_by=user_id).all()
        return [help.serialize_html for help in helps]

