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
        player.updatePosition(x, y);
        setRefreshPositionsGhosts((prev) => !prev);
      }
    }, 500);
  }, []);

  function manhattanDist(x, y) {
    let dist = Math.abs(x) + Math.abs(y);
    return dist;
  }

  const getNewDistances = () => {
    const { x: testX, y: testY } = player.data;

    const arr = [];
    DEFAULT_MATRIX.forEach((elem, y) =>
      elem.forEach((e, x) => {
        if (e === 0) {
          const distancePlayerX = testX - x;
          const distancePlayerY = testY - y;

          arr.push({
            x,
            y,
            distance: manhattanDist(distancePlayerX, distancePlayerY),
          });
        }
      })
    );
    return arr;
  };

  // const getNearestCases = (arr, entity) => {
  //   const nearestCases = arr.filter(
  //     (e) =>
  //       e.distance === entity.distance - 1 &&
  //       (e.x === entity.x - 1 || e.y === entity.y - 1)
  //   );
  //   return nearestCases;
  // };

  // function isContained(arr, obj) {
  //   return arr.some((value) => value.x === obj.x && value.y === obj.y);
  // }

  // get all possible next moves
  function getAdjacences(point) {
    const { x: testX, y: testY } = player.data;

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
        const distancePlayerX = testX - e.x;
        const distancePlayerY = testY - e.y;

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

  // get shortest road
  const getShortestRoad = (entity) => {
    const { x: testX, y: testY } = player.data;
    const arr = getNewDistances();
    if (entity.x === testX && entity.y === testY) {
      return null;
    }

    const entityDistance = arr.find(
      (e) => e.x === entity.x && e.y === entity.y
    ).distance;

    const visited = [{ x: entity.x, y: entity.y }];

    const nearestCases = getAdjacences(entity).filter((elem) => {
      return !visited.find((e) => elem.x === e.x && elem.y === e.y);
    });
    // .sort((a, b) => a.x < b.x && a.y < b.y)
    console.log({ visited });

    const Q = [];
    while (Q.length) {}

    if (entity.updateDistance) {
      entity.updateDistance(entityDistance);
    }

    if (entity.updatePosition && nearestCases.length > 0) {
      entity.updatePosition(nearestCases[0].x, nearestCases[0].y);
    }

    console.log(`nearest cases ${nearestCases.length} : `, nearestCases);
    // const process = (nearest) => {

    // };
  };

  useEffect(() => {
    setInterval(() => {
      ghosts.forEach((ghost) => {
        if (!ghost.distance || ghost.distance >= 24) {
          getShortestRoad(ghost);
        }
      });
    }, 1500);

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
  return (
    <div style={{ height: "50%" }}>
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
    </div>
  );
};

export default Home;
