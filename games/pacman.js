const player = "p";
const walltop = "t";
const wallside = "s";
const dot = "d";
const ghost = "A";
const empty = "e";

setLegend(
  [player, bitmap`
0000000000000000
0000000000000000
0000066666600000
0006666666666000
0006666666666000
0066666666660000
0066666666600000
0066666660000000
0066666600000000
0066666666000000
0066666666660000
0006666666666000
0006666666666000
0000066666600000
0000000000000000
0000000000000000`],
  [walltop, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
5555555555555555
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
5555555555555555
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
  [wallside, bitmap`
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000
0000500000500000`],
  [dot, bitmap`
................
................
................
................
................
................
......666.......
......666.......
......666.......
................
................
................
................
................
................
................`],
  [ghost, bitmap`
0000000000000000
0000003333300000
0000333333330000
0003333333333000
0003333333333300
0035522355223300
0035522355223300
0032223322233300
0033333333333300
0033333333333300
0033333333333300
0033333333333300
0033333333333300
0033033330003300
0030000330000300
0000000000000000`],
  [empty, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`]
);

setSolids([player, walltop, wallside, ghost]);

let level = 0;
const levels = [
  map`
sttttttttttttts
speeeeeeeeeeees
seeeettttteeees
seeeeeeeeeteees
seeeettttteeees
seetteeeeeeeees
seeeeeeeeeeeees
sttttttttttttts`
];

setMap(levels[level]);

// Add dots to every tile that's not a wall, ghost, or player
for (let y = 0; y < height(); y++) {
  for (let x = 0; x < width(); x++) {
    const tileContent = getTile(x, y);
    if (!tileContent.some(tile => tile === walltop || tile === wallside || tile === player || tile === ghost)) {
      addSprite(x, y, dot);
    }
  }
}

setPushables({
  [player]: []
});

onInput("w", () => {
  const p = getFirst(player);
  p.y -= 1;
  checkCollision();
});

onInput("a", () => {
  const p = getFirst(player);
  p.x -= 1;
  checkCollision();
});

onInput("s", () => {
  const p = getFirst(player);
  p.y += 1;
  checkCollision();
});

onInput("d", () => {
  const p = getFirst(player);
  p.x += 1;
  checkCollision();
});

let score = 0;
let lives = 3;

function checkCollision() {
  const playerPos = getFirst(player);
  const tileContent = getTile(playerPos.x, playerPos.y);

  if (tileContent.some(tile => tile === dot)) {
    score += 1;
    clearTile(playerPos.x, playerPos.y);
    setTitle("");
  }
  if (tileContent.some(tile => tile === ghost)) {
    lives--;
    if (lives <= 0) {
      addText("Game Over!", { y: 4, color: color`3` });
      score = 0;
      lives = 3;
      setMap(levels[level]);
    }
  }
}

function moveGhosts() {
  const ghosts = getAll(ghost);
  ghosts.forEach(g => {
    let direction = Math.floor(Math.random() * 4);
    let newX = g.x;
    let newY = g.y;

    switch (direction) {
      case 0: newY -= 1; break;  // Move up
      case 1: newX += 1; break;  // Move right
      case 2: newY += 1; break;  // Move down
      case 3: newX -= 1; break;  // Move left
    }

    // Check if the new position is a wall or out of bounds
    if (!getTile(newX, newY).some(tile => tile === walltop || tile === wallside)) {
      g.x = newX;
      g.y = newY;
    }
  });
}

afterInput(() => {
  moveGhosts();
  addSprite(0, 0, empty);
});
