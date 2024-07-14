import cv2
import numpy as np

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
    logo_size = (50, 50)

    h, w, _ = frame.shape
    top_banner = np.zeros((top_banner_height, w, 3), dtype=np.uint8)
    top_banner[:] = top_banner_color
    frame = np.vstack((top_banner, frame))

    bottom_banner = np.zeros((bottom_banner_height, w, 3), dtype=np.uint8)
    bottom_banner[:] = bottom_banner_color
    frame = np.vstack((frame, bottom_banner))

    if logo_path:
        logo = cv2.imread(logo_path, cv2.IMREAD_UNCHANGED)
        logo = cv2.resize(logo, logo_size)
        logo_h, logo_w, logo_c = logo.shape

        logo_x = settings.get('logo_x', 10)
        logo_y = settings.get('logo_y', 10)

        if logo_c == 4:
            alpha_logo = logo[:, :, 3] / 255.0
            alpha_frame = 1.0 - alpha_logo

            for c in range(0, 3):
                frame[logo_y:logo_y+logo_h, logo_x:logo_x+logo_w, c] = (alpha_logo * logo[:, :, c] +
                                                    alpha_frame * frame[logo_y:logo_y+logo_h, logo_x:logo_x+logo_w, c])
        else:
            frame[logo_y:logo_y+logo_h, logo_x:logo_x+logo_w] = logo

    font_scale = 1
    font_thickness = 2
    font = cv2.FONT_HERSHEY_SIMPLEX
    text_size = cv2.getTextSize(settings.get('scrolling_text', 'Rootkit Racers'), font, font_scale, font_thickness)[0]

    scroll_speed = 5
    if preview:
        horizontal_shift = (w // 2) + (text_size[0] // 2)
    else:
        horizontal_shift = (scroll_speed * frame_idx) % (w + text_size[0])

    text_x = int(w - horizontal_shift)
    text_y = int(h + 1.75 * bottom_banner_height)

    cv2.putText(frame, settings.get('scrolling_text', 'Rootkit Racers'), (text_x, text_y), font, font_scale, (255, 255, 255), font_thickness, cv2.LINE_AA)

    return frame
