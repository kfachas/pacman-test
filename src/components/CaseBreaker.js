import React, { useEffect } from "react";

const CaseBreaker = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    class Player {
      constructor() {
        this.x = canvas.width / 2;
        this.y = 265;
        this.vx = 5;
        this.vy = 2;
        this.color = "brown";
        this.width = 50;
        this.height = 10;
      }
      draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    class Ball {
      constructor(position) {
        this.x = position.x;
        this.y = position.y;
        this.vx = 0;
        this.vy = 2;
        this.radius = 10;
        this.color = "red";
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const player = new Player();
    const ball = new Ball({ x: canvas.width / 2, y: 50 });

    let animationId;

    const animationLoop = (timestamp) => {
      animationId = requestAnimationFrame(animationLoop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      player.draw();
      ball.draw();
      if (ball.vx > 2 || ball.vx < 1) {
        ball.vx = ball.vx < 0 ? -1.5 : 1.5;
      }
      if (ball.vy > 2 || ball.vy < 1) {
        ball.vy = ball.vy < 0 ? -1.5 : 1.5;
      }
      ball.x += ball.vx;
      ball.y += ball.vy;

      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }

      const ballX = ball.x + ball.radius;
      const minX = player.x;
      const maxX = player.x + player.width + ball.radius * 2;
      const ballY = ball.y + ball.radius;
      const minY = player.y + player.height / 2 - 5;
      const maxY = player.y + player.height + ball.radius * 2;

      const axeXtouched = ballX >= minX && ballX <= maxX;
      const axeYtouched = ballY >= minY && ballY <= maxY;

      if (axeXtouched && axeYtouched) {
        const ballPosition = ball.x - player.x;
        const fromLeft = ball.vx > 0;
        const fromRight = ball.vx < 0;
        const onMiddle = ball.vx === 0;
        // ball.vy = -ball.vy;
        // ball.vx = -ball.vx;

        // left side
        const test = ballPosition / 5;
        ball.vy = -test;
        if (fromLeft) {
          ball.vx = +test;
        } else if (fromRight) {
          ball.vx = -test;
        } else {
          ball.vx = -test;
        }
        if (ballPosition >= -10 && ballPosition < 24) {
        }
        // right side
        // if (ballPosition > 26 && ballPosition <= 60) {
        //   console.log("there???", fromRight);
        //   if (fromRight) {
        //     ball.vx = -ball.vx;
        //   }
        // }
        // // middle
        // if (ballPosition >= 24 && ballPosition <= 26) {
        //   // const
        // }
      }
    };

    animationLoop();
    canvas.addEventListener("mousemove", function (e) {
      player.x = e.clientX - canvas.width / 5;
    });

    canvas.addEventListener("mouseover", function (e) {
      animationId = window.requestAnimationFrame(animationLoop);
    });

    canvas.addEventListener("mouseout", function (e) {
      window.cancelAnimationFrame(animationId);
    });
  }, []);

  return <canvas id="canvasCaseBreaker" width="600" height="300"></canvas>;
};
export default CaseBreaker;
