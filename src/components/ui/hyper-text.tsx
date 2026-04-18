import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { cn } from "../../lib/utils";

const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function HyperText({
  children,
  className,
  duration = 800,
  delay = 0,
  animateOnLoad = true,
}: {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  animateOnLoad?: boolean;
}) {
  const [displayText, setDisplayText] = useState(children.split(""));
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(containerRef, { once: true });
  
  const iterations = useRef(0);
  const totalCharacters = children.length;

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    iterations.current = 0;
  }, []);

  useEffect(() => {
    if (isInView && animateOnLoad) {
      setTimeout(() => {
        triggerAnimation();
      }, delay);
    }
  }, [isInView, animateOnLoad, delay, triggerAnimation]);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setDisplayText((prevText) =>
        prevText.map((char, index) => {
          if (index < iterations.current) {
             return children[index]; // Settled
          }
          if (children[index] === " ") {
            return " ";
          }
          return alphabets[Math.floor(Math.random() * alphabets.length)];
        })
      );

      // We update iterations at a rate that completes inside the duration.
      // approx 30ms per tick
      const steps = duration / 30;
      iterations.current += totalCharacters / steps;

      if (iterations.current >= totalCharacters) {
        clearInterval(interval);
        setIsAnimating(false);
        setDisplayText(children.split("")); // finalize
      }
    }, 30);

    return () => clearInterval(interval);
  }, [children, duration, isAnimating, totalCharacters]);

  // Particle explosion effect for hyper text
  useEffect(() => {
    if (!isAnimating || !canvasRef.current || !containerRef.current) return;
    
    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[] = [];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const render = () => {
      if (!ctx || !containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = containerRef.current.offsetHeight;
      
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      // While scrambling characters, emit cool pixelated black dust around the edges
      if (iterations.current < totalCharacters) {
        for(let i=0; i<3; i++) {
            particles.push({
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 6,
              vy: (Math.random() - 0.5) * 6,
              life: 0,
              maxLife: 15 + Math.random() * 15,
              size: 2 + Math.random() * 3
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
        ctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnimating, totalCharacters]);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
      onMouseEnter={triggerAnimation}
    >
       <canvas 
         ref={canvasRef}
         className="absolute inset-0 pointer-events-none scale-150"
         style={{ zIndex: 20 }}
       />
      <div className={cn("flex scale-100 items-center justify-center overflow-hidden", className)}>
        {displayText.map((letter, i) => (
          <motion.span
            key={i}
            className={cn("inline-block whitespace-pre", children[i] === " " ? "w-2" : "")}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
