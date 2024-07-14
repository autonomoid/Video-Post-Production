// Import necessary setup functions from external modules
import { setupSocketHandlers } from './socketHandlers.js';
import { setupEventHandlers } from './eventHandlers.js';

// Event listener for DOMContentLoaded to initialize the setups
document.addEventListener('DOMContentLoaded', function() {
    setupSocketHandlers(); // Initialize socket connection and event listeners
    setupEventHandlers();  // Initialize all event handlers
});