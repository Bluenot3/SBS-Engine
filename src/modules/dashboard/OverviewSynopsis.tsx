import { motion } from "motion/react";
import { Playbook, BusinessContext } from "../../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis, ReferenceLine } from "recharts";
import { TrendingUp, Clock, Mail, DollarSign, Activity } from "lucide-react";
import { NumberTicker } from "../../components/ui/number-ticker";

type OverviewSynopsisProps = {
  playbook: Playbook;
  context: BusinessContext;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[160px]">
        <p className="font-medium text-[13px] text-white/90 mb-1 leading-tight">{label || payload[0]?.payload?.name || "Metric"}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between items-center gap-4 mt-2">
            <span className="text-[11px] text-white/50 uppercase tracking-widest">{entry.name}</span>
            <span className="text-[14px] font-mono text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function OverviewSynopsis({ playbook, context }: OverviewSynopsisProps) {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1'];
  const totalHours = playbook.automations.reduce((acc, curr) => acc + (curr.metrics?.laborHoursPerWeek || 0), 0);
  const totalDollars = playbook.automations.reduce((acc, curr) => acc + (curr.metrics?.dollarsPerYear || 0), 0);
  const totalEmails = playbook.automations.reduce((acc, curr) => acc + (curr.metrics?.emailsAutomatedPerWeek || 0), 0);
  
  const chartData = playbook.automations.map(auto => ({
    name: auto.title.substring(0, 15) + "...",
    hours: auto.metrics?.laborHoursPerWeek || 0,
    dollars: (auto.metrics?.dollarsPerYear || 0) / 1000, 
    value: auto.valueScore,
    friction: auto.frictionScore
  }));

  const scatterData = playbook.prioritizationMatrix.map(item => ({
    name: item.title,
    value: item.valueScore,
    friction: item.frictionScore,
    z: 100 // node size
  }));

  const valueDistribution = [
    { name: 'High Value', value: playbook.automations.filter(a => a.valueScore > 70).length },
    { name: 'Medium Value', value: playbook.automations.filter(a => a.valueScore <= 70 && a.valueScore > 40).length },
    { name: 'Strategic', value: playbook.automations.filter(a => a.valueScore <= 40).length },
  ];

  const radarData = [
    { subject: 'Scalability', A: 95, fullMark: 100 },
    { subject: 'Cost Efficiency', A: 85, fullMark: 100 },
    { subject: 'Velocity', A: Math.min(100, totalHours + 20), fullMark: 100 },
    { subject: 'Resilience', A: 90, fullMark: 100 },
    { subject: 'Accuracy', A: 99, fullMark: 100 },
    { subject: 'Autonomy', A: playbook.agents.length * 20 + 30, fullMark: 100 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 50, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show" 
      className="space-y-10 pb-20 mt-4"
    >
      {/* High-Impact Stat Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Annual Capital", prefix: "$", value: totalDollars / 1000, suffix: "k", decimalPlaces: 0, icon: DollarSign, trend: "+14.2%" },
          { label: "Weekly Capacity", prefix: "", value: totalHours, suffix: " hrs", decimalPlaces: 0, icon: Clock, trend: "+25.8%" },
          { label: "Agent Output", prefix: "", value: totalEmails, suffix: " units", decimalPlaces: 0, icon: Mail, trend: "99.2% Acc" },
          { label: "Synergy Index", prefix: "", value: 94, suffix: "%", decimalPlaces: 0, icon: Activity, trend: "Peak" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            className="zen-glass p-8 rounded-[2rem] space-y-4 relative overflow-hidden group cursor-default"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center border border-black/5 group-hover:border-black/20 transition-all">
                <stat.icon className="w-5 h-5 text-black/70 group-hover:text-black group-hover:scale-110 transition-all" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider">{stat.trend}</span>
            </div>
            <div className="relative z-10 pt-2">
              <h4 className="text-[11px] font-bold text-black/50 uppercase tracking-[0.15em] mb-1">{stat.label}</h4>
              <p className="text-4xl font-serif text-black">
                <NumberTicker 
                  value={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                  decimalPlaces={stat.decimalPlaces} 
                />
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dynamic Area Chart */}
        <motion.div variants={itemVariants} className="zen-glass p-10 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="relative z-10 space-y-8 h-full">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-serif text-black mb-1">Efficiency Vector</h3>
                <p className="text-[13px] text-black/40 font-medium">Value vs Deployment Friction Correlation</p>
              </div>
              <TrendingUp className="text-black/20 w-6 h-6" />
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFriction" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#000', opacity: 0.5, fontFamily: 'var(--font-mono)' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#000', opacity: 0.5, fontFamily: 'var(--font-mono)' }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="step" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  <Area type="step" dataKey="friction" stroke="#000000" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorFriction)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Priority Matrix Scatter */}
        <motion.div variants={itemVariants} className="zen-glass p-10 rounded-[2.5rem] relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="space-y-8 h-full relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-serif text-black mb-1">Impact Matrix</h3>
                <p className="text-[13px] text-black/40 font-medium">Actionable Intelligence Mapping</p>
              </div>
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                 <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000000" opacity={0.05} />
                  <XAxis type="number" dataKey="friction" name="Friction" unit=" idx" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#000', opacity: 0.5, fontFamily: 'var(--font-mono)' }} domain={[0, 100]} />
                  <YAxis type="number" dataKey="value" name="Value" unit=" pts" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#000', opacity: 0.5, fontFamily: 'var(--font-mono)' }} domain={[0, 100]} />
                  <ZAxis type="number" dataKey="z" range={[100, 300]} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#000' }} />
                  <ReferenceLine x={50} stroke="#000000" strokeOpacity={0.1} />
                  <ReferenceLine y={50} stroke="#000000" strokeOpacity={0.1} />
                  <Scatter name="Intel" data={scatterData} fill="#000000">
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#000000'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
              {/* Matrix Labels */}
              <div className="absolute top-[80px] left-[60px] text-[10px] font-bold text-black/20 uppercase tracking-widest -rotate-90 origin-left">High Value</div>
              <div className="absolute bottom-[20px] right-[40px] text-[10px] font-bold text-black/20 uppercase tracking-widest">High Friction</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* System Synergy Radar */}
         <motion.div variants={itemVariants} className="col-span-1 zen-glass p-8 rounded-[2.5rem] flex flex-col space-y-6 relative group overflow-hidden">
            <h3 className="text-[11px] font-bold text-black/50 uppercase tracking-[0.2em] mb-2 text-center w-full z-10">System Synergy</h3>
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
            <div className="flex-1 min-h-[220px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#000000" strokeOpacity={0.08} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#000000', opacity: 0.8, fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Synergy" dataKey="A" stroke="#000000" strokeWidth={2} fill="#000000" fillOpacity={0.05} />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
         </motion.div>

         {/* Executive Summary Area */}
         <motion.div variants={itemVariants} className="col-span-2 zen-glass p-10 rounded-[2.5rem] flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-gradient-to-t from-emerald-500/10 to-transparent blur-[80px] rounded-full pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="space-y-8 relative z-10">
               <div className="space-y-4">
                 <h3 className="text-3xl font-serif text-black leading-tight tracking-tight">National Grade Infrastructure<br/><span className="text-black/50">Calibrated for {context.name}.</span></h3>
                 <p className="text-[15px] text-black/70 leading-relaxed font-light max-w-2xl">
                   ZEN Better analyzes operational entropy at the sub-atomic level. Our proposed model for the {context.industry} sector focuses on the absolute elimination of low-value manual processing, seamlessly re-routing human capital toward high-yield cognitive strategy and exponential growth.
                 </p>
               </div>
               <div className="flex flex-wrap gap-4 pt-2 no-print relative">
                  <button className="px-8 py-4 rounded-full bg-black text-white text-[13px] font-medium tracking-wide shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all">
                    Initiate Deployment
                  </button>
                  <div className="relative group">
                    <button 
                      onClick={() => window.print()}
                      className="px-8 py-4 rounded-full bg-white/50 border border-black/10 text-black text-[13px] font-medium tracking-wide hover:bg-white hover:shadow-lg transition-all"
                    >
                      Export Actions
                    </button>
                    
                    <div className="absolute bottom-full mb-2 left-0 w-64 bg-white/90 backdrop-blur-xl shadow-xl border border-black/5 rounded-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col z-50">
                       <button className="text-left px-4 py-3 hover:bg-black/5 rounded-xl text-black text-[13px]" onClick={(e) => {
                          e.stopPropagation();
                          let csv = "Title,Category,Expected Value,Hours Saved/Wk,Implementation Ease\n";
                          playbook.automations.forEach(a => {
                             csv += `"${a.title}","${a.category || ''}","${a.expectedValue}","${a.metrics?.laborHoursPerWeek}","${a.scores?.implementationEase}"\n`;
                          });
                          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                          const link = document.createElement("a");
                          link.href = URL.createObjectURL(blob);
                          link.setAttribute("download", "zen-better-intelligence.csv");
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                       }}>Download Data (CSV)</button>
                       <button className="text-left px-4 py-3 hover:bg-black/5 rounded-xl text-black text-[13px]" onClick={(e) => {
                          e.stopPropagation();
                          const md = `# ZEN Better: Operations Architecture\n\n## Client: ${context.name} (${context.industry})\n\n### Diagnosis\n${playbook.diagnosis?.executiveSummary}\n\n### Proposed Systems\n${playbook.automations.map(a => `- **${a.title}**: ${a.description} (Value: ${a.expectedValue})`).join('\n')}\n\n### Recommended Rollout\n${playbook.roadmap.map(r => `**${r.phase}**: ${r.title}\n${r.items.map(i => `  - ${i}`).join('\n')}`).join('\n\n')}`;
                          navigator.clipboard.writeText(md);
                          alert("Architecture copied to clipboard for Claude/Gemini!");
                       }}>Copy AI Context (Markdown)</button>
                       <button className="text-left px-4 py-3 hover:bg-black/5 rounded-xl text-black text-[13px]" onClick={(e) => {
                          e.stopPropagation();
                          window.print();
                       }}>Export Executive Brief (PDF)</button>
                    </div>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
}
