import React, { useEffect } from "react";
import { DEFAULT_MATRIX } from "../constants";

function manhattanDist(x, y) {
  let dist = Math.abs(x) + Math.abs(y);
  return dist;
}

// get all possible next moves
function getAdjacences(point, player) {
  const playerX = Math.round(player.position.x / 40);
  const playerY = Math.round(player.position.x / 40);
  console.log(point.x, playerX);

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

    return adj.filter(
      (value) =>
        value.x >= 0 &&
        value.x < DEFAULT_MATRIX[0].length &&
        value.y < DEFAULT_MATRIX.length &&
        value.y >= 0 &&
        DEFAULT_MATRIX[value.y][value.x] === 0
    );
  } else {
    return [];
  }
}

function notInMap(y, x) {
  return !(
    DEFAULT_MATRIX[y] &&
    typeof DEFAULT_MATRIX[y][x] === "number" &&
    DEFAULT_MATRIX[y][x] === 0
  );
}

// get shortest road
const getShortestRoad = (ghost, player, ghosts) => {
  let entity = {
    x: Math.round(ghost.position.x / 40),
    y: Math.round(ghost.position.y / 40),
    visited: ghost.visited,
    updateVisited: ghost.updateVisited,
  };
  try {
    console.log({ entity });
    let dRow = [-1, 1, 0, 0];
    let dCol = [0, 0, -1, 1];
    const visited = [{ x: entity.x, y: entity.y }];
    const Q = [{ x: entity.x, y: entity.y }];

    let distance = Array(DEFAULT_MATRIX.length)
      .fill()
      .map(() => Array(DEFAULT_MATRIX[0].length).fill(-1));

    distance[entity.y][entity.x] = 0;

    while (Q.length > 0) {
      let cur = Q.shift();
      let row = cur.x;
      let col = cur.y;
      for (let k = 0; k < 4; k++) {
        let newRow = row + dRow[k];
        let newCol = col + dCol[k];
        if (
          !visited.find((e) => e.x === newRow && e.y === newCol) &&
          !notInMap(newCol, newRow)
        ) {
          visited.push({ x: newRow, y: newCol });
          distance[newCol][newRow] = distance[col][row] + 1;
          Q.push({ x: newRow, y: newCol });
        }
      }
    }

    // console.log("** start **")
    if (!entity.visited.find((o) => o.x === entity.x && o.y === entity.y))
      entity.updateVisited({ x: entity.x, y: entity.y });

    console.log("position : ", entity.y, entity.x);
    let nearestCases = getAdjacences(entity, player).filter((e) =>
      entity.visited.length > 0
        ? !entity.visited.find((o) => o.x === e.x && o.y === e.y)
        : true
    );

    console.log("nearest cases... ", nearestCases);

    const bestdistance = Math.min(...nearestCases.map((o) => o.distance));

    const findBestCase = nearestCases.find((e) => e.distance === bestdistance);

    //  console.log("best case : ", findBestCase)
    //  console.log("visited...", entity.visited)
    //  console.log("** end **")

    // const anotherGhost = ghosts.find(
    //   (e) =>
    //     e.id !== entity.id && e.x === findBestCase.x && e.y === findBestCase.y
    // );

    // if (entity.updatePosition && nearestCases.length > 0 && !anotherGhost) {
    if (nearestCases.length > 0) {
      return { x: findBestCase.x, y: findBestCase.y };
    } else {
      return null;
    }
  } catch (error) {
    console.log("err", error.message);
  }
};

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
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
      }
      update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
      updateScore() {
        this.score += 10;
      }
    }

    class Boundary {
      static width = 40;
      static height = 40;
      constructor(position) {
        this.position = position;
        this.width = 40;
        this.height = 40;
      }
      draw() {
        ctx.beginPath();
        ctx.fillStyle = "#4040BF";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.closePath();
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
        x: Boundary.width / 2,
        y: Boundary.height / 2,
      },
      { x: 0, y: 0 }
    );

    class Ghost {
      constructor(position, velocity) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 10;
        this.visited = [];
        this.nextCase = null;
      }
      updateVisited() {
        this.visited.push({ x: this.position.x, y: this.position.y });
      }

      clearVisited() {
        this.visited = [];
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
      }

      updateVisited(newPos) {
        this.visited.push({ x: newPos.x, y: newPos.y });
      }

      updateTest(res) {
        this.nextCase = res;
      }

      update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
    }

    canvas.width = 600;
    canvas.height = 400;

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

    DEFAULT_MATRIX.forEach((row, y) =>
      row.forEach((elem, x) => {
        if (elem === 1) {
          boundaries.push(
            new Boundary({
              x: Boundary.width * x,
              y: Boundary.height * y,
            })
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

    const circleCollidesWithEntity = (circle, entity) =>
      circle.position.y - circle.radius + circle.velocity.y <=
        entity.position.y + entity.height &&
      circle.position.x + circle.radius + circle.velocity.x >=
        entity.position.x &&
      circle.position.y + circle.radius + circle.velocity.y >=
        entity.position.y &&
      circle.position.x - circle.radius + circle.velocity.x <=
        entity.position.x + entity.width;

    function animationLoop() {
      // if (gameOver) return

      requestAnimationFrame(animationLoop);

      ctx.beginPath();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw map
      boundaries.forEach((boundary) => {
        boundary.draw();
      });

      const scoreElem = document.getElementById("score");
      coins.forEach((coin, index) => {
        coin.draw();
        if (circleCollidesWithEntity(player, coin)) {
          coins.splice(index, 1);
          player.updateScore();

          scoreElem.innerText = player.score;
        }
      });

      player.update();

      ghosts.forEach((ghost) => {
        ghost.update();

        if (!ghost.nextCase) {
          console.log("no next case");
          ghost.clearVisited();
          const res = getShortestRoad(ghost, player);
          if (res) {
            ghost.updateTest(res);
          }

          console.log("next case -> ", {
            x: Math.round(res.x * 40),
            y: Math.round(res.y * 40),
          });
          console.log("position -> ", ghost.position.x, ghost.position.y);
        } else {
          if (
            ghost.nextCase &&
            (ghost.position.x !== ghost.nextCase.x ||
              ghost.position.y !== ghost.nextCase.y)
          ) {
            console.log("case to go : ", ghost.nextCase);
            const newRes = {
              x: Math.round(ghost.nextCase.x * 40) - 20,
              y: Math.round(ghost.nextCase.y * 40) - 20,
            };
            const ghostPosition = ghost.position;

            // if (ghostPosition.x < newRes.x) {
            //   ghost.position.x += 2.5;
            // }
            // if (ghostPosition.x > newRes.x) {
            //   ghost.position.x -= 2.5;
            // }

            // if (ghostPosition.x === newRes.x) {
            //   if (ghostPosition.y < newRes.y) {
            //     ghost.position.y += 2.5;
            //   }
            //   if (ghostPosition.y > newRes.y) {
            //     ghost.position.y -= 2.5;
            //   }
            // }
          }
          if (ghost.nextCase) {
            const r = {
              x: Math.round(ghost.nextCase.x * 40) - 20,
              y: Math.round(ghost.nextCase.y * 40) - 20,
            };
            if (r.x === ghost.position.x && r.y === ghost.position.y) {
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
            player.velocity.y = -2.5;
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
            player.velocity.x = 2.5;
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
            player.velocity.x = -2.5;
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
            player.velocity.y = 2.5;
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
