var balls;
var inventory = [];
var levels;
var ctx;
var height = 800;
var width = 480;
var currentLevel = new Level();
var waterWave = 0;
var waterWaveD = 1;
var setIntervalId;

var currentLevelNumber = 0;
var imgLog = new Image();
imgLog.src = 'images/log.png';
var imgFrogRed = new Image();
imgFrogRed.src = 'images/redfrog.png';
var imgFrogGreen = new Image();
imgFrogGreen.src = 'images/greenfrog.png';
var imgFrogYellow = new Image();
imgFrogYellow.src = 'images/yellowfrog.png';
var imgFrogBlue = new Image();
imgFrogBlue.src = 'images/bluefrog.png';
var imgWater = new Image();
imgWater.src = 'images/water.png';

var isSoundOn = true;

//load setting value
if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem("isSoundOn") == "true") isSoundOn = true;
    if (localStorage.getItem("isSoundOn") == "false") isSoundOn = false;
    if (localStorage.getItem("isSoundOn") == null) isSoundOn = true;
}



var audioPlayer = new Audio(); // buffers automatically when created
audioPlayer.loop = true;
audioPlayer.volume = 0.4;

var selectedIcon;

var gameCanvas;
var greenFrogCanvas;
var yellowFrogCanvas;
var blueFrogCanvas;
var redFrogCanvas;
var logCanvas;
var dragIconsDiv;

var fps = 0;


//class Level
function Level(st, r, gf, rf, bf, yf, log, music) {
    this.startText = st;
    this.requied = r;
    this.greenFrogCount = gf;
    this.redFrogCount = rf;
    this.blueFrogCount = bf;
    this.yellowFrogCount = yf;
    this.logCount = log;
    this.music = music;
    this.remaining = function () {
        return currentLevel.greenFrogCount + currentLevel.redFrogCount + currentLevel.blueFrogCount + currentLevel.yellowFrogCount + currentLevel.logCount;
    }
}

//requestAnimationFrame fix for all browsers
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                   || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        //alert("requestAnimationFrame is not supported");
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
var scale = 1;
var offset = null;
function init() {
    currentLevelNumber = 0;
    dragIconsDiv = document.getElementById('dragicons');

    gameCanvas = document.getElementById('gameCanvas');
    gameCanvas.onmousedown = function (e) {
        gameClick(this, e);
    };
    // Add eventlistener to canvas
    //gameCanvas.addEventListener('touchmove', function () {
    //    //Assume only one touch/only process one touch even if there's more
    //    var touch = event.targetTouches[0];

    //    //// Is touch close enough to our object?
    //    //if (detectHit(obj.x, obj.y, touch.pageX, touch.pageY, obj.w, obj.h)) {
    //    //    // Assign new coordinates to our object
    //    //    obj.x = touch.pageX;
    //    //    obj.y = touch.pageY;

    //    //    // Redraw the canvas
    //    //    draw();
    //    //}
    //    event.preventDefault();
    //}, false);


    $(document).bind('touchstart mousedown', function (e) {
        var canvas = document.getElementById("gameCanvas");
        scale = canvas.clientWidth / canvas.width;
        offset = $('#gameCanvas').offset();

        var currentX = ((e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX) - offset.left) / scale;
        var currentY = ((e.originalEvent.touches ? e.originalEvent.touches[0].clientY : e.clientY) - offset.top) / scale;

        //if showing instuction remove them
        //todo:code it

        //check if item found to drag
        //todo:find hit col
        selectedIcon = null;
        for (i in balls) {
            if (currentX < balls[i].x - balls[i].s) continue;
            if (currentX > balls[i].x - balls[i].s + balls[i].img.width) continue;
            if (currentY < balls[i].y - balls[i].s) continue;
            if (currentY > balls[i].y - balls[i].s + balls[i].img.height) continue;

            selectedIcon = balls[i];
           // break;
        }
        for (i in inventory) {
            if (currentX < inventory[i].x - inventory[i].s) continue;
            if (currentX > inventory[i].x - inventory[i].s + inventory[i].img.width) continue;
            if (currentY < inventory[i].y - inventory[i].s) continue;
            if (currentY > inventory[i].y - inventory[i].s + inventory[i].img.height) continue;

            selectedIcon = inventory[i];
            //break;
        }
        if (selectedIcon != null) {
        }

        
    });
    $(document).bind('touchmove mousemove', function (e) {
        
        var currentX = ((e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX) - offset.left) / scale;
        var currentY = ((e.originalEvent.touches ? e.originalEvent.touches[0].clientY : e.clientY) - offset.top) / scale;


        //drag
        if (selectedIcon != null) {
            selectedIcon.x = currentX;
            selectedIcon.y = currentY;
        }
    });
    $(document).bind('touchend  mouseup', function (e) {

       //drop
        if (selectedIcon != null) {
            //remove from inventory
            var i = inventory.indexOf(selectedIcon);
            if (i > -1) {
                inventory.splice(i, 1);
            }
            placeItem(selectedIcon.id, selectedIcon.x, selectedIcon.y);
            selectedIcon = null;
        }
        checkForEndLevel();
    });
    ctx = document.getElementById('gameCanvas').getContext('2d');
    ctx.globalCompositeOperation = 'source-over';

    //greenFrogCanvas = createColoredImage(imgFrogGray, .5, 1.5, .5);
    //yellowFrogCanvas = createColoredImage(imgFrogGray, 1.5, 1.5, .5);
    //blueFrogCanvas = createColoredImage(imgFrogGray, .25, .5, 1.5);
    //redFrogCanvas = createColoredImage(imgFrogGray, 1.5, .5, .5);
    greenFrogCanvas = imgFrogGreen;
    yellowFrogCanvas = imgFrogYellow;
    blueFrogCanvas = imgFrogBlue;
    redFrogCanvas = imgFrogRed;
    logCanvas = imgLog;


    // document.getElementById('greenFrogIcon').appendChild()

    // drawColorImage(greenFrogCanvas, imgFrogGreen, 0,0, 100,20,60);
    // imgFrogGreen.addEventListener('load', function () { changeColorImage(greenFrogCanvas, this, 100, 0, 0) }, false);


    levels = new Array();
    levels.push(new Level("<h3>Level 1</h3><p>Hello Froggie!</p><p><small>Hint: Drag the log first</small></p>", 2, 2, 0, 0, 0, 1, "music/FrogBuzz.mp3"));
    levels.push(new Level("<h3>Level 2</h3><p>Make room for all!</p>", 12, 15, 0, 0, 0, 1, "music/facelines.mp3"));
    levels.push(new Level("<h3>Level 3</h3><p>Big Blue</p><p><small>Hint: Blue frogs are heavy</small></p>", 6, 2, 0, 3, 0, 1, "music/FrogBuzz.mp3"));
    levels.push(new Level("<h3>Level 4</h3><p>Ninja Pop Corn!</p><p><small>Hint: You will see why</small></p>", 7, 0, 9, 0, 0, 1, "music/facelines.mp3"));
    levels.push(new Level("<h3>Level 5</h3><p>Logs!</p><p><small>Hint: Try making a frog sandwitch</small></p>", 14, 15, 0, 1, 0, 4, "music/FrogBuzz.mp3"));
    levels.push(new Level("<h3>Level 6</h3><p>Meet Sticky!</p><p><small>Hint: Other frogs and even logs will stick to the yellow frog</small></p>", 27, 25, 0, 0, 4, 2, "music/facelines.mp3"));
    levels.push(new Level("<h3>Level 7</h3><p>Hold'em Down!</p><p><small>Hint: Sticky is your friend</small></p>", 22, 0, 18, 0, 4, 1, "music/FrogBuzz.mp3"));
    levels.push(new Level("<h3>Level 8</h3><p>Its a party and everybody(frog) is invited!</p><p><small>Hint: Good luck</small></p>", 24, 15, 8, 2, 3, 3, "music/facelines.mp3"));

    document.getElementById('msgModelWindow').style.display = 'none';


    //shows start screen - onclick start level 1
    startScreen();



    document.getElementById('btnSound').onclick = function () {
        if (audioPlayer.paused) {
            audioPlayer.play();
            isSoundOn = true;
        } else {
            audioPlayer.pause();
            isSoundOn = false;
        }
        //save audio setting
         localStorage.isSoundOn=isSoundOn;
    };

    $(document).bind('pageshow', function (event, data) {
        console.log("pageshow --> previous page: " + data.prevPage.attr('id'));
    });

    $(document).bind('pagehide', function (event, data) {
        console.log("pagehide --> next page: " + data.nextPage.attr('id'));
        audioPlayer.pause();
    });



    ////timer loop
    //clearInterval(setIntervalId);
    //setIntervalId = setInterval(ticker, 30);



    //max frame rate
    function OnEnterFrame() {
        requestAnimationFrame(OnEnterFrame);

        ticker();
        fps++;
    }
    OnEnterFrame();

    //todo: enable to see fps
   // setInterval(updateFPS, 1000);
}

function updateFPS() {
    document.getElementById('fpscounter').innerHTML = fps;
    fps = 0;
}
//function createColoredImage(img, r, g, b) {

//    var canvas = document.createElement('canvas');



//    var x = 0, y = 0;
//    var context = canvas.getContext('2d');

//    // Draw the image on canvas.
//    context.clearRect(0, 0, img.width, img.height); // clear canvas
//    context.drawImage(img, x, y);

//    // Get the pixels.
//    var imgd = context.getImageData(x, y, img.width, img.height);
//    var pix = imgd.data;

//    // Loop over each pixel 
//    for (var i = 0; n = pix.length, i < n; i += 4) {

//        if (pix[i] * r > 255)// red
//            pix[i] = 255;
//        else
//            pix[i] = pix[i] * r;

//        if (pix[i + 1] * g > 255)// green
//            pix[i + 1] = 255;
//        else
//            pix[i + 1] = pix[i + 1] * g;

//        if (pix[i + 2] * b > 255)// blue
//            pix[i + 2] = 255;
//        else
//            pix[i + 2] = pix[i + 2] * b;



//        // pix[i + 3] += a; // alpha

//    }

//    // Draw the ImageData object at the given (x,y) coordinates.
//    context.putImageData(imgd, 0, 0);
//    return canvas;
//}



function setUpLevel(levelNumber) {


    if (levelNumber > levels.length - 1) {
        //you win!
        //show start text
        showMessage("<h1>You Win!</h1><p>You have saved all the frogs.</p>", function () { init() });

    } else {

        balls = new Array();
        var level = levels[levelNumber];

        currentLevelNumber = levelNumber;
        currentLevel = new Level();

        currentLevel.startText = level.startText;
        currentLevel.requied = level.requied;
        currentLevel.greenFrogCount = level.greenFrogCount;
        currentLevel.redFrogCount = level.redFrogCount;
        currentLevel.blueFrogCount = level.blueFrogCount;
        currentLevel.logCount = level.logCount;
        currentLevel.yellowFrogCount = level.yellowFrogCount;
        currentLevel.music = level.music;
        //show start text
        showMessage(level.startText, function () { document.getElementById('msgModelWindow').style.display = 'none'; });

        updateInventory();

        
        audioPlayer.src = currentLevel.music;

        if (isSoundOn) {
            audioPlayer.play();
        }
    }


}
function startScreen() {

    balls = new Array();

    addLog(imgLog, 100, 50, 10);

    addFrog(greenFrogCanvas, 1200, 0, 30, 1);
    addFrog(greenFrogCanvas, 150, -50, 30, 1);
    addFrog(greenFrogCanvas, 100, -100, 30, 1);
    addFrog(greenFrogCanvas, 300, -150, 30, 1);
    addFrog(greenFrogCanvas, 10, -200, 30, 1);
    addFrog(greenFrogCanvas, 110, -250, 30, 1);
    addFrog(greenFrogCanvas, 60, -300, 30, 1);
    addFrog(greenFrogCanvas, 170, -500, 30, 1);

    showMessage("<h1>FROG-LOG</h1><p>Some frogs just can't swim.</p>", function () { instructionsScreen(); });

    audioPlayer.src = "music/facelines.mp3";
    if (isSoundOn){
        audioPlayer.play();
    }




}
function instructionsScreen() {

    showMessage("<h4>Objective:</h4><p>Save all the frogs from drowning.</p><h4>How to play:</h4><p>Drag the logs and frogs to the water.</p>", function () { setUpLevel(0); });

}


function drop(target, e) {
    //var id = e.dataTransfer.getData('Text');
    var x = e.layerX;
    var y = e.layerY;
    placeItem(id, x, y);
    e.preventDefault();
}

var levelEndTimer;
function placeItem(id, x, y) {
    if (id == "greenFrogIcon") {
        currentLevel.greenFrogCount -= 1;
        addFrog(greenFrogCanvas, x , y , 30, 10, false);
    }

    if (id == "yellowFrogIcon") {
        currentLevel.yellowFrogCount -= 1;
        addFrog(yellowFrogCanvas, x , y , 30, 10, true);
    }
    if (id == "redFrogIcon") {
        currentLevel.redFrogCount -= 1;
        addFrog(redFrogCanvas, x , y , 30, 1, false);
    }
    if (id == "blueFrogIcon") {
        currentLevel.blueFrogCount -= 1;
        addFrog(blueFrogCanvas, x , y , 30, 200, false);
    }
    if (id == "logIcon") {
        currentLevel.logCount -= 1;
        addLog(logCanvas, x, y, 10);
    }



    //updateInventory();

    checkForEndLevel();
   
}
function checkForEndLevel() {
    //check if level is over
    clearTimeout(levelEndTimer);
    if (currentLevel != null) {
        if (currentLevel.remaining() == 0) {
            //start timer
            
            levelEndTimer = setTimeout(endLevel, 4000);
        }
    }
}

function endLevel() {
    var count = 0;
    for (i in balls) {
        if (balls[i].type == "frog")
            count++;
    }


    if (count >= currentLevel.requied) {
        //pass level
        //display score e.g. 12/33
        //show next level button
        currentLevelNumber++;
        showMessage("<h3>You win!</h3><p>You saved <b>" + count + "</b> frogs out of the <b>" + currentLevel.requied + "</b> required.</p>", function () { setUpLevel(currentLevelNumber) });
        //click to continue
    } else {
        //fail level
        //display score e.g. 12/33
        //show retry button
        showMessage("<h3>Failed</h3><p>You only saved <b>" + count + "</b> frogs out of the <b>" + currentLevel.requied + "</b> required.</p>", function () { setUpLevel(currentLevelNumber) });
        //click to continue
    }

}

function showMessage(msg, callback) {
   

    document.getElementById('msgModelMessage').innerHTML = msg;
    document.getElementById('msgModelWindow').style.display = 'block';
    document.getElementById('msgModelWindow').onmousedown = function () {
            callback();
    };
    
}



function addFrog(img, x, y, s, w, sty) {
    var ball1 = { type: "frog", x: x, y: y, s: s, w: w, vx: 0, vy: 0, img: img, next: null, sticky: sty };
    balls.push(ball1);
}
function addLog(img, x, y, l) {
    var lastBall = null;
    x = x + (l * 9);
    for (i = 0; i < l; i++) {
        var ball = { type: "log", x: x - (i * 25), y: y, s: 20, w: 20, vx: 0, vy: 0, img: img, next: lastBall };
        balls.push(ball);
        lastBall = ball;
    }
}



function getBallDistance(ball1, ball2) {
    var a = ball1.x - ball2.x;
    var b = ball1.y - ball2.y;
    var c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return c;
}

function getBallAngle(ball1, ball2) {
    var r = Math.atan2(ball1.x - ball2.x, ball1.y - ball2.y);
    return r;
}

function fall() {
    for (i in balls) {
        if (balls[i].y < 490)
            balls[i].vy += .5;
        else {
            //float
            if (balls[i].type == "frog")
                balls[i].vy += .16;
            else
                balls[i].vy += -.4;
        }
    }
}
function jiggle() {
    for (i in balls) {

        //push away
        for (j in balls) {
            //not self
            if (balls[i] != balls[j]) {
                //close enough
                var d = getBallDistance(balls[i], balls[j]);

                if (d < (balls[i].s + balls[j].s)) {
                    //get overlap
                    var overlap = ((balls[i].s + balls[j].s) - d);
                    var r = getBallAngle(balls[i], balls[j]);
                    var pushY = overlap * Math.cos(r);
                    var pushX = overlap * Math.sin(r);
                    //heavyer pushes harder on lighter balls
                    var strength = 3;

                    pushX = (pushX / balls[j].w) * 2;
                    pushY = (pushY / balls[j].w) * strength;

                    //friction - if angle is small zero out, like a flat top.
                    if (Math.abs(Math.sin(r)) < Math.PI / 6) pushX = 0;




                    balls[j].vx -= pushX;
                    balls[j].vy -= pushY;

                }

            }
        }

    }
}
function updatePostions() {

    for (k in balls) {
        //drag
        balls[k].vx = balls[k].vx * .85;
        balls[k].vy = balls[k].vy * .85;
        //push
        balls[k].x += balls[k].vx;
        balls[k].y += balls[k].vy;

    }
}
function wallPush() {

    for (i in balls) {
        //return a random integer between 1 and 4
        var rnd = Math.floor(Math.random() * 3) + 1;
        //wall
        if ((balls[i].x + balls[i].s) > width) {
            balls[i].x = width - balls[i].s;
            balls[i].vx = -1 * balls[i].vx + rnd;
        }
        if ((balls[i].x) < 0) {
            balls[i].x = 0;
            balls[i].vx = -1 * balls[i].vx + rnd;
        }
        //        if ((balls[i].y + balls[i].s) > height) {
        //            balls[i].y = height - balls[i].s;
        //            balls[i].vy = -1 * balls[i].vx;
        //        }
    }
}
function pullTogetherLinked() {
    for (i in balls) {
        //pull together
        if (balls[i].next != undefined) {
            var nball = balls[i].next;

            //close enough
            var d = getBallDistance(balls[i], nball);

            if (d > (balls[i].s + nball.s)) {
                //get overlap
                var overlap = ((balls[i].s + nball.s) - d);
                var r = getBallAngle(balls[i], nball);
                var pushY = overlap * Math.cos(r);
                var pushX = overlap * Math.sin(r);
                //heavyer pushes harder on lighter balls
                var strength = 3;

                nball.vx -= (pushX / nball.w) * strength;
                nball.vy -= (pushY / nball.w) * strength;
                balls[i].vx += (pushX / balls[i].w) * strength;
                balls[i].vy += (pushY / balls[i].w) * strength;
            }
        }
    }
}

function pullTogetherSticky() {

    for (i in balls) {
        //pull together
        if (balls[i].sticky) {
            var fxTotal = 0;
            var fyTotal = 0;
            var count = 0;
            for (j in balls) {

                //close enough
                var d = getBallDistance(balls[i], balls[j]);
                if (d < (balls[i].s + balls[j].s + 10)) {
                    if (balls[j].type == "frog")//so log does not curl
                        fxTotal += balls[j].vx * balls[j].w;
                    fyTotal += balls[j].vy * balls[j].w;
                    count++;
                }
            }
            for (j in balls) {
                //close enough
                var d = getBallDistance(balls[i], balls[j]);
                if (d < (balls[i].s + balls[j].s + 10)) {

                    //only match 90% of others
                    if (balls[j].type == "frog")//so log does not curl
                        balls[j].vx = (balls[j].vx * .1) + (fxTotal / count * .9 / balls[j].w);
                    balls[j].vy = (balls[j].vy * .1) + (fyTotal / count * .9 / balls[j].w);

                }
            }
        }
    }
}
function gameClick(sender, e) {
    //var x = e.layerX;
    //var y = e.layerY;
    //if (selectedIcon != null) {
    //    //drop
    //    placeItem(selectedIcon.id, x, y);
    //    //unselect
    //    updateInventory();
    //    selectedIcon = null;

    //}

}
function iconClick(sender, e) {
    //clear all highlighted
    var c = dragIconsDiv.firstChild;
    while (c) {
        c.style.backgroundColor = "";
        c = c.nextSibling;
    }
    //select icon

    selectedIcon = sender;
    selectedIcon.style.backgroundColor = "#888888";
}
function allowDrop(ev) {
    ev.preventDefault();
}
function drop(event) {
    event.preventDefault();
    var id = event.dataTransfer.getData("text");
    //var id = event.currentTarget.id;
    //var x = event.offsetX + event.currentTarget.offsetLeft;
    //var y = event.offsetY + event.currentTarget.offsetTop;
    var x = event.offsetX;
    var y = event.offsetY;
    placeItem(id, x, y);
}
function drag(target, e) {
    e.dataTransfer.setData('Text', target.id);
}

var click = {
    x: 0,
    y: 0,
    scale: 1
};

var dragId = 0


function updateInventory() {

    inventory = [];
    for (i = 0; i < currentLevel.logCount; i++) {
        var inventoryItemLog = { id: "logIcon", type: "frog", x: 40, y: 50, s: 30, w: 1, vx: 0, vy: 0, img: logCanvas };
        inventory.push(inventoryItemLog);
    }
    for (i = 0; i < currentLevel.greenFrogCount; i++) {
        var inventoryItemFrog = { id: "greenFrogIcon", type: "frog", x: 120, y: 40, s: 30, w: 1, vx: 0, vy: 0, img: greenFrogCanvas };
        inventory.push(inventoryItemFrog);
    }
    for (i = 0; i < currentLevel.yellowFrogCount; i++) {
        var inventoryItemFrog = { id: "yellowFrogIcon", type: "frog", x: 240, y: 40, s: 30, w: 1, vx: 0, vy: 0, img: yellowFrogCanvas };
        inventory.push(inventoryItemFrog);
    }
    for (i = 0; i < currentLevel.redFrogCount; i++) {
        var inventoryItemFrog = { id: "redFrogIcon", type: "frog", x: 360, y: 40, s: 30, w: 1, vx: 0, vy: 0, img: redFrogCanvas };
        inventory.push(inventoryItemFrog);
    }
    for (i = 0; i < currentLevel.blueFrogCount; i++) {
        var inventoryItemFrog = { id: "blueFrogIcon", type: "frog", x: 40, y: 120, s: 30, w: 1, vx: 0, vy: 0, img: blueFrogCanvas };
        inventory.push(inventoryItemFrog);
    }


    //if (currentLevel.logCount > 0) {
    //    var inventoryItemLog = { id: "logIcon", type: "frog", x: 40, y: 50, s: 30, w: 1, vx: 0, vy: 0, img: logCanvas };
    //    inventory.push(inventoryItemLog);
    //}
    //if (currentLevel.greenFrogCount > 0) {
    //    var inventoryItemFrog = { id: "greenFrogIcon", type: "frog", x: 120, y: 40, s: 30, w: 1, vx: 0, vy: 0, img: greenFrogCanvas };
    //    inventory.push(inventoryItemFrog);
    //}
    //if (currentLevel.yellowFrogCount > 0) {
    //    var inventoryItemFrog = { id: "yellowFrogIcon", type: "frog", x: 240, y: 40, s: 30, w: 1, vx: 0, vy: 0, img: yellowFrogCanvas };
    //    inventory.push(inventoryItemFrog);
    //}
    //if (currentLevel.redFrogCount > 0) {
    //    var inventoryItemFrog = { id: "redFrogIcon", type: "frog", x: 360, y: 40, s: 30, w: 1, vx: 0, vy: 0, img: redFrogCanvas };
    //    inventory.push(inventoryItemFrog);
    //}
    //if (currentLevel.blueFrogCount > 0) {
    //    var inventoryItemFrog = { id: "blueFrogIcon", type: "frog", x: 40, y:120, s: 30, w: 1, vx: 0, vy: 0, img: blueFrogCanvas };
    //    inventory.push(inventoryItemFrog);
    //}
  

    return;
 



}
function removeSunk() {
    for (i in balls) {

        if (balls[i].y > height)
            balls.splice(i, 1);

    }
}
function ticker() {


    fall();
    jiggle();


    pullTogetherSticky();
    pullTogetherLinked();

    wallPush();
    updatePostions();


    removeSunk();


    draw();
}
function draw() {

    //ctx.clearRect(0, 0, width, height); // clear canvas
    ctx.fillStyle = '#A5CBFF';
    ctx.fillRect(0, 0, width, height);



    ctx.drawImage(imgWater, -waterWave, 440);

    // createWave(-waterWave);
    for (i in balls) {
        ctx.drawImage(balls[i].img, Math.floor(balls[i].x - balls[i].s),Math.floor( balls[i].y - balls[i].s));
    }
    for (i in inventory) {
        ctx.drawImage(inventory[i].img, Math.floor(inventory[i].x - inventory[i].s), Math.floor(inventory[i].y - inventory[i].s));
    }
    ctx.drawImage(imgWater, waterWave - 100, 470);


    //createWave(waterWave);

    waterWave += waterWaveD;
    if (waterWave == 50)
        waterWaveD = -1;
    if (waterWave == 0)
        waterWaveD = 1;


}
function createWave(w) {
    ctx.beginPath();
    ctx.moveTo(-50, 500);
    ctx.quadraticCurveTo(50 + w, 510 + w, 75 + w, 490);
    ctx.quadraticCurveTo(100 + w, 490 + w, 125 + w, 510);
    ctx.quadraticCurveTo(350 + w, 510 + w, 375 + w, 490);
    ctx.quadraticCurveTo(450 + w, 490 + w, 500 + w, 510);
    ctx.quadraticCurveTo(700 + w, 475 + w, 700 + w, 515);
    ctx.quadraticCurveTo(700, 800, 700, 800);
    ctx.quadraticCurveTo(0, 800, 0, 800);
    ctx.fillStyle = 'rgba(79,116,165,.5)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(50,79,118,.8)';
    ctx.lineWidth = 4;
    ctx.stroke();
}
$(window).load(function () {

    //start
    init();
});
////start
//window.onload = init;

