import { motion } from "motion/react";
import { Playbook, BusinessContext } from "../../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell, PieChart, Pie } from "recharts";
import { TrendingUp, Clock, Mail, DollarSign } from "lucide-react";

type OverviewSynopsisProps = {
  playbook: Playbook;
  context: BusinessContext;
};

export function OverviewSynopsis({ playbook, context }: OverviewSynopsisProps) {
  const COLORS = ['#000000', '#404040', '#A3A3A3'];
  const totalHours = playbook.automations.reduce((acc, curr) => acc + (curr.metrics?.laborHoursPerWeek || 0), 0);
  const totalDollars = playbook.automations.reduce((acc, curr) => acc + (curr.metrics?.dollarsPerYear || 0), 0);
  const totalEmails = playbook.automations.reduce((acc, curr) => acc + (curr.metrics?.emailsAutomatedPerWeek || 0), 0);
  
  const chartData = playbook.automations.map(auto => ({
    name: auto.title.substring(0, 15) + "...",
    hours: auto.metrics?.laborHoursPerWeek || 0,
    dollars: (auto.metrics?.dollarsPerYear || 0) / 1000, // in k
    value: auto.valueScore,
    friction: auto.frictionScore
  }));

  const valueDistribution = [
    { name: 'High Value', value: playbook.automations.filter(a => a.valueScore > 70).length },
    { name: 'Medium Value', value: playbook.automations.filter(a => a.valueScore <= 70 && a.valueScore > 40).length },
    { name: 'Strategic', value: playbook.automations.filter(a => a.valueScore <= 40).length },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* High-Impact Stat Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Annual Reclaimed Capital", value: `$${(totalDollars/1000).toFixed(0)}k`, icon: DollarSign, trend: "+14.2%" },
          { label: "Weekly Labor Capacity", value: `${totalHours}hrs`, icon: Clock, trend: "+25.8%" },
          { label: "Agent Comms Volume", value: totalEmails, icon: Mail, trend: "99.2% Acc" },
          { label: "Strategic Efficiency", value: "88%", icon: TrendingUp, trend: "Peak" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="zen-glass p-8 rounded-[2rem] space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-2xl bg-black/5 flex items-center justify-center">
                <stat.icon className="w-5 h-5 opacity-60" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">{stat.trend}</span>
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-[0.15em] mb-1">{stat.label}</h4>
              <p className="text-3xl font-serif text-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Value vs Friction Distribution */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="zen-glass p-10 rounded-[2.5rem] relative overflow-hidden"
        >
          <div className="relative z-10 space-y-8 h-full">
            <div>
              <h3 className="text-xl font-serif text-black mb-2">Efficiency Vector</h3>
              <p className="text-[13px] text-black/40">Correlation of automation value versus deployment friction.</p>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                  <Area type="monotone" dataKey="friction" stroke="#A3A3A3" strokeWidth={1} strokeDasharray="4 4" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Labor Dynamics Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="zen-glass p-10 rounded-[2.5rem]"
        >
          <div className="space-y-8 h-full">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-serif text-black mb-2">Labor Capacity Release</h3>
                <p className="text-[13px] text-black/40">Hours reclaimed across the enterprise architecture.</p>
              </div>
              <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-black opacity-60"></div>
                 <div className="w-3 h-3 rounded-full bg-black opacity-20"></div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5E5" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }}
                  />
                  <Bar dataKey="hours" radius={[10, 10, 10, 10]} barSize={24} fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Strategic Mix Pie */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="col-span-1 zen-glass p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-6"
         >
            <h3 className="text-[11px] font-bold text-black/40 uppercase tracking-widest">Architectural Focus</h3>
            <div className="h-[180px] w-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={valueDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {valueDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-6 mt-4">
               {valueDistribution.map((d, i) => (
                 <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-[10px] font-bold text-black/40 uppercase">{d.name}</span>
                 </div>
               ))}
            </div>
         </motion.div>

         <motion.div className="col-span-2 zen-glass p-10 rounded-[2.5rem] flex flex-col justify-center">
            <div className="space-y-8">
               <div className="space-y-3">
                 <h3 className="text-2xl font-serif text-black leading-tight">National Grade Infrastructure<br/>Calibrated for {context.name}.</h3>
                 <p className="text-[14px] text-black/50 leading-relaxed font-light">
                   ZEN Better analyzes operational entropy at the sub-atomic level. Our proposed model for {context.industry} focuses on the elimination of low-value manual processing, re-routing human capital toward high-yield strategy.
                 </p>
               </div>
               <div className="flex gap-4">
                  <button className="px-6 py-3 rounded-full bg-black text-white text-[12px] font-medium tracking-wide shadow-lg">View Detailed Steps</button>
                  <button className="px-6 py-3 rounded-full border border-black/10 text-black text-[12px] font-medium tracking-wide">Download Full PDF</button>
               </div>
            </div>
         </motion.div>
      </div>
    </div>
  );
}
