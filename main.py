from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import secrets

app = Flask(__name__, template_folder="templates")
secret_key = secrets.token_urlsafe(32)
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+mysqlconnector://server:senhaserver@localhost:3306/borboletas"
app.config["SECRET_KEY"] = secrets.token_hex(32)
app.app_context().push()
db = SQLAlchemy(app)

@app.route('/')
def home():
    print(request.headers.get('User-Agent'))
    print(request.headers.get('Authorization'))
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

