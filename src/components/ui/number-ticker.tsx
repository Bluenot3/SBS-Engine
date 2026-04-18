import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * High-end animated number ticker with dark energy particle emission.
 */
export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  decimalPlaces = 0,
  prefix = "",
  suffix = ""
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[] = [];
    const canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.pointerEvents = "none";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "10";
    
    // Check local storage or context if possible, but appending to relative parent is safer
    if (ref.current && ref.current.parentElement) {
      ref.current.parentElement.style.position = "relative";
      ref.current.parentElement.appendChild(canvas);
    }

    const ctx = canvas.getContext("2d");

    const render = () => {
      if (!ctx || !ref.current) return;
      
      const width = ref.current.offsetWidth;
      const height = ref.current.offsetHeight;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // Add new particles if still animating heavily (velocity check)
      const currentVal = springValue.get();
      const targetVal = value;
      const progress = currentVal / targetVal;

      if (progress < 0.999 && currentVal > 0 && Math.random() > 0.3) {
        for(let i=0; i<2; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 1) * 3, // slightly upward
            life: 0,
            maxLife: 20 + Math.random() * 20,
            size: 1 + Math.random() * 2
          });
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        
        const alpha = 1 - (p.life / p.maxLife);
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.beginPath();
        // pixelated/dust look - simple rects
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [springValue, value]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = 
          prefix + 
          Intl.NumberFormat("en-US", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces))) + 
          suffix;
      }
    });
  }, [springValue, decimalPlaces, prefix, suffix]);

  return (
    <span
      className={cn(
        "inline-block tabular-nums tracking-wider",
        className,
      )}
      ref={ref}
    />
  );
}
