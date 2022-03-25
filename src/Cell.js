import React from "react";
import ghost_1 from "./images/G1.gif";
import ghost_2 from "./images/G2.gif";
import ghost_3 from "./images/G3.gif";
import ghost_4 from "./images/G4.gif";
import brique from "./brique.jpg"
import coin from "./bit.gif"

import Pacman from "./Pacman";

const MOVE_UP = "MOVE_UP";
const MOVE_DOWN = "MOVE_DOWN";
const MOVE_LEFT = "MOVE_LEFT";
// const MOVE_RIGHT = "MOVE_RIGHT";

const ghostIcons = {
  1: { img: ghost_1 },
  2: { img: ghost_2 },
  3: { img: ghost_3 },
  4: { img: ghost_4 },
};

const styles = {
  ghostStyle: {
    width: 20,
    height: 20,
    color: "red",
  },
};

const Cell = ({ ghost, isPacman = null, direction = null, content, isCoin }) => {
  let cellContent = null;

  if (isCoin) {
    cellContent = <img src={coin} alt="bitcoin" style={{height: 17, width: 17}}  />
  }
  if (isPacman) {
    let rotate = "0deg";
    switch (direction) {
      case MOVE_UP:
        rotate = "270deg";
        break;
      case MOVE_DOWN:
        rotate = "90deg";
        break;
      case MOVE_LEFT:
        rotate = "180deg";
        break;
      default:
        break;
    }
    cellContent = (
      <Pacman
        style={{
          margin: "0 auto",
          transform: `rotate(${rotate})`,
        }}
      />
    );
  } else if (content === 0 && ghost) {
    cellContent = (
      <img
        src={ghostIcons[ghost.id].img}
        style={styles.ghostStyle}
        alt={`ghost icon ${ghost.id}`}
      />
    );
  } else if (content === 1) {
    cellContent = (
        <div style={{height: 30, width: "100%", objectFit: "cover",  backgroundColor: "#4040BF" }}/>
    );
  }
  return (
    <div
      style={{
        flex: 1,
        height: 30,
        borderColor: "#3F51B5",
        borderWidth: 0.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {cellContent}
    </div>
  );
};

export default Cell;
