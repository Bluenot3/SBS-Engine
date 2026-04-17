import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BusinessContext, Playbook, PrioritizationCategory } from "../../types";
import { Map, Zap, Users, Calendar, Target, ShieldCheck, AlertCircle, Maximize2, ChevronDown } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, ReferenceLine } from "recharts";
import { ProcessVisualizer } from "../../components/ProcessVisualizer";

type DashboardProps = {
  playbook: Playbook;
  context: BusinessContext;
  reset?: () => void;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="zen-glass p-4 rounded-xl pointer-events-none max-w-xs shadow-xl">
        <p className="font-medium text-[13px] text-black mb-1 leading-tight">{data.title}</p>
        <p className="text-[11px] text-black/50 mb-2 font-medium tracking-wide uppercase">{data.category}</p>
        <div className="flex gap-4 text-[11px] text-black/40 font-mono">
          <span>V:{data.valueScore || data.impact}</span>
          <span>F:{data.frictionScore || data.complexity}</span>
        </div>
      </div>
    );
  }
  return null;
};

const getCategoryColor = (category: PrioritizationCategory | string) => {
  switch (category) {
    case 'Can do now': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    case 'Should do next': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
    case 'Requires infrastructure first': return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    case 'Not worth doing yet': return 'bg-red-500/10 text-red-700 border-red-500/20';
    default: return 'bg-black/5 text-black border-black/10';
  }
};

export function Dashboard({ playbook, context, reset }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "automations" | "agents" | "roadmap">("overview");
  const [expandedArchitecture, setExpandedArchitecture] = useState<number | null>(0);

  const tabs = [
    { id: "overview", label: "Intelligence", icon: Map },
    { id: "automations", label: "Architecture", icon: Zap },
    { id: "agents", label: "Orchestration", icon: Users },
    { id: "roadmap", label: "Deployment", icon: Calendar },
  ] as const;

  const chartData = playbook.prioritizationMatrix.map(item => ({
    ...item,
    valueScore: item.valueScore !== undefined ? item.valueScore : (item as any).impact * 10,
    frictionScore: item.frictionScore !== undefined ? item.frictionScore : (item as any).complexity * 10,
  }));

  return (
    <div className="space-y-8 h-full flex flex-col relative z-10 w-full mb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 pb-8 mt-12 md:mt-2">
        <div>
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em] mb-3"
          >
            {context.scale} Topology Scaffold
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-serif text-4xl md:text-5xl font-light text-black tracking-tight"
          >
            {context.name}
          </motion.h1>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-2xl font-medium text-[13px] flex items-center gap-3 transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? "bg-black text-white shadow-xl scale-105" 
                : "bg-black/5 text-black/60 hover:bg-black/10"
            }`}
          >
            <tab.icon className={`w-[14px] h-[14px] ${activeTab === tab.id ? 'opacity-100' : 'opacity-60'}`} />
            {tab.label}
          </button>
        ))}
      </motion.div>

      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              <div className="lg:col-span-2 space-y-6">
                <div className="zen-glass-heavy rounded-3xl p-8 md:p-10 flex flex-col relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-6 flex justify-between items-center relative z-10">
                    Diagnostic Synthesis
                    <span className="text-emerald-600 flex items-center gap-2 font-medium bg-emerald-50 px-3 py-1 rounded-full"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Optimal</span>
                  </div>
                  <p className="text-black/80 font-light text-lg leading-relaxed relative z-10">{playbook.diagnosis.executiveSummary}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="zen-glass rounded-3xl p-8 flex flex-col hover:-translate-y-1 transition-transform duration-500">
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-6 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      </div>
                      Inefficiencies
                    </div>
                    <ul className="space-y-4">
                      {playbook.diagnosis.structuralInefficiencies.map((item, i) => (
                        <li key={i} className="flex gap-3 text-[14px] text-black/70 font-light leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="zen-glass rounded-3xl p-8 flex flex-col hover:-translate-y-1 transition-transform duration-500">
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-6 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">
                        <Target className="w-3 h-3 text-amber-600" />
                      </div>
                      Risk Vectors
                    </div>
                    <ul className="space-y-4">
                      {playbook.diagnosis.scalingRisks.map((item, i) => (
                        <li key={i} className="flex gap-3 text-[14px] text-black/70 font-light leading-snug">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="zen-glass rounded-3xl p-8 flex flex-col">
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-8">System Volumes</div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-black/5 pb-4">
                      <span className="text-[14px] font-light text-black/60">Automations Generated</span>
                      <span className="text-3xl font-light text-black">{playbook.automations.length}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-black/5 pb-4">
                      <span className="text-[14px] font-light text-black/60">Agent Topologies</span>
                      <span className="text-3xl font-light text-black">{playbook.agents.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] font-light text-black/60">Deployment Phasing</span>
                      <span className="text-3xl font-light text-black">{playbook.roadmap.length}</span>
                    </div>
                  </div>
                </div>

                <div className="zen-glass-heavy rounded-3xl p-8 flex flex-col">
                  <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-6">Scatter Analysis</div>
                  <div className="h-64 w-full relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-blue-50/50 rounded-xl pointer-events-none"></div>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                        <XAxis type="number" dataKey="frictionScore" name="Friction" domain={[0, 100]} stroke="rgba(0,0,0,0.2)" tick={false} label={{ value: "Friction →", position: "bottom", offset: 0, fill: "rgba(0,0,0,0.4)", fontSize: 10, fontWeight: 600, textAnchor: "middle" }} />
                        <YAxis type="number" dataKey="valueScore" name="Value" domain={[0, 100]} stroke="rgba(0,0,0,0.2)" tick={false} label={{ value: "Value ↑", angle: -90, position: "insideLeft", fill: "rgba(0,0,0,0.4)", fontSize: 10, fontWeight: 600, textAnchor: "middle" }} />
                        <ZAxis type="number" range={[150, 150]} />
                        <ReferenceLine x={50} stroke="rgba(0,0,0,0.1)" />
                        <ReferenceLine y={50} stroke="rgba(0,0,0,0.1)" />
                        <Tooltip cursor={{ strokeDasharray: '3 3', stroke: 'rgba(0,0,0,0.1)' }} content={<CustomTooltip />} />
                        <Scatter data={chartData} fill="#000000" className="drop-shadow-md" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "automations" && (
            <motion.div
              key="automations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-6"
            >
              {playbook.automations.map((auto, i) => (
                <motion.div 
                  key={i} 
                  layout
                  className={`zen-glass border border-white/60 rounded-[2rem] p-8 md:p-10 flex flex-col relative overflow-hidden transition-all duration-500 cursor-pointer ${expandedArchitecture === i ? 'shadow-2xl scale-[1.01]' : 'hover:scale-[1.005]'}`}
                  onClick={() => setExpandedArchitecture(expandedArchitecture === i ? null : i)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center shrink-0">
                        <Zap className="w-5 h-5 text-black/80" />
                      </div>
                      <div className="pt-2">
                        <h3 className="text-xl md:text-2xl font-serif text-black mb-2 leading-tight">{auto.title}</h3>
                        <p className={`text-[14px] text-black/60 font-light max-w-3xl leading-relaxed ${expandedArchitecture === i ? '' : 'line-clamp-2'}`}>{auto.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 pt-2">
                      {auto.category && (
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase border ${getCategoryColor(auto.category)}`}>
                          {auto.category}
                        </span>
                      )}
                       <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center transition-colors hover:bg-black/10 mt-auto">
                         <ChevronDown className={`w-4 h-4 text-black transition-transform duration-500 ${expandedArchitecture === i ? 'rotate-180' : ''}`} />
                       </div>
                    </div>
                  </div>
                  
                  {expandedArchitecture === i && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="origin-top"
                    >
                      <div className="pt-8 border-t border-black/5 mt-6">
                        <div className="mb-10 w-full rounded-2xl overflow-hidden shadow-sm">
                           <ProcessVisualizer architecture={auto} />
                        </div>

                        {auto.valueScore && auto.frictionScore && (
                           <div className="flex gap-8 mb-8 bg-black/5 px-6 py-4 rounded-2xl inline-flex w-full md:w-auto">
                              <div className="flex flex-col gap-1 w-1/2 md:w-auto text-center md:text-left">
                                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Value Density</span>
                                <span className="text-2xl font-light text-black">{auto.valueScore}</span>
                              </div>
                              <div className="w-[1px] bg-black/10"></div>
                              <div className="flex flex-col gap-1 w-1/2 md:w-auto text-center md:text-left">
                                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Friction Index</span>
                                <span className="text-2xl font-light text-black">{auto.frictionScore}</span>
                              </div>
                           </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-[13px]">
                          <div className="zen-glass p-6 rounded-2xl">
                            <span className="block text-[10px] font-bold text-black/40 uppercase tracking-[0.1em] mb-4">Ingestion Vectors</span>
                            <ul className="space-y-3">
                              {auto.triggers.map((t, idx) => <li key={idx} className="flex gap-3 text-black/70 font-light"><span className="text-black/20 font-bold">→</span> {t}</li>)}
                            </ul>
                          </div>
                          <div className="zen-glass p-6 rounded-2xl">
                            <span className="block text-[10px] font-bold text-black/40 uppercase tracking-[0.1em] mb-4">Execution State</span>
                            <ul className="space-y-3">
                              {auto.outputs.map((o, idx) => <li key={idx} className="flex gap-3 text-black/70 font-light"><span className="text-black/20 font-bold">←</span> {o}</li>)}
                            </ul>
                          </div>
                          <div className="zen-glass p-6 rounded-2xl">
                            <span className="block text-[10px] font-bold text-black/40 uppercase tracking-[0.1em] mb-4">Required Connectors</span>
                            <div className="flex flex-wrap gap-2">
                               {auto.integrations.map((int, idx) => <span key={idx} className="px-3 py-1.5 bg-white border border-black/10 rounded-xl text-[11px] font-medium text-black/70 shadow-sm">{int}</span>)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === "agents" && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-6"
            >
              {playbook.agents.map((agent, i) => (
                <div key={i} className="zen-glass-heavy rounded-[2rem] p-8 md:p-10 flex flex-col relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent blur-3xl rounded-full opacity-50 pointer-events-none"></div>
                  <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-black/80" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif text-black mb-2">{agent.role}</h3>
                        <p className="text-[14px] font-light text-black/60 leading-relaxed">{agent.scope}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div className="zen-glass rounded-2xl p-6 h-full border border-black/5">
                         <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/40 mb-6 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Subroutines</h4>
                         <ul className="space-y-4 font-light text-[13px] text-black/80">
                           {agent.actions.map((act, idx) => (
                             <li key={idx} className="flex items-start gap-3">
                               <span className="text-black/20 font-bold mt-0.5">→</span>
                               {act}
                             </li>
                           ))}
                         </ul>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="zen-glass rounded-2xl p-6 border border-black/5">
                           <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-black/40 mb-4 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Boundary</h4>
                           <ul className="space-y-2 font-light text-[13px] text-black/70">
                               {agent.boundaries.map((b, idx) => (
                                   <li key={idx}>- {b}</li>
                               ))}
                           </ul>
                        </div>
                        <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100/50">
                           <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-red-700/60 mb-4 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Escalation</h4>
                           <p className="font-light text-[13px] text-red-900/80 leading-relaxed">{agent.escalationLogic}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "roadmap" && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl mx-auto space-y-12 py-10 w-full relative"
            >
              <div className="absolute left-[39px] md:left-1/2 top-10 bottom-10 w-[1px] bg-gradient-to-b from-black/0 via-black/10 to-transparent md:-translate-x-1/2"></div>
              
              {playbook.roadmap.map((phase, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row gap-12 md:gap-0 ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  
                  <div className="hidden md:block w-1/2"></div>
                  
                  <div className="absolute left-6 md:left-1/2 w-8 h-8 rounded-full bg-white border border-black/10 md:-translate-x-1/2 flex items-center justify-center z-10 shadow-sm mt-8">
                    <div className="w-2 h-2 bg-black rounded-full" />
                  </div>
                  
                  <div className="w-full md:w-1/2 pl-20 md:pl-0">
                    <div className={`zen-glass-heavy border border-white/60 p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] ${i % 2 === 0 ? "md:ml-16" : "md:mr-16"}`}>
                      <span className="inline-block px-4 py-2 bg-black/5 rounded-full text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-6">{phase.timeframe}</span>
                      <h3 className="text-2xl font-serif mb-8 text-black">{phase.title}</h3>
                      <ul className="space-y-4">
                        {phase.items.map((item, idx) => (
                          <li key={idx} className="flex gap-4 text-black/70 font-light text-[14px] leading-relaxed">
                            <span className="text-black/20 font-bold mt-1">→</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
