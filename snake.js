(function () {
if (typeof Snake === "undefined") {
  window.Snake = {};
}

Snake.snake = function (startpos,board) {
  this.startpos = startpos;
  this.dir = "N";
  this.segments = [this.startpos];
  this.board = board;
  this.hitSelf = false;
  this.outOfBounds = false;
};

Snake.snake.prototype.hasCoord = function (coord) {
  for (var i = 0; i < this.segments.length; i++) {
    var seg = this.segments[i];
    if (coord[0] === seg[0] && coord[1] === seg[1]) {
      return true;
    }
  }
  return false;
};


Snake.snake.prototype.addSeg = function () {
  var lastSeg = this.segments.slice(this.segments.length - 1);
  var seg;
  if (this.dir === "N") {
    seg = [lastSeg[0] + 1, lastSeg[1]];
  } else if (this.dir === "S") {
    seg = [lastSeg[0] - 1, lastSeg[1]];
  } else if (this.dir === "W") {
    seg = [lastSeg[0], lastSeg[1] + 1];
  } else if (this.dir === "E") {
    seg = [lastSeg[0], lastSeg[1] - 1];
  }
  this.segments.push(seg);
};

Snake.snake.prototype.checkNextMove = function (nextGridPos) {
   if (nextGridPos === "A") {
      this.addSeg();
      this.addSeg();
      this.addSeg();
      this.board.placeApple();
    } else if (nextGridPos === "S") {
      this.hitSelf = true;
    }
};

Snake.snake.prototype.inBounds = function (nextSeg) {
  if ((nextSeg[0] < this.board.grid.length && nextSeg[0] > -1) &&
    (nextSeg[1] < this.board.grid.length && nextSeg[1] > -1)) {
    return true;
  } else {
    this.outOfBounds = true;
    return false;
  }
};

Snake.snake.prototype.move = function () {
  for (var i = this.segments.length - 1; i >= 0; i--) {
    var seg = this.segments[i];
    if (i === 0) {
      var nextSeg;
      if (this.dir === "N") {
        nextSeg = [seg[0] - 1, seg[1]];
      } else if (this.dir === "S") {
        nextSeg = [seg[0] + 1, seg[1]];
      } else if (this.dir === "W") {
        nextSeg = [seg[0], seg[1] - 1];
      } else if (this.dir === "E") {
        nextSeg = [seg[0], seg[1] + 1];
      }
      if (this.inBounds(nextSeg)) {
        var nextVal = this.board.grid[nextSeg[0]][nextSeg[1]];
        this.checkNextMove(nextVal);
        this.segments[0] = nextSeg;
      }
    } else {
      var nextseg = this.segments[i-1];
      this.segments[i] = nextseg;
    }
  }
};


Snake.board = function () {
  this.grid = new Array(48);
  for (var i = 0; i < this.grid.length; i++) {
    this.grid[i] = new Array(48);
  }
  this.snake = new Snake.snake([24,24],this);
  this.placeApple();
  this.update();
};

Snake.board.prototype.update = function () {
  for (var i = 0; i < this.grid.length; i++) {
    for (var j = 0; j < this.grid.length; j++) {
      if (this.snake.hasCoord([i,j])) {
        this.grid[i][j] = "S";
      } else if (this.grid[i][j] !== "A") {
        this.grid[i][j] = ".";
      }
    }
  }
};

Snake.board.prototype.isGameOver = function () {
  if (this.snakeHitEdge() || this.snakeHitSelf()) {
    return true;
  } else {
    return false;
  }
};

Snake.board.prototype.snakeHitSelf = function () {
  if (this.snake.hitSelf === true) {
    return true;
  } else {
    return false;
  }
};

Snake.board.prototype.snakeHitEdge = function () {
  if (this.snake.outOfBounds === false) {
    return false;
  } else {
    return true;
  }
};

Snake.board.prototype.placeApple = function () {
  var xCoord = this.randomCoord();
  var yCoord = this.randomCoord();
  if (this.grid[xCoord][yCoord] !== "S") {
    this.grid[xCoord][yCoord] = "A";
  } else {
    this.placeApple();
  }
};

Snake.board.prototype.randomCoord = function () {
  return Math.floor(Math.random() * 48);
};



})();
