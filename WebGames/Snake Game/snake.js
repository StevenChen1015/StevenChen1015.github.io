var GRID = 16;
var INIT_LENGTH = 10;
var SNAKE_X = 64;
var SNAKE_Y = 64;
var GRID_X, GRID_Y;
//Initial Snake Object
function Snake() {
  this.x = SNAKE_X;
  this.y = SNAKE_Y;
  this.dx = GRID;
  this.dy = 0;
  this.body = [];
  this.maxLength = score + INIT_LENGTH;
  this.move = function() {
    this.x += this.dx;
    this.y += this.dy;
  };
  this.snakeMove = function(dx, dy) {
      this.dx = dx;
      this.dy = dy;
  }
}
