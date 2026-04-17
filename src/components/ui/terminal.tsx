import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface TerminalProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Terminal = ({ children, className, title = "zen@better: ~" }: TerminalProps) => {
  return (
    <div className={cn(
      "flex flex-col h-full w-full rounded-2xl bg-black border border-white/10 overflow-hidden shadow-2xl font-mono text-[13px] text-white/80",
      className
    )}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-[11px] font-medium tracking-wide text-white/40 select-none">
          {title}
        </div>
        <div className="w-12 h-1" /> {/* Spacer */}
      </div>
      
      {/* Terminal Body */}
      <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-2">
        {children}
      </div>
    </div>
  );
};

interface AnimatedSpanProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSpan = ({ children, className, delay = 0 }: AnimatedSpanProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {children}
    </motion.div>
  );
};

interface TypingAnimationProps {
  children: string;
  className?: string;
  delay?: number;
  speed?: number;
}

export const TypingAnimation = ({ children, className, delay = 0, speed = 40 }: TypingAnimationProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(children.substring(0, i + 1));
        i++;
        if (i >= children.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [children, delay, speed]);

  return (
    <div className={cn("flex items-center", className)}>
      <span>{displayedText}</span>
      {!isDone && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-white/60 ml-1"
        />
      )}
    </div>
  );
};
