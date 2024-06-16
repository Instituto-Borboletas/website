from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, make_response
from src.services.volunteers_service import VolunteerService
from src.services.volunteers_kind_service import VolunteerKindService

from src.middlewares.auth_middleware import token_required_internal, token_required_external

volunteer_bp = Blueprint('volunteer_bp', __name__)

@volunteer_bp.route('/tipos', methods=['POST'])
@token_required_internal
def create_volunteer_kind(token):
    if request.method == 'POST':
        request_json = request.get_json()
        name = request_json.get('name')
        description = request_json.get('description')

        created_kind = VolunteerKindService.create_volunteer_kind(token, name, description)
        return jsonify(created_kind.serialize), 201

    data = VolunteerKindService.list_volunteer_kinds(token)
    return render_template('list_volunteer_kinds.html', data=data)

@volunteer_bp.route('/tipos/<int:kind_id>', methods=['GET', 'PUT', 'DELETE'])
@token_required_internal
def volunteer_rud(token, kind_id):
    print(token)

    if request.method == 'GET':
        return jsonify({'message': f'Tipo de voluntário {kind_id} encontrado'}), 200

    if request.method == 'PUT':
        return jsonify({'message': f'Tipo de voluntário {kind_id} atualizado'}), 202

    if request.method == 'DELETE':
        return jsonify({'message': f'Tipo de voluntário {kind_id} deletado'}), 202

    return jsonify({'error': 'Method not allowed'}), 405


@volunteer_bp.route('/', methods=['GET'])
@token_required_internal
def list_volunteers(token):
    volunteers = VolunteerService.list_volunteers(token)
    kinds = VolunteerKindService.list_volunteer_kinds(check_enabled=True, check_session=False)

    return render_template('list_volunteers.html', volunteers=volunteers, kinds=kinds)

@volunteer_bp.route('/', methods=['POST'])
@token_required_external
def register_volunteer(token):
    request_json = request.get_json()
    name = request_json.get('name')
    email = request_json.get('email')
    phone = request_json.get('phone')
    kind_id = request_json.get('kind_id')

    volunteer = VolunteerService.create_volunteer(token, name, email, phone, kind_id)
    return jsonify(volunteer.serialize), 201

