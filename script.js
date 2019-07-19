//constants
const canvasBorderBg = 'black';
const canvasBg = 'white';
const snakeBorderBg = 'black';
const snakeBg = 'black';
const foodBorderBg = 'darkred';
const foodBg = 'red';
const lKey = 37;
const rKey = 39;
const uKey = 38;
const dKey = 40;
const speed = 10;

let changingDirection = true;
var gameCanvas = document.getElementById('gameCanvas');
var context = gameCanvas.getContext("2d");
let snake = [
	{x: 300, y: 300},
	{x: 290, y: 300},
	{x: 280, y: 300},
	{x: 270, y: 300},
	{x: 260, y: 300},
	{x: 250, y: 300},
];
let score = 0;
let dx = 10;
let dy = 0;

createFood();
main();
document.addEventListener("keydown", changeDirection);

function main(){
	if(didGameEnd()) return;

	setTimeout(function onTick(){
		changingDirection = false;
		clearCanvas();
		drawFood();
		advanceSnake();
		drawSnake();

		main();
	}, speed)
}


function clearCanvas(){					//styling the canvas - the playground
	context.fillStyle = canvasBg;
	context.strokeStyle = canvasBorderBg;
	context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	context.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function drawSnake(){					//loop through the array snake (aka Snakey's body)
	snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart){		//create snake === Snakey
	context.fillStyle = snakeBg;
	context.strokeStyle = snakeBorderBg;

	context.fillRect(snakePart.x, snakePart.y, 10, 10);
	context.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function changeDirection(event){		//Change Snakey's direction.
	const keyPressed = event.keyCode;
	const goingUp = dy === -10;
	const goingDown = dy === 10;
	const goingRight = dx === 10;
	const goingLeft = dx === -10;

	if(changingDirection) return;
	changingDirection = true;

	if(keyPressed === lKey && !goingRight){
		dx = -10;
		dy = 0;
	}

	if(keyPressed === uKey && !goingDown){
		dx = 0;
		dy = -10;
	}

	if(keyPressed === rKey && !goingLeft){
		dx = 10;
		dy = 0;
	}

	if(keyPressed === dKey && !goingUp){
		dx = 0;
		dy = 10;
	}
}

function advanceSnake(){				//Go Snakey Go!
	const head = {x: snake[0].x + dx, y: snake[0].y + dy};

	snake.unshift(head);

	const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
	if(didEatFood){
		document.getElementById('score').innerHTML = (score+=10);
		createFood();
	}
	else snake.pop();
}

function randomTen (min, max){			//Ugh.. Food is all random. Sankey will loose its weight searching. for it.
	return Math.round( (Math.random() * (max-min) + min)/10)*10;
}

function createFood(){					//Snakey is hungry. Very hungry.
	foodX = randomTen(0, gameCanvas.width - 10);
	foodY = randomTen(0, gameCanvas.height - 10);

	snake.forEach(function isFoodOnSnake(part){
		const foodIsOnSnake = part.x == foodX && part.y == foodY;
		if(foodIsOnSnake) createFood();
	})
	//speed = speed -5;
}

function drawFood(){					//Snakey's hunger knows no bounds.
	context.fillStyle = foodBg;
	context.strokeStyle = foodBorderBg;

	context.beginPath();
	context.arc(foodX+5, foodY+5, 5, 0, 2*Math.PI);
	context.stroke();
	context.fill();
}

function didGameEnd(){
	for(let i = 4; i < snake.length; i++){
		const didCollide = snake[i].x === snake[0].x && snake[i].y == snake[0].y;

		if(didCollide) return true;
	}

	const hitLeftWall = snake[0].x < 0;
	const hitRightWall = snake[0].x > gameCanvas.width - 10;
	const hitTopWall = snake[0].y < 0;
	const hitBottomWall = snake[0].y > gameCanvas.height - 10;

	return hitRightWall || hitLeftWall || hitBottomWall || hitTopWall;
}
