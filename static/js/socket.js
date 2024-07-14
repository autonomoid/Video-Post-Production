// socket.js
import { updateProgress, updateStatus } from './ui.js';

export function setupSocket() {
    var socket = io();
    
    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('status', function(data) {
        updateStatus(data.message);
    });

    socket.on('progress', function(data) {
        updateProgress(data.progress);
    });

    socket.on('processing_done', function(data) {
        const videoUrl = '/download/' + data.filename;
        document.getElementById('videoSource').src = videoUrl;
        document.getElementById('videoPreview').load();
        setTimeout(function() {
            document.getElementById('videoPreview').play();
        }, 1000);
        document.getElementById('downloadButton').href = videoUrl;
        document.getElementById('downloadButton').classList.remove('disabled');
        document.getElementById('downloadButton').removeAttribute('disabled');
        document.getElementById('imagePreviewContainer').style.display = 'none';
        document.getElementById('videoPreviewContainer').style.display = 'block';
        document.getElementById('togglePreview').classList.remove('disabled');
        document.getElementById('togglePreview').removeAttribute('disabled');
        document.getElementById('togglePreview').innerText = 'Show Image Preview';
    });

    return socket;
}