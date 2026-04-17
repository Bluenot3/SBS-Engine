import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Cpu, MousePointer2 } from "lucide-react";
import { BusinessContext, Playbook } from "./types";
import { generatePlaybook } from "./services/ai";
import { IntakeWizard } from "./modules/intake/IntakeWizard";
import { Dashboard } from "./modules/dashboard/Dashboard";
import { BackgroundParticles } from "./components/BackgroundParticles";
import { Terminal, AnimatedSpan, TypingAnimation } from "./components/ui/terminal";

function TerminalDemo() {
  return (
    <Terminal className="h-[420px] shadow-[0_0_50px_rgba(0,0,0,0.1)]">
      <TypingAnimation>&gt; pnpm dlx shadcn@latest init</TypingAnimation>

      <AnimatedSpan className="text-green-500" delay={0.5}>
        ✔ Preflight checks.
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500" delay={1}>
        ✔ Verifying framework. Found Next.js.
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500" delay={1.5}>
        ✔ Validating Tailwind CSS.
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500" delay={2}>
        ✔ Validating import alias.
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500" delay={2.5}>
        ✔ Writing components.json.
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500" delay={3}>
        ✔ Checking registry.
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500" delay={3.5}>
        ✔ Updating tailwind.config.ts
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500" delay={4}>
        ✔ Updating app/globals.css
      </AnimatedSpan>

      <AnimatedSpan className="text-green-500" delay={4.5}>
        ✔ Installing dependencies.
      </AnimatedSpan>

      <AnimatedSpan className="text-blue-500" delay={5}>
        <span>ℹ Updated 1 file:</span>
        <span className="pl-2">- lib/utils.ts</span>
      </AnimatedSpan>

      <TypingAnimation className="text-white/60" delay={5.5}>
        Success! Project initialization completed.
      </TypingAnimation>

      <TypingAnimation className="text-white/60" delay={6}>
        You may now add components.
      </TypingAnimation>
    </Terminal>
  );
}

export default function App() {
  const [appState, setAppState] = useState<"landing" | "intake" | "loading" | "dashboard">("landing");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };
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
        executiveSummary: "Summit Marinas represents a high-entropy operational environment where decentralized management has led to severe revenue leakage (est. $450k+ annually). The architecture below seeks to move from manual GM-dependency to a centralized, agent-led infrastructure.",
        currentPainPoints: ["Manual billing ingestion across 45 nodes", "Latency in accounts receivable (42-day average)", "Data fragmentation preventing corporate yield management"],
        structuralInefficiencies: ["Decentralized AR requiring 900+ human hours/mo", "Manual guest communication for standard FAQs", "Spreadsheet-based location reporting"],
        scalingRisks: ["Inability to absorb new location overhead", "Executive blindness to underperforming units", "High turnover in administrative roles"]
      },
      automations: [
        {
          title: "Intelligent Revenue Extraction Engine",
          description: "A multi-stage system that orchestrates collections using AI-driven urgency ranking.",
          impacts: "Accelerates cash flow by 32%, eliminates manual chasing.",
          problemSolved: "Slow revenue collection at scale.",
          triggers: ["Invoice generated", "Payment window < 48hrs", "Past due > 1hr"],
          inputs: ["Dockwa Revenue Stream", "QuickBooks Ledger"],
          outputs: ["Personalized Payment Portal Link", "Urgent SMS/WhatsApp Alert"],
          integrations: ["Dockwa API", "Twilio", "Stripe"],
          platforms: ["Make.com", "Retool", "Twelve Labs"],
          implementationSteps: [
            "Map Dockwa API endpoints to central Retool DB",
            "Configure sequenced communication logic in Make.com",
            "Deploy auto-escalation triggers to Regional Directors"
          ],
          humanInLoop: "Approves disputes > $5,000",
          expectedValue: "$210k/yr recovery boost",
          metrics: {
            laborHoursPerWeek: 45,
            dollarsPerYear: 210000,
            emailsAutomatedPerWeek: 850,
            errorRateReduction: 98
          },
          scores: {
             revenueImpact: 9, costReduction: 7, timeSavings: 10, cxImprovement: 6, strategicLeverage: 8, complexity: 6, implementationEase: 5, maintenanceBurden: 3, risk: 3
          },
          valueScore: 88,
          frictionScore: 52,
          category: "Requires infrastructure first",
          impact: 10,
          complexity: 6
        },
        {
          title: "Multi-Node Yield Optimizer",
          description: "Real-time pricing adjustment engine based on local demand and occupancy trends.",
          impacts: "Increases average slip rate by $12/day/node.",
          problemSolved: "Flat-rate pricing in dynamic markets.",
          triggers: ["Occupancy > 85%", "Local event detected", "Competitor price change"],
          inputs: ["Local Demand Data", "Historical Occupancy"],
          outputs: ["Dynamic Rate Update to Dockwa"],
          integrations: ["Dockwa API", "Proprietary Scraper"],
          platforms: ["Pinecone", "LangGraph", "Python / AWS Lambda"],
          implementationSteps: [
            "Initialize vector store with historical demand data",
            "Deploy LangGraph agent to monitor external market signals",
            "Automate rate pushes to slip management engines"
          ],
          humanInLoop: "Overrides if rate change > 25%",
          expectedValue: "$340k/yr margin expansion",
          metrics: {
            laborHoursPerWeek: 15,
            dollarsPerYear: 340000,
            emailsAutomatedPerWeek: 0,
            errorRateReduction: 92
          },
          scores: {
             revenueImpact: 10, costReduction: 4, timeSavings: 5, cxImprovement: 4, strategicLeverage: 10, complexity: 9, implementationEase: 3, maintenanceBurden: 7, risk: 6
          },
          valueScore: 78,
          frictionScore: 84,
          category: "Requires infrastructure first",
          impact: 9,
          complexity: 9
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
    <div 
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-bg-base text-text-main font-sans flex overflow-hidden custom-scrollbar"
    >
      <BackgroundParticles />
      
      {/* Interactive Ambient Glow */}
      <motion.div 
        animate={{
          x: mousePos.x - 400,
          y: mousePos.y - 400,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 50, restDelta: 0.001 }}
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-black/[0.02] rounded-full blur-[120px] pointer-events-none -z-10"
      />
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
          <div className="font-serif text-[20px] font-medium tracking-tight flex items-center gap-3 cursor-pointer" onClick={reset}>
            <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
            ZEN Better
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
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full zen-glass border-white/40 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/60 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0 animate-pulse"></span>
                    ZEN Better • Operational Intelligence
                  </div>
                  <h1 className="text-6xl md:text-8xl font-serif text-black leading-[1.05] tracking-tight">
                    Better operations.<br/><span className="italic opacity-30 font-light italic">Purely ZEN.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-black/40 max-w-xl leading-relaxed font-light">
                    The nationally recognized architect for business transformation. We identify revenue leaks and synthesize granular, platform-specific automation ecosystems and agent-led roadmaps.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-5 relative z-40">
                  <button 
                    type="button"
                    onClick={() => setAppState("intake")}
                    className="zen-btn-powerful px-10 py-5 rounded-full font-medium flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 text-[16px] tracking-wide flex-1 sm:flex-none cursor-pointer relative group overflow-hidden shadow-2xl z-40"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                        Initialize Architecture <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="btn-glimmer pointer-events-none" />
                  </button>
                  <button 
                    type="button"
                    onClick={loadDemo}
                    className="zen-glass border border-black/10 text-black px-8 py-5 rounded-full font-medium hover:bg-white/40 hover:shadow-lg transition-all text-[15px] tracking-wide flex-1 sm:flex-none flex items-center justify-center cursor-pointer relative z-40 group"
                  >
                    View Demo Architecture
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full relative h-[500px] flex items-center justify-center">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 1, delay: 0.5 }}
                   className="w-full"
                >
                  <TerminalDemo />
                </motion.div>
                
                {/* Floating Architectural Nodes */}
                <motion.div 
                  animate={{ y: [0, 20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-10 w-24 h-24 bg-white/40 backdrop-blur-xl border border-black/5 rounded-3xl shadow-xl z-20 hidden xl:flex items-center justify-center hover:scale-110 transition-transform cursor-pointer group"
                >
                   <MousePointer2 className="w-8 h-8 opacity-20 group-hover:opacity-100 group-hover:text-emerald-500 transition-all" />
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
