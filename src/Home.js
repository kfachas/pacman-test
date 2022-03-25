import React, { useRef, useEffect, useState } from "react";
import Cell from "./Cell";
import { DEFAULT_MATRIX, getRandomNum } from "./constants";


const getDirectionOfGhost = ({ ghostPosition, actualDirection = null,  }) => {
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
      let {x, y} = player.data;
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
      if (
        nextPositionOfPacman !== 0
      ) {
        return;
      } else if (moveRef.current) {
        const findCoin = coins.findIndex((e) => e.x == x && e.y == y);
        if (findCoin !== -1) {
         setCoins((prev) => {
           const newCoins = [...prev]
           newCoins[findCoin] = {x:null,y:null} 
           return newCoins;
         })
        }
        player.updatePosition(x, y);
        setRefreshPositionsGhosts((prev) => !prev);
      }

    }, 500)
  }, [])


  useEffect(() => {
    setInterval(() => {
      ghosts.forEach((ghost) => {
        try {
          let newDirection;

          newDirection = getDirectionOfGhost({
            ghostPosition: { x: ghost.positionX, y: ghost.positionY },
            actualDirection: ghost.direction,
          });

          ghost.updateDirection(newDirection);

          if (ghost.direction) {
            const ghostDirection = ghost.direction;
            let newPositionX = ghost.positionX;
            let newPositionY = ghost.positionY;

            if (ghostDirection === "U") {
              newPositionY -= 1;
            }
            if (ghostDirection === "D") {
              newPositionY += 1;
            }
            if (ghostDirection === "R") {
              newPositionX += 1;
            }
            if (ghostDirection === "L") {
              newPositionX -= 1;
            }
            if (DEFAULT_MATRIX[newPositionY][newPositionX] === 0) {
              ghost.updatePosition(newPositionX, newPositionY);
            }
          }
        } catch (error) {
        }
      });

      setRefreshPositionsGhosts((prev) => !prev);
    }, 500);
  }, []);
  return (
    <div
      style={{ height: "50%" }}

      tabIndex={0}
    >

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div style={{ width: "80%", border: "5px solid #4040BF", }}>
            {DEFAULT_MATRIX.map((content, indexY) => {
              return (
                <div style={{ display: "flex" }} key={indexY}>
                  {content.map((elem, indexX) => {
                    const findGhost = ghosts.find(
                      (ghost) =>
                        ghost.positionX === indexX && ghost.positionY === indexY
                    );

                    const isPacman = indexX === playerX && indexY === playerY;
                    const isCoin = coins.some((e) => e.x === indexX && indexY === e.y)
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
