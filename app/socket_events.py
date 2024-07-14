from flask_socketio import emit
from .video_processing import process_video
from . import socketio

@socketio.on('connect')
def handle_connect():
    emit('status', {'message': 'Connected to server'})

@socketio.on('start_processing')
def handle_start_processing(data):
    filepath = data.get('filepath')
    if filepath:
        emit('status', {'message': 'Processing started...'})
        process_video(filepath)
    else:
        emit('status', {'message': 'Filepath not provided'})

@socketio.on('disconnect')
def handle_disconnect():
    emit('status', {'message': 'Disconnected from server'})
