from os import environ

from flask import Flask
from flask_bcrypt import Bcrypt
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

from starcar.flask_jwt import FlaskJWT

app = Flask(__name__)
# TODO: Set config
# app.config['SECRET_KEY'] = 'secret!'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

if environ.get('STARCAR_ENV_FILE') is not None:
    print(f'Using config file: {environ.get("STARCAR_ENV_FILE")}')
    app.config.from_envvar('STARCAR_ENV_FILE')

app.config.from_prefixed_env("STARCAR")

socketio = SocketIO(app)
# TODO: Check if needed , cors_allowed_origins="*"
# , transports=["websocket"]
socketio.init_app(app, cors_allowed_origins="*")


class Base(DeclarativeBase):
    pass


db = SQLAlchemy(model_class=Base)
db.init_app(app)

bcrypt = Bcrypt(app)
flask_jwt = FlaskJWT(app)

from starcar import routes, sockets

# with app.app_context():
#     db.create_all()
