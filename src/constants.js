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

const test = [
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0],
  [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
  [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
];

export const DEFAULT_MATRIX = test;

export const PACMAN_SPEED = 200;
export const GHOST_SPEED = 300;

export const COL_COUNT = DEFAULT_MATRIX[0].length;
export const ROW_COUNT = DEFAULT_MATRIX.length;
export const getRandomNum = (max) => Math.floor(Math.random() * max);
