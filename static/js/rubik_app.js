var scene, camera;
var dot = document.getElementsByClassName("dot")
var scan_btn = document.getElementById("scan")
var capture_btn = document.getElementById("capture")
var scan_status = document.getElementById("scan-status")
var solve_btn = document.getElementById("solve")

color_obj = {
    yellow: "rgb(255, 255, 0)",
    blue: "rgb(0, 0, 255)",
    red: "rgb(255, 0, 0)",
    green: "rgb(0, 128, 0)",
    orange: "rgb(255, 165, 0)",
    white: "rgb(255, 0, 0)"
}

var WIDTH = 200;
var HEIGHT = 200;
var SPEED = 0.03;

var texture_list = [];
var cube;

const renderer = new THREE.WebGLRenderer({ antialias: true });

function initCube(){
    var texture0 = new THREE.TextureLoader().load("/static/img/0.jpg", () => {renderer.render(scene, camera)});
    for(var i = 0; i < 6; i++){
        texture_list.push(new THREE.MeshBasicMaterial({ map: texture0 }));
    }
    cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), texture_list);
    cube.rotation.x = Math.PI*90/180
    scene.add(cube);
}
function initCamera(){
    camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1 , 10);
    camera.position.set(2, 2, 5);
    camera.lookAt(scene.position);
    scene.add(camera);
}
function initRender(){
    document.getElementById("container").appendChild(renderer.domElement)
    renderer.setSize(WIDTH, HEIGHT);
}
function initAll(){
    scene = new THREE.Scene();
    var loader = new THREE.TextureLoader();
    loader.crossOrigin = true;
    initCube()
    initCamera()
    initRender()
}
initAll()
// function waitCube(){
//     return new Promise(resolve => {
//         var texture0 = new THREE.TextureLoader().load("/static/img/0.jpg", () => {renderer.render(scene, camera)});
//         for(var i = 0; i < 6; i++){
//             texture_list.push(new THREE.MeshBasicMaterial({ map: texture0 }));
//         }
//         cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), texture_list);
//         cube.rotation.x = Math.PI*90/180
//         resolve(scene.add(cube));      
//     });
// }
// function waitCamera(){
//     return new Promise(resolve => {
//         camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1 , 10);
//         camera.position.set(2, 2, 5);
//         camera.lookAt(scene.position);
//         resolve(scene.add(camera));
//     });
// }
// function waitRender(){
//     return new Promise(resolve => {
//         document.body.appendChild(renderer.domElement)
//         renderer.setSize(WIDTH, HEIGHT);
//     });
// }
// function initCube(){
//     waitCube()
// }
// function initCamera(){
//     waitCamera()
// }
// function initRender(){
//     waitRender()
// }
// function initAll(){
//     scene = new THREE.Scene();
//     var loader = new THREE.TextureLoader();
//     loader.crossOrigin = true;
//     initCube()
//     initCamera()
//     initRender()  
// }
function update(cnt, order){
    if(document.getElementsByTagName("img")){
        var url_img = document.getElementsByTagName("img")[cnt - 1].src
    }
    var texture = new THREE.TextureLoader().load(url_img, () => {renderer.render(scene, camera)});
    //rotate image for 6th
    if(cnt == 6){
        var img = new Image();
        img.src = url_img;
        var mapCanvas = document.createElement('canvas');
        mapCanvas.width = mapCanvas.height = 300;
        var ctx = mapCanvas.getContext('2d');
        ctx.translate(300 / 2, 300 / 2);
        ctx.rotate(-Math.PI / 2 );
        ctx.translate(-300 / 2, -300 / 2);
        ctx.drawImage(img, 0, 0, 300, 300);
        texture = new THREE.Texture( mapCanvas );
        texture.needsUpdate = true;
    }
    texture_list[order] = new THREE.MeshBasicMaterial({ map: texture });
}
function rotate_x(){
    var stop_x = cube.rotation.x
    var i = setInterval(function(){
        cube.rotation.x -= SPEED
        renderer.render(scene, camera);
        if(cube.rotation.x <= stop_x - Math.PI*90/180) {
            stop_x = cube.rotation.x
            clearInterval(i);
            scan_btn.disabled = false
        }
    }, 30);
}
function rotate_y(){
    var stop_y = cube.rotation.y
    //requestAnimationFrame(render);
    var i = setInterval(function(){
        cube.rotation.y -= SPEED
        renderer.render(scene, camera);
        if(cube.rotation.y <= stop_y - Math.PI*90/180) {
            stop_y = cube.rotation.y
            clearInterval(i);
            scan_btn.disabled = false
        }
    }, 30); 
}
function rotate_z(){
    var stop_z = cube.rotation.z
    var i = setInterval(function(){
        cube.rotation.z -= SPEED
        renderer.render(scene, camera);
        if(cube.rotation.z <= stop_z - Math.PI*90/180) {
            stop_z = cube.rotation.z
            clearInterval(i);
            scan_btn.disabled = false
        }
    }, 30);
}

// Set constraints for the video stream
var constraints = { 
    video: { 
        facingMode: "environment" 
    }, 
    audio: false 
};
// Define constants
const cameraView = document.querySelector("#camera--view"),
      cameraOutput = document.createElement("img"),
      cameraSensor = document.querySelector("#camera--sensor")
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
function find_key(val){
    for (const [key, value] of Object.entries(color_obj)) {
        if(value == val){
            return key
        }
    }
}
// Take a picture when scan_btn is tapped
var click = 1
var color_letter = ""
scan_btn.onclick = () => {
    if(click == 6){
        scan_btn.disabled = true
    }
    scan_btn.disabled = true
    scan_status.innerHTML = "Scanning..."
    scan_status.style.display = "block"
    
    var cameraOutput = document.createElement("img")
    cameraSensor.width = 300;
    cameraSensor.height = 300;
    cameraSensor.getContext("2d").drawImage(cameraView, -170, -90);
    // function aa(){
    //     var p = document.createElement("p")
    //     p.innerHTML = document.getElementsByClassName("nhac-in").value+";"+document.getElementById("rgb01")
    //     document.getElementById("nhac-div").appendChild(p)}
    cameraOutput.src = cameraSensor.toDataURL("jpg");
    
    $.ajax({ 
        url: '/result', 
        type: 'POST', 
        data: cameraOutput.src.replace("data:image/png;base64,",""),
        success: response => { 
            for(var i = 0; i < 9; i++){
                dot[i].style.backgroundColor = color_obj[response.colors[i]]
            }
            scan_status.innerHTML = "Done!"
            capture_btn.disabled = false
        } 
    });
    cameraOutput.classList.add("taken");
    document.getElementById("image-list").appendChild(cameraOutput)
}
capture_btn.onclick = () => {
    if(click == 6){
        capture_btn.disabled = true
        solve_btn.disabled = false
    }
    capture_btn.disabled = true
    scan_status.style.display = "none"
    for(var i = 0; i < 9; i++){
        if(click == 6){
            color_letter += find_key(dot[8 - i].style.backgroundColor)[0] 
        }
        else if(click == 1){
            color_letter += find_key(dot[6 + (i - (i % 3)) / 3 - 3 * (i % 3)].style.backgroundColor)[0]
        }
        else{
            color_letter += find_key(dot[i].style.backgroundColor)[0]
        }
    }
    switch(click){
        case 1:
            update(click, 2)
            break
        case 2:
            update(click, 4)
            break
        case 3:
            update(click, 0)
            break
        case 4:
            update(click, 5)
            break
        case 5:
            update(click, 1)
            break
        case 6:
            update(click, 3)
            break
    }
    if(click == 1 || click == 5 ){
        rotate_x()
    }
    if(click > 1 && click < 5){
        rotate_y()
    }
    click++
}
solve_btn.onclick = () => {
    //color_letter = 'boobyowbgoogbbowyrrwwwrbyyroyyrgrwwrggywoybrbgrbgwgogy'
    $.ajax({ 
        url: '/solve', 
        type: 'POST', 
        data: color_letter,
        success: response => {
            document.getElementById("solve-result").innerHTML = "Result: " + response.step.replace(/,/g, "")
        } 
    });
}
// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);