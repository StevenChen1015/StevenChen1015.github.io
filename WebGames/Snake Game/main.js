var fps = 0;
var score = 0;
var gameStopped = false;
//Initial Dots
function Dot() {
  this.x = 320;
  this.y = 320;
}
function resize(){
  var canvas = document.getElementById('canvas');
  var menu = document.getElementById('main');
  // canvas.width = Math.floor(Math.trunc(window.innerWidth)/10)*10;
  canvas.width = Math.round(window.innerWidth / 100) * 100;
  canvas.height = Math.round(Math.trunc(window.innerHeight - 200)/100)*100;
  menu.style.top = canvas.height / 2 - 150 + "px";
  menu.style.width = window.innerWidth * 0.5 + "px";
  GRID_X = Math.ceil(canvas.width) / Math.ceil(GRID);
  GRID_Y = Math.ceil(canvas.height) /  Math.ceil(GRID);
 }

//Loading the game...
window.onload = function() {
  var	canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var snake = new Snake();
  var dot = new Dot();
  resize();
  window.onresize = function(event) {
      resize();
  };
document.getElementById('main').style.display = "block";
document.getElementById('start').addEventListener('click', function (argument) {
    displayMenu();
    main();

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
    swipedetect();
  	if (++fps < 4) {
  		return;
  	}
  	fps = 0;
  	if(gameStopped) {
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
  			dot.x = getRandom(0, GRID_X) * GRID;
  	        dot.y = getRandom(0, GRID_Y) * GRID;
            console.log("x" + dot.x + " y" + dot.y);

  	        score++;
  	        document.getElementById("score").innerHTML = score;
  		}
  		// check collision with all cells after this one (modified bubble sort)
      for (var i = index + 1; i < snake.body.length; i++) {
        // snake occupies same space as a body part. reset game
        if (cell.x === snake.body[i].x && cell.y === snake.body[i].y) {
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
    if(e.which == 82 && gameStopped) {
      restartGame();
    }
  });
  function restartGame() {
    score = 0;
    document.getElementById("score").innerHTML = score;
    snake.x = SNAKE_X;
    snake.y = SNAKE_Y;
    snake.body = [];
    snake.maxLength = score + INIT_LENGTH;
    snake.dx = GRID;
    snake.dy = 0;
    dot.x = getRandom(0, GRID_X) * GRID;
    dot.y = getRandom(0, GRID_Y) * GRID;
    gameStopped = false;
    document.getElementById('main').style.display = "none";
  }
  function gameLost() {
    // context.font = "50px Arial";
    // context.fillStyle = "red";
    // context.textAlign = "center";
    // context.fillText("SCORE:" + score, canvas.width / 2, canvas.height / 2 - 50);
    // context.fillText("YOU LOST!", canvas.width / 2 , canvas.height / 2);
    document.getElementById("lost_score").innerHTML = "SCORE: " + score;
    displayMenu();
  }
  //Mobile version game

  function swipedetect(){

    var swipedir;
    var startX;
    var startY;
    var distX;
    var distY;
    var threshold = 150; //required min distance traveled to be considered swipe
    var restraint = 100; // maximum distance allowed at the same time in perpendicular direction
    var allowedTime = 300; // maximum time allowed to travel that distance
    var elapsedTime;
    var startTime;
// window.addEventListener ("touchmove", function (event) { event.preventDefault (); }, {passive: false});
    document.addEventListener('touchstart', function(e){
        var touched = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touched.pageX
        startY = touched.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, {passive: false})

    document.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, {passive: false})

    document.addEventListener('touchend', function(e){
        var touched = e.changedTouches[0]
        distX = touched.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touched.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'LEFT' : 'RIGHT' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'UP' : 'DOWN' // if dist traveled is negative, it indicates up swipe
            }
        }
        mobileControl(swipedir);
        e.preventDefault()
    }, {passive: false})
}

  function mobileControl(swipedir) {
    console.log(swipedir);
    if (swipedir == "UP" && snake.dy === 0) {
      snake.snakeMove(0, -GRID);
    } else if(swipedir == "DOWN" && snake.dy === 0) {
      snake.snakeMove(0, GRID);
    } else if(swipedir == "LEFT" && snake.dx === 0) {
      snake.snakeMove(-GRID, 0);
    } else if(swipedir == "RIGHT" && snake.dx === 0) {
      snake.snakeMove(GRID, 0);
    }
  }
  function displayMenu() {
    if(!gameStopped) {
      document.getElementById('main').style.display = "none";
    } else {
      document.getElementById('main').style.display = "block";
      document.getElementById('start').style.display = "none";
      document.getElementById('lostgame').style.display = "block";
    }
  }
  function getRandom(min, max) {
  	return Math.floor(Math.random() * (max - min)) + min;
  }
}
