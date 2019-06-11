const gridSize = 25;        // The width of the grid's squares, in pixels
const snakeStartLength = 5;    // Used to work out how many points you've gained

let snake = [];   // The data structure storing all the segments of the snake
let apples = [];   // The data structure storing all the apples that randomly appear
let snakeHead = {x: 0, y: 0}; // The head of the snake (an X and Y co-ordinate)
let snakeDirection = 'S';     // [N]orth, [S]outh, [E]ast, [W]est
let snakeAlive = true;        // Gets set to false when you lose the game!
let snakeMaxLength = snakeStartLength;  // How long the snake can grow (increases when you eat apples)
let snakeAlreadyTurned = false;   // This limits you to one change of direction per animation frame

/*-----------------------------------------------
  This function runs when the page first loads...
  -----------------------------------------------*/
function pageLoad() {

  let newSegment = {x: snakeHead.x, y: snakeHead.y};
  snake.push(newSegment);

  drawCanvas();

  setInterval(updateSnake, 200);
  setInterval(addApple, 1000);

  document.addEventListener("keydown", checkKeyPress, false);

}

function updateSnake() {

  if (snakeAlive) {

    if (snakeDirection === 'N') snakeHead.y--;
    if (snakeDirection === 'E') snakeHead.x++;
    if (snakeDirection === 'S') snakeHead.y++;
    if (snakeDirection === 'W') snakeHead.x--;
    snakeAlreadyTurned = false;

    if (snakeHead.x < 0 ||
        snakeHead.y < 0 ||
        snakeHead.x >= 800/gridSize ||
        snakeHead.y >= 600/gridSize) {
          snakeAlive = false;
    }

    for (let segment of snake) {
      if (segment.x == snakeHead.x &&
          segment.y == snakeHead.y) {
          snakeAlive = false;
        }
    }

    if (snakeAlive) {
      let newSegment = {x: snakeHead.x, y: snakeHead.y};
      snake.push(newSegment);

      let remainingApples = [];
      for (let apple of apples) {
        if (apple.x === newSegment.x && apple.y === newSegment.y) {
          snakeMaxLength++;
          document.getElementById("score").innerHTML = snakeMaxLength - snakeStartLength;
        } else {
         remainingApples.push(apple);
        }
      }
      apples = remainingApples;

      if (snake.length > snakeMaxLength) {
        snake.shift();
      }
    }

  }

  drawCanvas();

}

function drawCanvas() {

  let canvasContext = document.getElementById('snakeCanvas').getContext('2d');

  canvasContext.clearRect(0, 0, 800, 600);

  for (let apple of apples) {

    canvasContext.fillStyle = "green";
    canvasContext.beginPath();
    canvasContext.rect(apple.x*gridSize + 5, apple.y*gridSize + 5, gridSize - 10, gridSize - 10);
    canvasContext.fill();

  }

  for (let segment of snake) {

    if (snakeAlive) {
      canvasContext.fillStyle = "purple";
    } else if (snake.length >= (800/gridSize)*(600/gridSize)) {
      canvasContext.fillStyle = "gold";
    }
    else {
      canvasContext.fillStyle = "red";
    }

    canvasContext.beginPath();
    canvasContext.rect(segment.x*gridSize, segment.y*gridSize, gridSize, gridSize);
    canvasContext.fill();

  }

}

function checkKeyPress(event) {

  if (snakeAlreadyTurned) return;

  if ( event.key === "ArrowUp" ) {
    snakeDirection = 'N';
    snakeAlreadyTurned = true;
  }

  if ( event.key === "ArrowDown" ) {
    snakeDirection = 'S';
    snakeAlreadyTurned = true;
  }

  if ( event.key === "ArrowLeft" ) {
    snakeDirection = 'W';
    snakeAlreadyTurned = true;
  }

  if ( event.key === "ArrowRight" ) {
    snakeDirection = 'E';
    snakeAlreadyTurned = true;
  }

}

function addApple() {

    if (!snakeAlive) return;

    let newApple = {
      x: Math.floor(Math.random() * (800/gridSize)),
      y: Math.floor(Math.random() * (600/gridSize))
    };
    apples.push(newApple);

}
