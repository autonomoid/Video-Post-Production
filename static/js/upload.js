// upload.js
import { enableImageView, updateStatus } from './ui.js';

export function setupUploadForm() {
    document.getElementById('file').addEventListener('change', function() {
        if (this.value) {
            document.getElementById('settingsForm').removeAttribute('inert');
            document.getElementById('processButton').removeAttribute('disabled');
        } else {
            document.getElementById('settingsForm').setAttribute('inert', 'true');
            document.getElementById('processButton').setAttribute('disabled', 'true');
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