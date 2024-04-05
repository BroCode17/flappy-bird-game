//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 34; //width ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512; //
let pipeX = boardWidth;
let pipeY = 0;

//Game over
let gameOver = false;
let score = 0;
let start = false;

//top pip
let topPipeImg;
let bottomPipeImg;

//Game physics
let velocityX = -2; //pipe moving left
let velocityY = 0; // bird not jump speed
let gravity = 0.4; // Gravity to pull you down

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw flappy bird
  // context.fillStyle = 'green';
  // context.fillRect(bird.x, bird.y, bird.width, bird.height)

  //bird image
  birdImage = new Image();
  birdImage.src = "./flappybird.png";
  birdImage.onload = () => {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  };
  setTimeout(() => {
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 sec
    //Event
    document.addEventListener("keydown", moveBird);
  }, 400);
};

function startGame(start) {
  if (start !== false) {
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 sec
    //Event
    document.addEventListener("keydown", moveBird);
  }
}

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  //draw bird for each flame
  velocityY += gravity;
  // bird.y += volocityY
  bird.y = Math.max(bird.y + velocityY, 0); // apply gravity
  context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  if (bird.y > board.height) {
    gameOver = true;
  }

  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5; // Because there are two pipes
      pipe.passed = true;
    }
    if (detectCollission(bird, pipe)) {
      gameOver = true;
    }
  }

  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift(); //remove first element from the array
  }

  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 55);

  if (gameOver) {
    gameOverText(50, boardHeight / 2);
  }
}

function placePipes() {
  if (gameOver) {
    return;
  }

  let randomPipeY = pipeY - pipeHeight / 4 - (Math.random() * pipeHeight) / 2;
  let opneningSpace = board.height / 4;
  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + opneningSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //jump
    velocityY = -6;

    //reset
    if (gameOver) {
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
    }
  }
}

function detectCollission(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function gameOverText(w, h) {
  context.fillStyle = "red";
  context.font = "50px sans-serif";
  context.fillText("Game Over", w, h);
  context.font = "20px sans-serif";
  context.fillText("Press Space To Restart", w+25, h+20);
}
