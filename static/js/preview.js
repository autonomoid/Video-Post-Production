// preview.js
import { updateStatus } from './ui.js';

export function setupPreview() {
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var formData = new FormData(this);
        fetch('/settings', {
            method: 'POST',
            body: formData
        }).then(response => response.json())
        .then(() => {
            updateStatus('Settings updated');
            updatePreview();
            document.getElementById('imagePreviewContainer').style.display = 'block';
            document.getElementById('videoPreviewContainer').style.display = 'none';
            document.getElementById('togglePreview').innerText = 'Show Processed Video';
        }).catch(() => {
            updateStatus('Error updating settings');
        });
    });

    document.getElementById('togglePreview').addEventListener('click', function() {
        if (document.getElementById('imagePreviewContainer').style.display !== 'none') {
            document.getElementById('imagePreviewContainer').style.display = 'none';
            document.getElementById('videoPreviewContainer').style.display = 'block';
            this.innerText = 'Show Image Preview';
            document.getElementById('videoPreview').load();
            setTimeout(function() {
                document.getElementById('videoPreview').play();
            }, 1000);
        } else {
            document.getElementById('imagePreviewContainer').style.display = 'block';
            document.getElementById('videoPreviewContainer').style.display = 'none';
            this.innerText = 'Show Processed Video';
        }
    });

    // Event listener for the top banner color change
    document.getElementById('topBannerColor').addEventListener('change', function() {
        if (document.getElementById('lockColors').checked) {
            document.getElementById('bottomBannerColor').value = this.value;
        }
        updatePreview();
    });

    // Event listener for the lock colors checkbox change
    document.getElementById('lockColors').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('bottomBannerColor').value = document.getElementById('topBannerColor').value;
        }
        updatePreview();
    });

    document.getElementById('logoX').addEventListener('input', updatePreview);
    document.getElementById('logoY').addEventListener('input', updatePreview);
    document.getElementById('scrollingText').addEventListener('input', updatePreview);
}

export function updatePreview() {
    var formData = new FormData(document.getElementById('settingsForm'));
    fetch('/preview', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
    .then(data => {
        document.getElementById('previewImage').src = 'data:image/jpeg;base64,' + data.image;
        updateStatus('Preview updated');
    }).catch(() => {
        updateStatus('Error generating preview');
    });
}