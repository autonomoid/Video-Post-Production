/**
 * Updates the status message displayed to the user
 * @param {string} message - The status message to display
 */
export function updateStatus(message) {
    document.getElementById('statusMessage').innerText = message;
}

/**
 * Updates the progress bar based on the progress value
 * @param {number} progress - The current progress value (0-100)
 */
export function updateProgress(progress) {
    const progressBar = document.getElementById('progressBar');
    setProgressBarWidth(progressBar, progress);
    setProgressBarAttributes(progressBar, progress);
    toggleProgressBarCompleteClass(progressBar, progress);
}

/**
 * Sets the width of the progress bar
 * @param {HTMLElement} progressBar - The progress bar element
 * @param {number} progress - The current progress value (0-100)
 */
function setProgressBarWidth(progressBar, progress) {
    progressBar.style.width = `${progress}%`;
}

/**
 * Sets the attributes of the progress bar
 * @param {HTMLElement} progressBar - The progress bar element
 * @param {number} progress - The current progress value (0-100)
 */
function setProgressBarAttributes(progressBar, progress) {
    progressBar.setAttribute('aria-valuenow', progress);
    progressBar.innerText = `${progress}%`;
}

/**
 * Toggles the 'progress-bar-complete' class based on progress value
 * @param {HTMLElement} progressBar - The progress bar element
 * @param {number} progress - The current progress value (0-100)
 */
function toggleProgressBarCompleteClass(progressBar, progress) {
    if (progress === 100) {
        progressBar.classList.add('progress-bar-complete');
    } else {
        progressBar.classList.remove('progress-bar-complete');
    }
}

/**
 * Enables the image preview view and hides the video preview
 */
export function enableImageView() {
    displayElement('imagePreviewContainer');
    hideElement('videoPreviewContainer');
    updateTogglePreviewButton('Show Processed Video');
}

/**
 * Displays the specified element by ID
 * @param {string} elementId - The ID of the element to display
 */
function displayElement(elementId) {
    document.getElementById(elementId).style.display = 'block';
}

/**
 * Hides the specified element by ID
 * @param {string} elementId - The ID of the element to hide
 */
function hideElement(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

/**
 * Updates the toggle preview button text
 * @param {string} text - The text to set on the toggle preview button
 */
function updateTogglePreviewButton(text) {
    document.getElementById('togglePreview').innerText = text;
}

/**
 * Displays the video preview and hides the image preview
 */
export function displayVideoPreview() {
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('videoPreviewContainer').style.display = 'block';
    const togglePreviewButton = document.getElementById('togglePreview');
    togglePreviewButton.classList.remove('disabled');
    togglePreviewButton.removeAttribute('disabled');
    togglePreviewButton.innerText = 'Show Image Preview';
}

/**
 * Toggles the preview between image and video
 */
export function togglePreview() {
    if (isImagePreviewVisible()) {
        displayVideoPreview();
    } else {
        enableImageView();
    }
}

/**
 * Checks if the image preview is currently visible
 * @returns {boolean} - True if the image preview is visible, otherwise false
 */
function isImagePreviewVisible() {
    return document.getElementById('imagePreviewContainer').style.display !== 'none';
}

/**
 * Updates the video source and prepares the video for playback
 * @param {string} videoUrl - The URL of the processed video
 */
export function updateVideoSource(videoUrl) {
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
export function enableDownloadButton(videoUrl) {
    const downloadButton = document.getElementById('downloadButton');
    downloadButton.href = videoUrl;
    downloadButton.classList.remove('disabled');
    downloadButton.removeAttribute('disabled');
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

/**
 * Enable the form and related buttons
 * @param {HTMLElement} settingsForm - The settings form element
 * @param {HTMLElement} processButton - The process button element
 * @param {HTMLElement} applyButton - The apply button element
 */
export function enableForm(settingsForm, processButton, applyButton) {
    settingsForm.removeAttribute('inert');
    processButton.removeAttribute('disabled');
    applyButton.removeAttribute('disabled');  // Enable the Apply button
}

/**
 * Disable the form and related buttons
 * @param {HTMLElement} settingsForm - The settings form element
 * @param {HTMLElement} processButton - The process button element
 * @param {HTMLElement} applyButton - The apply button element
 */
export function disableForm(settingsForm, processButton, applyButton) {
    settingsForm.setAttribute('inert', 'true');
    processButton.setAttribute('disabled', 'true');
    applyButton.setAttribute('disabled', 'true');  // Disable the Apply button
}