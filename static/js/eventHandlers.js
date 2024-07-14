import { updatePreview } from './preview.js';
import { updateStatus, enableImageView, displayVideoPreview, togglePreview } from './ui.js';

/**
 * Initializes event handlers for various elements
 */
export function setupEventHandlers() {
    // Event listener for the settings form submission
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsFormSubmit);

    // Event listener for the top banner color change
    document.getElementById('topBannerColor').addEventListener('change', handleTopBannerColorChange);

    // Event listener for the lock colors checkbox change
    document.getElementById('lockColors').addEventListener('change', handleLockColorsChange);

    // Event listener for the upload form submission
    document.getElementById('uploadForm').addEventListener('submit', handleFormSubmit);

    // Event listener for toggling the preview between image and video
    document.getElementById('togglePreview').addEventListener('click', togglePreview);

    // Event listeners for real-time updates to the preview
    document.getElementById('logoX').addEventListener('input', updatePreview);
    document.getElementById('logoY').addEventListener('input', updatePreview);
    document.getElementById('scrollingText').addEventListener('input', updatePreview);
}

/**
 * Handles the settings form submission
 * @param {Event} e - The event object
 */
function handleSettingsFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    fetch('/settings', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(() => {
        updateStatus('Settings updated');
        updatePreview();
        enableImageView();
    })
    .catch(() => {
        updateStatus('Error updating settings');
    });
}

/**
 * Handles the top banner color change event
 */
function handleTopBannerColorChange() {
    if (document.getElementById('lockColors').checked) {
        document.getElementById('bottomBannerColor').value = this.value;
    }
    updatePreview();
}

/**
 * Handles the lock colors checkbox change event
 */
function handleLockColorsChange() {
    if (this.checked) {
        document.getElementById('bottomBannerColor').value = document.getElementById('topBannerColor').value;
    }
    updatePreview();
}

/**
 * Handles the form submission event
 * @param {Event} event - The event object
 */
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(this);
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(handleUploadResponse)
    .catch(handleUploadError);
}

/**
 * Handles the response from the server after file upload
 * @param {Object} data - The data received from the server
 */
function handleUploadResponse(data) {
    if (data.status === 'processing') {
        updateStatus('File uploaded successfully. Processing...');
        enableImageView();
    } else {
        updateStatus('Error uploading file');
    }
}

/**
 * Handles any errors that occur during the upload process
 */
function handleUploadError() {
    updateStatus('Error uploading file');
}