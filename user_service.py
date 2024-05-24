from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

def hash_password(password):
    return password


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.Text, nullable=False)

    def __init__(self, email, password_hash):
        self.email = email
        self.password_hash = password_hash


class UserService:
    def __init__(self):
        pass

    def login(self, email, password):
        user = User.query.filter_by(email=email).first()
        password_hash = hash_password(password)

        if user and user.password_hash == password_hash:
            return user
        else:
            return None
