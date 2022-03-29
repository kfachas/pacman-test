import React, { useState, useEffect, useRef } from "react";

import { getRandomNum, DEFAULT_MATRIX } from "./constants";

import Home from "./components/Home";
import Canvas from "./components/Pac-Man";
import CaseBreaker from "./components/CaseBreaker";

class Ghost {
  constructor(id, positionX, positionY) {
    this.id = id;
    this.x = positionX;
    this.y = positionY;
    this.direction = null;
    this.distance = null;
    this.speed = 1000;
    this.followPacman = false;
    this.visited = [];
  }

  get data() {
    return { x: this.x, y: this.y };
  }

  updateVisited(newPos) {
    this.visited.push({ x: newPos.x, y: newPos.y });
  }
  clearVisited() {
    this.visited = [];
  }

  updatePosition(newX, newY) {
    this.y = newY;
    this.x = newX;
  }
  updateDistance(distance) {
    this.distance = distance;
  }

  updateDirection(direction) {
    this.direction = direction;
  }
}

class Player {
  constructor(id, positionX, positionY) {
    this.id = id;
    this.x = positionX;
    this.y = positionY;
    this.direction = null;
    this.distance = null;
    this.speed = 1000;
    this.lifes = 3;
    this.lose = false;
    this.win = false;
  }

  get data() {
    return { x: this.x, y: this.y };
  }

  loseLife() {
    this.lifes -= 1;
  }
  loseGame() {
    this.lose = true;
  }
  winGame() {
    this.win = true;
  }

  updatePosition(newX, newY) {
    this.y = newY;
    this.x = newX;
  }
  updateDistance(distance) {
    this.distance = distance;
  }

  updateDirection(direction) {
    this.direction = direction;
  }
}

const getTime = () => {
  const today = new Date();
  const date =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return date;
};

const getSpawnPoint = () => {
  const randomY = getRandomNum(DEFAULT_MATRIX.length);
  const randomX = getRandomNum(DEFAULT_MATRIX[0].length);

  if (DEFAULT_MATRIX[randomY][randomX] === 0 && randomX > 0 && randomY > 0) {
    return { x: randomX, y: randomY };
  }
};

function App() {
  const [loading, setLoading] = useState(true);
  const [scoreNb, setScoreNb] = useState(0);
  const [ghosts, setGhosts] = useState([]);
  const [coins, setCoins] = useState([]);
  const [time, setTime] = useState(getTime());
  const [playHtml, setPlayHtml] = useState(false);
  const [playCanvas, setPlayCanvas] = useState(false);
  const [playCaseBreaker, setPlayCaseBreaker] = useState(false);
  const isPlaying = playCanvas || playCaseBreaker || playCanvas;

  const playerRef = useRef(new Player(5, 0, 0));
  const player = playerRef.current;

  const moveRef = useRef();

  useEffect(() => {
    setPlayCaseBreaker(true);
  }, []);

  const handleKeyPlayer = (code) => {
    let newType = null;

    switch (code) {
      case "ArrowUp":
        newType = "MOVE_UP";
        break;
      case "ArrowLeft":
        newType = "MOVE_LEFT";
        break;
      case "ArrowRight":
        newType = "MOVE_RIGHT";
        break;
      case "ArrowDown":
        newType = "MOVE_DOWN";
        break;
      default:
        break;
    }

    if (newType && newType !== moveRef.current) {
      moveRef.current = newType;
    }
  };

  useEffect(() => {
    setInterval(() => {
      const timeTxt = getTime();
      setTime(timeTxt);
    }, 1000);
  }, []);

  // calcul score of pacman
  useEffect(() => {
    const getScore = coins.filter((e) => typeof e.x !== "number");
    setScoreNb(getScore.length * 10);
  }, [coins]);

  useEffect(() => {
    if (playHtml) {
      for (let i = 1; i <= 4; i++) {
        let elem = getSpawnPoint();
        while (!elem) {
          elem = getSpawnPoint();
        }

        const alreadyGhost = ghosts.some(
          (ghost) => ghost.positionX === elem.x && ghost.positionY === elem.y
        );
        if (alreadyGhost) {
          elem = getSpawnPoint();
        }

        const newGhost = new Ghost(i, elem.x, elem.y);

        setGhosts((prev) => [...prev, newGhost]);
      }

      const arr = [];
      DEFAULT_MATRIX.forEach((elem, y) =>
        elem.forEach((x, index) => {
          if (x === 0) {
            arr.push({ x: index, y });
          }
        })
      );
      setCoins(arr);

      setTimeout(() => setLoading(false), 950);
    }
  }, [playHtml]);

  return (
    <div
      style={{ height: "100%" }}
      onKeyDown={(e) => !player.lose && handleKeyPlayer(e.code)}
      tabIndex={0}
    >
      <div style={{ textAlign: "center", width: "100%", paddingTop: 12 }}>
        {time}
      </div>
      {isPlaying && (
        <button
          onClick={() => {
            playHtml && setPlayHtml(false);
            playCanvas && setPlayCanvas(false);
            playCaseBreaker && setPlayCaseBreaker(false);
          }}
        >
          RETOUR AU MENU
        </button>
      )}
      {!isPlaying && (
        <button onClick={() => setPlayHtml(true)}>HTML ELEMENT</button>
      )}
      {!isPlaying && (
        <button onClick={() => setPlayCanvas(true)}>CANVAS</button>
      )}
      {!isPlaying && (
        <button onClick={() => setPlayCaseBreaker(true)}>CASSE BRIQUE</button>
      )}
      {player.lose && (
        <div style={{ position: "absolute", left: "45%", top: "45%" }}>
          VOUS AVEZ PERDU
        </div>
      )}
      <div style={{ height: "70%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            height: "30%",
          }}
        >
          <span>
            Score : <span id="score">{scoreNb}</span>
          </span>
          <div style={{ margin: "0 12px" }}>|</div>
          <span>Vies : {player.lifes}</span>
        </div>
        <div style={{ textAlign: "center" }}>
          {playCanvas && <Canvas />}
          {playHtml && loading
            ? "chargement...."
            : playHtml &&
              !loading && (
                <Home
                  setScoreNb={setScoreNb}
                  coins={coins}
                  ghosts={ghosts}
                  player={player}
                  setCoins={setCoins}
                  moveRef={moveRef}
                />
              )}
          {playCaseBreaker && <CaseBreaker />}
        </div>
      </div>
    </div>
  );
}

export default App;
