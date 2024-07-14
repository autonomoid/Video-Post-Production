// main.js
import { setupSocket } from './socket.js';
import { setupUploadForm } from './upload.js';
import { setupPreview } from './preview.js';

document.addEventListener('DOMContentLoaded', function() {
    setupSocket();
    setupUploadForm();
    setupPreview();
});