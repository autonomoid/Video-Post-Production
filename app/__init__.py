from flask import Flask
from flask_socketio import SocketIO
from .config import Config

socketio = SocketIO()

def create_app():
    app = Flask(__name__, template_folder='../templates', static_folder='../static')
    app.config.from_object(Config)
    socketio.init_app(app)
    
    from .routes import main as main_blueprint
    app.register_blueprint(main_blueprint)
    
    from . import socket_events

    return app