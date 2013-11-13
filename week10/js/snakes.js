
//initial snake 1 position
// 7 10


    var gameState = "Start";
    // Play = game is playing
    // Start = game is on the start screen

    var gameLength = 90000;
    var counterS;
    var timeStep = 250; // In milliseconds
    var w; //canvas width
    var h; //canvas height
    var cmTID; //holds the timeout
    var gameCounter;//how long until the game starts
    var canvas;
    var context;
    var tiles;
    //layout for the level
    var arena;

    var appleLocation;
    var snake1 = new snake();
    var snake2 = new snake();
    var currentLocationInArray = 2;
    var snake1Length = 3;

    /// state of tiles
    //0 = empty
    //1= wall
    //2 = apple
    //3 = snakehead 1
    //4 =snakebody 1
    //5 = snakehead 2
    //6 =snakebody 2

    //THis function initializes the canvas/game
    function myFunction() {

        //get stuff from html
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d');

        //get canvas dimensions
        w = canvas.width;
        h = canvas.height;
        tiles = w / 35;
        arena = new Array(tiles);
        initializeSnake1();
        initializeSnake2();
        //initializing all the tiles in the arena
        initializeArena();

        //start the game
        //call draw again
        
        Draw();
        cmTID = setTimeout(Draw, timeStep);
    }

    function initializeArena() {
        for (var i = 0; i < tiles; i++) {
            arena[i] = new Array(tiles);
            if (i == 0 || i == tiles - 1) {         //left/right walls
                for (var j = 0; j < tiles; j++) {
                    arena[i][j] = 1;
                }
            }
            else {
                arena[i][0] = 1;                //top and bot walls
                arena[i][tiles - 1] = 1;
                for (var j = 1; j < tiles - 1; j++)        //empty space
                {
                    arena[i][j] = 0;
                }
            }
        }
    }

    //Draws and updates the field
    function Draw() {
        if (gameState == "Start") {
        
            for (var i = 0; i < tiles; i++) {
                for (var j = 0; j < tiles; j++) {
                    drawTile(i, j);
                }
                context.fillStyle = "white";
                context.font = "bold 16px Arial";
                snake1.score = Math.floor(snake1.score);
                snake2.score = Math.floor(snake2.score);
                context.fillText("Player 1: " + snake1.score, canvas.width / 4, 20);
                context.fillText("Player 2: " + snake2.score, 2 * canvas.width / 3, 20);
                context.fillText("Press space to start", canvas.width / 3, canvas.height / 3);
                context.fillText("Player 1:WASD to change direction", canvas.width / 4, canvas.height / 2);
                context.fillText("Player 2:Up, Down, Left, Right arrows to change direction", canvas.width / 6, 16*canvas.height /30 );
            }

        }
        else if (gameState == "gameOver") {
            for (var i = 0; i < tiles; i++) {
                for (var j = 0; j < tiles; j++) {
                    drawTile(i, j);
                }
            }
            context.fillStyle = "white";
            context.font = "bold 16px Arial";
            snake1.score = Math.floor(snake1.score);
            snake2.score = Math.floor(snake2.score);
            context.fillText("Player 1: " + snake1.score, canvas.width / 4, 20);
            context.fillText("Player 2: " + snake2.score, 2 * canvas.width / 3, 20);
            if(snake1.score>snake2.score)
                context.fillText("Player 1 wins", canvas.width / 3, canvas.height / 3);
            else if(snake1.score<snake2.score)
                context.fillText("Player 2 wins", canvas.width / 3, canvas.height / 3);
            else
                context.fillText("Draw", canvas.width / 3, canvas.height / 3);
            
        }
        if (gameState == "Play") {
            moveSnakes();
            collision2();
            //draw snake1
            if (snake1.isDead) {
                for (var i = 1; i <= snake1.length; i++) {
                    var temp = (snake1.headspot - i) % 100;
                    if (temp < 0)
                        temp += 100;
                    arena[snake1.body[temp][0]][snake1.body[temp][1]] = 0;
                }
                snake1.length = -1;
                initializeSnake1();

            }
            else {
                for (var i = 0; i <= snake1.length; i++) {
                    var temp = (snake1.headspot - i) % 100;
                    if (temp < 0)
                        temp += 100;
                    if (i == 0) {
                        arena[snake1.body[temp][0]][snake1.body[temp][1]] = 3;
                    }
                    else if (i == snake1.length) {
                        arena[snake1.body[temp][0]][snake1.body[temp][1]] = 0;
                    }
                    else {
                        arena[snake1.body[temp][0]][snake1.body[temp][1]] = 4;
                    }
                }
            }
            //draw snake 2
            if (snake2.isDead) {
                for (var i = 1; i <= snake2.length; i++) {
                    var temp = (snake2.headspot - i) % 100;
                    if (temp < 0)
                        temp += 100;
                    arena[snake2.body[temp][0]][snake2.body[temp][1]] = 0;
                }
                snake2.length = -1;
                initializeSnake2();

            }
            else {
                for (var i = 0; i <= snake2.length; i++) {
                    temp = (snake2.headspot - i);
                    if (temp < 0)
                        temp += 100;
                    if (i == 0) {
                        arena[snake2.body[temp][0]][snake2.body[temp][1]] = 5;
                    }
                    else if (i == snake2.length) {
                        arena[snake2.body[temp][0]][snake2.body[temp][1]] = 0;
                    }
                    else {
                        arena[snake2.body[temp][0]][snake2.body[temp][1]] = 6;
                    }
                }
            }


            //draw the field
            for (var i = 0; i < tiles; i++) {
                for (var j = 0; j < tiles; j++) {
                    drawTile(i, j);
                }
            }
            var d= new Date();
            snake1.score = Math.floor(snake1.score);
            snake2.score = Math.floor(snake2.score);
            context.fillStyle = "white";
            context.font = "bold 16px Arial";
            context.fillText("Player 1: " + snake1.score, canvas.width / 4, 20);
            context.fillText("Player 2: " + snake2.score, 2 * canvas.width / 3, 20);
            var value = gameLength/1000 - Math.floor((d.getTime() - counterS) / 1000);
            context.fillText("Remaining Time: "+value , canvas.width / 3, canvas.height - 20);
            
        }
        clearTimeout(cmTID);
        cmTID = setTimeout(Draw, timeStep);
   }


    //snake class
   function snake() {
        this.score = 0;
        this.type = "snake";
        this.length = 3;
        this.body = new Array(100);
        for (var i = 0; i < 100; i++) {
            this.body[i] = new Array(2);
        }

        this.isDead = false;
        this.direction = 0;
        this.nextDirection = 0;
        //0=up
        //1 = right
        //2 = down
        //3 =left

        this.headspot = 2;

    }

    // draws a single tile on the arena
    // i, j the corresponding arena location
    function drawTile(i, j) {
        var tileType = arena[i][j];
        var x = i * 35;
        var y = j * 35;
        if (tileType == 0) {
            context.fillStyle = "black";
            context.fillRect(x, y, 35, 35);
        }
        if (tileType == 1) {
            context.fillStyle = "blue";
            context.fillRect(x, y, 35, 35);
        }
        if (tileType == 2) {
            context.fillStyle = "red";
            context.fillRect(x, y, 35, 35);
        }
        if (tileType == 3) {
            context.fillStyle = "Purple";
            context.fillRect(x, y, 35, 35);
        }
        if (tileType == 4) {
            context.fillStyle = "Green";
            context.fillRect(x, y, 35, 35);
        }
        if (tileType == 5) {
            context.fillStyle = "Yellow";
            context.fillRect(x, y, 35, 35);
        }
        if (tileType == 6) {
            context.fillStyle = "Brown";
            context.fillRect(x, y, 35, 35);
        }


    }

    //creates the apple
    function CreateApple() {
        var success = false;
        while (!success) {
            var i = Math.floor(Math.random() * (tiles));
            var j = Math.floor(Math.random() * (tiles));
            if (arena[i][j] == 0) {
                appleLocation = Array(2);
                appleLocation[0]=i;
                appleLocation[1] = j;
                arena[i][j] = 2;
                success = true;
            }

        }
    }

    //used to initialize the snake1 in the game
    function initializeSnake1() {

        //initialize the bodies
        snake1.body[0][0] = 7;
        snake1.body[0][1] = 12;
        snake1.body[1][0] = 7;
        snake1.body[1][1] = 11;
        snake1.body[2][0] = 7;
        snake1.body[2][1] = 10;
        snake1.length = 2;
        snake1.headspot = 2;
        snake1.direction = 0;
        snake1.nextDirection = 0;
        snake1.isDead = false;
    }

    //used to initialize the snake2 in the game
    function initializeSnake2() {
        snake2.body[0][0] = 13;
        snake2.body[0][1] = 12;
        snake2.body[1][0] = 13;
        snake2.body[1][1] = 11;
        snake2.body[2][0] = 13;
        snake2.body[2][1] = 10;
        snake2.length = 2; 
        snake2.headspot = 2;
        snake2.direction = 0;
        snake2.nextDirection = 0;
        snake2.isDead = false;

    }

    //update the positions of the snakes
    function moveSnakes() {
        //snake 1
        if (!snake1.isDead) {
            var currentPosition = Array(2);
            currentPosition[0] = snake1.body[snake1.headspot][0];
            currentPosition[1] = snake1.body[snake1.headspot][1];
            switch (snake1.nextDirection) {

                case (0):
                    currentPosition[1] = currentPosition[1] - 1;
                    break;
                case (1):
                    currentPosition[0] = currentPosition[0] + 1;
                    break;
                case (2):
                    currentPosition[1] = currentPosition[1] + 1;
                    break;
                case (3):
                    currentPosition[0] = currentPosition[0] - 1;
                    break;
                default:
                    break;

            }
            snake1.direction = snake1.nextDirection;
            snake1.headspot = (snake1.headspot + 1) % 100;
            snake1.body[snake1.headspot][0] = currentPosition[0];
            snake1.body[snake1.headspot][1] = currentPosition[1];
        }

        //snake 2
        if (!snake2.isDead) {
            currentPosition = Array(2);
            currentPosition[0] = snake2.body[snake2.headspot][0];
            currentPosition[1] = snake2.body[snake2.headspot][1];
            switch (snake2.nextDirection) {

                case (0):
                    currentPosition[1] = currentPosition[1] - 1;
                    break;
                case (1):
                    currentPosition[0] = currentPosition[0] + 1;
                    break;
                case (2):
                    currentPosition[1] = currentPosition[1] + 1;
                    break;
                case (3):
                    currentPosition[0] = currentPosition[0] - 1;
                    break;
                default:
                    break;

            }
            snake2.direction = snake2.nextDirection;
            snake2.headspot = (snake2.headspot + 1) % 100;
            snake2.body[snake2.headspot][0] = currentPosition[0];
            snake2.body[snake2.headspot][1] = currentPosition[1];
        }
        collision1();
    }

    //tests for collisions on walls/ snakeheads
    function collision1() {
        var snake1Head=Array(2);
        snake1Head[0]=snake1.body[snake1.headspot][0];
        snake1Head[1]=snake1.body[snake1.headspot][1];
        var snake2Head=Array(2);
        snake2Head[0]=snake2.body[snake2.headspot][0];
        snake2Head[1] = snake2.body[snake2.headspot][1];
        //snakes hit each other head on
    
        if (snake1Head[0] == snake2Head[0] && snake1Head[1] == snake2Head[1] &&!snake1.isDead && !snake2.isDead) {
            //both die

            snake1.isDead = true;
            snake2.isDead = true;
        }
        //snake hits a wall
        if ( !snake1.isDead && arena[snake1Head[0]][snake1Head[1]] == 1) {
            //snake1 dies
            snake1.isDead = true;
        }
        if (!snake2.isDead && arena[snake2Head[0]][snake2Head[1]] == 1) {
            //snake2 dies
            snake2.isDead = true;
        }
        //snake eats apple
        if (!snake1.isDead && arena[snake1Head[0]][snake1Head[1]] == 2) {
            snake1.length++;
            snake1.score += 10;
            CreateApple();
        }
        if (!snake2.isDead && arena[snake2Head[0]][snake2Head[1]] == 2) {
            snake2.length++;
            snake2.score += 10;
            CreateApple();
        }
  }

    //handles snake body collision
    function collision2() {
        //easy snakehead reference
        var snake1Head = Array(2);
        snake1Head[0] = snake1.body[snake1.headspot][0];
        snake1Head[1] = snake1.body[snake1.headspot][1];
        var snake2Head = Array(2);
        snake2Head[0] = snake2.body[snake2.headspot][0];
        snake2Head[1] = snake2.body[snake2.headspot][1];


        //snake1 body collision testing
        if (!snake1.isDead) {
            for (var i = 1; i < snake1.length; i++) {
                var temp = (snake1.headspot - i) % 100;
                if (temp < 0)
                    temp += 100;

                //does snake1 hit itself
                if (snake1.body[temp][0] == snake1Head[0] && snake1.body[temp][1] == snake1Head[1]) {
                    snake1.isDead = true;
                    snake1.score /= 2;
                }
                //does snake2 hit snake1's body
                if (snake1.body[temp][0] == snake2Head[0] && snake1.body[temp][1] == snake2Head[1]) {
                    snake2.isDead = true;
                    for (var j = i; j <= snake1.length; j++) {
                        var temp2 = (snake1.headspot - j) % 100;
                        if (temp2 < 0)
                            temp2 += 100;
                        arena[snake1.body[temp2][0]][snake1.body[temp2][1]] = 0;
                    }
                    var points = snake2.score / 2;
                    snake1.score += points / 2;
                    snake1.length = i;

                    snake2.score -= points;
                }
            }
        }
        //snake2 body
        if (!snake2.isDead) {
            for (var i = 1; i <= snake2.length; i++) {
                var temp = (snake2.headspot - i) % 100;
                if (temp < 0)
                    temp += 100;

                //does snake1 hit snake2's body
                if (snake2.body[temp][0] == snake1Head[0] && snake2.body[temp][1] == snake1Head[1]) {
                    snake1.isDead = true;
                    for (var j = i; j <= snake2.length; j++) {
                        var temp2 = (snake2.headspot - j) % 100;
                        if (temp2 < 0)
                            temp2 += 100;
                        arena[snake2.body[temp2][0]][snake2.body[temp2][1]] = 0;
                    }
                    var points = snake1.score / 2;
                    snake2.score += points / 2;
                    snake2.length = i;
                    snake1.score -= points;
                }
                //does snake2 hit itself
                if (snake2.body[temp][0] == snake2Head[0] && snake2.body[temp][1] == snake2Head[1]) {
                    snake2.isDead = true;
                    snake2.score /= 2;
                }
            }
        }
    }

    //handles changing direction
    function keyPress(event) {
        switch (event.keyCode) {
            case (87): //w
                {
                    if (snake1.direction != 2)
                        snake1.nextDirection = 0;
                    break;
                }
            case (65):    //a
                {
                    if (snake1.direction != 1)
                        snake1.nextDirection = 3;
                    break;
                }
            case (83):   //s
                {
                    if (snake1.direction != 0)
                        snake1.nextDirection = 2;
                    break;
                }
            case (68):   //d
                {
                    if (snake1.direction != 3)
                        snake1.nextDirection = 1;
                    break;
                }
            case (38): //up
                if (snake2.direction != 2)
                    snake2.nextDirection = 0;
                break;

            case (37): //left
                if (snake2.direction != 1)
                    snake2.nextDirection = 3;
                break;

            case (40): //down
                if (snake2.direction != 0)
                    snake2.nextDirection = 2;
                break;

            case (39): //right
                if (snake2.direction != 3)
                    snake2.nextDirection = 1;
                break;
            case (32): //space
                if (gameState == "Start") {
                    gameCounter = setTimeout(gameOver, gameLength);
                    CreateApple();
                    gameState = "Play";
                    var d = new Date();
                    counterS = d.getTime();
                }
                if (gameState == "gameOver") {
                    snake1.score = 0;
                    initializeSnake1();
                    snake2.score = 0;
                    initializeSnake2();
                    gameState = "Start";
                }
                break;
                    
                
        }
       
    }
    function gameOver (){
        gameState = "gameOver";
        initializeArena();
        
    }

