import React from "react";

import ghost_1 from "../images/G1.gif";
import canBeEat from "../images/canBeEat.gif";
import coin from "../images/bitcoin.png";

import Pacman from "./Pacman";

const MOVE_UP = "MOVE_UP";
const MOVE_DOWN = "MOVE_DOWN";
const MOVE_LEFT = "MOVE_LEFT";
// const MOVE_RIGHT = "MOVE_RIGHT"; default is MOVE RIGHT so dont need it

const styles = {
  ghostStyle: {
    width: 20,
    height: 20,
    color: "red",
  },
};

const Cell = ({
  ghost,
  isPacman = null,
  direction = null,
  content,
  isCoin,
}) => {
  let cellContent = null;

  if (isCoin) {
    cellContent = (
      <img src={coin} alt="bitcoin" style={{ height: 10, width: 10 }} />
    );
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
        src={ghost_1}
        style={styles.ghostStyle}
        alt={`ghost icon ${ghost.id}`}
      />
    );
  } else if (content === 1) {
    cellContent = (
      <div
        style={{
          height: 30,
          width: "100%",
          objectFit: "cover",
          backgroundColor: "#4040BF",
        }}
      />
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
        justifyContent: "center",
      }}
    >
      {cellContent}
    </div>
  );
};

export default Cell;
