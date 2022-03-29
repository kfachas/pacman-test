import React, { useEffect } from "react";



const CaseBreaker = () => {
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");


    class Player {
      constructor() {
        this.x = 100;
        this.y = 265;
        (this.vx = 5); (this.vy = 2); (this.color = "brown");
        this.width = 50;
        this.height = 10
      }
      draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.closePath()
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
        this.color = "red"
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
    const ball = new Ball({ x: 100, y: 50 });

    let animationId;

    const animationLoop = (timestamp) => {
      animationId = requestAnimationFrame(animationLoop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      player.draw();
      ball.draw();
      ball.x += ball.vx / 4;
      ball.y += ball.vy / 4;
 

  if (ball.y + ball.vy > canvas.height ||
      ball.y + ball.vy < 0) {
    ball.vy = -ball.vy;
  }
  if (ball.x + ball.vx > canvas.width ||
      ball.x + ball.vx < 0) {
    ball.vx = -ball.vx;
  }

 const ballX = ball.x + ball.radius
 const minX = player.x;
 const maxX = player.x + player.width + (ball.radius * 2);
 const ballY = ball.y + ball.radius
 const minY = player.y + (player.height / 2) - 5;
 const maxY = player.y + player.height + (ball.radius * 2);

 const axeXtouched = ballX >= minX && ballX <= maxX
 const axeYtouched = ballY >= minY && ballY <= maxY
 
 if (axeXtouched && axeYtouched) {
   if (ballX < player.x + player.width / 2 + ball.radius) {
     console.log("left side")
     ball.vy = -ball.vy
     ball.vx = -ball.vx
   } else if(ballX > player.x + player.width / 2 + ball.radius) {
     console.log("right side")
     ball.vx = -ball.vx
     ball.vy = -ball.vy
   } else {
     console.log("middle")
     ball.vx = 0;
   }
   
   
 }



}
  


    animationLoop();
    canvas.addEventListener("mousemove", function (e) {
      player.x = e.clientX - canvas.width / 1.75;
    });
  
    canvas.addEventListener('mouseover', function(e) {
      animationId = window.requestAnimationFrame(animationLoop);
    });
    
    canvas.addEventListener('mouseout', function(e) {
      window.cancelAnimationFrame(animationId);
    });
  }, []);



  return <canvas id="canvasCaseBreaker" width="600" height="300"></canvas>;
};
export default CaseBreaker;
