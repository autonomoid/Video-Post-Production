from moviepy.editor import VideoFileClip
import cv2
import numpy as np
import os
import json
import base64
import imageio
import shutil
from flask import current_app
from .utils import hex_to_bgr, add_banners_and_logo
from . import socketio
from flask import Flask

def save_settings(form, files):
    settings = {
        'logo_x': form.get('logoX', default=10, type=int),
        'logo_y': form.get('logoY', default=10, type=int),
        'top_banner_color': form.get('topBannerColor', default='#006a4d'),
        'bottom_banner_color': form.get('bottomBannerColor', default='#006a4d'),
        'scrolling_text': form.get('scrollingText', default='Codito Ergo Sum'),
    }
    logo_file = files.get('logoFile')
    if logo_file:
        logo_filepath = os.path.join(current_app.config['SETTINGS_FOLDER'], 'logo.jpg')
        logo_file.save(logo_filepath)
        settings['logo_path'] = logo_filepath
    settings_path = os.path.join(current_app.config['SETTINGS_FOLDER'], 'settings.json')
    with open(settings_path, 'w') as f:
        json.dump(settings, f)

def load_settings():
    settings_path = os.path.join(current_app.config['SETTINGS_FOLDER'], 'settings.json')
    if os.path.exists(settings_path):
        with open(settings_path, 'r') as f:
            settings = json.load(f)
    else:
        settings = {
            'logo_x': 10,
            'logo_y': 10,
            'top_banner_color': '#006a4d',
            'bottom_banner_color': '#006a4d',
            'logo_path': 'logo.jpg',
            'scrolling_text': 'Rootkit Racers'
        }
    return settings

def generate_preview_image(settings):
    files = os.listdir(current_app.config['UPLOAD_FOLDER'])
    if not files:
        return None
    
    # Select the first video file for preview
    first_video = None
    for file in files:
        if file.endswith(('.mp4', '.avi', '.mov')):
            first_video = os.path.join(current_app.config['UPLOAD_FOLDER'], file)
            break
    
    if first_video is None:
        return None
    
    # Extract the first frame from the video
    clip = VideoFileClip(first_video)
    frame = clip.get_frame(0)
    frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
    frame = add_banners_and_logo(frame, 0, settings, preview=True)
    
    _, buffer = cv2.imencode('.jpg', frame)
    preview_image = base64.b64encode(buffer).decode('utf-8')
    return preview_image



def process_video_with_app_context(app, filepath):
    with app.app_context():
        process_video(filepath)

def process_video(filepath):
    try:
        socketio.emit('status', {'message': 'Processing frames...'})

        clip = VideoFileClip(filepath)
        fps = clip.fps
        duration = clip.duration
        total_frames = int(duration * fps)
        frames = []

        settings = load_settings()

        for frame_idx, t in enumerate(np.arange(0, duration, 1/fps)):
            frame = clip.get_frame(t)
            frame = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            frame = add_banners_and_logo(frame, frame_idx, settings)
            frames.append(frame)
            progress = int((frame_idx / total_frames) * 100)
            socketio.emit('progress', {'progress': progress})

        socketio.emit('status', {'message': 'Saving video...'})

        temp_output_path = os.path.join(current_app.config['PROCESSED_FOLDER'], 'temp_output_video.mp4')

        out = imageio.get_writer(uri=temp_output_path, fps=fps, codec='libx264', format='mp4')

        for frame in frames:
            out.append_data(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

        out.close()

        final_output_path = os.path.join(current_app.config['PROCESSED_FOLDER'], 'output_video.mp4')
        shutil.copyfile(temp_output_path, final_output_path)
        
        socketio.emit('progress', {'progress': 100})
        socketio.emit('status', {'message': 'Processing complete.'})
        socketio.emit('processing_done', {'filename': 'output_video.mp4'})
    except Exception as e:
        socketio.emit('status', {'message': f'Error during processing: {str(e)}'})
