import React, { useEffect } from "react";
class Player {
  constructor() {
    this.x = 100;
    this.y = 265;
    (this.vx = 5), (this.vy = 2), (this.color = "brown");
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, 50, 10);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Ball {
  constructor(position) {
    this.x = position.x;
    this.y = position.y;
    this.vx = 5;
    this.vy = 2;
    this.radius = 10;
  }
  draw(ctx) {
    this.x += this.vx;
    this.y += this.vy;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

const CaseBreaker = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const player = new Player();
    const ball = new Ball({ x: 100, y: 50 });

    let animationId;
    let running = false;
    let raf;

    function clear() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    canvas.addEventListener("mousemove", function (e) {
      if (running) {
        clear();
        player.x = e.clientX - canvas.width / 2.1;
        // ball.y = e.clientY;
        // player.draw(ctx);
      }
    });

    canvas.addEventListener("mouseout", function (e) {
      window.cancelAnimationFrame(raf);
      if (running) running = false;
    });
    canvas.addEventListener("mouseenter", function (e) {
      // window.cancelAnimationFrame(raf);
      if (!running) running = true;
    });

    const animationLoop = (timestamp) => {
      animationId = requestAnimationFrame(animationLoop);
      // ctx.clearRect(0, 0, canvas.width, canvas.height);

      player.draw(ctx);
      ball.draw(ctx);

      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }
    };

    animationLoop();
  });

  return <canvas id="canvasCaseBreaker" width="600" height="300"></canvas>;
};
export default CaseBreaker;
