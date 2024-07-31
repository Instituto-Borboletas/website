from sqlalchemy.orm import joinedload
from src.models.help_model import HelpKindNotFoundException, HelpRequest, HelpKind
from src.models.session_model import InvalidSessionExeption
from src.models.users import User, UserType
from src.services.users_service import UserService
from src.database import db

internal_user_service = UserService(UserType.internal)
external_user_service = UserService(UserType.external)

class HelpsService:
    @staticmethod
    def find_help_kind_by_id(session_token, help_id):
        user = internal_user_service.find_user_by_session_token(session_token)
        if user is None:
            raise InvalidSessionExeption

        help = HelpKind.query.filter_by(id=help_id).first()
        if help is None:
            raise HelpKindNotFoundException

        return help.serilize

    @staticmethod
    def deactivate_help_kind_by_id(session_token, help_id):
        user = internal_user_service.find_user_by_session_token(session_token)
        if user is None:
            raise InvalidSessionExeption

        updated = HelpRequest.query.filter_by(id=help_id).update({'enabled': False})
        if updated == 0:
            return None

        db.session.commit()
        return {'success': True}

    @staticmethod
    def register_help_kind(session_token, name, description):
        user = internal_user_service.find_user_by_session_token(session_token)
        if user is None:
            raise InvalidSessionExeption

        kind = HelpKind(name=name, description=description, created_by=user.id)

        try:
            db.session.add(kind)
            db.session.commit()
        except Exception as e:
            raise e

        return kind.serialize

    @staticmethod
    def uptade_help_kind(session_token, help_kind_id, name, description):
        user = internal_user_service.find_user_by_session_token(session_token)
        if user is None:
            raise InvalidSessionExeption

        kind = HelpKind.query.filter_by(id=help_kind_id).first()
        if kind is None:
            raise HelpKindNotFoundException

        if name is not None:
            kind.name = name

        if description is not None:
            kind.description = description

        try:
            db.session.commit()
        except Exception as e:
            raise e

    @staticmethod
    def list_help_kinds(enabled_only=False):
        """
        List all help kinds
        This method is meant to be used on html mounting and should not be used on API calls.
        """
        help_kinds = []
        if enabled_only:
            help_kinds = HelpKind.query.filter(HelpKind.enabled == True).all()
        else:
            help_kinds = HelpKind.query.all()

        return help_kinds

    @staticmethod
    def list_helps(session_token):
        """
        List all help kinds
        This method is meant to be used on html mounting and should not be used on API calls.
        """
        user = internal_user_service.find_user_by_session_token(session_token)
        if user is None:
            raise InvalidSessionExeption

        helps = db.session.query(HelpRequest).join(HelpKind).options(joinedload(HelpRequest.user), joinedload(HelpRequest.help_kinds)).all()

        return helps

    @staticmethod
    def register_help_request(session_token, description, kind_id):
        user = external_user_service.find_user_by_session_token(session_token)
        if user is None:
            raise InvalidSessionExeption

        new_help = HelpRequest(description=description, kind_id=kind_id, requested_by=user.id)

        db.session.add(new_help)
        db.session.commit()

        return new_help

    @staticmethod
    def list_user_requests(user: User):
        if user.user_type == UserType.internal:
            raise Exception('Invalid user type')
        helps = HelpRequest.query.filter_by(requested_by=user.id).all()
        return helps
