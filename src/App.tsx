import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Cpu } from "lucide-react";
import { BusinessContext, Playbook } from "./types";
import { generatePlaybook } from "./services/ai";
import { IntakeWizard } from "./modules/intake/IntakeWizard";
import { Dashboard } from "./modules/dashboard/Dashboard";

export default function App() {
  const [appState, setAppState] = useState<"landing" | "intake" | "loading" | "dashboard">("landing");
  const [businessContext, setBusinessContext] = useState<BusinessContext | null>(null);
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startIntake = () => setAppState("intake");

  const handleIntakeComplete = async (context: BusinessContext) => {
    setBusinessContext(context);
    setAppState("loading");
    setError(null);
    try {
      const generated = await generatePlaybook(context);
      setPlaybook(generated);
      setAppState("dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to generate playbook. Please try again.");
      setAppState("intake"); 
    }
  };

  const loadDemo = () => {
    // Re-use demoContext and demoPlaybook payload exactly
    const demoContext: BusinessContext = {
      name: "Summit Marinas",
      industry: "Marinas & Hospitality",
      scale: "multi-location",
      locationCount: 45,
      operatingModel: "hybrid",
      currentStack: "Dockwa for slips, generic QuickBooks, disparate spreadsheets per location",
      painPoints: "Local GMs spend 20 hours a week chasing unpaid slip fees and entering basic boat data into two systems. No central visibility across 45 properties.",
      goals: "Centralize collections, automate billing, provide executive visibility",
      budgetSensitivity: "medium"
    };
    const demoPlaybook: Playbook = {
      diagnosis: {
        executiveSummary: "Summit Marinas is experiencing significant operational drag due to fragmented local data silos. Centralizing billing and automating basic customer workflows could free up 900+ hours per week across the enterprise, directly accelerating revenue collection.",
        currentPainPoints: ["Manual data entry across systems", "Slow unpaid fee collection", "No central executive visibility"],
        structuralInefficiencies: ["Decentralized accounts receivable", "Duplicated tools at the site level", "High dependency on general managers for routine administration"],
        scalingRisks: ["Inability to forecast cash flow accurately", "High staff turnover due to administrative burden", "Inconsistent customer experience across locations"]
      },
      automations: [
        {
          title: "Automated Collections Workflow",
          description: "A centralized system that detects past-due slips and triggers a sequenced communication flow to boat owners before escalating to local managers.",
          impacts: "Reduces receivable days by 40%, saves GM time",
          problemSolved: "Slow unpaid fee collection at local level",
          triggers: ["Invoice 5 days past due", "Invoice 15 days past due"],
          inputs: ["Billing Data", "CRM contact"],
          outputs: ["Automated SMS/Email", "Dashboard Flag for GM"],
          integrations: ["Dockwa API", "Twilio", "QuickBooks"],
          humanInLoop: "Local GM reviews escalations",
          expectedValue: "$120k/yr cash flow acceleration",
          scores: {
             revenueImpact: 8, costReduction: 6, timeSavings: 9, cxImprovement: 7, strategicLeverage: 5, complexity: 5, implementationEase: 6, maintenanceBurden: 4, risk: 4
          },
          valueScore: 84,
          frictionScore: 48,
          category: "Requires infrastructure first",
          impact: 9,
          complexity: 5
        },
        {
          title: "Executive Rollup Dashboard",
          description: "A central data pipeline that pulls daily occupancy and revenue metrics from all 45 locations into a single executive dashboard.",
          impacts: "Improves corporate visibility and strategic deployment",
          problemSolved: "No central corporate visibility",
          triggers: ["Nightly sync script"],
          inputs: ["Dockwa DB", "Local spreadsheets"],
          outputs: ["PowerBI / Custom Dashboard view"],
          integrations: ["Dockwa API", "Data Warehouse"],
          humanInLoop: "None",
          expectedValue: "Faster executive decision making",
          scores: {
             revenueImpact: 5, costReduction: 4, timeSavings: 7, cxImprovement: 3, strategicLeverage: 9, complexity: 6, implementationEase: 4, maintenanceBurden: 6, risk: 2
          },
          valueScore: 71,
          frictionScore: 65,
          category: "Requires infrastructure first",
          impact: 8,
          complexity: 6
        }
      ],
      agents: [
        {
          role: "Collections Agent",
          scope: "Handles routine communication with boat owners regarding payments.",
          boundaries: ["Cannot offer discounts", "Only processes standard payment questions"],
          tools: ["Stripe Payment Links", "Twilio SMS", "Email Client"],
          actions: ["Sends payment reminders", "Answers FAQs about how to pay", "Updates payment status in CRM"],
          escalationLogic: "If customer disputes the charge or uses aggressive language, route to human GM."
        },
        {
          role: "Operations Analyst Agent",
          scope: "Monitors daily reports across 45 marinas and flags anomalies.",
          boundaries: ["Internal use only", "Read-only access to PII"],
          tools: ["SQL DB Read", "Slack API"],
          actions: ["Scans reports for underperforming locations", "Summarizes weekly variances", "Drafts executive digest"],
          escalationLogic: "If occupancy drops >15% unexpectedly, page Regional Director immediately."
        }
      ],
      roadmap: [
        {
          phase: "Phase 1: Foundation",
          title: "Centralize Data Pipelines",
          timeframe: "Month 1-2",
          items: ["Audit local tool usage", "Deploy automated Data Warehouse sync", "Cleanse legacy data"]
        },
        {
          phase: "Phase 2: Automation",
          title: "Deploy Automated Collections",
          timeframe: "Month 3",
          items: ["Integrate Twilio with Billing", "Train Collections Agent on playbooks", "Roll out to 5 pilot locations"]
        },
        {
          phase: "Phase 3: Scale",
          title: "Network-Wide Orchestration",
          timeframe: "Month 4-6",
          items: ["Deploy across all 45 marinas", "Activate Operations Analyst Agent", "Transition to maintenance mode"]
        }
      ],
      prioritizationMatrix: [
        { title: "Automated Collections", valueScore: 84, frictionScore: 48, category: "Requires infrastructure first" },
        { title: "Executive Rollup Dashboard", valueScore: 71, frictionScore: 65, category: "Requires infrastructure first" }
      ]
    };
    
    setBusinessContext(demoContext);
    setPlaybook(demoPlaybook);
    setAppState("dashboard");
  };

  const reset = () => {
    setBusinessContext(null);
    setPlaybook(null);
    setAppState("landing");
  };

  return (
    <div className="relative min-h-screen w-full bg-bg-base text-text-main font-sans flex overflow-hidden">
      
      {/* Liquid Glass Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-gray-200 rounded-full blur-[120px]"
        />
        <motion.div 
           animate={{ y: [0, 40, 0], x: [0, -30, 0], opacity: [0.1, 0.2, 0.1] }}
           transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
           className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] bg-blue-100 rounded-full blur-[120px]"
        />
      </div>

      <nav className="fixed top-6 left-6 right-6 z-50 flex justify-between items-center px-8 py-4 rounded-full zen-glass transition-all hidden md:flex backdrop-blur-3xl">
         <div className="font-serif text-[18px] font-medium tracking-wide flex items-center gap-3 cursor-pointer" onClick={reset}>
           <div className="w-4 h-4 bg-black rounded-full" />
           ZEN
         </div>
         <div className="flex items-center gap-6 text-[12px] font-medium uppercase tracking-[0.08em] opacity-60">
           <span className="hover:opacity-100 cursor-pointer transition-opacity" onClick={reset}>Intelligence</span>
           <span className="hover:opacity-100 cursor-pointer transition-opacity" onClick={() => appState === 'landing' ? loadDemo() : null}>Architecture</span>
           <span className="hover:opacity-100 cursor-pointer transition-opacity">Deployments</span>
           {appState === 'dashboard' && (
              <>
                 <span className="hover:opacity-100 cursor-pointer transition-opacity ml-8 border-l border-black/10 pl-8" onClick={() => {
                   if (playbook) {
                     const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(playbook));
                     const downloadAnchorNode = document.createElement('a');
                     downloadAnchorNode.setAttribute("href",     dataStr);
                     downloadAnchorNode.setAttribute("download", "zen-architecture.json");
                     document.body.appendChild(downloadAnchorNode);
                     downloadAnchorNode.click();
                     downloadAnchorNode.remove();
                   }
                 }}>Export Architecture</span>
                 <span className="hover:opacity-100 cursor-pointer transition-opacity text-red-500 font-bold ml-4 border-l border-black/10 pl-4" onClick={reset}>Terminate Session</span>
              </>
           )}
         </div>
      </nav>

      <main className="flex-1 flex flex-col p-6 md:p-12 md:pt-36 overflow-y-auto w-full z-10 relative">
        <AnimatePresence mode="wait">
          {appState === "landing" && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col xl:flex-row gap-16 items-center min-h-[60vh] max-w-7xl mx-auto w-full"
            >
              <div className="flex-1 space-y-10">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full zen-glass border-white/40 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/60 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0 animate-pulse"></span>
                    Smart Business Solution Engine
                  </div>
                  <h1 className="text-5xl md:text-7xl font-serif text-black leading-[1.1] tracking-tight">
                    Transform operations<br/><span className="italic opacity-60">into architecture.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-black/50 max-w-xl leading-relaxed font-light">
                    A high-trust business systems intelligence platform. Drop in your operational context, and we'll generate McKinsey-grade automation blueprints, agent ecosystems, and implementation roadmaps.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-5">
                  <motion.button 
                    onClick={startIntake}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="zen-btn-powerful px-8 py-5 rounded-full font-medium flex items-center justify-center gap-3 transition-shadow text-[15px] tracking-wide flex-1 sm:flex-none cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                        Start Diagnosis <ArrowRight className="w-5 h-5" />
                    </span>
                    <div className="btn-glimmer" />
                  </motion.button>
                  <motion.button 
                    onClick={loadDemo}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="zen-glass border border-black/10 text-black px-8 py-5 rounded-full font-medium hover:bg-white/40 transition-all text-[14px] tracking-wide flex-1 sm:flex-none flex items-center justify-center cursor-pointer shadow-sm hover:shadow-md"
                  >
                    View Demo Architecture
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 w-full relative h-[500px]">
                {/* Floating Zen UI Display */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 zen-glass-heavy shadow-2xl rounded-3xl p-10 flex flex-col justify-center"
                >
                  <div className="flex items-center gap-4 mb-10 opacity-70">
                    <Cpu className="w-6 h-6" />
                    <span className="font-medium text-[11px] tracking-[0.1em] uppercase">Intelligence Matrix</span>
                  </div>
                  <div className="space-y-6">
                    {[1,2,3].map((i) => (
                       <div key={i} className="h-16 w-full zen-glass rounded-2xl flex items-center px-6 gap-6 relative overflow-hidden group">
                         <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                           <div className="w-1.5 h-1.5 bg-black rounded-full" />
                         </div>
                         <div className="flex-1 space-y-2.5">
                           <div className="h-1.5 w-1/3 bg-black/20 rounded-full"></div>
                           <div className="h-1 w-1/4 bg-black/10 rounded-full"></div>
                         </div>
                         {/* Animated scanline */}
                         <motion.div 
                           className="absolute top-0 bottom-0 w-16 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                           animate={{ left: ["-100%", "200%"] }}
                           transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                         />
                       </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {appState === "intake" && (
             <motion.div 
               key="intake"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="flex-1 flex justify-center py-6 w-full max-w-3xl mx-auto"
             >
               <IntakeWizard onComplete={handleIntakeComplete} error={error} />
             </motion.div>
          )}

          {appState === "loading" && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12"
            >
              <div className="relative flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 bg-black rounded-full blur-3xl absolute"
                />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border border-black/10 border-t-black/80 z-10"
                />
                <div className="w-3 h-3 bg-black rounded-full absolute z-20"></div>
              </div>
              <div className="space-y-4 max-w-md relative z-10">
                <h3 className="text-3xl font-serif text-black tracking-tight">Synthesizing Core Architecture</h3>
                <p className="text-black/50 text-[13px] tracking-wide leading-relaxed">
                  Mapping pain points, evaluating logic redundancies, and constructing multi-agent solutions.
                </p>
              </div>
            </motion.div>
          )}

          {appState === "dashboard" && playbook && businessContext && (
             <motion.div 
               key="dashboard"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="h-full w-full max-w-7xl mx-auto"
             >
               <Dashboard playbook={playbook} context={businessContext} reset={reset} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
