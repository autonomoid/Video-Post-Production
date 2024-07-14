$(document).ready(function(){
    var socket = io();
    var processedVideoAvailable = false;

    socket.on('connect', function() {
        console.log('Connected to server');
    });

    socket.on('status', function(data) {
        $('#statusMessage').text(data.message);
    });

    socket.on('progress', function(data) {
        $('#progressBar').css('width', data.progress + '%').attr('aria-valuenow', data.progress).text(data.progress + '%');
        if (data.progress === 100) {
            $('#progressBar').addClass('progress-bar-complete');
        } else {
            $('#progressBar').removeClass('progress-bar-complete');
        }
    });

    socket.on('processing_done', function(data) {
        processedVideoAvailable = true;
        var videoUrl = '/download/' + data.filename;
        $('#videoSource').attr('src', videoUrl);
        $('#videoPreview').get(0).pause();
        $('#videoPreview').get(0).load();
        setTimeout(function() {
            $('#videoPreview').get(0).play();
        }, 1000);
        $('#downloadButton').attr('href', videoUrl);
        $('#downloadButton').removeClass('disabled');
        $('#downloadButton').removeAttr('disabled');
        $('#imagePreviewContainer').hide();
        $('#videoPreviewContainer').show();
        $('#togglePreview').removeClass('disabled');
        $('#togglePreview').removeAttr('disabled');
        $('#togglePreview').text('Show Image Preview');
    });

    $('#file').on('change', function() {
        if ($(this).val()) {
            $('#settingsForm').removeAttr('inert');
            $('#processButton').removeAttr('disabled');
        } else {
            $('#settingsForm').attr('inert', true);
            $('#processButton').attr('disabled', 'disabled');
        }
    });

    $('#uploadForm').on('submit', function(e){
        e.preventDefault();

        var formData = new FormData(this);
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            success: function(response){
                if(response.status === 'processing') {
                    $('#statusMessage').text('File uploaded successfully. Processing...');
                    enableImageView();
                } else {
                    $('#statusMessage').text('Error uploading file');
                }
            },
            error: function() {
                $('#statusMessage').text('Error uploading file');
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    function enableImageView() {
        $('#imagePreviewContainer').show();
        $('#videoPreviewContainer').hide();
        $('#togglePreview').text('Show Processed Video');
        $('#togglePreview').addClass('disabled');
        $('#togglePreview').attr('disabled', 'disabled');
    }

    $('#settingsForm').on('submit', function(e){
        e.preventDefault();
        var formData = new FormData(this);
        $.ajax({
            url: '/settings',
            type: 'POST',
            data: formData,
            success: function(response){
                $('#statusMessage').text('Settings updated');
                updatePreview();
                $('#imagePreviewContainer').show();
                $('#videoPreviewContainer').hide();
                $('#togglePreview').text('Show Processed Video');
            },
            error: function() {
                $('#statusMessage').text('Error updating settings');
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    $('#settingsForm :input').on('change', function() {
        var formData = new FormData($('#settingsForm')[0]);
        $.ajax({
            url: '/settings',
            type: 'POST',
            data: formData,
            success: function(response){
                $('#statusMessage').text('Settings saved');
            },
            error: function() {
                $('#statusMessage').text('Error saving settings');
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });

    $('#topBannerColor, #bottomBannerColor').on('change', function() {
        if($('#lockColors').is(':checked')) {
            $('#bottomBannerColor').val($('#topBannerColor').val());
        }
        updatePreview();
    });

    $('#logoX, #logoY, #scrollingText').on('input', function() {
        updatePreview();
    });

    $('#togglePreview').on('click', function() {
        togglePreview();
    });

    function togglePreview() {
        if ($('#imagePreviewContainer').is(':visible')) {
            $('#imagePreviewContainer').hide();
            $('#videoPreviewContainer').show();
            $('#togglePreview').text('Show Image Preview');
            $('#videoPreview').get(0).load();
            setTimeout(function() {
                $('#videoPreview').get(0).play();
            }, 1000);
        } else {
            $('#imagePreviewContainer').show();
            $('#videoPreviewContainer').hide();
            $('#togglePreview').text('Show Processed Video');
        }
    }

    function updatePreview() {
        var formData = new FormData($('#settingsForm')[0]);
        $.ajax({
            url: '/preview',
            type: 'POST',
            data: formData,
            success: function(response){
                if(response.status === 'success') {
                    $('#previewImage').attr('src', 'data:image/jpeg;base64,' + response.image);
                    $('#statusMessage').text('Preview updated');
                } else {
                    $('#statusMessage').text(response.message || 'Error generating preview');
                }
            },
            error: function() {
                $('#statusMessage').text('Error generating preview');
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

    socket.on('progress', function(data){
        $('#progressBar').css('width', data.progress + '%').attr('aria-valuenow', data.progress).text(data.progress + '%');
        if (data.progress === 100) {
            $('#progressBar').addClass('progress-bar-complete');
        } else {
            $('#progressBar').removeClass('progress-bar-complete');
        }
    });

    socket.on('status', function(data){
        $('#statusMessage').text(data.message);
    });

    socket.on('processing_done', function(data){
        processedVideoAvailable = true;
        var videoUrl = '/download/' + data.filename;
        $('#videoSource').attr('src', videoUrl);
        $('#videoPreview').get(0).pause();
        $('#videoPreview').get(0).load();
        setTimeout(function() {
            $('#videoPreview').get(0).play();
        }, 1000);
        $('#downloadButton').attr('href', videoUrl);
        $('#downloadButton').removeClass('disabled');
        $('#downloadButton').removeAttr('disabled');
        $('#imagePreviewContainer').hide();
        $('#videoPreviewContainer').show();
        $('#togglePreview').removeClass('disabled');
        $('#togglePreview').removeAttr('disabled');
        $('#togglePreview').text('Show Image Preview');
    });

    $('#downloadButton').on('click', function(){
        if (!processedVideoAvailable) {
            return false;  // prevent default action if video is not ready
        }
    });
});