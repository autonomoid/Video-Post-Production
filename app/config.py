import os

class Config:
    UPLOAD_FOLDER = 'static/uploads'
    PROCESSED_FOLDER = 'static/processed'
    SETTINGS_FOLDER = 'static/settings'
    SECRET_KEY = 'supersecretkey'

    @staticmethod
    def init_app(app):
        pass
