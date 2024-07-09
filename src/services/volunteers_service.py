from sqlalchemy.orm import joinedload
from src.models.volunteer_model import Volunteer, VolunteerKind, VolunterKindNotFound
from src.models.users import UserType
from src.models.session_model import InvalidSessionExeption
from src.services.users_service import UserService
from src.database import db

internal_user_service = UserService(UserType.INTERNAL)
external_user_service = UserService(UserType.EXTERNAL)

class VolunteerService:
    @staticmethod
    def register_volunteer(session_token, name, kind_id, email=None, phone=None):
        user = internal_user_service.find_user_by_session_token(session_token)

        if email is None:
            email = user['email']

        if phone is None:
            phone = user['phone']

        volunteer = Volunteer(name=name, email=email, phone=phone, kind_id=kind_id, registered_by=user.id)
        db.session.add(volunteer)
        db.session.commit()
        return volunteer

    @staticmethod
    def find_volunteer_by_id(session_token, volunteer_id):
        volunteer = Volunteer.query.filter_by(id=volunteer_id).first()
        if volunteer is None:
            return None
        return volunteer.serialize

    @staticmethod
    def deactivate_volunteer_by_id(session_token, volunteer_id):
        updated_volunteer = Volunteer.query.filter_by(id=volunteer_id).update({'enabled': False})

        if updated_volunteer == 0:
            return None

        db.session.commit()
        return {'success': True}

    @staticmethod
    def list_volunteers(session_token):
        pass

    @staticmethod
    def get_dashboard_data(session_token):
        pass

    @staticmethod
    def list_volunteers_from_user(session_token):
        user = external_user_service.find_user_by_session_token(session_token)
        volunteers_list = Volunteer.query.filter_by(registered_by=user.id).all()
        if volunteers_list is None:
            return None
        return [volunteer.serialize for volunteer in volunteers_list]

    @staticmethod
    def register_volunteer_kind(session_token, name, description):
        user = internal_user_service.find_user_by_session_token(session_token)
        if user is None:
            raise InvalidSessionExeption()

        volunteer_kind = VolunteerKind(name=name, description=description, created_by=user.id)
        db.session.add(volunteer_kind)
        db.session.commit()
        return volunteer_kind.serialize

    @staticmethod
    def uptade_volunteer_kind(current_user_token, kind_id, name, description):
        user = internal_user_service.find_user_by_session_token(current_user_token)
        if user is None:
            raise InvalidSessionExeption()

        kind = VolunteerKind.query.filter_by(id=kind_id).first()

        if kind is None:
            raise VolunterKindNotFound()

        if name is not None:
            kind.name = name
        if description is not None:
            kind.description = description

        db.session.commit()

    @staticmethod
    def deactivate_volunteer_kind(session_token, kind_id):
        user = internal_user_service.find_user_by_session_token(session_token)
        if user is None:
            raise InvalidSessionExeption()

        kind = VolunteerKind.query.filter_by(id=kind_id).first()
        if kind is None:
            raise VolunterKindNotFound()

        kind.enabled = False

        db.session.delete(kind)
        db.session.commit()
