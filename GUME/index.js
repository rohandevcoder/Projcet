// config

const canvasX = 700;
const canvasY = 700;

const heroSpeed = 5;
const heroSize = 20;
const heroColor = "yellow";
const heroHealth = 200;

const enemySpeed = 2;
const enemySize = 20;
const enemyColor = "blue";
const enemyHealth = 10;
const enemyDirSpeed = 0.98;
const numberofEnemyTime = 6;
const enemyBulletFiringRate = 0.5;
const enemyBulletDamge = 2;

const bulletColor = "red";
const bulletSize = 20;
const bulletSpeed = 3;
const bulletDamge = 2;

//--------State
let score = 0;
const hero = {
  x: 200,
  y: 200,
  d: "up",
  size: heroSize,
  health: heroHealth,
};

const enemyArray = [];

const bulletArray = [];

const canvas = document.getElementById("canvas");
const playBoxEle = document.getElementById("play_box");
const playBtnEle = document.getElementById("play");
const music = document.getElementById("background_music");
let interval;
playBoxEle.addEventListener("click", () => {
  interval = setInterval(function () {
    // Game Logic
    enemySpwaner();
    enemyMover();
    enemyBulletFire();
    bulletMover();
    heroBulletHit();
    enemyBulletHit();
    scoreUpdater();
    removeBullet();
    bulletTobulletHit();
    enemyRemover();
    isGameOver();

    // Renderer
    ctx.clearRect(0, 0, canvasX, canvasY);
    drawBullet();
    drawEnemy();
    drawChar(hero.x, hero.y, hero.d, hero.size, heroColor);
  }, 20);
  playBoxEle.style.display = "none";
  music.play();
});
const scoreEle = document.getElementById("score");
canvas.height = canvasY;
canvas.width = canvasX;
const ctx = canvas.getContext("2d");

scoreEle.innerText = "score:0";

function enemyMover() {
  let i = 0;
  while (i < enemyArray.length) {
    const rand = Math.random();
    if (enemyArray[i].d === "up") {
      enemyArray[i].y -= rand * enemySpeed;
    } else if (enemyArray[i].d === "down") {
      enemyArray[i].y += rand * enemySpeed;
    } else if (enemyArray[i].d === "left") {
      enemyArray[i].x -= rand * enemySpeed;
    } else if (enemyArray[i].d === "right") {
      enemyArray[i].x += rand * enemySpeed;
    }
    //choose change direction or not
    const rand2 = Math.random();

    if (rand2 > enemyDirSpeed) {
      const rand1 = Math.random();
      // change direction
      if (rand1 < 0.25) {
        enemyArray[i].d = "up";
      } else if (rand1 < 0.5) {
        enemyArray[i].d = "down";
      } else if (rand1 < 0.75) {
        enemyArray[i].d = "left";
      } else {
        enemyArray[i].d = "right";
      }
    }
    i++;
  }
}

function heroBulletHit() {
  let i = 0;
  while (i < bulletArray.length) {
    if (bulletArray[i].owner == "enemy") {
      i++;
      continue;
    }
    let j = 0;
    while (j < enemyArray.length) {
      if (
        Math.abs(enemyArray[j].x - bulletArray[i].x) <
          enemyArray[j].size * 1.5 + bulletArray[i].size / 2 &&
        Math.abs(enemyArray[j].y - bulletArray[i].y) <
          enemyArray[j].size * 1.5 + bulletArray[i].size / 2
      ) {
        bulletArray[i].hitted = true;
        enemyArray[j].health =
          enemyArray[j].health - bulletArray[i].damage;
        if (enemyArray[j].health <= 0) {
          enemyArray[j].death = true;
        }
      }
      j++;
    }
    i++;
  }
}

function enemyBulletHit() {
  let i = 0;
  while (i < bulletArray.length) {
    if (bulletArray[i].owner == "hero") {
      i++;
      continue;
    }
    if (
      Math.abs(hero.x - bulletArray[i].x) <
        hero.size * 1.5 + bulletArray[i].size / 2 &&
      Math.abs(hero.y - bulletArray[i].y) <
        hero.size * 1.5 + bulletArray[i].size / 2
    ) {
      bulletArray[i].hitted = true;
      hero.health = hero.health - bulletArray[i].damge;
      if (hero.health <= 0) {
        hero.death = true;
      }
    }
    i++;
  }
}

function enemyBulletFire() {
  let i = 0;
  while (i < enemyArray.length) {
    const d = Math.random();
    if (d > enemyBulletFiringRate) {
      bulletArray.push({
        x: enemyArray[i].x,
        y: enemyArray[i].y,
        d: enemyArray[i].d,
        size: enemyArray[i].size,
        damge: enemyBulletDamge,
        owner: "enemy",
      });
    }
    i++;
  }
}

function enemySpwaner() {
  if (enemyArray.length < numberofEnemyTime) {
    enemyArray.push({
      x: Math.random() * canvasX,
      y: Math.random() * canvasY,
      d: "up",
      size: enemySize,
      health: enemyHealth,
    });
  }
}
//------------------------------drawing----------------------------
function drawChar(x, y, d, size, color) {
  ctx.beginPath();
  ctx.fillStyle = color;
  if (d === "up") {
    ctx.rect(x - size / 2, y - (3 * size) / 2, size, size);
    ctx.rect(x - (3 * size) / 2, y - size / 2, size, size);
    ctx.rect(x - size / 2, y - size / 2, size, size);
    ctx.rect(x + size / 2, y - size / 2, size, size);
    ctx.rect(x - (3 * size) / 2, y + size / 2, size, size);
    ctx.rect(x + size / 2, y + size / 2, size, size);
  } else if (d === "down") {
    ctx.rect(x - (3 * size) / 2, y - (3 * size) / 2, size, size);
    ctx.rect(x + size / 2, y - (3 * size) / 2, size, size);
    ctx.rect(x - (3 * size) / 2, y - size / 2, size, size);
    ctx.rect(x - size / 2, y - size / 2, size, size);
    ctx.rect(x + size / 2, y - size / 2, size, size);
    ctx.rect(x - size / 2, y + size / 2, size, size);
  } else if (d === "left") {
    ctx.rect(x - (3 * size) / 2, y - size / 2, size, size);
    ctx.rect(x - size / 2, y + size / 2, size, size);
    ctx.rect(x - size / 2, y - size / 2, size, size);
    ctx.rect(x - size / 2, y - (3 * size) / 2, size, size);
    ctx.rect(x + size / 2, y + size / 2, size, size);
    ctx.rect(x + size / 2, y - (3 * size) / 2, size, size);
  } else if (d === "right") {
    ctx.rect(x - (3 * size) / 2, y - (3 * size) / 2, size, size);
    ctx.rect(x - (3 * size) / 2, y + size / 2, size, size);
    ctx.rect(x - size / 2, y + size / 2, size, size);
    ctx.rect(x - size / 2, y - size / 2, size, size);
    ctx.rect(x - size / 2, y - (3 * size) / 2, size, size);
    ctx.rect(x + size / 2, y - size / 2, size, size);
  }
  ctx.fill();
  ctx.stroke();
}

function drawEnemy() {
  let i = 0;
  while (i < enemyArray.length) {
    drawChar(
      enemyArray[i].x,
      enemyArray[i].y,
      enemyArray[i].d,
      enemyArray[i].size,
      enemyColor
    );
    i++;
  }
  console.log(enemyArray);
}

//----------------------drawing--------------

function enemyRemover() {
  let i = 0;
  while (i < enemyArray.length) {
    if (
      enemyArray[i].x < 0 ||
      enemyArray[i].y > canvasX ||
      enemyArray[i].y < 0 ||
      enemyArray[i].x > canvasY ||
      enemyArray[i].death
    ) {
      enemyArray.splice(i, 1);
    }
    i++;
  }
}
//--------------------bullet---------------------------------
function drawBullet() {
  let i = 0;
  while (i < bulletArray.length) {
    ctx.beginPath();
    ctx.fillStyle = bulletColor;
    ctx.rect(
      bulletArray[i].x - bulletSize / 2,
      bulletArray[i].y - bulletSize / 2,
      bulletSize,
      bulletSize
    );
    ctx.fill();
    i++;
  }
}

function bulletMover() {
  let i = 0;
  while (i < bulletArray.length) {
    if (bulletArray[i].d === "up") {
      bulletArray[i].y = bulletArray[i].y - bulletSpeed;
    } else if (bulletArray[i].d === "down") {
      bulletArray[i].y = bulletArray[i].y + bulletSpeed;
    } else if (bulletArray[i].d === "left") {
      bulletArray[i].x = bulletArray[i].x - bulletSpeed;
    } else if (bulletArray[i].d === "right") {
      bulletArray[i].x = bulletArray[i].x + bulletSpeed;
    }
    i++;
  }
}

function removeBullet() {
  let i = 0;
  while (i < bulletArray.length) {
    if (
      bulletArray[i].x < 0 ||
      bulletArray[i].y < 0 ||
      bulletArray[i].y > canvasX ||
      bulletArray[i].x > canvasY ||
      bulletArray[i].hitted
    ) {
      bulletArray.splice(i, 1);
    }
    i++;
  }
}

function bulletTobulletHit() {
  let i = 0;
  while (i < bulletArray.length) {
    let j = i;
    while (j < bulletArray.length) {
      if (bulletArray[i].owner != bulletArray[j].owner) {
        if (
          Math.abs(bulletArray[i].x - bulletArray[j].x) <
            bulletArray[i].size / 2 + bulletArray[j].size / 2 &&
          Math.abs(bulletArray[i].y - bulletArray[j].y) <
            bulletArray[i].size / 2 + bulletArray[j].size / 2
        ) {
          if (bulletArray[i].damage < bulletArray[j].damage) {
            bulletArray[j].damage =
              bulletArray[j].damage - bulletArray[i].damage;
            bulletArray[i].damage = 0;
            bulletArray[i].hitted = true;
          } else if (bulletArray[i].damage > bulletArray[j].damage) {
            bulletArray[i].damage =
              bulletArray[i].damage - bulletArray[j].damage;
            bulletArray[j].damage = 0;
            bulletArray[j].hitted = true;
          } else {
            //equal

            bulletArray[i].damage = 0;
            bulletArray[j].damage = 0;
            bulletArray[i].hitted = true;
            bulletArray[j].hitted = true;
          }
        }
      }
      j++;
    }
    i++;
  }
}
//---------------------bullet-------------------
// let lastPressed = 0;
// const throttle = (fn, delay, ...arg) => {
//   if (Date.now() - lastPressed > delay) {
//     lastPress = Date.now();
//     fn(...arg);
//   }
// };

window.addEventListener("keydown", function (e) {
  if (hero.y < 35) {
    hero.y = 35;
  } else if (hero.x > canvasX - 35) {
    hero.x = canvasY - 35;
  } else if (hero.x < 35) {
    hero.x = 35;
  } else if (hero.y > canvasY - 35) {
    hero.y = canvasX - 35;
  }
  //----------------------------------
  if (e.code === "KeyW") {
    hero.y = hero.y - heroSpeed;
  } else if (e.code === "KeyA") {
    hero.x -= heroSpeed;
  } else if (e.code === "KeyD") {
    hero.x += heroSpeed;
  } else if (e.code === "KeyS") {
    hero.y += heroSpeed;
  }
  if (e.code === "ArrowUp") {
    hero.d = "up";
  } else if (e.code === "ArrowLeft") {
    hero.d = "left";
  } else if (e.code === "ArrowRight") {
    hero.d = "right";
  } else if (e.code === "ArrowDown") {
    hero.d = "down";
  }

  if (e.code === "Space") {
    const audio_bullet_hit = new Audio("./bullet hit.mp3");
    audio_bullet_hit.play();

    bulletArray.push({
      x: hero.x,
      y: hero.y,
      d: hero.d,
      size: bulletSize,
      damge: bulletDamge,
      owner: "hero",
    });
    console.log(bulletArray);
  }
});

function isGameOver() {
  if (hero.health <= 0) {
    console.log("game over");
    clearInterval(interval);
    music.pause();
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  }
}

function scoreUpdater() {
  let i = 0;
  // bullet hit score update
  while (i < bulletArray.length) {
    if (bulletArray[i].owner === "hero" && bulletArray[i].hitted) {
      score += 5;
    }
    i++;
  }
  i = 0;
  // enemy death score update
  while (i < enemyArray.length) {
    if (enemyArray[i].death) {
      score += 10;
    }
    i++;
  }
  const hScoreStr = localStorage.getItem("high_score");
  scoreEle.innerHTML = `<span>Health${
    hero.health
  } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Score: ${score} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Highest Score:${
    hScoreStr || 0
  } </span>`;
  //save high score to local storage

  const hScore = hScoreStr * 1;
  if (!isNaN(hScore) && hScore < score) {
    localStorage.setItem("high_score", score);
  }
  // console.log(hScoreStr);
}