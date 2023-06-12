const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, i + 70));
}

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, i + 70));
}

const transferMap = [];
for (let i = 0; i < transferData.length; i += 70) {
	transferMap.push(transferData.slice(i, i + 70));
}

const offset = {
  x: -735,
  y: -650
}

const boundaries = [];
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

const battleZones = []
battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

const transfers = []
transferMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1368)
		transfers.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          }
        })
      )
  })
})

const image = new Image();
image.src = './img/Pellet Town.png';

const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';

const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';

const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';

const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';


const player = new Sprite({
	position: {
		x: canvas.width / 2 -192 / 4 / 2,
		y: canvas.height / 2 - 68 / 2
	},
	image: playerDownImage,
	frames: {
		max: 4,
		hold: 10
	},
	sprites: {
		up: playerUpImage,
		left: playerLeftImage,
		right: playerRightImage,
		down: playerDownImage
	}
});

const background = new Sprite({
	position:{
		x: offset.x,
		y: offset.y
	},
	image: image
});

const foreground = new Sprite({
	position:{
		x: offset.x,
		y: offset.y
	},
	image: foregroundImage
});

const keys = {
	w: {
		pressed: false
	}
	,
	a: {
		pressed: false
	}
	,
	s: {
		pressed: false
	}
	,
	d: {
		pressed: false
	}
};

const movables = [background, ...boundaries, foreground, ...battleZones, ...transfers]

function rectangularCollision({rectangle1, rectangle2}) {
	return (
		rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
		rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
		rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
		rectangle1.position.y + rectangle1.height >= rectangle2.position.y
	)
}

const battle = {
  initiated: false
}

function animate() {
	const animationId = window.requestAnimationFrame(animate);

	background.draw();
	boundaries.forEach((boundary) => {
		boundary.draw();	 
	})

	battleZones.forEach((battleZone) => {
		battleZone.draw();	 
	})

	transfers.forEach((transfer) => {
		transfer.draw();
	})

	player.draw();
	foreground.draw();

	let moving = true;
	player.animate = false;

	//console.log(animationId)
	if(battle.initiated) return

	//activate battle
	if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
		for(let i = 0; i < battleZones.length; i++){

			const battleZone = battleZones[i];
			const overlappingArea =
				(Math.min(
				player.position.x + player.width,
				battleZone.position.x + battleZone.width
				) -
				Math.max(player.position.x, battleZone.position.x)) *
				(Math.min(
				player.position.y + player.height,
				battleZone.position.y + battleZone.height
				) -
				Math.max(player.position.y, battleZone.position.y))


			if (
				rectangularCollision({
					rectangle1: player, 
					rectangle2: battleZone
				}) && 
				overlappingArea > (player.width * player.height) / 2 &&
				Math.random() < 0.01
			) {

				// deactive the current animation loop
				window.cancelAnimationFrame(animationId)
				audio.Map.stop()
				audio.initBattle.play()
				audio.battle.play()
				
				battle.initiated = true;
				startBattleAnimation(initBattle, animateBattle);
				break;
			}
		}
	}

	// activate rooms game
	if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
		for(let i = 0; i < transfers.length; i++){
			const transfer = transfers[i];

			const overlappingArea =
				(Math.min(
				player.position.x + player.width,
				transfer.position.x + transfer.width
				) -
				Math.max(player.position.x, transfer.position.x)) *
				(Math.min(
				player.position.y + player.height,
				transfer.position.y + transfer.height
				) -
				Math.max(player.position.y, transfer.position.y))

			if (
				rectangularCollision({
					rectangle1: player, 
					rectangle2: {
						...transfer, 
						position: {
							x: transfer.position.x,
							y: transfer.position.y 
						}
					}
				}) && overlappingArea > (player.width * player.height) / 2 &&
				Math.random() < 0.1
			) {
				// deactive the current animation loop
				window.cancelAnimationFrame(animationId);
				audio.Map.stop();
				audio.initBattle.play();
				battle.initiated = true;
				currentScene = 2;
				startBattleAnimation(levels[level].init, animateRoom);
				break;
			}
		}
	}

	
	if(keys.w.pressed && lastKey === 'w') {
		player.animate = true;
		player.image = player.sprites.up

		for(let i = 0; i < boundaries.length; i++){
			const boundary = boundaries[i];
			if (
				rectangularCollision({
					rectangle1: player, 
					rectangle2: {
						...boundary, 
						position: {
							x: boundary.position.x,
							y: boundary.position.y + 3
						}
					}
				})
			) {
				moving = false;
				break;
			}
		}


		if(moving)
			movables.forEach((movable) => {
				movable.position.y += 3;
			})
	} else if(keys.a.pressed && lastKey === 'a') {
		player.animate = true;
		player.image = player.sprites.left

		for(let i = 0; i < boundaries.length; i++){
			const boundary = boundaries[i];
			if (
				rectangularCollision({
					rectangle1: player, 
					rectangle2: {
						...boundary, 
						position: {
							x: boundary.position.x + 3,
							y: boundary.position.y
						}
					}
				})
			) {
				moving = false;
				break;
			}
		}

		if(moving)
		movables.forEach((movable) => {
			movable.position.x += 3;
		})
	} else if(keys.s.pressed && lastKey === 's') {
		player.animate = true;
		player.image = player.sprites.down

		for(let i = 0; i < boundaries.length; i++){
			const boundary = boundaries[i];
			if (
				rectangularCollision({
					rectangle1: player, 
					rectangle2: {
						...boundary, 
						position: {
							x: boundary.position.x,
							y: boundary.position.y - 3
						}
					}
				})
			) {
				moving = false;
				break;
			}
		}

		if(moving)
		movables.forEach((movable) => {
			movable.position.y -= 3;
		})
	} else if(keys.d.pressed && lastKey === 'd') {
		player.animate = true;
		player.image = player.sprites.right

		for(let i = 0; i < boundaries.length; i++){
			const boundary = boundaries[i];
			if (
				rectangularCollision({
					rectangle1: player, 
					rectangle2: {
						...boundary, 
						position: {
							x: boundary.position.x - 3,
							y: boundary.position.y
						}
					}
				})
			) {
				moving = false;
				break;
			}
		}
		
		if(moving)
		movables.forEach((movable) => {
			movable.position.x -= 3;
		})
	}
}

let lastKey = '';
let currentScene = 1;
function mainMap(event){
	window.addEventListener('keydown', (e) => {
		switch(e.key){
		case 'w':
			keys.w.pressed = true;
			lastKey = 'w';
			break;
		case 'a':
			keys.a.pressed = true;
			lastKey = 'a';
			break;
		case 's':
			keys.s.pressed = true;
			lastKey = 's';
			break;
		case 'd':
			keys.d.pressed = true;
			lastKey = 'd';
			break;
		}
	
	});
}

function roomsMap(event){
	window.addEventListener('keydown', (event) => {
		if (playerRooms.preventInput) return
		switch (event.key) {
		  case 'w':
			for (let i = 0; i < doors.length; i++) {
			  const door = doors[i]
	  
			  if (
				playerRooms.hitbox.position.x + playerRooms.hitbox.width <=
				  door.position.x + door.width &&
				playerRooms.hitbox.position.x >= door.position.x &&
				playerRooms.hitbox.position.y + playerRooms.hitbox.height >= door.position.y &&
				playerRooms.hitbox.position.y <= door.position.y + door.height
			  ) {
				playerRooms.velocity.x = 0
				playerRooms.velocity.y = 0
				playerRooms.preventInput = true
				playerRooms.switchSprite('enterDoor')
				door.play()
				return
			  }
			}
			if (playerRooms.velocity.y === 0) playerRooms.velocity.y = -25
	  
			break
		  case 'a':
			// move player to the left
			keys.a.pressed = true
			console.log('sss2')
			break
		  case 'd':
			// move player to the right
			keys.d.pressed = true
			break
		}
	})
	  
}

window.addEventListener('keydown', (event) => {
	if (currentScene === 1) {
	  mainMap(event);
	} else if (currentScene === 2) {
		roomsMap(event);
	}
  });


window.addEventListener('keyup', (e) => {
	switch(e.key){
	case 'w':
		keys.w.pressed = false;
		break;
	case 'a':
		keys.a.pressed = false;
		break;
	case 's':
		keys.s.pressed = false;
		break;
	case 'd':
		keys.d.pressed = false;
		break;
	}

});

let clicked = false
addEventListener('click', () => {
	if(!clicked){
		audio.Map.play()
	}
	clicked = true	
})

function startBattleAnimation(initBattle, animateBattle) {
	gsap.to('#overlappingDiv', {
	  opacity: 1,
	  repeat: 3,
	  yoyo: true,
	  duration: 0.4,
	  onComplete() {
		gsap.to('#overlappingDiv', {
		  opacity: 1,
		  duration: 0.4,
		  onComplete() {
			initBattle()
			animateBattle()
			gsap.to('#overlappingDiv', {
			  opacity: 0,
			  duration: 0.4
			})
		  }
		})
	  }
	});
}


  
  
  


