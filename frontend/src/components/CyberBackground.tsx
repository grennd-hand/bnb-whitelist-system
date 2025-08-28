import React, { useEffect, useRef } from "react";

const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置canvas尺寸为窗口大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 监听窗口大小变化
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // 网格参数
    const gridSize = 40;
    const gridColor = "#00f0ff";
    const gridOpacity = 0.15;

    // 粒子参数
    const particles: Particle[] = [];
    const particleCount = 50;
    const particleColor = "#00f0ff";
    const particleSize = 2;

    // 粒子类
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * particleSize + 0.5;
        this.color = particleColor;
        this.alpha = Math.random() * 0.8 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // 边界检查
        if (this.x < 0 || this.x > (canvas?.width || window.innerWidth)) this.vx = -this.vx;
        if (this.y < 0 || this.y > (canvas?.height || window.innerHeight)) this.vy = -this.vy;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 创建粒子
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // 绘制网格
    const drawGrid = () => {
      ctx.strokeStyle = gridColor;
      ctx.globalAlpha = gridOpacity;
      ctx.lineWidth = 0.5;

      // 水平线
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 垂直线
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    };

    // 绘制粒子
    const drawParticles = () => {
      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });
    };

    // 绘制连接线
    const drawConnections = () => {
      const maxDistance = 150;
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            ctx.globalAlpha = 0.1 * (1 - distance / maxDistance);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawParticles();
      drawConnections();
      requestAnimationFrame(animate);
    };

    animate();

    // 清理
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed left-0 top-0 -z-10 h-full w-full"
    />
  );
};

export default CyberBackground;