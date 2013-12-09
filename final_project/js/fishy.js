
var canvas;
var context;
var Player;
var acceleration = 1.5;
var keyPressed;
var timeStep = 50;
var cmTID;

var gameState = "Start";

//smaller fish
var enemyHolder1;
//bigger fish
var enemyHolder2;
//big fish
var enemyHolder3;
//biggest fish
var enemyHolder4;
var audio1 = null;
var audio2 = null;
//starting function
function Initialize() {
    canvas = document.getElementById("theCanvas");
    context = canvas.getContext("2d");
    
    audio1 = new Audio();
    audio1.src = "audio/gulp.wav";
    audio1.load();
    audio2 = new Audio();
    audio2.src = "audio/eaten.wav";
    audio2.load();
    
    clearStuff();
    Draw();
    
}

//user control fish class
function Playerfish() {
    this.score = 0;
    this.type = "Playerfish";
    this.weight = 5;       //how much the fish weights/ size


    this.isDead = false;
    //speed and position
    this.end = "You were Eaten";
    this.XMovement = 0;
    this.YMovement = 0;
    this.Xspeed = 0;
    this.Yspeed = 0;
    this.XPosition = 400;
    this.YPosition = 300;
    this.score = 0;
    this.fishEaten = 0;

    this.ratio = .3;        // height/width ratio of the fish 
}

//enemy fish class
function fish() {
    this.type = "fish";
    this.weight = 0;       //how much the fish weights/ size

    //speed and position
    this.Xspeed = 0;
    this.XPosition = 0;
    this.YPosition = 0;

    this.ratio = .3;        // height/width ratio of the fish
    cmTID = setTimeout(Draw, timeStep);
}

//draw function
function Draw() {
    clearTimeout(cmTID);
    if (gameState == "Play") {
        //draw the background
        context.fillStyle = "Blue";
        context.fillRect(0, 0, canvas.width, canvas.height);
        //draw player
        context.fillStyle = "Red";
        //update locations
        PlayerUpdate();
        FishUpdate(enemyHolder1);
        FishUpdate(enemyHolder2);
        FishUpdate(enemyHolder3);
        FishUpdate(enemyHolder4);
        //collision detection
        CollisionDetection(enemyHolder1);
        CollisionDetection(enemyHolder2);
        CollisionDetection(enemyHolder3);
        CollisionDetection(enemyHolder4);
        //draw stuff
        drawFish(enemyHolder1);
        drawFish(enemyHolder2);
        drawFish(enemyHolder3);
        drawFish(enemyHolder4);
        context.fillStyle = "Orange";
        //drawing player
       
        drawEllipseByCenter(context, Player.XPosition, Player.YPosition, 10 * Player.weight, 10 * Player.weight * Player.ratio);
        if (Player.Xspeed > 0) {
            context.beginPath();
            context.moveTo(Player.XPosition - Player.weight * 5, Player.YPosition - Player.weight * 1.5);
            context.lineTo(Player.XPosition - Player.weight * 5, Player.YPosition + Player.weight * 1.5);
            context.lineTo(Player.XPosition - Player.weight * 1.5, Player.YPosition);

            context.fill();
            context.fillStyle = "Black";
            drawEllipseByCenter(context, Player.XPosition + Player.weight * 2.5, Player.YPosition, .75 * Player.weight, .75 * Player.weight);
        }
        else {
            context.beginPath();
            context.moveTo(Player.XPosition + Player.weight * 5, Player.YPosition + Player.weight * 1.5);
            context.lineTo(Player.XPosition + Player.weight * 5, Player.YPosition - Player.weight * 1.5);
            context.lineTo(Player.XPosition + Player.weight * 1.5, Player.YPosition);

            context.fill();
            context.fillStyle = "Black";
            drawEllipseByCenter(context, Player.XPosition - Player.weight * 2.5, Player.YPosition, .75 * Player.weight, .75 * Player.weight);
        }
        context.fillStyle = "white";
        context.font = "bold 16px Arial";
        context.fillText("Score: " + Player.score, canvas.width / 2 - 5, 16);

    }
    else if (gameState == "Start") {
        context.fillStyle = "Blue";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.font = "bold 16px Arial";
        context.fillText("Press space to start", canvas.width / 3, canvas.height / 3);
        context.fillText("Controls:Up, Down, Left, Right arrows to move", canvas.width / 6, canvas.height / 2);
        context.fillText("Eat smaller fish to get bigger, don't get eaten by bigger fish ", canvas.width / 6, 2 * canvas.height /3 );
        
    }
    else if (gameState == "gameOver") {

        context.fillStyle = "Blue";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "white";
        context.font = "bold 16px Arial";
        context.fillText(Player.end, canvas.width / 3, canvas.height / 3-32);
        context.fillText("Score: "+Player.score, canvas.width / 3, canvas.height / 3);
        context.fillText("Fish Eaten: "+Player.fishEaten, canvas.width / 3, canvas.height / 3+16);
        context.fillText("Press space to start ", canvas.width / 3, 2 * canvas.height / 3 + 16*2);

    }
    cmTID = setTimeout(Draw, timeStep);
}

//generate the initial enemies
function StartGame() {
    for (var i = 0; i < 3; i++) {
        MakeFish(1);
        MakeFish(2);
        MakeFish(3);
        if(i>0)
            MakeFish(4);
    }
}

//updates the players speed
function PlayerUpdate() {

    var speedXIncrease = acceleration * Player.XMovement;
    var speedYIncrease = acceleration * Player.YMovement;
    var dragX=0;
    var dragY=0;
    if (speedXIncrease == 0) {
        dragX = Player.Xspeed / 4;
    }
    else {
        dragX = Math.abs(speedXIncrease) * (Player.Xspeed / 25);
    }
    if (speedYIncrease == 0) {
        dragY= Player.Yspeed / 4;
    }
    else
        dragY = Math.abs(speedYIncrease) * (Player.Yspeed / 25);

    Player.Xspeed += speedXIncrease - dragX;
    Player.Yspeed += speedYIncrease - dragY;


    if (Player.Yspeed > 25)
        Player.Yspeed = 25;
    else if (Player.Yspeed < -25)
        Player.Yspeed = -25;
    if (Player.Xspeed > 25)
        Player.Xspeed = 25;
    else if (Player.Xspeed < -25)
        Player.Xspeed = -25;
    
    if (Player.Xspeed < .5 && Player.Xspeed > -.5) {
        Player.Xspeed = 0;
    }
    if (Player.Yspeed < .5 && Player.Yspeed > -.5) {
        Player.Yspeed = 0;
    }

    

    Player.YPosition += Player.Yspeed;
    Player.XPosition += Player.Xspeed;

    //boundry checking
    if (Player.YPosition + (Player.weight * 1.5) > 600) {
        Player.YPosition = 600 - Player.weight * 1.5;
        Player.Yspeed *= -.5;
    }
    else if (Player.YPosition - (Player.weight * 1.5) < 0) {
        Player.YPosition =Player.weight * 1.5;
        Player.Yspeed *= -.5;
    }
    if (Player.XPosition + (Player.weight * 5) > 800) {
        Player.XPosition =800 - Player.weight * 5;
        Player.Xspeed *= -.5;
    }
    else if (Player.XPosition - (Player.weight * 5) < 0) {
        Player.XPosition = Player.weight * 5;
        Player.Xspeed *= -.5;
    }
    console.log("Player X Speed: " + Player.Xspeed + " " + Player.XPosition);
}

function FishUpdate(enemyHolder) {
    for (var i = 0; i < enemyHolder.length; i++) {
        enemyHolder[i].XPosition += enemyHolder[i].Xspeed;
    }
}

function drawFish(enemyHolder) {
    for (var i = 0; i < enemyHolder.length; i++) {
        context.fillStyle = "Red";
        drawEllipseByCenter(context, enemyHolder[i].XPosition, enemyHolder[i].YPosition, 10 * enemyHolder[i].weight, 10 * enemyHolder[i].weight * enemyHolder[i].ratio);
        context.beginPath();
        if (enemyHolder[i].Xspeed > 0) {
            context.moveTo(enemyHolder[i].XPosition - enemyHolder[i].weight * 5, enemyHolder[i].YPosition - enemyHolder[i].weight * 1.5);
            context.lineTo(enemyHolder[i].XPosition - enemyHolder[i].weight * 5, enemyHolder[i].YPosition + enemyHolder[i].weight * 1.5);
            context.lineTo(enemyHolder[i].XPosition - enemyHolder[i].weight * 1.5, enemyHolder[i].YPosition);

            context.fill();
            context.fillStyle = "Black";
            drawEllipseByCenter(context, enemyHolder[i].XPosition + enemyHolder[i].weight * 2.5, enemyHolder[i].YPosition, .75 * enemyHolder[i].weight, .75 * enemyHolder[i].weight);
        }
        else {
            context.moveTo(enemyHolder[i].XPosition + enemyHolder[i].weight * 5, enemyHolder[i].YPosition + enemyHolder[i].weight * 1.5);
            context.lineTo(enemyHolder[i].XPosition + enemyHolder[i].weight * 5, enemyHolder[i].YPosition - enemyHolder[i].weight * 1.5);
            context.lineTo(enemyHolder[i].XPosition + enemyHolder[i].weight * 1.5, enemyHolder[i].YPosition);

            context.fill();
            context.fillStyle = "Black";
            drawEllipseByCenter(context, enemyHolder[i].XPosition - enemyHolder[i].weight * 2.5, enemyHolder[i].YPosition, .75 * enemyHolder[i].weight, .75 * enemyHolder[i].weight);
         }
    }
}

function clearStuff() {
    Player = new Playerfish();
    keyPressed = new Array();
    keyPressed.push(false);
    keyPressed.push(false);
    keyPressed.push(false);
    keyPressed.push(false);
    enemyHolder1 = new Array();
    enemyHolder2 = new Array();
    enemyHolder3 = new Array();
    enemyHolder4 = new Array();
}


function drawEllipseByCenter(context, cx, cy, w, h) {
    drawEllipse(context, cx - w / 2.0, cy - h / 2.0, w, h);
}

//function used to draw elipses
function drawEllipse(context, x, y, w, h) {
    var kappa = .5522848,
      ox = (w / 2) * kappa, // control point offset horizontal
      oy = (h / 2) * kappa, // control point offset vertical
      xe = x + w,           // x-end
      ye = y + h,           // y-end
      xm = x + w / 2,       // x-middle
      ym = y + h / 2;       // y-middle

    context.beginPath();
    context.moveTo(x, ym);
    context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    context.closePath();
    context.fill();
}
//handles keys being pressed
function keyPressDown(event) {
 
    switch (event.keyCode) {
        case (38): //up
            if (!keyPressed[0])
                Player.YMovement--;
            keyPressed[0] = true;
            break;

        case (37): //left
            if (!keyPressed[1])
                Player.XMovement--;
            keyPressed[1] = true;
            break;

        case (40): //down
            if (!keyPressed[2])
                Player.YMovement++;
            keyPressed[2] = true;
            break;

        case (39): //right
            if (!keyPressed[3])
                Player.XMovement++;
            keyPressed[3] = true;
            break;

        case (32): //space
            if (gameState == "Start") {
                gameState = "Play";
                StartGame();
            }
            if (gameState == "gameOver") {
                clearStuff();
                gameState = "Start";
            }
            break;
    }


}

//handles keys being released
function keyPressUp(event) {

    switch (event.keyCode) {
        case (38): //up
            Player.YMovement++;
            keyPressed[0] = false ;
            break;

        case (37): //left
            Player.XMovement++;
            keyPressed[1] = false;
            break;

        case (40): //down
            Player.YMovement--;
            keyPressed[2] = false;
            break;

        case (39): //right
            Player.XMovement--;
            keyPressed[3] = false;
            break; 
    }


}

function CollisionDetection(enemyHolder) {
    var removeFish = new Array();
    var weightAddition = 0;
    //check every fish
    for(var i=0; i<enemyHolder.length; i++)
    {
        //each weight is 10 pixles  left right, 3 pixels up down
        var Xlength = Math.abs(Player.XPosition - enemyHolder[i].XPosition);
        var Ylength = Math.abs(Player.YPosition - enemyHolder[i].YPosition);

        var size = Player.weight + enemyHolder[i].weight;
        if (Xlength < (5 * size) && Ylength < (1.5 * size)) {
            if (Player.weight >= enemyHolder[i].weight) {
                Player.score += Math.floor(enemyHolder[i].weight * 100);
                Player.fishEaten++;
                weightAddition += enemyHolder[i].weight / 40;
                audio1.play();
                if (Player.weigth > 40) {
                    gameState = "gameOver";
                    Player.end = "You ate Everything and Everyone in the world";
                }
                removeFish.unshift(i);
            }
            else {
                var iu = 0;
                audio2.play();
                gameState = "gameOver";
            }
        }
        //out of X Bounds
        if (enemyHolder[i].XPosition + enemyHolder[i].weight * 5 < -25 || enemyHolder[i].XPosition - enemyHolder[i].weight * 5 > 825) {
            removeFish.unshift(i);
            
        }
    }
    //remove eaten fish/ out of bounds
    for (var j = 0; j < removeFish.length; j++) {
        MakeFish(Math.floor(enemyHolder[0].weight / 5) + 1);
        enemyHolder.splice(removeFish[j], 1);
        
    }
    Player.weight += weightAddition;

}

//makes enemy fish
//size is which category it belongs to
function MakeFish(size) {
    var newFish = new fish();
    if (size == 1) {
        newFish.weight = Math.random() * 3.9 + 1;   
    }
    else if (size == 2) {
        newFish.weight = Math.random() * 3 + 7; 
    }
    else if (size == 3) {
        newFish.weight = Math.random() * 5 + 10; 
    }
    else if (size == 4) {
        newFish.weight = Math.random() * 5 + 15; 
    }
    //create fish on left
    var direction=0;
    if (Math.random() * 2 > 1) {
        newFish.XPosition = -1 - newFish.weight * 5;
        direction=1;
        }
    else //on right
    {
        newFish.XPosition = 801 + newFish.weight * 5;
            direction=-1;
    }

        newFish.YPosition = Math.random() * (600 - 2 * newFish.weight * 1.5) + 1.5;
        newFish.Xspeed = (Math.random() * (7) + 3) * direction;
    if (size == 1) {
        enemyHolder1.push(newFish);
    }
    else if (size == 2) {
        enemyHolder2.push(newFish);
    }
    else if (size == 3) {
        enemyHolder3.push(newFish);
    }
    else if (size == 4) {
        enemyHolder4.push(newFish);
    }
}
