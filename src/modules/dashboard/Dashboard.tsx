import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BusinessContext, Playbook, PrioritizationCategory, GranularMetrics } from "../../types";
import { Map, Zap, Users, Calendar, Target, ShieldCheck, AlertCircle, Maximize2, ChevronDown, Clock, MousePointer, Mail, Globe, Activity } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, ReferenceLine } from "recharts";
import { ProcessVisualizer } from "../../components/ProcessVisualizer";
import { OverviewSynopsis } from "./OverviewSynopsis";
import { NumberTicker } from "../../components/ui/number-ticker";

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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <OverviewSynopsis playbook={playbook} context={context} />
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
                           <ProcessVisualizer automation={auto} />
                        </div>

                        {/* Granular Metrics Dashboard */}
                        {auto.metrics && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                            {[
                              { label: "Labor Impact", value: auto.metrics.laborHoursPerWeek, suffix: "h/wk", icon: Clock },
                              { label: "Yield (Est)", prefix: "$", value: auto.metrics.dollarsPerYear/1000, suffix: "k/yr", decimalPlaces: 0, icon: Target },
                              { label: "Agent Output", value: auto.metrics.emailsAutomatedPerWeek, suffix: " comms", icon: Mail },
                              { label: "Error Reduction", value: auto.metrics.errorRateReduction, suffix: "%", icon: ShieldCheck }
                            ].map((m, i) => (
                              <div key={i} className="zen-glass p-5 rounded-3xl flex flex-col gap-2">
                                <m.icon className="w-4 h-4 opacity-40 mb-1" />
                                <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">{m.label}</span>
                                <span className="text-xl font-medium text-black">
                                  <NumberTicker value={m.value} prefix={m.prefix} suffix={m.suffix} decimalPlaces={m.decimalPlaces} />
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Deep Financial & Obstacle Integration */}
                        {auto.forecast && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            {/* ROI Forecasting */}
                            <div className="zen-glass p-8 rounded-3xl space-y-6">
                              <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                10-Year Mathematical Forecast
                              </h4>
                              <div className="grid grid-cols-2 gap-6">
                                <div>
                                  <span className="block text-[10px] text-black/40 uppercase tracking-widest mb-1">Ten-Year Compounding Savings</span>
                                  <span className="text-3xl font-serif text-black">
                                    <NumberTicker prefix="$" value={auto.forecast.tenYearCumulativeSavings / 1000000} suffix="M" decimalPlaces={2} />
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-black/40 uppercase tracking-widest mb-1">Calculated ROI</span>
                                  <span className="text-3xl font-serif text-black">
                                    <NumberTicker value={auto.forecast.ROI} suffix="%" />
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-black/40 uppercase tracking-widest mb-1">Initial CapEx</span>
                                  <span className="text-xl font-medium text-black">
                                    <NumberTicker prefix="$" value={auto.forecast.initialImplementationCost / 1000} suffix="k" decimalPlaces={1} />
                                  </span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-black/40 uppercase tracking-widest mb-1">Break-Even Point</span>
                                  <span className="text-xl font-medium text-black">
                                    Month <NumberTicker value={auto.forecast.breakEvenMonth} />
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Obstacle Mitigation */}
                            {auto.obstacles && auto.obstacles.length > 0 && (
                              <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100/50 space-y-4">
                                <h4 className="text-[11px] font-bold text-red-800/60 uppercase tracking-[0.2em] flex items-center gap-2">
                                  <ShieldCheck className="w-3 h-3 text-red-500" />
                                  Predicted Roadblocks & Pivot Logic
                                </h4>
                                {auto.obstacles.map((obs, idx) => (
                                  <div key={idx} className="space-y-3">
                                    <div className="flex justify-between items-start">
                                      <span className="text-[14px] font-medium text-red-900">{obs.roadblock}</span>
                                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${obs.riskImpact === 'high' || obs.riskImpact === 'critical' ? 'bg-red-500/20 text-red-700' : 'bg-red-500/10 text-red-600'}`}>
                                        {obs.riskImpact} Risk
                                      </span>
                                    </div>
                                    <div className="pl-4 border-l-2 border-red-200/50 space-y-2">
                                      <span className="block text-[11px] text-red-800/70 font-medium">PIVOT STRATEGY: {obs.alternativeRoute}</span>
                                      <ul className="space-y-1">
                                        {obs.rectificationSteps.map((step, sIdx) => (
                                          <li key={sIdx} className="text-[12px] text-red-900/60 font-light">• {step}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Granular Matrix Detail */}
                        {auto.metrics?.savingsPerPerson && (
                           <div className="mb-10 zen-glass-heavy p-8 rounded-[2.5rem] overflow-hidden relative">
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-transparent opacity-20" />
                              <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-[0.2em] mb-6">Granular Fractional Savings</h4>
                              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                                {['Hour', 'Day', 'Week', 'Month', 'Year', 'Decade'].map((scope, idx) => {
                                  const key = scope.toLowerCase() as keyof GranularMetrics;
                                  return (
                                  <div key={idx} className="space-y-2">
                                    <span className="block text-[9px] font-bold text-black/30 uppercase tracking-widest border-b border-black/5 pb-2">Per {scope}</span>
                                    <div className="space-y-1 pt-2">
                                      <span className="block text-[14px] font-medium text-emerald-700">
                                        <NumberTicker prefix="$" value={auto.metrics.savingsPerTeam.dollars[key] || 0} decimalPlaces={auto.metrics.savingsPerTeam.dollars[key] % 1 === 0 ? 0 : 2} />
                                      </span>
                                      <span className="block text-[11px] font-light text-black/50">
                                        <NumberTicker value={auto.metrics.savingsPerTeam.hours[key] || 0} suffix=" hrs" />
                                      </span>
                                    </div>
                                  </div>
                                )})}
                              </div>
                           </div>
                        )}

                        {/* Platform Badges */}
                        <div className="mb-10 flex flex-wrap gap-3 items-center">
                          <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest mr-2">InfrastructureStack</span>
                          {auto.platforms?.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full border border-black/5 hover:bg-black text-white hover:border-black transition-all group">
                               <Globe className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                               <span className="text-[11px] font-medium transition-colors group-hover:text-white text-black/60">{p}</span>
                            </div>
                          ))}
                        </div>

                        {/* Deployment Roadmap */}
                        <div className="mb-10 p-10 zen-glass-heavy rounded-[2.5rem] relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-10">
                              <Target className="w-24 h-24 rotate-12" />
                           </div>
                           <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-[0.2em] mb-8">Implementation Sequence</h4>
                           <div className="space-y-6">
                              {auto.implementationSteps?.map((step, idx) => (
                                <div key={idx} className="flex gap-6 items-start group/step">
                                   <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-lg transition-transform group-hover/step:scale-110">
                                      {idx + 1}
                                   </div>
                                   <p className="text-[14px] text-black/70 font-light leading-relaxed pt-1">{step}</p>
                                </div>
                              ))}
                           </div>
                        </div>

                        {auto.valueScore && auto.frictionScore && (
                           <div className="flex gap-8 mb-8 bg-black/5 px-6 py-4 rounded-2xl inline-flex w-full md:w-auto">
                              <div className="flex flex-col gap-1 w-1/2 md:w-auto text-center md:text-left">
                                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Value Density</span>
                                <span className="text-2xl font-light text-black"><NumberTicker value={auto.valueScore} /></span>
                              </div>
                              <div className="w-[1px] bg-black/10"></div>
                              <div className="flex flex-col gap-1 w-1/2 md:w-auto text-center md:text-left">
                                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Friction Index</span>
                                <span className="text-2xl font-light text-black"><NumberTicker value={auto.frictionScore} /></span>
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
                      
                      {phase.detailedItems ? (
                        <div className="space-y-6">
                           {phase.detailedItems.map((item, idx) => (
                              <div key={idx} className="flex flex-col gap-2 p-4 bg-white/50 border border-black/5 rounded-2xl">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="font-medium text-[14px] text-black/80">{item.task}</span>
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-700 bg-emerald-500/10 px-2 py-1 rounded-full">{item.assignedTeam}</span>
                                 </div>
                                 <div className="flex flex-wrap gap-4 text-[11px] text-black/50 font-mono">
                                    <span>T+{item.startDateOffsetDays} days</span>
                                    <span>Duration: {item.durationDays} days</span>
                                    {item.dependencies.length > 0 && (
                                       <span className="text-amber-600">Requires: {item.dependencies[0]}</span>
                                    )}
                                 </div>
                              </div>
                           ))}
                        </div>
                      ) : (
                        <ul className="space-y-4">
                          {phase.items.map((item, idx) => (
                            <li key={idx} className="flex gap-4 text-black/70 font-light text-[14px] leading-relaxed">
                              <span className="text-black/20 font-bold mt-1">→</span> {item}
                            </li>
                          ))}
                        </ul>
                      )}
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
