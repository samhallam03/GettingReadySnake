/*-------------------------------------------------------
Constants and variables:
------------------------------------------------------*/
const GRID_SIZE = 25;      // The width of the grid's squares, in pixels
const START_LENGTH = 5;    // Used to work out how many points you've gained
const MAX_X = 800;         // This is the max X co-ordinate of the graphics canvas...
const MAX_Y = 600;         // ... and this is the maximum Y co-ordinate.

let snake = [];         // The data structure storing all the segments of the snake
let apples = [];        // The data structure storing all the apples that randomly appear
let snakeHead = {x: 0, y: 0};   // The head of the snake (an X and Y co-ordinate)
let snakeDirection = 'S';       // [N]orth, [S]outh, [E]ast, [W]est
let snakeAlive = true;          // Gets set to false when you lose the game!
let snakeMaxLength = START_LENGTH;      // How long the snake can grow (increases when you eat apples)
let snakeAlreadyTurned = false;             // This limits you to one change of direction per animation frame

/*-------------------------------------------------------
This function runs when the page first loads. Look for
the line <body onload="pageLoad()"> in the HTML file.
------------------------------------------------------*/
function pageLoad() {

    let firstSegment = {x: snakeHead.x, y: snakeHead.y};        // The very first body segment of the snake.
    snake.push(firstSegment);                                   // Add it to the snake segments list.

    setInterval(updateSnake, 200);      // Schedule a snake update every 200ms (5 times per second)
    setInterval(addApple, 1000);        // Schedule a new apple to appear every second

    document.addEventListener('keydown', checkKeyPress);        // Assign the function 'checkKeyPress'
                                                                // to handle when a key is pressed.

    drawCanvas();                       // Draw the canvas (playing field) for the first time

}

/*-------------------------------------------------------
This is the function that runs 5 times every second to
update the snake's position and check for collisions.
------------------------------------------------------*/
function updateSnake() {

    if (snakeAlive) {     // Only process this code if the snake is alive.

        if (snakeDirection == 'N') snakeHead.y--;       // North, move snake's head up
        if (snakeDirection == 'E') snakeHead.x++;       // East, move snake's head left
        if (snakeDirection == 'S') snakeHead.y++;       // South, move snake's head down
        if (snakeDirection == 'W') snakeHead.x--;       // West, move snake's head right

        snakeAlreadyTurned = false;                     // Reset the 'double move' variable (see checkKeyPress function)

        if (snakeHead.x < 0 ||                              // If snake's head has hit the left edge
            snakeHead.y < 0 ||                              // or if snake's head has hit top edge
            snakeHead.x >= MAX_X/GRID_SIZE ||               // or if snake's head has hit right edge
            snakeHead.y >= MAX_Y/GRID_SIZE) {               // or if snake's head has hit bottom edge
            snakeAlive = false;                             // then the snake is dead!
        }

        for (let segment of snake) {                        // Check each of the snake's body segments...
            if (segment.x == snakeHead.x &&                 // If the segment has the same x co-ordinate
                segment.y == snakeHead.y) {                 // and the same y co-ordinate as the new head position
                snakeAlive = false;                         // then the snake is dead!
                break;                                      // (and there's no point checking any other segments)
            }
        }

        if (snakeAlive) {                                   // If the snake has survived this far with no collisions...

            let newSegment = {x: snakeHead.x, y: snakeHead.y};    // Create a new segement at the new head position...
            snake.push(newSegment);                               // and add it to the list of snake body segements.

            if (snake.length > snakeMaxLength) {                  // If the snake is longer than it is supposed to be...
                snake.shift();                                    // ...then drop the oldest segement (called shift because
            }                                                     // it drops the first item and shifts the list along one.)

            for (let apple of apples) {                // Check each of the apples...
                if (apple.x == newSegment.x && apple.y == newSegment.y) {       // ... if the new segement has collided with an apple...
                    snakeMaxLength++;                                           // ... then increase the snake's max length by one ...
                    document.getElementById('score').innerHTML = snakeMaxLength - START_LENGTH;   // ... update the score ...
                    apples = apples.filter(a => a !== apple);                   // ... remove this apple from the list of apples ...
                    break;                            // ... and terminate stop checking (you can only with one apple at a time!)
                }
            }

            /* The 'filter' function above only keeps the apples that are not the one we've collided with.
            If does this by testing each candidate apple (denoted by a) to establish that a is not the apple (a != apple) */
        }
    }

    drawCanvas();     // At the end of every snake update, redraw the canvas!

}

/*-------------------------------------------------------
This function redraws the canvas, creating one 'frame'
of the game's animation.
------------------------------------------------------*/
function drawCanvas() {

    let canvas = document.getElementById('snakeCanvas');    // Get a reference to the canvas element.
    canvas.width = MAX_X;                                   // Set the canvas' width and height.
    canvas.height = MAX_Y;

    /* Get a reference the the canvas' drawing context. The context provided
    access to lot of tools that allow us to draw on the canvas. */
    let context = canvas.getContext('2d');

    context.clearRect(0, 0, MAX_X, MAX_Y);  // Firstly, clear the canvas of all previously drawn stuff.

    for (let apple of apples) {             // We need to draw each of the apples, so for each apple in the apples list...

        context.fillStyle = 'green';        // ... set the drawing colour to be green
        context.beginPath();                // ... begin drawing a shape
        context.rect(apple.x*GRID_SIZE + 5, apple.y*GRID_SIZE + 5, GRID_SIZE - 10, GRID_SIZE - 10);   // ... a rectangular path that is
        // 5 pixels in from the top left corner and 10 pixels less wide than the grid size - i.e. a 5 pixel margin all the way round.)
        context.fill();                     // ... fill the shape!

    }

    for (let segment of snake) {              // Next, we need to draw each of the snake's body segments...

        if (snakeAlive) {
            context.fillStyle = 'purple';     // If the snake is alive, it will be purple
        } else if (snake.length >= (MAX_X/GRID_SIZE)*(MAX_Y/GRID_SIZE)) {
            context.fillStyle = 'gold';       // If the snake fills the whole screen, it will be gold!
        } else {
            context.fillStyle = 'red';        // Otherwise, the snake must be dead so it will be red.
        }

        context.beginPath();                // Begin drawing a shape...
        context.rect(segment.x*GRID_SIZE, segment.y*GRID_SIZE, GRID_SIZE, GRID_SIZE);   // ... a square, GRID_SIZE wide and tall,
        context.fill();                     // ... and filled in.

    }

}

/*-------------------------------------------------------
This function processes any key presses and changes the
snake's direction accordingly.
------------------------------------------------------*/
function checkKeyPress(event) {

    /* You can only change direction once per frame (this prevents you crashing into your own head!) */
    if (snakeAlreadyTurned) return;    // If you've already turned, return out of the function.

    if ( event.key == 'ArrowUp' ) {         // If you've pressed the up arrow...
        snakeDirection = 'N';               // ... change the snake's direction to N (for North)
        snakeAlreadyTurned = true;          // ... and prevent any further direction changes this frame.
    }

    if ( event.key == 'ArrowDown' ) {       // If you've pressed the down arrow...
        snakeDirection = 'S';               // ... change the snake's direction to S (for South)
        snakeAlreadyTurned = true;          // ... and prevent any further direction changes this frame.
    }

    if ( event.key == 'ArrowLeft' ) {       // If you've pressed the left arrow...
        snakeDirection = 'W';               // ... change the snake's direction to W (for West)
        snakeAlreadyTurned = true;          // ... and prevent any further direction changes this frame.
    }

    if ( event.key == 'ArrowRight' ) {      // If you've pressed the right arrow...
        snakeDirection = 'E';               // ... change the snake's direction to E (for East)
        snakeAlreadyTurned = true;          // ... and prevent any further direction changes this frame.
    }

}

/*-------------------------------------------------------
Last but not least, this is the function that runs adds
a new apple to the playing field.
------------------------------------------------------*/
function addApple() {

    if (!snakeAlive) return;    // Return out of the function if the snake is not alive

    let newApple = {            // Create a new object called apple at a random location...
        x: Math.floor(Math.random() * MAX_X/GRID_SIZE),  // Math.random generates a number between 0.000 and 0.999
        y: Math.floor(Math.random() * MAX_Y/GRID_SIZE)   // Math.floor rounds down
    };
    apples.push(newApple);      // ...and add it to the list of apples.

}
