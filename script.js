const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

const pontosTexto = document.getElementById("pontos");
const vidasTexto = document.getElementById("vidas");

let pontos = 0;
let vidas = 3;

const ovelha = {
    x: 100,
    y: 250,
    tamanho: 35,
    velocidade: 5
};

let teclas = {};

let maca = {
    x: 600,
    y: 200,
    tamanho: 20
};

let obstaculos = [
    { x: 300, y: 100, tamanho: 50 },
    { x: 500, y: 350, tamanho: 60 },
    { x: 700, y: 120, tamanho: 45 }
];

document.addEventListener("keydown", function(event) {
    teclas[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(event) {
    teclas[event.key.toLowerCase()] = false;
});

function desenharOvelha() {
    // Corpo
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ovelha.x, ovelha.y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Cabeça
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(
        ovelha.x + 25,
        ovelha.y - 5,
        15,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Olho
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(
        ovelha.x + 30,
        ovelha.y - 10,
        4,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Pernas
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(ovelha.x - 15, ovelha.y + 18);
    ctx.lineTo(ovelha.x - 15, ovelha.y + 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(ovelha.x + 5, ovelha.y + 18);
    ctx.lineTo(ovelha.x + 5, ovelha.y + 35);
    ctx.stroke();
}

function desenharMaca() {
    // Maçã
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(
        maca.x,
        maca.y,
        maca.tamanho,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Folha
    ctx.fillStyle = "green";
    ctx.fillRect(
        maca.x + 8,
        maca.y - 20,
        12,
        6
    );
}

function desenharObstaculos() {
    obstaculos.forEach(obstaculo => {
        ctx.fillStyle = "#8b4513";

        ctx.beginPath();
        ctx.arc(
            obstaculo.x,
            obstaculo.y,
            obstaculo.tamanho,
            0,
            Math.PI * 2
        );

        ctx.fill();

        // Folhas
        ctx.fillStyle = "green";

        ctx.beginPath();
        ctx.arc(
            obstaculo.x - 20,
            obstaculo.y - obstaculo.tamanho + 10,
            20,
            0,
            Math.PI * 2
        );
        ctx.fill();

        ctx.beginPath();
        ctx.arc(
            obstaculo.x + 20,
            obstaculo.y - obstaculo.tamanho + 5,
            20,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
}

function movimentarOvelha() {

    if (teclas["arrowup"] || teclas["w"]) {
        ovelha.y -= ovelha.velocidade;
    }

    if (teclas["arrowdown"] || teclas["s"]) {
        ovelha.y += ovelha.velocidade;
    }

    if (teclas["arrowleft"] || teclas["a"]) {
        ovelha.x -= ovelha.velocidade;
    }

    if (teclas["arrowright"] || teclas["d"]) {
        ovelha.x += ovelha.velocidade;
    }

    // Limites da tela
    ovelha.x = Math.max(40, Math.min(canvas.width - 40, ovelha.x));
    ovelha.y = Math.max(40, Math.min(canvas.height - 40, ovelha.y));
}

function distancia(x1, y1, x2, y2) {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
    );
}

function verificarMaca() {

    const d = distancia(
        ovelha.x,
        ovelha.y,
        maca.x,
        maca.y
    );

    if (d < 45) {

        pontos += 10;

        pontosTexto.textContent = pontos;

        // Nova posição da maçã
        maca.x = Math.random() * (canvas.width - 80) + 40;
        maca.y = Math.random() * (canvas.height - 80) + 40;
    }
}

function verificarObstaculos() {

    obstaculos.forEach(obstaculo => {

        const d = distancia(
            ovelha.x,
            ovelha.y,
            obstaculo.x,
            obstaculo.y
        );

        if (d < obstaculo.tamanho + 25) {

            vidas--;

            vidasTexto.textContent = vidas;

            // Volta para o início
            ovelha.x = 100;
            ovelha.y = 250;

            if (vidas <= 0) {
                alert("🐑 Game Over!\nPontuação: " + pontos);

                reiniciarJogo();
            }
        }
    });
}

function desenharCampo() {

    ctx.fillStyle = "#6fcf55";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Algumas flores
    for (let i = 0; i < 20; i++) {

        let x = (i * 137) % canvas.width;
        let y = (i * 83) % canvas.height;

        ctx.fillStyle = "yellow";

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function atualizar() {

    movimentarOvelha();

    verificarMaca();

    verificarObstaculos();
}

function desenhar() {

    desenharCampo();
    desenharObstaculos();
    desenharMaca();
    desenharOvelha();
}

function loop() {

    atualizar();
    desenhar();

    requestAnimationFrame(loop);
}

function reiniciarJogo() {

    pontos = 0;
    vidas = 3;

    pontosTexto.textContent = pontos;
    vidasTexto.textContent = vidas;

    ovelha.x = 100;
    ovelha.y = 250;

    maca.x = 600;
    maca.y = 200;
}

loop();