let info_abierto = true;
function abrir_info() {
    if (!info_abierto) {
        info_abierto = !info_abierto;
        document.getElementById("div-info").style.display = "block";
        document.getElementById("bt-info").style.display = "none";
    }
}

let audio_play = false;
window.addEventListener('click', () => {
    if (info_abierto) {
        info_abierto = null;
        document.getElementById("div-info").style.display = "none";
        document.getElementById("bt-info").style.display = "none";
    }
    if (!audio_play) {
        document.getElementById("song").play();
    }
    else {
        document.getElementById("song").pause();
        document.getElementById("song").currenTime = 0;
    }
    audio_play = !audio_play
});


let autoRotate = true; // auto rotate or not
let rotateSpeed = -55; // unit: seconds/360 degrees



setTimeout(init, 100);

const odrag = document.getElementById("drag-container");
const ospin = document.getElementById("spin-container");
const aImg = ospin.getElementsByTagName("img");
let aEle = [...aImg]
//espacio imagenes
let radius = 260;
//tamaño imagenes
let imgWidth = 140;
let imgHeight = 180;
const pantalla_width = window.innerWidth

if (pantalla_width > 1700) {
    imgWidth = 200
    imgHeight = 230
    radius = 310
}
else if (pantalla_width > 1500 && pantalla_width <= 1700) {
    imgWidth = 185
    imgHeight = 225
    radius = 290
}
else if (pantalla_width > 1300 && pantalla_width <= 1500) {
    imgWidth = 175
    imgHeight = 215
    radius = 265
}
else if (pantalla_width > 1000 && pantalla_width <= 1300) {
    imgWidth = 160
    imgHeight = 200
    radius = 235
}
else if (pantalla_width >= 850 && pantalla_width <= 1000) {
    imgWidth = 150
    imgHeight = 190
    radius = 210
}
else if (pantalla_width >= 675 && pantalla_width < 850) {
    imgWidth = 140
    imgHeight = 180
    radius = 180
}
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
const ground = document.getElementById("ground");
ground.style.width = radius * 2 + "px";
ground.style.height = radius * 2 + "px";

function init(delayTime) {
    for (let i = 0; i < aEle.length; i++) {
        aEle[i].style.transform =
            "rotateY(" +
            i * (360 / aEle.length) +
            "deg) translateZ(" +
            radius +
            "px)";
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay =
            delayTime || (aEle.length - i) / 4 + "s";
    }
}

function applyTranform(obj) {
    // Constrain the angle of camera (between 0 and 180)
    if (tY > 180) tY = 180;
    if (tY < 0) tY = 0;

    // Apply the angle
    obj.style.transform = "rotateX(" + -tY + "deg) rotateY(" + tX + "deg)";
}

function playSpin(yes) {
    ospin.style.animationPlayState = yes ? "running" : "paused";
}

let sX,
    sY,
    nX,
    nY,
    desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
    let animationName = rotateSpeed > 0 ? "spin" : "spinRevert";
    ospin.style.animation = `${animationName} ${Math.abs(
        rotateSpeed
    )}s infinite linear`;
}

// add background music

// setup events
document.onpointerdown = function (e) {
    clearInterval(odrag.timer);
    e = e || window.event;
    let sX = e.clientX,
        sY = e.clientY;

    this.onpointermove = function (e) {
        e = e || window.event;
        let nX = e.clientX,
            nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTranform(odrag);
        sX = nX;
        sY = nY;
    };

    this.onpointerup = function (e) {
        odrag.timer = setInterval(function () {
            desX *= 0.95;
            desY *= 0.95;
            tX += desX * 0.1;
            tY += desY * 0.1;
            applyTranform(odrag);
            playSpin(false);
            if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
                clearInterval(odrag.timer);
                playSpin(true);
            }
        }, 17);
        this.onpointermove = this.onpointerup = null;
    };

    return false;
};

document.onmousewheel = function (e) {
    e = e || window.event;
    let d = e.wheelDelta / 20 || -e.detail;
    radius += d;
    init(1);
};