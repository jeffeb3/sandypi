var dropzone;
var floater;

function show_dropzone(){
    if(!dropzone){
        $("#popup_container").html('\
    <div id="upload_dropzone">\
        <div class="dz-message" data-dz-message>\
            <span class="message_span">Drag and drop the .gcode/.nc file here <br>or click to open the file explorer</span>\
            <div id="upload_progress">\
                <div id="upload_progress_value">0%</div>\
                <span id="upload_progress_bar"></span>\
            </div>\
        </div>\
    </div>');
        dropzone = new Dropzone("#upload_dropzone", {url: location.protocol + '//' + location.host + "/upload", acceptedFiles: ".gcode, .nc"});
        dropzone.on("success", file_loaded_success);
        dropzone.on("error", file_loaded_error);
        dropzone.on("totaluploadprogress", function (progress) {
            document.getElementById("upload_progress_bar").style.width=progress + '%';
            document.getElementById("upload_progress_value").text = progress + '%';
          });
        dropzone.on("addedfile", function(file){
            document.getElementById("upload_progress").style.display="block";
        })
    }

    floater = document.getElementById("popup");
    floater.style.display = 'block';
    floater.setAttribute("onclick", "hide_dropzone()");
}

function hide_dropzone(){
    floater.style.display = 'none';
    dropzone.removeAllFiles(true);
    document.getElementById("upload_progress").style.display="none";
    location.reload()
}

function file_loaded_success(){
    console.log("Success");
    hide_dropzone();
}

function file_loaded_error(){
    console.log("Error");
    hide_dropzone();
}

function redirect_drawing(code){
    window.location.href = "/drawing/"+code;
}