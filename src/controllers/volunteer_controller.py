from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, make_response
from src.services.users_service import UserService, UserType
from src.services.volunteers_service import VolunteerService
from src.services.volunteers_kind_service import VolunteerKindService
from src.services.sessions_service import SessionsService
from src.models.session_model import InvalidSessionExeption

from src.middlewares.auth_middleware import (
    token_required_internal, token_required_external
)

volunteer_bp = Blueprint('volunteer_bp', __name__)

internal_user_service = UserService(UserType.internal)
external_user_service = UserService(UserType.external)


@volunteer_bp.route('/tipos', methods=['POST'])
@token_required_internal
def create_volunteer_kind(token):
    request_json = request.get_json()
    name = request_json.get('name')
    description = request_json.get('description')

    created_kind = VolunteerKindService.create_volunteer_kind(
        token,
        name,
        description
    )
    return jsonify(created_kind.serialize), 201


@volunteer_bp.route('/tipos/editar', methods=['PUT'])
@token_required_internal
def edit_volunteer_kind(token):
    request_json = request.get_json()
    kind_id = request_json.get('id')
    name = request_json.get('name')
    description = request_json.get('description')

    updated_kind = VolunteerService.uptade_volunteer_kind(
        token,
        kind_id,
        name,
        description
    )

    return jsonify(updated_kind), 200


@volunteer_bp.route('/tipos/deletar/<int:kind_id>', methods=['DELETE'])
@token_required_internal
def delete_help_kind(session_token, kind_id):
    user = internal_user_service.find_user_by_session_token(session_token)
    if user is None:
        raise InvalidSessionExeption()

    VolunteerService.deactivate_volunteer_kind(session_token, kind_id)

    return jsonify({'message': f'Tipo de voluntariado {kind_id} deletado'}), 202

@volunteer_bp.route('/', methods=['GET'])
@token_required_internal
def list_volunteers(token):
    volunteers = VolunteerService.list_volunteers(token)
    kinds = VolunteerKindService.list_volunteer_kinds(check_enabled=True, check_session=False)
    kinds = [volunteer_kind.serialize_html for volunteer_kind in kinds or []]

    return render_template('list_volunteers.html', volunteers=volunteers, kinds=kinds)

@volunteer_bp.route('/', methods=['POST'])
@token_required_external
def register_volunteer(token):
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    kind_id = request.form.get('kind')

    volunteer = VolunteerService.create_volunteer(token, name, email, phone, kind_id)
    if volunteer is None:
        flash('Erro ao criar voluntário tente novamente mais tarde', 'danger')
        return render_template('index.html', has_token=True)

    flash('Voluntário criado com sucesso', 'success')
    return render_template('index.html', has_token=True)

@volunteer_bp.route('/<int:volunteer_id>/deletar', methods=['DELETE'])
@token_required_internal
def delete_volunteer(token, volunteer_id):
    session = SessionsService.find_session(token)
    if session is None:
        raise Exception('Invalid session')

    user = external_user_service.find_user_by_id(session['user_id'])
    if user is None:
        raise Exception('User not found')

    volunteer = VolunteerService.find_by_id(volunteer_id)
    if volunteer is None:
        raise Exception('Volunteer not found')

    if volunteer.registered_by != user.id:
        raise Exception('Unauthorized')

    VolunteerService.delete_volunteer_by_id(volunteer_id)

    return jsonify({'message': f'Voluntário {volunteer_id} deletado'}), 202
