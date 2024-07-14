import { updateStatus } from './ui.js';

/**
 * Initializes the preview setup by adding event listeners to various elements
 */
export function setupPreview() {
    // Event listeners for real-time updates to the preview
    document.getElementById('logoX').addEventListener('input', updatePreview);
    document.getElementById('logoY').addEventListener('input', updatePreview);
    document.getElementById('scrollingText').addEventListener('input', updatePreview);
}

/**
 * Updates the preview image based on the current form data
 */
export function updatePreview() {
    const formData = new FormData(document.getElementById('settingsForm'));
    fetch('/preview', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('previewImage').src = `data:image/jpeg;base64,${data.image}`;
        updateStatus('Preview updated');
    })
    .catch(() => {
        updateStatus('Error generating preview');
    });
}