import { updateStatus, updateProgress, displayVideoPreview, enableImageView } from './ui.js';

/**
 * Initializes the socket connection and sets up event listeners for various socket events
 * @returns {Socket} - The initialized socket
 */
export function setupSocket() {
    const socket = io();

    // Event listener for successful connection
    socket.on('connect', handleConnect);

    // Event listener for status updates
    socket.on('status', handleStatusUpdate);

    // Event listener for progress updates
    socket.on('progress', handleProgressUpdate);

    // Event listener for when processing is done
    socket.on('processing_done', handleProcessingDone);

    return socket;
}

/**
 * Handles the socket connection event
 */
function handleConnect() {
    console.log('Connected to server');
}

/**
 * Handles the status update event from the server
 * @param {Object} data - The data received from the server
 * @param {string} data.message - The status message
 */
function handleStatusUpdate(data) {
    updateStatus(data.message);
}

/**
 * Handles the progress update event from the server
 * @param {Object} data - The data received from the server
 * @param {number} data.progress - The progress value
 */
function handleProgressUpdate(data) {
    updateProgress(data.progress);
}

/**
 * Handles the processing done event from the server
 * @param {Object} data - The data received from the server
 * @param {string} data.filename - The name of the processed video file
 */
function handleProcessingDone(data) {
    const videoUrl = `/download/${data.filename}`;
    updateVideoSource(videoUrl);
    enableDownloadButton(videoUrl);
    displayVideoPreview();
}

/**
 * Updates the video source and prepares the video for playback
 * @param {string} videoUrl - The URL of the processed video
 */
function updateVideoSource(videoUrl) {
    const videoElement = document.getElementById('videoPreview');
    document.getElementById('videoSource').src = videoUrl;
    videoElement.load();
    setTimeout(() => {
        videoElement.play();
    }, 1000);
}

/**
 * Enables the download button with the given video URL
 * @param {string} videoUrl - The URL of the processed video
 */
function enableDownloadButton(videoUrl) {
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.href = videoUrl;
    downloadButton.classList.remove('disabled');
    downloadButton.removeAttribute('disabled');
}