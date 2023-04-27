var bg, bgImg;
var player, shooterImg, shooter_shooting, invisibleground;
var boxGroup, villain, patronus, villainGroup, avadakedavra

var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score = 50

function preload() {

  harryImg = loadAnimation("assets/hp_1.png", "assets/hp_1.png")
  voldemortImg = loadImage("assets/voldemort.png")
  dementorImg = loadImage("assets/dementor.png")
  bgImg = loadImage("/assets/BG.JPG")
  boxImg = loadImage("assets/box.png")
  killspellImg = loadImage("assets/avada-kedavra.png")
  patronusspellImg = loadImage("assets/patronus.png")


  harry_running = loadAnimation("assets/hp_1.png", "assets/hp_2.png", "assets/hp_3.png")

  explosionSound = loadSound("assets/explosion.mp3")
  loseSound = loadSound("assets/lose.mp3")
  winSound = loadSound("assets/win.mp3")


}

function setup() {


  createCanvas(windowWidth, windowHeight);

  // adding the background image
  bg = createSprite(0, 0, width, height)
  bg.addImage(bgImg)
  bg.scale = 3.8



  //creating the player sprite
  player = createSprite(80, displayHeight - 300, 50, 50);
  player.addAnimation("running", harry_running)
  player.addAnimation("idle", harryImg)
  player.scale = 5


  //  player.debug = true
  player.setCollider("rectangle", 0, 0, 20, 30)


  invisibleground = createSprite(width / 2, height - 50, width, 20)
  invisibleground.visible = false

  boxGroup = createGroup()
  villainGroup = createGroup()
  patronusGroup = createGroup()
  avadaGroup = createGroup()
}

function draw() {
  background(0);



  if (gameState === PLAY) {
    bg.velocityX = -4;
    if (bg.x < 0) {
      bg.x = bg.width / 3;
    }
    if ((keyDown("space") && player.y >= 750) || touches.length > 0) {
      player.velocityY = -25
      console.log(player.y)
      player.changeAnimation("idle")
    }

    player.velocityY = player.velocityY + 0.9

    spawnBoxes()
    spawnVillains()

    player.overlap(boxGroup, touched)
    player.overlap(villainGroup, collided)
    patronusGroup.overlap(villainGroup, crashed)


    if (score <= 0) {
      gameState = "END"
    }
  }


  //moving the player up and down and making the game mobile compatible using touches


  if (keyDown("DOWN_ARROW")) {
    castPatronus()
  }



  player.collide(invisibleground)

  drawSprites();


  if (gameState == "END") {
    gameOver()
  }

  fill("cyan")
  textSize(30)
  stroke("black")
  strokeWeight(3)
  textStyle(BOLDITALIC);
  text("SCORE : " + score, width - 200, 50)
}

function spawnBoxes() {
  if (frameCount % 200 === 0) {
    var box = createSprite(width, displayHeight - 190, 20, 80)
    box.velocityX = -7
    box.addImage(boxImg)
    box.lifetime = 600
    box.scale = 0.35
    boxGroup.add(box)
  }
}



function touched(player, box) {
  score -= 5
  //boxGroup.destroyEach()
  box.remove()
  loseSound.play()
}

function collided(player, villain) {
  score -= 20
  // villainGroup.destroyEach()
  villain.remove()
  loseSound.play()
}

function crashed(villain, patronus) {
  score += 15
  explosionSound.play()
  winSound.play()
  villain.remove()
  patronus.remove()

}

function spawnVillains() {
  if (frameCount % 275 === 0) {
    var villain = createSprite(width, displayHeight - 270, 50, 80)
    villain.velocityX = -7
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1: villain.addImage(voldemortImg);

        villain.scale = 0.6
        break;
      case 2: villain.addImage(dementorImg);

        villain.scale = 0.75
        break;
    }

    villain.lifetime = 400
    villainGroup.add(villain)
  }


}


function castPatronus() {
  var patronus = createSprite(100, displayHeight - 250, 5, 5)
  patronus.velocityX = 4
  patronus.scale = 0.6
  patronus.addImage(patronusspellImg)
  patronusGroup.add(patronus)

}


function gameOver() {
  swal({
    title: `Game Over`,
    text: "Oops you lost the game....!!!",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Replay'
  },
  
  function () {

    window.location.reload();}
  );
}