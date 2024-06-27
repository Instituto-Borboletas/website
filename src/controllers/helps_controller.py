from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, make_response
from src.services.helps_service import HelpsService

from src.middlewares.auth_middleware import token_required_internal, token_required_external

helps_bp = Blueprint('helps_bp', __name__)

@helps_bp.route('/tipos', methods=['POST'])
@token_required_internal
def create_help_kind(token):
    request_json = request.get_json()
    name = request_json.get('name')
    description = request_json.get('description')

    created_kind = HelpsService.create_help_kind(token, name, description)
    return jsonify(created_kind), 201

@helps_bp.route('/', methods=['GET'])
@token_required_internal
def list_helps(token):
    helps = HelpsService.list_helps(token)
    kinds = HelpsService.list_help_kinds(check_enabled=True, check_session=False)
    kinds = [kind.serialize_for_select for kind in kinds or []]

    print(helps)

    return render_template('list_helps.html', helps=helps, kinds=kinds)

@helps_bp.route('/', methods=['POST'])
@token_required_external
def create_help_request(token):
    title = request.form.get('title')
    description = request.form.get('description')
    kind_id = request.form.get('kind')

    created_help = HelpsService.create_help(token, title, description, kind_id)
    if created_help is None:
        flash('Erro ao criar voluntário tente novamente mais tarde', 'danger')
        return render_template('index.html', has_token=True)

    flash('Voluntário criado com sucesso', 'success')
    return render_template('index.html', has_token=True)
