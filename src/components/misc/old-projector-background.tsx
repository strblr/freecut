import { times } from "lodash-es";
import { useEffect, useRef } from "react";

export function OldProjectorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let flickerIntensity = 0.15;
    const minFlickerIntensity = 0.08;
    const particles: Particle[] = [];
    const particleCount = Math.floor((width * height) / 30000);

    type Particle = ReturnType<typeof createParticle>;

    const resizeCanvas = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.scale(ratio, ratio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    times(particleCount, () => particles.push(createParticle()));

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

    function updateParticle(particle: Particle) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.angle += particle.angularVelocity;

      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;

      particle.opacity +=
        Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.002;
      particle.opacity = Math.max(0.05, Math.min(0.4, particle.opacity));
    }

    function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle) {
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

    function drawFlicker(ctx: CanvasRenderingContext2D) {
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

    function updateFlicker() {
      if (Math.random() < 0.01) {
        flickerIntensity = 0.1 + Math.random() * 0.15;
      } else {
        flickerIntensity *= 0.99;
        if (flickerIntensity < minFlickerIntensity)
          flickerIntensity = minFlickerIntensity;
      }
    }

    function drawScanLines(ctx: CanvasRenderingContext2D) {
      if (Math.random() < 0.01) {
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

    const animate = (_timestamp?: number) => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(particle => {
        updateParticle(particle);
        drawParticle(ctx, particle);
      });
      updateFlicker();
      drawFlicker(ctx);
      drawScanLines(ctx);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[url('/grain.gif')] bg-size-[512px_512px] bg-repeat opacity-[0.025]" />
    </>
  );
}
