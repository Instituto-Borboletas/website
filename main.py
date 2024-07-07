import os
import secrets
from flask import Flask, send_from_directory, render_template, request
from src.database import db
from src.controllers.users_controller import users_bp
from src.controllers.volunteer_controller import volunteer_bp
from src.controllers.helps_controller import helps_bp
from src.controllers.pages_controller import pages_bp

# get env value
is_offline = os.environ.get('IS_OFFLINE', 'false') == 'true'
print(f"Running offline: {is_offline}")

app = Flask(__name__, template_folder="templates")
app.config["SQLALCHEMY_ECHO"] = is_offline
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = is_offline
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://server:senhaserver@localhost:3306/borboletas"
app.config["SECRET_KEY"] = secrets.token_hex(32)
app.app_context().push()
db.init_app(app)

@app.route("/public/<path:filename>")
def public(filename):
    return send_from_directory("public", filename)

@app.route("/")
def index():
    has_token_cookie = "token" in request.cookies
    return render_template("index.html", has_token=has_token_cookie)

app.register_blueprint(users_bp)
app.register_blueprint(volunteer_bp, url_prefix="/voluntarios")
app.register_blueprint(helps_bp, url_prefix="/ajudas")
app.register_blueprint(pages_bp)

@app.errorhandler(404)
def not_found(e):
    return send_from_directory("public", "404.html"), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")

