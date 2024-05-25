import secrets
from flask import Flask, send_from_directory
from src.database import db
from src.controllers.users_controller import users_bp

app = Flask(__name__, template_folder="templates")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://server:senhaserver@localhost:3306/borboletas"
app.config["SECRET_KEY"] = secrets.token_hex(32)
app.app_context().push()
db.init_app(app)

@app.route("/public/<path:filename>")
def public(filename):
    return send_from_directory("public", filename)

if __name__ == '__main__':
    app.register_blueprint(users_bp)
    app.run(debug=True)

