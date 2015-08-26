(function () {
  if (typeof Snake === "undefined") {
    window.Snake = {};
  }


  var View = window.Snake.View = function (el) {
    this.board = new Snake.board();
    this.$el = $(el);
    this.setupBoard();
    this.drawBoard();
    this.setKeyHandlers();
    this.start();
  };

  View.prototype.bindEvents = function () {
    var that = this;
    $("div").on("click",function (event) {
      var $cell = $(event.currentTarget);
      var pos = $cell.data("pos");
      try {
        that.game.playMove(pos);
        that.makeMove($cell);
        that.checkWin();
      } catch(e) {
        alert("Invalid move!");
      }
    });
  };

  View.prototype.drawBoard = function () {
    this.board.update();
    $divs = $(this.$el.find("div"));
    var that = this;
    $.each($divs, function (div,val) {
      val = $(val);
      var pos = val.data("pos");
      if (that.board.grid[pos[0]][pos[1]] === "S") {
        val.addClass("snake");
        val.removeClass("apple");
      } else if (that.board.grid[pos[0]][pos[1]] === "A") {
        val.addClass("apple");
      } else {
        val.removeClass("snake");
        val.removeClass("apple");
      }
    });
  };


  View.prototype.setupBoard = function () {
    var $container = $("<ul>");
    for (var row = 0; row < 48; row++) {
      for (var col = 0; col < 48; col++) {
        var $div = $("<div>");
        $div.data("pos",[row,col]);
        $container.append($div);
      }
    }
    this.$el.append($container);
    var $button = $("<button>").text("Try Again");
    $button.on("click",this.restart.bind(this));
    this.$el.append($button);
  };

  View.prototype.restart = function () {
    $button = $(this.$el.find("button"));
    $button.css({"display": "none"});
    this.board = new Snake.board();
    this.drawBoard();
    this.setKeyHandlers();
  };

  View.prototype.start = function () {
  this.setKeyHandlers();
  var that = this;
  setInterval(function () { that.run();}, 50);
  };

  View.prototype.run = function () {
    if (this.board.isGameOver()) {
      $button = $(this.$el.find("button"));
      $h2 = $(this.$el.find("h2"));
      $h2.css({"display": "block"});
      $button.css({"display": "block"});
    } else {
      this.drawBoard();
    }
    if (this.board.isGameOver() === false) {
      this.board.snake.move();
    }
  };


  View.prototype.setKeyHandlers = function () {
  var snake = this.board.snake;
  key('w',function () {if (snake.dir != "S") {snake.dir = "N";}});
  key('s',function () {if (snake.dir != "N") {snake.dir = "S";}});
  key('a',function () {if (snake.dir != "E") {snake.dir = "W";}});
  key('d',function () {if (snake.dir != "W") {snake.dir = "E";}});
};



})();
