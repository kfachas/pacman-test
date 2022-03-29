import * as boundariesImg from "./images/box";

const maxY = 11;
const maxX = 16;

const arr = Array.from({ length: maxY }, () =>
  Array.from({ length: maxX }, () => 0)
);
arr.forEach((elem, i) =>
  elem.forEach((e, index) => {
    if (index % 2 === 0 && i % 2 === 0) {
      arr[i][index] = 1;
    }
    if (i === 0 && index === 0) {
      arr[i][index] = 0;
    }
  })
);

const map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const DEFAULT_MATRIX = map;

export const getRandomNum = (max) => Math.floor(Math.random() * max);

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

export const findRightImage = (y, x) => {
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
  return image;
};

export const circleCollidesWithEntity = (circle, entity) => {
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
