from flask import Flask, render_template, send_from_directory, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import secrets

app = Flask(__name__, template_folder="templates")
secret_key = secrets.token_urlsafe(32)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://server:senhaserver@localhost:3306/borboletas"
app.config["SECRET_KEY"] = secrets.token_hex(32)
app.app_context().push()
db = SQLAlchemy(app)

class Volunteer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(11), nullable=False)
    cpf = db.Column(db.String(11), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    volunteer_kind = db.Column("volunteer_kind_id", db.Integer, nullable=False)

    def __init__(self, name, city, email, phone, cpf, birth_date, volunteer_kind):
        self.name = name
        self.city = city
        self.email = email
        self.phone = phone
        self.cpf = cpf
        self.birth_date = birth_date
        self.volunteer_kind = volunteer_kind

# show tables from database
# result = db.session.execute(text("SHOW TABLES;"))
# for row in result:
#     print("row", row.)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        print("email", email)
        print("password", password)
        return redirect(url_for("home"))
        # if user and user.password == password:
        #     return redirect(url_for("home"))
        # else:
        #    return render_template("login.html", error="Email ou senha inválidos")

    return render_template("login.html")

@app.route("/public/<path:filename>")
def public(filename):
    return send_from_directory("public", filename)

if __name__ == "__main__":
    app.run(debug=True)

