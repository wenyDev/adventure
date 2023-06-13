let parsedCollisions
let collisionBlocks
let backgroundRooms
let doors
const playerRooms = new Player({
  imageSrc: './img/king/idle.png',
  frameRate: 11,
  animations: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/king/idle.png',
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: './img/king/idleLeft.png',
    },
    runRight: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/king/runRight.png',
    },
    runLeft: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: './img/king/runLeft.png',
    },
    enterDoor: {
      frameRate: 8,
      frameBuffer: 4,
      loop: false,
      imageSrc: './img/king/enterDoor.png',
      onComplete: () => {
        console.log('completed animation')
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++;
            count++;
            
            if(count > 3 && count % 3 === 1){
                currentScene = 1
                playerRooms.preventInput = true
                cancelAnimationFrame(animateRoomId)
                player.position.x = 190;
                player.position.y = 250;
                battle.initiated = false 
                animate()
                audio.Map.play() 
                updateUser('coins', 1)
                level = 1
                count = 0
                
            }
            
            if (level === 4) level = 1
            levels[level].init()
            playerRooms.switchSprite('idleRight')
            playerRooms.preventInput = false
            gsap.to(overlay, {
              opacity: 0,
            })
          },
        })
      },
    },
  },
})

let level = 1
let count = 0
let levels = {
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D(292)
      playerRooms.collisionBlocks = collisionBlocks
      document.getElementById('coins_header').style.display = 'none';
      if (playerRooms.currentAnimation) playerRooms.currentAnimation.isActive = false

      backgroundRooms = new SpriteRooms({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel1.png',
      })

      doors = [
        new SpriteRooms({
          position: {
            x: 767,
            y: 270,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
  2: {
    init: () => {
      parsedCollisions = collisionsLevel2.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D(292)
      playerRooms.collisionBlocks = collisionBlocks
      playerRooms.position.x = 96
      playerRooms.position.y = 140

      if (playerRooms.currentAnimation) playerRooms.currentAnimation.isActive = false

      backgroundRooms = new SpriteRooms({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel2.png',
      })

      doors = [
        new SpriteRooms({
          position: {
            x: 772.0,
            y: 336,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
  3: {
    init: () => {
      parsedCollisions = collisionsLevel3.parse2D()
      collisionBlocks = parsedCollisions.createObjectsFrom2D(250)
      playerRooms.collisionBlocks = collisionBlocks
      playerRooms.position.x = 750
      playerRooms.position.y = 230
      if (playerRooms.currentAnimation) playerRooms.currentAnimation.isActive = false

      backgroundRooms = new SpriteRooms({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: './img/backgroundLevel3.png',
      })

      doors = [
        new SpriteRooms({
          position: {
            x: 176.0,
            y: 335,
          },
          imageSrc: './img/doorOpen.png',
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ]
    },
  },
}



const overlay = {
  opacity: 0,
}

function animateRoom() {
  animateRoomId = window.requestAnimationFrame(animateRoom)

  backgroundRooms.draw()
  doors.forEach((door) => {
    door.draw()
  })

  playerRooms.handleInput(keys)
  playerRooms.draw()
  playerRooms.update()
  
  c.save()
  c.globalAlpha = overlay.opacity
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.restore()
}


