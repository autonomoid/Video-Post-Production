from moviepy.editor import VideoFileClip
import cv2
import numpy as np
import os
import base64
import imageio
import shutil
from flask import Flask, current_app
from .utils import hex_to_bgr, overlay_image, load_settings
from . import socketio

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

def add_banners_and_logo(frame, frame_idx, settings, preview=False):
    """
    Add top and bottom banners and a logo to a video frame.
    
    Args:
        frame (numpy.ndarray): The video frame to modify.
        frame_idx (int): The index of the frame in the video.
        settings (dict): A dictionary of settings including banner colors, logo position, etc.
        preview (bool): If True, generate a preview of the frame.
        
    Returns:
        numpy.ndarray: The modified video frame with banners and logo added.
    """
    top_banner_height = 50
    bottom_banner_height = 50
    top_banner_color = hex_to_bgr(settings['top_banner_color'])
    bottom_banner_color = hex_to_bgr(settings['bottom_banner_color'])
    logo_path = settings.get('logo_path', 'logo.jpg')

    h, w, _ = frame.shape
    top_banner = np.zeros((top_banner_height, w, 3), dtype=np.uint8)
    top_banner[:] = top_banner_color
    frame = np.vstack((top_banner, frame))

    bottom_banner = np.zeros((bottom_banner_height, w, 3), dtype=np.uint8)
    bottom_banner[:] = bottom_banner_color
    frame = np.vstack((frame, bottom_banner))


    # Add logo
    logo_path = settings.get('logo_path')
    if logo_path and os.path.exists(logo_path):
        logo = cv2.imread(logo_path, cv2.IMREAD_UNCHANGED)
        if logo is not None:
            logo_x = settings['logo_x']
            logo_y = settings['logo_y']
            logo_width = settings['logo_width']
            logo_height = settings['logo_height']
            resized_logo = cv2.resize(logo, (logo_width, logo_height))
            overlay_image(frame, resized_logo, logo_x, logo_y)

    font_scale = 1
    font_thickness = 2
    font = cv2.FONT_HERSHEY_SIMPLEX
    text_size = cv2.getTextSize(settings.get('scrolling_text', 'Codito Ergo Sum'), font, font_scale, font_thickness)[0]

    scroll_speed = 5
    if preview:
        horizontal_shift = (w // 2) + (text_size[0] // 2)
    else:
        horizontal_shift = (scroll_speed * frame_idx) % (w + text_size[0])

    text_x = int(w - horizontal_shift)
    text_y = int(h + 1.75 * bottom_banner_height)

    cv2.putText(frame, settings.get('scrolling_text', 'Codito Ergo Sum'), (text_x, text_y), font, font_scale, (255, 255, 255), font_thickness, cv2.LINE_AA)

    return frame

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