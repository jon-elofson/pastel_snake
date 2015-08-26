(function () {
  if (typeof Snake === "undefined") {
    window.Snake = {};
  }

  var View = window.Snake.View = function (el) {
    this.board = new Snake.board();
    this.$el = $(el);
    this.setupBoard();
    this.drawBoard();
    this.highScores = [];
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

  View.prototype.selectRandomColor = function () {
    var colorCodes = ['#FF6961','#FFB347','#B19CD9', "#FFFF84",
    "#FFBBFF", "#2F74D0", "#F49AC2", "#CB99C9" ];
    var that = this;
    var idx = Math.floor(Math.random() * colorCodes.length);
    return colorCodes[idx];
  };



  View.prototype.drawBoard = function () {
    this.board.update();
    this.updateSquares();
    var strScore = this.board.score.toString();
    var level = this.board.level;
    this.$el.find('.game-info').html("Score: " + strScore +
    " | Level:" + level.toString());
    clearInterval(this.interval);
    var that = this;
    this.interval = setInterval(function () { that.run();}, 100 - (10 * (level - 1)));
  };

  View.prototype.updateSquares = function () {
    $divs = $(this.$el.find("div.grid-square"));
    var that = this;
    $.each($divs, function (div,val) {
      val = $(val);
      var pos = val.data("pos");
      if (that.board.grid[pos[0]][pos[1]] === "S") {
        if (val.hasClass('apple')){
          val.removeClass("apple");
        }
        val.addClass("snake");
        val.css('background-color',"#33D685");
      } else if (that.board.grid[pos[0]][pos[1]] === "A") {
        val.addClass("apple");
          if (val.css('background-color') === "rgba(0, 0, 0, 0)") {
            val.css('background-color',that.selectRandomColor());
          }
      } else {
        val.removeClass("snake");
        val.removeClass("apple");
        val.css('background-color',"rgba(0, 0, 0, 0)");
      }
    });
  };


  View.prototype.setupBoard = function () {
    this.addGameInfo();
    // this.addLeaderBoard();
    this.addSquares();
    this.addButton();
  };

  View.prototype.addButton = function () {
    var $button = $("<button>").text("Try Again");
    $button.on("click",this.restart.bind(this));
    this.$el.append($button);
  };

  View.prototype.addSquares = function () {
    var $container = $("<ul>");
    for (var row = 0; row < 48; row++) {
      for (var col = 0; col < 48; col++) {
        var $div = $("<div>");
        $div.data("pos",[row,col]);
        $div.addClass('grid-square');
        $container.append($div);
      }
    }
    this.$el.append($container);
  };

  View.prototype.addLeaderBoard = function () {
    var $leaderBoard = $("<div>");
    $leaderBoard.addClass('leader-board');
    $header = $("<h3>").addClass('leader-board-header');
    $header.html("High Scores");
    $leaderBoard.append($header);
    var scores = Snake.sortedScores();
    scores.forEach(function (el) {
      scoreStr = el[1].toString();
      $score = $("<h4>").addClass('high-score').html(el[0] + ": " + scoreStr);
      $leaderBoard.append($score);
    });
    this.$el.append($leaderBoard);
  };


  View.prototype.addGameInfo = function () {
    var $gameInfo = $('<h2>');
    $gameInfo.addClass('game-info');
    var strScore = this.board.score.toString();
    var strLevel = this.board.level.toString();
    $gameInfo.html("Score: " + strScore + " | Level:" + strLevel);
    this.$el.append($gameInfo);
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
  this.interval = setInterval(function () { that.run();}, 100);
};

  View.prototype.run = function () {
    if (this.board.isGameOver()) {
      $button = $(this.$el.find("button"));
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
