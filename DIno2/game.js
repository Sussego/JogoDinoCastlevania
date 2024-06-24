const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ambientSound = new Audio('sound/music.mp3');
const failSound = new Audio('sound/fail.mp3');
const scoreElement = document.getElementById('score');

// Variáveis do jogo
let dino = {
    x: 50,
    y: 150,
    width: 20,
    height: 40,
    dy: 0,
    jumpStrength: 10,
    gravity: 0.5,
    grounded: false,
    sprite: new Image()
};
dino.sprite.src = 'images/dino.gif'; // Adicione a imagem do dinossauro

let obstacles = [];
let gameSpeed = 5;
let score = 0;
let isJumping = false;
let jumpTimer = 0;
let gameOver = false;
const maxJumpTimer = 20; // Limite para o tempo de salto

const obstacleSprite = new Image();
obstacleSprite.src = 'images/obstacle.png'; // Caminho para a imagem do obstáculo

// Fundo parallax
const backgroundLayers = [
    { img: new Image(), x: 0, speed: 0 }, // Camada estática
    { img: new Image(), x: 0, speed: 0.5 },
    { img: new Image(), x: 0, speed: 1 },
    { img: new Image(), x: 0, speed: 1.5 },
    { img: new Image(), x: 0, speed: 2 },
    { img: new Image(), x: 0, speed: 2.5 }
];
backgroundLayers[0].img.src = 'images/background_layer0.png';
backgroundLayers[1].img.src = 'images/background_layer1.png';
backgroundLayers[2].img.src = 'images/background_layer2.png';
backgroundLayers[3].img.src = 'images/background_layer3.png';
backgroundLayers[4].img.src = 'images/background_layer4.png';
backgroundLayers[5].img.src = 'images/background_layer5.png';

// Imagem do chão
const groundImage = new Image();
groundImage.src = 'images/ground.png';

// Posição inicial do chão
let groundX = 0;

// Função para desenhar o dinossauro
function drawDino() {
    ctx.drawImage(dino.sprite, dino.x, dino.y, dino.width, dino.height);
}

// Função para desenhar o chão
function drawGround() {
    ctx.drawImage(groundImage, groundX, canvas.height - 50, canvas.width, 50);
    ctx.drawImage(groundImage, groundX + canvas.width, canvas.height - 50, canvas.width, 50);
}

// Função para desenhar o fundo parallax
function drawBackground() {
    backgroundLayers.forEach(layer => {
        layer.x -= layer.speed;
        if (layer.x <= -canvas.width) {
            layer.x = 0;
        }
        ctx.drawImage(layer.img, layer.x, 0, canvas.width, canvas.height);
        ctx.drawImage(layer.img, layer.x + canvas.width, 0, canvas.width, canvas.height);
    });
}

// Função para desenhar obstáculos
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleSprite, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

// Função para atualizar obstáculos
function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - randomIntFromRange(300, 600)) {
        let obstacle = {
            x: canvas.width,
            y: canvas.height - 50, // Altura fixa para todos os obstáculos
            width: 20,
            height: 38
        };
        obstacles.push(obstacle);
    }

    if (obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
        score++;
        scoreElement.textContent = `Score: ${score}`;
    }
}

// Função para detectar colisão
function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            // Colisão detectada
            gameOver = true;
            ambientSound.pause();
            failSound.currentTime = 0; // Reinicia o som
            failSound.play();
            alert('Game Over! Score: ' + score);
            document.location.reload();
        }
    });
}

// Função para atualizar o dinossauro
function updateDino() {
    if (isJumping && !gameOver && dino.grounded) {
        dino.dy = -dino.jumpStrength;
        dino.grounded = false;
    }

    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > canvas.height - 10) {
        dino.y = canvas.height - 10 - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    }
}

document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && dino.grounded && !gameOver) {
        isJumping = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        isJumping = false;
    }
});

// Função para desenhar o jogo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawGround();
    drawDino();
    drawObstacles();
}

// Função para atualizar o jogo
function update() {
    if (!gameOver) {
        updateDino();
        updateObstacles();
        detectCollision();
        updateGround();
    }
}

// Função para atualizar a posição do chão
function updateGround() {
    groundX -= gameSpeed;
    if (groundX <= -canvas.width) {
        groundX = 0;
    }
}

// Função principal do jogo
function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

// Iniciar o loop do jogo
gameLoop();

// Função para gerar número aleatório dentro de um intervalo
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
