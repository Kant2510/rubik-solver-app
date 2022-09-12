import {rotate_x, rotate_y, rotate_z, update} from "./cube.js"
// Set constraints for the video stream
var constraints = { 
    video: { 
        facingMode: "environment" 
    }, 
    audio: false 
};
// Define constants
const cameraView = document.querySelector("#camera--view"),
    //cameraOutput = document.querySelector("#camera--output"),
    cameraOutput = document.createElement("img"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger")
    
    const can = document.getElementById('canvas');  
// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
        var track = stream.getTracks()[0];
        cameraView.srcObject = stream;
    })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
var click = 1
cameraTrigger.onclick = () => {
    cameraTrigger.disabled = true
    if(click == 1){
        update(click, 2)
    }
    if(click == 2){
        update(click, 4)
    }
    if(click == 3){
        update(click, 0)
    }
    if(click == 4){
        update(click, 5)
    }
    if(click == 5){
        update(click, 1)
    }
    if(click == 6){
        update(click, 3)
    }

    setTimeout(() => {
        if(click == 1 || click == 5 ){
            rotate_x()
        }
        if(click > 1 && click < 5){
            rotate_y()
        }
        click++
    }, 100);
    var context = can.getContext('2d')

    // Capture the image into canvas from Webcam streaming Video element  
    context.drawImage(cameraView, 0, 0); 
    var cameraOutput = document.createElement("img")
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    
    cameraOutput.src = cameraSensor.toDataURL("jpg");
    document.getElementById("base64-string").value = cameraOutput.src.replace("data:image/png;base64,","")
    cameraOutput.classList.add("taken");
    document.getElementById("image-list").appendChild(cameraOutput)
};
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);