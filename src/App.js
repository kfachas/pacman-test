import React, { useState, useEffect, useRef } from "react";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { getRandomNum, DEFAULT_MATRIX } from "./constants";

import "./App.css";
import Home from "./Home";

// reducer
const initialState = {
  value: 0,
  positionX: 0,
  positionY: 0,
};

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "MOVE_UP":
      return {
        ...state,
        positionY: state.positionY - 1,
      };
    case "MOVE_DOWN":
      return {
        ...state,
        positionY: state.positionY + 1,
      };
    case "MOVE_RIGHT":
      return {
        ...state,
        positionX: state.positionX + 1,
      };
    case "MOVE_LEFT":
      return {
        ...state,
        positionX: state.positionX - 1,
      };
    default:
      return state;
  }
}

// créer le store
const store = createStore(
  counterReducer, // Il est possible d'ajouter plusieurs reducers en utilisant combineReducers()
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

class Ghost {
  constructor(id, positionX, positionY) {
    this.id = id;
    this.positionX = positionX;
    this.positionY = positionY;
    this.direction = null;
    this.speed = 1000;
    this.followPacman = false;
  }

  get data() {
    return { x: this.positionX, y: this.positionY };
  }

  updatePosition(newX, newY) {
    this.positionY = newY;
    this.positionX = newX;
  }

  updateDirection(direction) {
    this.direction = direction;
  }
}

function App() {
  const [loading, setLoading] = useState(true);
  const [scoreNb, setScoreNb] = useState(0);
  const [lifes] = useState(3);
  const [ghosts, setGhosts] = useState([]);
  const [coins, setCoins] = useState([])
  const [time, setTime] = useState(null);

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

  const getSpawnPoint = () => {
    const randomY = getRandomNum(DEFAULT_MATRIX.length);
    const randomX = getRandomNum(DEFAULT_MATRIX[0].length);

    if (DEFAULT_MATRIX[randomY][randomX] === 0 && randomX > 0 && randomY > 0) {
      return { x: randomX, y: randomY };
    }
  };

  useEffect(() => {
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
    DEFAULT_MATRIX.forEach((elem, y) => elem.forEach((x, index) => {
     if (x === 0) {
       arr.push({x: index, y})
     }
    }))
    setCoins(arr)

    setTimeout(() => setLoading(false), 950);
  }, []);

  useEffect(() => {
    setInterval(() => {
      const today = new Date();
      const date =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      setTime(date);
    }, 1000);
  }, []);

  // calcul score of pacman
  useEffect(() => {
    const getScore = coins.filter((e) => typeof e.x !== "number")
    setScoreNb(getScore.length * 10)
  }, [coins])


  return (
    <Provider store={store}       >
      <div style={{height: "100%"}} onKeyDown={(e) => handleKeyPlayer(e.code)}>
      <div>{time}</div>
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
      {loading && "chargement...."}
     {!loading && <Home  setScoreNb={setScoreNb} coins={coins} ghosts={ghosts} player={player} setCoins={setCoins} moveRef={moveRef}/>}
     </div>
    </Provider>
  );
}

export default App;
