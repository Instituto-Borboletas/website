from flask import jsonify
from sqlalchemy.orm import joinedload
from src.models.users import ExternalUser
from src.models.volunteer_model import Volunteer, VolunteerKind
from src.services.sessions_service import SessionsService
from src.database import db

class VolunteerService:
    @staticmethod
    def find_by_id(volunteer_id):
        volunteer = Volunteer.query.filter_by(id=volunteer_id).first()
        return volunteer

    @staticmethod
    def delete_volunteer_by_id(volunteer_id):
        volunteer = VolunteerService.find_by_id(volunteer_id)
        if volunteer is None:
            raise Exception('Volunteer not found')

        try:
            db.session.delete(volunteer)
            db.session.commit()
        except Exception as e:
            raise e

    @staticmethod
    def create_volunteer(current_user_token, name, email, phone, kind_id):
        session = SessionsService.find_session(current_user_token)
        if session is None:
            raise Exception('Invalid session')

        new_volunteer = Volunteer(name=name, email=email, phone=phone, kind_id=kind_id, registered_by=session['user_id'])

        try:
            db.session.add(new_volunteer)
            db.session.commit()
        except Exception as e:
            raise e

        return new_volunteer

    @staticmethod
    def list_volunteers(token):
        session = SessionsService.find_session(token)
        if session is None:
            return None

        # list all volunteers that have a Volunteer_kind with `enabled` as true, return the volunteers in a list, each volunteer should contain the relationed external user and Volunteer_kind
        volunteers = db.session.query(Volunteer).join(ExternalUser).join(VolunteerKind).filter(VolunteerKind.enabled == True).options(joinedload(Volunteer.external_user), joinedload(Volunteer.volunteer_kind)).all()

        return [volunteer.serialize_html_full for volunteer in volunteers]

    @staticmethod
    def get_dashboard_data(token):
        session = SessionsService.find_session(token)
        if session is None:
            return None

    @staticmethod
    def list_volunteers_from_user(user_id):
        volunteers = Volunteer.query.filter_by(registered_by=user_id).all()
        return [volunteer.serialize_html_full for volunteer in volunteers]
