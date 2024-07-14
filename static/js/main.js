// Import necessary setup functions from external modules
import { setupSocket } from './socketHandlers.js';
import { setupUploadForm } from './upload.js';
import { setupPreview } from './preview.js';
import { setupEventHandlers } from './eventHandlers.js';

// Event listener for DOMContentLoaded to initialize the setups
document.addEventListener('DOMContentLoaded', function() {
    setupSocket();        // Initialize socket connection and event listeners
    setupUploadForm();    // Initialize upload form event listeners
    setupPreview();       // Initialize preview setup and event listeners
    setupEventHandlers(); // Initialize other event handlers
});
