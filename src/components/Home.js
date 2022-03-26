import React, { useEffect, useState } from "react";

import Cell from "../components/Cell";
import { DEFAULT_MATRIX, getRandomNum } from "../constants";

const getDirectionOfGhost = ({ ghostPosition, actualDirection = null }) => {
  let randomNb = getRandomNum(4);

  const randomIntersection = getRandomNum(2);
  let direction;
  const ghostX = ghostPosition.x;
  const ghostY = ghostPosition.y;

  if (actualDirection) {
    switch (actualDirection) {
      case "U":
        randomNb = 0;
        break;
      case "L":
        randomNb = 1;
        break;
      case "R":
        randomNb = 2;
        break;
      case "D":
        randomNb = 3;
        break;
      default:
        break;
    }
  }

  switch (randomNb) {
    case 0: // up
      if (
        DEFAULT_MATRIX[ghostY - 1] &&
        typeof DEFAULT_MATRIX[ghostY - 1][ghostX] === "number" &&
        DEFAULT_MATRIX[ghostY - 1][ghostX] === 0
      ) {
        if (
          DEFAULT_MATRIX[ghostY - 1][ghostX + 1] === 0 &&
          randomIntersection === 1
        ) {
          direction = "R";
        } else if (
          DEFAULT_MATRIX[ghostY - 1][ghostX - 1] === 0 &&
          randomIntersection === 1
        ) {
          direction = "L";
        } else {
          direction = "U";
        }
      }
      break;
    case 1: // left
      if (
        typeof DEFAULT_MATRIX[ghostY][ghostX - 1] === "number" &&
        DEFAULT_MATRIX[ghostY][ghostX - 1] === 0
      ) {
        if (
          typeof DEFAULT_MATRIX[ghostY + 1][ghostX] === "number" &&
          DEFAULT_MATRIX[ghostY + 1][ghostX] === 0 &&
          randomIntersection === 1
        ) {
          direction = "D";
        } else if (
          typeof DEFAULT_MATRIX[ghostY - 1][ghostX] === "number" &&
          DEFAULT_MATRIX[ghostY - 1][ghostX] === 0 &&
          randomIntersection === 1
        ) {
          direction = "U";
        } else {
          direction = "L";
        }
      }
      break;
    case 2: // right
      if (
        typeof DEFAULT_MATRIX[ghostY][ghostX + 1] === "number" &&
        DEFAULT_MATRIX[ghostY][ghostX + 1] === 0
      ) {
        if (
          typeof DEFAULT_MATRIX[ghostY + 1][ghostX] === "number" &&
          DEFAULT_MATRIX[ghostY + 1][ghostX] === 0 &&
          randomIntersection === 1
        ) {
          direction = "D";
        } else if (
          typeof DEFAULT_MATRIX[ghostY - 1][ghostX] === "number" &&
          DEFAULT_MATRIX[ghostY - 1][ghostX] === 0 &&
          randomIntersection === 1
        ) {
          direction = "U";
        } else {
          direction = "R";
        }
      }
      break;
    case 3: // down
      if (
        DEFAULT_MATRIX[ghostY + 1] &&
        DEFAULT_MATRIX[ghostY + 1][ghostX] === 0
      ) {
        if (
          DEFAULT_MATRIX[ghostY + 1][ghostX + 1] === 0 &&
          randomIntersection === 1
        ) {
          direction = "R";
        } else if (
          DEFAULT_MATRIX[ghostY + 1][ghostX - 1] === 0 &&
          randomIntersection === 1
        ) {
          direction = "L";
        } else {
          direction = "D";
        }
      }
      break;
    default:
      break;
  }

  if (!direction) {
    getDirectionOfGhost({ ghostPosition });
  }

  return direction;
};

const Home = ({ ghosts, player, coins, setCoins, moveRef }) => {
  const [, setRefreshPositionsGhosts] = useState(false);

  const { x: playerX, y: playerY } = player.data;

  useEffect(() => {
    setInterval(() => {
      let { x, y } = player.data;
      switch (moveRef.current) {
        case "MOVE_UP":
          y -= 1;
          break;
        case "MOVE_LEFT":
          x -= 1;
          break;
        case "MOVE_RIGHT":
          x += 1;
          break;
        case "MOVE_DOWN":
          y += 1;
          break;
        default:
          break;
      }

      if (x < 0 || y < 0) return;
      const nextPositionOfPacman = DEFAULT_MATRIX[y][x];
      if (nextPositionOfPacman !== 0) {
        return;
      } else if (moveRef.current) {
        const findCoin = coins.findIndex((e) => e.x == x && e.y == y);
        if (findCoin !== -1) {
          setCoins((prev) => {
            const newCoins = [...prev];
            newCoins[findCoin] = { x: null, y: null };
            return newCoins;
          });
        }
        ghosts.forEach((ghost) => ghost.clearVisited())
        player.updatePosition(x, y);
        player
        setRefreshPositionsGhosts((prev) => !prev);
      }
    }, 500);
  }, []);

  function manhattanDist(x, y) {
    let dist = Math.abs(x) + Math.abs(y);
    return dist;
  }

  // get all possible next moves
  function getAdjacences(point) {
    const { x: playerX, y: playerY } = player.data;

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
    return !(DEFAULT_MATRIX[y] && typeof DEFAULT_MATRIX[y][x] === "number" && DEFAULT_MATRIX[y][x] === 0)
  }
  // get shortest road
  const getShortestRoad = (entity) => {    
    let dRow = [-1, 1, 0, 0]
    let dCol = [0, 0, -1, 1]
    const visited = [{ x: entity.x, y: entity.y}];
    const Q = [{ x: entity.x, y: entity.y  }]
   
    let distance = Array(DEFAULT_MATRIX.length).fill().map(() => Array(DEFAULT_MATRIX[0].length).fill(-1))
    distance[entity.y][entity.x] = 0;

      while (Q.length > 0) {
        let cur = Q.shift();
        let row = cur.x;
        let col = cur.y;
        for (let k = 0; k < 4; k++) {
          let newRow = row + dRow[k];
          let newCol = col + dCol[k];
          if (!visited.find((e) => e.x === newRow && e.y === newCol) && !notInMap(newCol, newRow)) {
            visited.push({x: newRow, y: newCol});
            distance[newCol][newRow] = distance[col][row] + 1;
            Q.push({x: newRow, y: newCol})
          }
        }
      }
      
    if (entity.updateDistance) {
      entity.updateDistance(distance[entity.y][entity.x]);
    }

   // console.log("** start **")
    entity.updateVisited({x: entity.x, y: entity.y})

   // console.log("position : ", entity.y, entity.x)
    let nearestCases = getAdjacences(entity).filter((e) => !entity.visited.find(o => o.x === e.x && o.y === e.y));
   // console.log("nearest cases... ", nearestCases)
    const bestdistance = Math.min(...nearestCases.map(o => o.distance))
    const findBestCase = nearestCases.find((e) => e.distance === bestdistance)

  //  console.log("best case : ", findBestCase)
  //  console.log("visited...", entity.visited)
  //  console.log("** end **")

    const anotherGhost = ghosts.find((e) => e.id !== entity.id && e.x === findBestCase.x && e.y === findBestCase.y)

    if (entity.updatePosition && nearestCases.length > 0 && !anotherGhost) {
      if (player.x === findBestCase.x && player.y === findBestCase.y) {
        if (player.lifes > 1) {
          player.loseLife()
        } else {
          player.loseGame()
        }
        
      }
      entity.updatePosition(findBestCase.x, findBestCase.y);
    } else {
      entity.updatePosition(findBestCase.x, findBestCase.y)
    }
  };

  useEffect(() => {
    setInterval(() => {
      ghosts.forEach((ghost) => {

          getShortestRoad(ghost);
      
      });
    },1000);

    // setInterval(() => {
    //   ghosts.forEach((ghost) => {
    //     try {
    //       let newDirection;
    //       getShortestRoad({ x: ghost.positionX, y: ghost.positionY });

    //       newDirection = getDirectionOfGhost({
    //         ghostPosition: { x: ghost.positionX, y: ghost.positionY },
    //         actualDirection: ghost.direction,
    //       });

    //       ghost.updateDirection(newDirection);

    //       if (ghost.direction) {
    //         const ghostDirection = ghost.direction;
    //         let newPositionX = ghost.positionX;
    //         let newPositionY = ghost.positionY;

    //         if (ghostDirection === "U") {
    //           newPositionY -= 1;
    //         }
    //         if (ghostDirection === "D") {
    //           newPositionY += 1;
    //         }
    //         if (ghostDirection === "R") {
    //           newPositionX += 1;
    //         }
    //         if (ghostDirection === "L") {
    //           newPositionX -= 1;
    //         }
    //         if (DEFAULT_MATRIX[newPositionY][newPositionX] === 0) {
    //           // ghost.updatePosition(newPositionX, newPositionY);
    //         }
    //       }
    //     } catch (error) {}
    //   });

    //   setRefreshPositionsGhosts((prev) => !prev);
    // }, 1000);
  }, []);

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("2d")

    context.beginPath()
    DEFAULT_MATRIX.forEach((row, y) => row.forEach((elem, x) => {
      context.fillRect(x, y, 15, 15)
    }))
    
  }, [])

  return (
    <canvas style={{ height: 400, width: "80%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ width: "80%", border: "5px solid #4040BF" }}>
          {DEFAULT_MATRIX.map((content, indexY) => {
            return (
              <div style={{ display: "flex" }} key={indexY}>
                {content.map((elem, indexX) => {
                  const findGhost = ghosts.find(
                    (ghost) => ghost.x === indexX && ghost.y === indexY
                  );

                  const isPacman = indexX === playerX && indexY === playerY;
                  const isCoin = coins.some(
                    (e) => e.x === indexX && indexY === e.y
                  );
                  return (
                    <Cell
                      key={indexX + indexY}
                      content={elem}
                      direction={moveRef.current ? moveRef.current : null}
                      ghost={findGhost}
                      isPacman={isPacman}
                      isCoin={isCoin}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </canvas>
  );
};

export default Home;
