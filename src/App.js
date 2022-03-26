import React, { useState, useEffect, useRef } from "react";

import { getRandomNum, DEFAULT_MATRIX } from "./constants";

import Home from "./components/Home";

// // reducer
// const initialState = {
//   value: 0,
//   positionX: 0,
//   positionY: 0,
// };

// function counterReducer(state = initialState, action) {
//   switch (action.type) {
//     case "MOVE_UP":
//       return {
//         ...state,
//         positionY: state.positionY - 1,
//       };
//     case "MOVE_DOWN":
//       return {
//         ...state,
//         positionY: state.positionY + 1,
//       };
//     case "MOVE_RIGHT":
//       return {
//         ...state,
//         positionX: state.positionX + 1,
//       };
//     case "MOVE_LEFT":
//       return {
//         ...state,
//         positionX: state.positionX - 1,
//       };
//     default:
//       return state;
//   }
// }

// // créer le store
// const store = createStore(
//   counterReducer, // Il est possible d'ajouter plusieurs reducers en utilisant combineReducers()
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

class Ghost {
  constructor(id, positionX, positionY) {
    this.id = id;
    this.x = positionX;
    this.y = positionY;
    this.direction = null;
    this.distance = null;
    this.speed = 1000;
    this.followPacman = false;
  }

  get data() {
    return { x: this.x, y: this.y };
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
  const [lifes] = useState(3);
  const [ghosts, setGhosts] = useState([]);
  const [coins, setCoins] = useState([]);
  const [time, setTime] = useState(getTime());
  const [isPlaying, setIsPlaying] = useState(false);

  const [player] = useState(new Ghost(5, 0, 0));

  const moveRef = useRef();

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
    // if (isPlaying) {
    // for (let i = 1; i <= 4; i++) {
    //   let elem = getSpawnPoint();
    //   while (!elem) {
    //     elem = getSpawnPoint();
    //   }

    //   const alreadyGhost = ghosts.some(
    //     (ghost) => ghost.positionX === elem.x && ghost.positionY === elem.y
    //   );
    //   if (alreadyGhost) {
    //     elem = getSpawnPoint();
    //   }

    //   const newGhost = new Ghost(i, elem.x, elem.y);

    //   setGhosts((prev) => [...prev, newGhost]);
    // }
    setGhosts([
      new Ghost(1, DEFAULT_MATRIX[0].length - 1, DEFAULT_MATRIX.length - 1),
    ]);

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
    // }
  }, [isPlaying]);

  return (
    <div
      style={{ height: "100%" }}
      onKeyDown={(e) => handleKeyPlayer(e.code)}
      tabIndex={0}
    >
      <div style={{ textAlign: "center", width: "100%", paddingTop: 12 }}>
        {time}
      </div>
      {/* {!isPlaying && (
        <button onClick={() => setIsPlaying(true)}>CLIQUER POUR JOUER</button>
      )} */}
      {/* {isPlaying && ( */}
      <div style={{ height: "70%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            height: "30%",
          }}
        >
          <span>Score : {scoreNb}</span>
          <div style={{ margin: "0 12px" }}>|</div>
          <span>Vies : {lifes}</span>
        </div>
        <div>
          {loading && "chargement...."}
          {!loading && (
            <Home
              setScoreNb={setScoreNb}
              coins={coins}
              ghosts={ghosts}
              player={player}
              setCoins={setCoins}
              moveRef={moveRef}
            />
          )}
        </div>
      </div>
      {/* )} */}
    </div>
  );
}

export default App;
