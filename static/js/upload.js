// upload.js
import { enableImageView, updateStatus } from './ui.js';

export function setupUploadForm() {
    document.getElementById('file').addEventListener('change', function() {
        const fileInput = this;
        const applyButton = document.getElementById('previewButton');
        if (fileInput.value) {
            document.getElementById('settingsForm').removeAttribute('inert');
            document.getElementById('processButton').removeAttribute('disabled');
            applyButton.removeAttribute('disabled');  // Enable the Apply button
        } else {
            document.getElementById('settingsForm').setAttribute('inert', 'true');
            document.getElementById('processButton').setAttribute('disabled', 'true');
            applyButton.setAttribute('disabled', 'true');  // Disable the Apply button
        }
    });

    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        fetch('/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(data => {
            if (data.status === 'processing') {
                updateStatus('File uploaded successfully. Processing...');
                enableImageView();
            } else {
                updateStatus('Error uploading file');
            }
        }).catch(() => {
            updateStatus('Error uploading file');
        });
    });
}