import { motion } from "motion/react";
import { ArchitectureItem } from "../types";
import { Zap, Layers, Cpu } from "lucide-react";

type ProcessVisualizerProps = {
  automation: ArchitectureItem;
};

export function ProcessVisualizer({ automation }: ProcessVisualizerProps) {
  return (
    <div className="relative p-6 md:p-10 bg-black/5 flex flex-col md:flex-row items-stretch justify-between w-full h-full gap-4 md:gap-8 rounded-2xl">
      
      {/* Node 1: Origin */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 bg-white border border-white/50 p-6 md:p-8 rounded-2xl flex flex-col relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
            <Zap className="w-4 h-4 text-black/60" strokeWidth={2} />
          </div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">Origin</h4>
        </div>
        
        <div className="flex flex-col gap-2 mt-auto">
          {automation.triggers.map((t, i) => (
             <div key={i} className="text-[12px] font-medium text-black/70 bg-black/5 px-3 py-2 rounded-lg line-clamp-2">
              {t}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Logical Bridge */}
      <div className="flex justify-center items-center py-4 md:py-0">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full border border-dashed border-black/20 flex items-center justify-center relative bg-transparent"
        >
           <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-black/5 rounded-full"
           />
           <Cpu className="w-4 h-4 text-black/40 relative z-10" strokeWidth={1.5} />
        </motion.div>
      </div>

      {/* Node 2: Resolution */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 bg-white border border-white/50 p-6 md:p-8 rounded-2xl flex flex-col relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50/50 rounded-full blur-3xl -z-10" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center">
            <Layers className="w-4 h-4 text-black/60" strokeWidth={2} />
          </div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50">Mutation</h4>
        </div>
        
        <div className="flex flex-col gap-2 mt-auto">
          {automation.outputs.map((o, i) => (
            <div key={i} className="text-[12px] font-medium text-black/70 bg-black/5 px-3 py-2 rounded-lg line-clamp-2">
              {o}
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
