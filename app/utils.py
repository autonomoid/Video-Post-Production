import cv2
import numpy as np
import os
import json
from flask import current_app

def save_settings(form, files):
    settings = {
        'logo_x': form.get('logoX', default=10, type=int),
        'logo_y': form.get('logoY', default=10, type=int),
        'logo_width': form.get('logoW', default=100, type=int),
        'logo_height': form.get('logoH', default=100, type=int),
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
            'logo_width': 100,
            'logo_height': 100,
            'top_banner_color': '#006a4d',
            'bottom_banner_color': '#006a4d',
            'logo_path': 'logo.jpg',
            'scrolling_text': 'Rootkit Racers'
        }
    return settings

def hex_to_bgr(hex_color):
    """
    Convert a hex color string to a BGR tuple.
    
    Args:
        hex_color (str): The hex color string (e.g., '#FFFFFF').
        
    Returns:
        tuple: A tuple representing the BGR color (e.g., (255, 255, 255)).
    """
    hex_color = hex_color.lstrip('#')
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return (b, g, r)

def overlay_image(background, overlay, x, y):
    """ Overlay an image on top of another image. Supports transparency. """
    if overlay is None or overlay.size == 0:
        return
    overlay_h, overlay_w = overlay.shape[0], overlay.shape[1]
    background[y:y+overlay_h, x:x+overlay_w] = overlay