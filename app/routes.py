from flask import Blueprint, request, render_template, jsonify, send_from_directory, current_app
from .video_processing import process_video_with_app_context, generate_preview_image
from .utils import save_settings, load_settings
from . import socketio
import os
import threading

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part'})
    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected file'})
    if file:
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        # Pass the Flask app instance to the thread
        thread = threading.Thread(target=process_video_with_app_context, args=(current_app._get_current_object(), filepath))
        thread.start()
        return jsonify({'status': 'processing'})

@main.route('/settings', methods=['POST'])
def update_settings():
    save_settings(request.form, request.files)
    return jsonify({'status': 'success'})

@main.route('/preview', methods=['POST'])
def generate_preview():
    settings = load_settings()
    image = generate_preview_image(settings)
    if image:
        return jsonify({'status': 'success', 'image': image})
    else:
        return jsonify({'status': 'error', 'message': 'No uploaded videos found'})

@main.route('/preview/<filename>')
def preview_video(filename):
    return send_from_directory("/app/" + current_app.config['PROCESSED_FOLDER'], filename, mimetype='video/mp4')

#@main.route('/download/<filename>')
#def download_video(filename):
#    return send_from_directory("/app/"+current_app.config['PROCESSED_FOLDER'], filename, as_attachment=True)

@main.route('/download/<filename>')
def download_video(filename):
    processed_folder = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', current_app.config['PROCESSED_FOLDER'])
    return send_from_directory(processed_folder, filename, as_attachment=True)