"use client";
import { useRef } from "react";

export default function MoneyRain() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const billsRef = useRef([]);

  function launch() {
    const canvas = canvasRef.current;
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (animRef.current) cancelAnimationFrame(animRef.current);

    billsRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      vy: 1.5 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 1.2,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.08,
      scale: 0.7 + Math.random() * 0.6,
    }));

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const b of billsRef.current) {
        b.y += b.vy;
        b.x += b.vx;
        b.rot += b.vr;
        if (b.y < canvas.height + 40) alive = true;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.scale(b.scale, b.scale);

        const w = 48, h = 22;
        ctx.fillStyle = "#4caf50";
        ctx.strokeStyle = "#2e7d32";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(-w / 2, -h / 2, w, h, 3);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = "#81c784";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-w / 2 + 3, -h / 2 + 3, w - 6, h - 6, 1);
        ctx.stroke();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("$", 0, 0);

        ctx.restore();
      }

      if (alive) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        canvas.style.display = "none";
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      <button
        onClick={launch}
        style={{
          marginLeft: "12px",
          padding: "4px 12px",
          fontSize: "13px",
          cursor: "pointer",
          border: "1.5px solid #2e7d32",
          borderRadius: "6px",
          background: "#e8f5e9",
          color: "#1b5e20",
          fontFamily: "inherit",
          verticalAlign: "middle",
          lineHeight: 1.4,
        }}
      >
        make it rain money 🤑
      </button>
    </>
  );
}
