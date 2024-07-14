// ui.js
export function updateStatus(message) {
    document.getElementById('statusMessage').innerText = message;
}

export function updateProgress(progress) {
    var progressBar = document.getElementById('progressBar');
    progressBar.style.width = progress + '%';
    progressBar.setAttribute('aria-valuenow', progress);
    progressBar.innerText = progress + '%';
    if (progress === 100) {
        progressBar.classList.add('progress-bar-complete');
    } else {
        progressBar.classList.remove('progress-bar-complete');
    }
}

export function enableImageView() {
    document.getElementById('imagePreviewContainer').style.display = 'block';
    document.getElementById('videoPreviewContainer').style.display = 'none';
    document.getElementById('togglePreview').innerText = 'Show Processed Video';
}