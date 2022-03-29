import React, { useEffect } from "react";
import { DEFAULT_MATRIX as map } from "../constants";

import * as boundariesImg from "../images/box/index.js";

function manhattanDist(x, y) {
  let dist = Math.abs(x) + Math.abs(y);
  return dist;
}

// get all possible next moves
function getAdjacences(point, player) {
  const playerX = Math.floor(player.position.x / 40);
  const playerY = Math.floor(player.position.y / 40);

  const { x, y } = point;
  if (typeof point !== "undefined") {
    let adj = [
      {
        x,
        y: y - 1,
      },
      {
        x,
        y: y + 1,
      },
      {
        x: x - 1,
        y,
      },
      {
        x: x + 1,
        y,
      },
    ];

    adj = adj.map((e) => {
      const distancePlayerX = playerX - e.x;
      const distancePlayerY = playerY - e.y;
      return {
        ...e,
        distance: manhattanDist(distancePlayerX, distancePlayerY),
      };
    });

    adj = adj.filter(
      (value) =>
        value.x >= 0 &&
        value.x < map[0].length - 1 &&
        value.y < map.length - 1 &&
        value.y >= 0 &&
        map[value.y] &&
        typeof map[value.y][value.x] === "number" &&
        map[value.y][value.x] === 0
    );

    return adj;
  } else {
    return [];
  }
}

function notInMap(y, x) {
  return !(map[y] && typeof map[y][x] === "number" && map[y][x] === 0);
}

// get shortest road
const getShortestRoad = (ghost, player, ghosts) => {
  let entity = {
    x: Math.floor(ghost.position.x / 40),
    y: Math.floor(ghost.position.y / 40),
    visited: ghost.visited,
    updateVisited: ghost.updateVisited,
  };

  ghost.updateVisited({ x: entity.x, y: entity.y });

  //  FOR APPROVE THAT
  // CHECK NB OF CASE TO GO FOR CIBLE
  let nearestCases = getAdjacences(entity, player).filter(
    (e) => !entity.visited.find((o) => o.x === e.x && o.y === e.y)
  );

  if (!nearestCases.length) {
    ghost.clearVisited();
  }

  // console.log("nearest cases... ", nearestCases);

  const bestdistance = Math.min(...nearestCases.map((o) => o.distance));

  const findBestCase = nearestCases.find((e) => e.distance === bestdistance);

  // const anotherGhost = ghosts.find(
  //   (e) =>
  //     e.id !== entity.id && e.x === findBestCase.x && e.y === findBestCase.y
  // );

  if (nearestCases.length > 0) {
    return { x: findBestCase.x, y: findBestCase.y };
  } else {
    return null;
  }
};

function draw_pacman(ctx, radius, mouth) {
  const angle = 0.2 * Math.PI * mouth;
  ctx.save();
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius, angle, 2 * Math.PI - angle);
  ctx.lineTo(0, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function draw_ghost(ctx, radius, options) {
  options = options || {};
  let feet = options.feet || 4;
  let head_radius = radius * 0.8;
  let foot_radius = head_radius / feet;
  ctx.save();
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "red";
  ctx.lineWidth = options.lineWidth || radius * 0.05;
  ctx.beginPath();
  for (let foot = 0; foot < feet; foot++) {
    ctx.arc(
      2 * foot_radius * (feet - foot) - head_radius - foot_radius,
      radius - foot_radius,
      foot_radius,
      0,
      Math.PI
    );
  }
  ctx.lineTo(-head_radius, radius - foot_radius);
  ctx.arc(0, head_radius - radius, head_radius, Math.PI, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(
    -head_radius / 2.5,
    -head_radius / 2,
    head_radius / 3,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(head_radius / 3.5, -head_radius / 2, head_radius / 3, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(
    -head_radius / 2,
    -head_radius / 2.2,
    head_radius / 8,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.beginPath();
  ctx.arc(head_radius / 4, -head_radius / 2.2, head_radius / 8, 0, 2 * Math.PI);
  ctx.fill();

  ctx.restore();
}

const Canvas = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    class Player {
      constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.score = 0;
        this.mouth = 0;
        this.time = 0;
        this.angle = 0;
      }
      draw() {
        // ctx.beginPath();
        // ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        // ctx.fillStyle = "yellow";
        // ctx.fill();
        // ctx.closePath();
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        draw_pacman(ctx, this.radius, this.mouth);
        ctx.restore();
      }

      update(elapsed) {
        if (elapsed && (this.velocity.x !== 0 || this.velocity.y !== 0)) {
          this.time = elapsed;
        } else {
          this.time = 0;
        }
        let newAngle = 0;
        if (this.velocity.x < 0) {
          newAngle = Math.PI;
        } else if (this.velocity.y > 0) {
          newAngle = 0.5 * Math.PI;
        } else if (this.velocity.y < 0) {
          newAngle = 1.5 * Math.PI;
        }
        this.angle = newAngle;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));

        this.draw();
      }
      updateScore() {
        this.score += 10;
      }
    }

    class Boundary {
      static width = 40;
      static height = 40;

      constructor(position, image) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
      }
      draw() {
        // ctx.beginPath();
        // ctx.fillStyle = "#4040BF";
        // ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        // ctx.closePath();
        ctx.drawImage(this.image, this.position.x, this.position.y);
      }
    }

    class Coin {
      constructor(position) {
        this.position = position;
        this.height = 10;
        this.width = 10;
        this.radius = 5;
      }

      draw() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
      }
    }

    const player = new Player(
      {
        x: (Boundary.width * 9) / 2,
        y: (Boundary.height * 9) / 2,
      },
      { x: 0, y: 0 }
    );

    class Ghost {
      constructor(position, velocity) {
        this.position = position;
        this.radius = 15;
        this.visited = [];
        this.nextCase = null;
        this.color = "red";
      }
      draw() {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        draw_ghost(ctx, this.radius, {
          fill: this.color,
        });
        ctx.restore();
      }

      updateVisited(newPos) {
        this.visited.push({ x: newPos.x, y: newPos.y });
      }
      clearVisited() {
        this.visited = [];
      }

      updateTest(res) {
        this.nextCase = res;
      }
      update() {
        this.draw();
      }
    }

    canvas.width = 800;
    canvas.height = 600;

    let keyPress;

    let lastKeyPress;

    addEventListener("keydown", ({ key }) => {
      if (keyPress) lastKeyPress = keyPress;
      switch (key) {
        case "ArrowUp":
          keyPress = "U";
          break;
        case "ArrowRight":
          keyPress = "R";
          break;
        case "ArrowLeft":
          keyPress = "L";
          break;
        case "ArrowDown":
          keyPress = "D";
          break;
      }
    });

    const boundaries = [];
    const coins = [];
    const ghosts = Array.from(
      { length: 1 },
      () =>
        new Ghost(
          {
            x: Boundary.width * 3 - 40 / 2,
            y: Boundary.height * 3 - 40 / 2,
          },
          { x: 0, y: 0 }
        )
    );

    const topIsBlock = (y, x) => {
      if (!map[y - 1]) {
        return false;
      }
      return map[y - 1][x] === 1;
    };
    const bottomIsBlock = (y, x) => {
      if (!map[y + 1]) {
        return false;
      }
      return map[y + 1][x] === 1;
    };
    const leftIsBlock = (y, x) => {
      if (typeof map[y][x - 1] === "undefined") {
        return false;
      }
      return map[y][x - 1] === 1;
    };
    const rightIsBlock = (y, x) => {
      if (typeof map[y][x + 1] === "undefined") {
        return false;
      }
      return map[y][x + 1] === 1;
    };

    map.forEach((row, y) =>
      row.forEach((elem, x) => {
        if (elem === 1) {
          // boundary who dont have neighbor
          let image = new Image();
          if (
            topIsBlock(y, x) &&
            !leftIsBlock(y, x) &&
            !rightIsBlock(y, x) &&
            !bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.capBottom;
          } else if (
            !topIsBlock(y, x) &&
            !leftIsBlock(y, x) &&
            !rightIsBlock(y, x) &&
            bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.capTop;
          } else if (
            !topIsBlock(y, x) &&
            leftIsBlock(y, x) &&
            !rightIsBlock(y, x) &&
            !bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.capRight;
          } else if (
            !topIsBlock(y, x) &&
            !leftIsBlock(y, x) &&
            rightIsBlock(y, x) &&
            !bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.capLeft;
          } else if (
            topIsBlock(y, x) &&
            leftIsBlock(y, x) &&
            !rightIsBlock(y, x) &&
            !bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeCorner3;
          } else if (
            topIsBlock(y, x) &&
            !leftIsBlock(y, x) &&
            rightIsBlock(y, x) &&
            !bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeCorner4;
          } else if (
            !topIsBlock(y, x) &&
            !leftIsBlock(y, x) &&
            rightIsBlock(y, x) &&
            bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeCorner1;
          } else if (
            !topIsBlock(y, x) &&
            leftIsBlock(y, x) &&
            !rightIsBlock(y, x) &&
            bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeCorner2;
          } else if (
            topIsBlock(y, x) &&
            !leftIsBlock(y, x) &&
            !rightIsBlock(y, x) &&
            bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeVertical;
          } else if (
            !topIsBlock(y, x) &&
            leftIsBlock(y, x) &&
            rightIsBlock(y, x) &&
            !bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeHorizontal;
          } else if (
            topIsBlock(y, x) &&
            leftIsBlock(y, x) &&
            rightIsBlock(y, x) &&
            !bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeConnectorTop;
          } else if (
            !topIsBlock(y, x) &&
            leftIsBlock(y, x) &&
            rightIsBlock(y, x) &&
            bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeConnectorBottom;
          } else if (
            topIsBlock(y, x) &&
            !leftIsBlock(y, x) &&
            rightIsBlock(y, x) &&
            bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeConnectorRight;
          } else if (
            topIsBlock(y, x) &&
            leftIsBlock(y, x) &&
            !rightIsBlock(y, x) &&
            bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeConnectorLeft;
          } else if (
            topIsBlock(y, x) &&
            leftIsBlock(y, x) &&
            rightIsBlock(y, x) &&
            bottomIsBlock(y, x)
          ) {
            image.src = boundariesImg.pipeCross;
          } else {
            image.src = boundariesImg.block;
          }

          boundaries.push(
            new Boundary(
              {
                x: Boundary.width * x,
                y: Boundary.height * y,
              },
              image
            )
          );
        }

        if (elem === 0) {
          coins.push(
            new Coin({
              x: x * Boundary.width + Boundary.width / 2,
              y: y * Boundary.height + Boundary.height / 2,
            })
          );
        }
      })
    );

    const circleCollidesWithEntity = (circle, entity) => {
      return (
        circle.position.y - circle.radius + circle.velocity.y <=
          entity.position.y + entity.height &&
        circle.position.x + circle.radius + circle.velocity.x >=
          entity.position.x &&
        circle.position.y + circle.radius + circle.velocity.y >=
          entity.position.y &&
        circle.position.x - circle.radius + circle.velocity.x <=
          entity.position.x + entity.width
      );
    };

    let previous,
      elapsed,
      animationId,
      playerLifes = 3;

    function animationLoop(timestamp) {
      // if (gameOver) return
      if (!previous) previous = timestamp;

      elapsed = timestamp - previous;

      animationId = requestAnimationFrame(animationLoop);

      ctx.beginPath();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw map
      boundaries.forEach((boundary) => {
        boundary.draw();
      });

      const scoreElem = document.getElementById("score");
      coins.forEach((coin, index) => {
        coin.draw();
        if (
          circleCollidesWithEntity(
            { ...player, radius: player.radius - 5 },
            coin
          )
        ) {
          coins.splice(index, 1);
          player.updateScore();
          scoreElem.innerText = player.score;
        }
      });

      player.update(elapsed / 1000);

      ghosts.forEach((ghost) => {
        ghost.update();

        if (
          Math.hypot(
            ghost.position.x - player.position.x,
            ghost.position.y - player.position.y
          ) <
          ghost.radius + player.radius
        ) {
          playerLifes -= 1;
          cancelAnimationFrame(animationId);
        }
        if (!ghost.nextCase) {
          const res = getShortestRoad(ghost, player);
          if (res) {
            ghost.updateTest(res);
          }
        } else {
          if (ghost.nextCase) {
            const newRes = {
              x: Math.floor(ghost.nextCase.x * 40) + 20,
              y: Math.floor(ghost.nextCase.y * 40) + 20,
            };
            const ghostSpeed = 1;
            if (
              ghost.position.x !== ghost.nextCase.x ||
              ghost.position.y !== ghost.nextCase.y
            ) {
              if (ghost.position.x < newRes.x) {
                ghost.position.x += ghostSpeed;
              }
              if (ghost.position.x > newRes.x) {
                ghost.position.x -= ghostSpeed;
              }
              if (ghost.position.x === newRes.x) {
                if (ghost.position.y < newRes.y) {
                  ghost.position.y += ghostSpeed;
                }

                if (ghost.position.y > newRes.y) {
                  ghost.position.y -= ghostSpeed;
                }
              }
            }

            if (
              newRes.x === ghost.position.x &&
              newRes.y === ghost.position.y
            ) {
              const res = getShortestRoad(ghost, player);

              if (res) {
                ghost.updateTest(res);
              }
            }
          }
        }
      });

      player.velocity.x = 0;
      player.velocity.y = 0;

      const nextPositionPossible = player.radius + 5;
      const pacmanSpeed = 1;
      if (keyPress === "U" && player.position.y > nextPositionPossible) {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            circleCollidesWithEntity(
              { ...player, velocity: { x: 0, y: -5 } },
              boundary
            )
          ) {
            player.velocity.y = 0;
            keyPress = lastKeyPress;
            break;
          } else {
            player.velocity.y = -pacmanSpeed;
          }
        }
      } else if (
        keyPress === "R" &&
        player.position.x < canvas.width - nextPositionPossible
      ) {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            circleCollidesWithEntity(
              { ...player, velocity: { x: 5, y: 0 } },
              boundary
            )
          ) {
            player.velocity.x = 0;
            keyPress = lastKeyPress;
            break;
          } else {
            player.velocity.x = pacmanSpeed;
          }
        }
      } else if (keyPress === "L" && player.position.x > nextPositionPossible) {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            circleCollidesWithEntity(
              { ...player, velocity: { x: -5, y: 0 } },
              boundary
            )
          ) {
            player.velocity.x = 0;
            keyPress = lastKeyPress;
            break;
          } else {
            player.velocity.x = -pacmanSpeed;
          }
        }
      } else if (
        keyPress === "D" &&
        player.position.y < canvas.height - nextPositionPossible
      ) {
        for (let i = 0; i < boundaries.length; i++) {
          const boundary = boundaries[i];
          if (
            circleCollidesWithEntity(
              { ...player, velocity: { x: 0, y: 5 } },
              boundary
            )
          ) {
            player.velocity.y = 0;
            keyPress = lastKeyPress;
            break;
          } else {
            player.velocity.y = pacmanSpeed;
          }
        }
      } else {
        keyPress = lastKeyPress;
      }
    }

    animationLoop();
  }, []);
  return <canvas>Not able</canvas>;
};
export default Canvas;
