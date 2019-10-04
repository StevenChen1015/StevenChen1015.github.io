var GRID = 16;
var fps = 0;
var score = 0;
var gameStopped = false;
// var gameStarted = false;
var MAX_LENGTH = 15;
var SNAKE_X = 64;
var SNAKE_Y = 64;

//Initial Snake Object
function Snake() {
  this.x = SNAKE_X;
  this.y = SNAKE_Y;
  this.dx = GRID;
  this.dy = 0;
  this.body = [];
  this.maxLength = MAX_LENGTH;
  this.move = function() {
    this.x += this.dx;
    this.y += this.dy;
  };
  this.snakeMove = function(dx, dy) {
      this.dx = dx;
      this.dy = dy;
  }
}
//Initial Dots
function Dot() {
  this.x = 320;
  this.y = 320;
}

//Loading the game...
window.onload = function() {
  var	canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var snake = new Snake();
  var dot = new Dot();

document.getElementById('start').addEventListener('click', function (argument) {
  if(gameStopped) {
      restartGame();
      gameStopped = false;
    } else {
      main();
    }
    document.getElementById("start").disabled = true;

})
  function main() {
    startGame();
  }
  function startGame() {
    updateGame();
    window.requestAnimationFrame(render);
  }
  //loop the game
  function updateGame() {
  	if (++fps < 4) {
  		return;
  	}
  	fps = 0;
  	if(gameStopped) {
      // gameStarted = false;
      return;
    }
    snake.move();
  	//Check if the snake is reached left or right side of the canvas
  	if (snake.x < 0) {
      	snake.x = canvas.width - GRID;
    	}
    	else if (snake.x >= canvas.width) {
      	snake.x = 0;
    	}
    	//Check if the snake is reached top or bottom side of the canvas
   	if (snake.y < 0) {
      	snake.y = canvas.height - GRID;
    	}
    	else if (snake.y >= canvas.height) {
      	snake.y = 0;
    	}
    	snake.body.unshift({x: snake.x, y: snake.y});
  	if (snake.body.length > snake.maxLength) {
      	snake.body.pop();
    	}
      window.setTimeout(updateGame, 10);
  }

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  	context.fillStyle = 'white';
  	context.fillRect(dot.x, dot.y, GRID - 1, GRID - 1);
    snake.body.forEach(function (cell, index) {
    if(!gameStopped) {
      context.fillStyle = 'green';  
      context.fillRect(cell.x, cell.y, GRID - 1, GRID - 1);
    }
  	
  		if(cell.x == dot.x && cell.y == dot.y) {
  			snake.maxLength++;
  			dot.x = getRandom(0, 25) * GRID;
  	        dot.y = getRandom(0, 25) * GRID;
  	        score++;
  	        document.getElementById("score").innerHTML = score;
  		}
  		// check collision with all cells after this one (modified bubble sort)
      for (var i = index + 1; i < snake.body.length; i++) {
        // snake occupies same space as a body part. reset game
        if (cell.x === snake.body[i].x && cell.y === snake.body[i].y) {
          score = 0;
          document.getElementById("score").innerHTML = score;
          gameStopped = true;
          context.clearRect(0, 0, canvas.width, canvas.height);
          gameLost();
        }
      }
  	})
    window.requestAnimationFrame(updateGame);
    window.requestAnimationFrame(render);
  }
  
  //Web version game
  document.addEventListener('keydown', function(e) {
    // left arrow key
    if (e.which === 37 && snake.dx === 0) {
      snake.snakeMove(-GRID, 0);
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
     snake.snakeMove(0, -GRID);
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
      snake.snakeMove(GRID, 0);
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
      snake.snakeMove(0, GRID);
    }
    if(e.which == 48 && gameStopped) {
      restartGame();
    }
  });
  function restartGame() {
    score = 0;
    document.getElementById("score").innerHTML = score;
    snake.x = SNAKE_X;
    snake.y = SNAKE_Y;
    snake.body = [];
    snake.maxLength = MAX_LENGTH;
    snake.dx = GRID;
    snake.dy = 0;
    dot.x = getRandom(0, 25) * GRID;
    dot.y = getRandom(0, 25) * GRID;
    gameStopped = false;
  }
  function gameLost() {
    context.font = "50px Arial";
    context.fillStyle = "red";
    context.textAlign = "center";
    context.fillText("YOU LOST!", canvas.width / 2 , canvas.height / 2);
  }
  //Mobile version game
  document.addEventListener("click", function(e){
    if (e.target.value == "UP" && snake.dy === 0) {
      snake.snakeMove(0, -GRID);
    } else if(e.target.value == "DOWN" && snake.dy === 0) {
      snake.snakeMove(0, GRID);
    } else if(e.target.value == "LEFT" && snake.dx === 0) {
      snake.snakeMove(-GRID, 0);
    } else if(e.target.value == "right" && snake.dx === 0) {
      snake.snakeMove(GRID, 0);
    }
    if(e.target.value == "restart") {
      restartGame();
    }

  })
  function getRandom(min, max) {
  	return Math.floor(Math.random() * (max - min)) + min;
  }
}