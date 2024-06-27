from flask import Blueprint, request, jsonify, render_template, flash, redirect, url_for, make_response

from src.middlewares.auth_middleware import token_required_external
# from src.services.volunteers_service import VolunteersService
from src.services.volunteers_kind_service import VolunteerKindService
from src.services.helps_service import HelpsService


pages_bp = Blueprint('pages_bp', __name__)

@pages_bp.route('/voluntario', methods=['GET'])
@token_required_external
def register_volunteer(token):
    volunteer_kinds = VolunteerKindService.list_volunteer_kinds(None, check_enabled=True, check_session=False)
    if volunteer_kinds is None:
        flash('Ainda não existem tipos de voluntariado cadastrados', 'danger')
        return render_template('register_volunteer.html')

    volunteer_kinds = [kind.serialize_for_select for kind in volunteer_kinds]

    return render_template('register_volunteer.html', kinds=volunteer_kinds)

@pages_bp.route('/ajuda', methods=['GET'])
@token_required_external
def register_help(token):
    help_kinds = HelpsService.list_help_kinds(None, check_enabled=True, check_session=False)
    if help_kinds is None:
        flash('Ainda não existem tipos de ajuda cadastrados', 'danger')
        return render_template('register_volunteer.html')

    help_kinds = [kind.serialize_for_select for kind in help_kinds]

    return render_template('register_help.html', kinds=help_kinds)
