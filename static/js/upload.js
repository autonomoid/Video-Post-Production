import { enableImageView, updateStatus } from './ui.js';

/**
 * Main function to setup the upload form
 */
export function setupUploadForm() {
    setupFileChangeListener();
    setupFormSubmitListener();
}

/**
 * Setup listener for file input change event
 */
function setupFileChangeListener() {
    document.getElementById('file').addEventListener('change', handleFileChange);
}

/**
 * Handle the change event for the file input
 */
function handleFileChange() {
    const fileInput = this;
    const applyButton = document.getElementById('previewButton');
    const settingsForm = document.getElementById('settingsForm');
    const processButton = document.getElementById('processButton');

    if (fileInput.value) {
        enableForm(settingsForm, processButton, applyButton);  // Enable the form and buttons if a file is selected
    } else {
        disableForm(settingsForm, processButton, applyButton);  // Disable the form and buttons if no file is selected
    }
}

/**
 * Enable the form and related buttons
 * @param {HTMLElement} settingsForm - The settings form element
 * @param {HTMLElement} processButton - The process button element
 * @param {HTMLElement} applyButton - The apply button element
 */
function enableForm(settingsForm, processButton, applyButton) {
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
function disableForm(settingsForm, processButton, applyButton) {
    settingsForm.setAttribute('inert', 'true');
    processButton.setAttribute('disabled', 'true');
    applyButton.setAttribute('disabled', 'true');  // Disable the Apply button
}

/**
 * Setup listener for form submit event
 */
function setupFormSubmitListener() {
    document.getElementById('uploadForm').addEventListener('submit', handleFormSubmit);
}

/**
 * Handle the form submission event
 * @param {Event} event - The event object
 */
function handleFormSubmit(event) {
    event.preventDefault();  // Prevent the default form submission
    const formData = new FormData(this);  // Create a FormData object from the form

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(handleUploadResponse)
    .catch(handleUploadError);
}

/**
 * Handle the response from the server after file upload
 * @param {Object} data - The data received from the server
 */
function handleUploadResponse(data) {
    if (data.status === 'processing') {
        updateStatus('File uploaded successfully. Processing...');  // Update the status to indicate successful upload
        enableImageView();  // Enable the image view
    } else {
        updateStatus('Error uploading file');  // Update the status to indicate an error
    }
}

/**
 * Handle any errors that occur during the upload process
 */
function handleUploadError() {
    updateStatus('Error uploading file');  // Update the status to indicate an error
}