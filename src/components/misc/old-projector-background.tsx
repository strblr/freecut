import { useEffect, useRef } from "react";
import { clamp, times } from "lodash-es";

export function OldProjectorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let animationId: number;
    let lastTimestamp = 0;
    let delta = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let flickerIntensity = 0.15;
    const minFlickerIntensity = 0.08;
    const particleCount = Math.floor((width * height) / 30000);
    const particles = times(particleCount, createParticle);

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.scale(ratio, ratio);
    };

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.02
      };
    }

    function updateParticles() {
      for (const particle of particles) {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;
        particle.angle += particle.angularVelocity * delta;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        particle.opacity +=
          Math.sin(lastTimestamp * 0.001 + particle.x * 0.01) * 0.002;
        particle.opacity = clamp(particle.opacity, 0.05, 0.4);
      }
    }

    function drawParticles() {
      for (const particle of particles) {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.angle);
        ctx.globalAlpha = particle.opacity;

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function updateFlicker() {
      if (Math.random() < 1 - 0.99 ** delta) {
        flickerIntensity = 0.1 + Math.random() * 0.15;
      } else {
        flickerIntensity *= 0.99 ** delta;
        if (flickerIntensity < minFlickerIntensity)
          flickerIntensity = minFlickerIntensity;
      }
    }

    function drawFlicker() {
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

      const beamGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius
      );

      const intensity = minFlickerIntensity + flickerIntensity * 0.15;
      beamGradient.addColorStop(0, `rgba(254, 220, 67, ${intensity})`);
      beamGradient.addColorStop(0.3, `rgba(254, 220, 67, ${intensity * 0.6})`);
      beamGradient.addColorStop(0.6, `rgba(254, 220, 67, ${intensity * 0.3})`);
      beamGradient.addColorStop(0.8, `rgba(254, 220, 67, ${intensity * 0.1})`);
      beamGradient.addColorStop(1, `rgba(254, 220, 67, 0)`);

      ctx.fillStyle = beamGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    function drawScanLines() {
      if (Math.random() < 1 - 0.99 ** delta) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.25;
        const lineCount = 1 + Math.floor(Math.random() * 2);
        times(lineCount, () => {
          const x = Math.random() * width;
          const thickness = 1 + Math.random() * 2;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
          ctx.fillRect(x, 0, thickness, height);
        });
        ctx.restore();
      }
    }

    const render = (timestamp = 0) => {
      delta = (timestamp - lastTimestamp) / (1000 / 144);
      lastTimestamp = timestamp;
      ctx.clearRect(0, 0, width, height);
      updateParticles();
      drawParticles();
      updateFlicker();
      drawFlicker();
      drawScanLines();
      animationId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 size-full"
      />
      <div className="pointer-events-none fixed inset-0 bg-[url('/grain.gif')] bg-size-[512px_512px] bg-repeat opacity-[0.025]" />
    </>
  );
}
