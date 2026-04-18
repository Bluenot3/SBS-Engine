import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, AlertCircle, Building, Cpu, Navigation2, Target } from "lucide-react";
import { BusinessContext, BusinessScale, OperatingModel } from "../../types";
import { HyperText } from "../../components/ui/hyper-text";

type IntakeWizardProps = {
  onComplete: (context: BusinessContext) => void;
  error: string | null;
};

export function IntakeWizard({ onComplete, error }: IntakeWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BusinessContext>>({
    name: "",
    industry: "",
    scale: "small",
    locationCount: 1,
    operatingModel: "centralized",
    currentStack: "",
    painPoints: "",
    goals: "",
    budgetSensitivity: "medium"
  });

  const update = (data: Partial<BusinessContext>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      onComplete(formData as BusinessContext);
    }
  };

  return (
    <div className="w-full relative">
      {/* Abstract floating step indicators */}
      <div className="flex gap-4 mb-16 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
             <motion.div 
               animate={{ scale: step === i ? 1 : 0.8, opacity: step === i ? 1 : 0.4 }}
               className={`w-12 h-1 rounded-full ${step >= i ? 'bg-black' : 'bg-black/10'}`}
             />
             {i < 4 && <span className="opacity-20 text-[10px]">•</span>}
          </div>
        ))}
      </div>

      <div className="zen-glass-heavy shadow-2xl rounded-[2rem] p-10 md:p-14 relative overflow-hidden">
        {/* Subtle background gradient responding to steps */}
        <motion.div 
          animate={{ x: step * 20 - 50, opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-100 via-transparent to-emerald-50 pointer-events-none"
        />

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50/80 text-red-600 p-4 rounded-xl flex items-start gap-3 border border-red-100 mb-8 backdrop-blur-md">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="text-[13px] font-medium">{error}</p>
          </motion.div>
        )}

        <div className="min-h-[400px] relative z-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Building className="w-5 h-5 text-black opacity-80" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif text-black font-semibold mb-1">
                      <HyperText animateOnLoad={true} duration={1000}>Organization Protocol</HyperText>
                    </h2>
                    <p className="text-[14px] text-black/50 font-light">Establish your structural baseline to calibrate the required architecture.</p>
                  </div>
                </div>
                
                <div className="space-y-8 max-w-xl">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Company Entity</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => update({ name: e.target.value })}
                      placeholder="e.g. Acme Corp"
                      className="zen-input w-full text-2xl font-light focus:bg-white/50"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Industry Sector</label>
                      <input 
                        type="text" 
                        value={formData.industry}
                        onChange={e => update({ industry: e.target.value })}
                        placeholder="e.g. Aviation, Hospitality"
                        className="zen-input w-full text-lg font-light focus:bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Operational Scale</label>
                      <select 
                        value={formData.scale}
                        onChange={e => update({ scale: e.target.value as BusinessScale })}
                        className="zen-input w-full text-lg font-light focus:bg-white/50 cursor-pointer appearance-none"
                      >
                        <option value="solopreneur">Solopreneur</option>
                        <option value="startup">Startup</option>
                        <option value="small">Small Business</option>
                        <option value="mid-sized">Mid-sized Business</option>
                        <option value="multi-location">Multi-location</option>
                        <option value="enterprise">Enterprise</option>
                        <option value="franchise">Franchise</option>
                        <option value="nonprofit">Nonprofit</option>
                        <option value="government">Government</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Node Count (Locations)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={formData.locationCount}
                        onChange={e => update({ locationCount: parseInt(e.target.value) || 1 })}
                        className="zen-input w-full text-lg font-light focus:bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Topology Model</label>
                      <select 
                        value={formData.operatingModel}
                        onChange={e => update({ operatingModel: e.target.value as OperatingModel })}
                        className="zen-input w-full text-lg font-light focus:bg-white/50 cursor-pointer appearance-none"
                      >
                        <option value="centralized">Centralized</option>
                        <option value="decentralized">Decentralized / Hub & Spoke</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="field-based">Field-based</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-black opacity-80" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif text-black font-semibold mb-1">
                      <HyperText animateOnLoad={true} duration={1000}>Systems & Stack</HyperText>
                    </h2>
                    <p className="text-[14px] text-black/50 font-light">Map the current technological constraints and tools in play.</p>
                  </div>
                </div>
                
                <div className="space-y-10 max-w-xl">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-4">Core Operating Stack</label>
                    <textarea 
                      rows={4}
                      value={formData.currentStack}
                      onChange={e => update({ currentStack: e.target.value })}
                      placeholder="e.g. Salesforce, legacy AS400, Google Workspace, disparate spreadsheets..."
                      className="zen-input w-full text-lg font-light focus:bg-white/50 resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-4">Capital Sensitivity</label>
                    <div className="flex gap-4">
                      {['low', 'medium', 'high'].map(level => (
                        <button
                          key={level}
                          onClick={() => update({ budgetSensitivity: level as any })}
                          className={`flex-1 py-4 text-[13px] font-medium rounded-2xl transition-all duration-300 ${formData.budgetSensitivity === level ? 'bg-black text-white shadow-xl scale-105' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
                        >
                          <span className="capitalize">{level}</span> Impact
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Navigation2 className="w-5 h-5 text-black opacity-80" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif text-black font-semibold mb-1">
                      <HyperText animateOnLoad={true} duration={1000}>Diagnostic Context</HyperText>
                    </h2>
                    <p className="text-[14px] text-black/50 font-light">Detail operational friction to inform agent synthesis.</p>
                  </div>
                </div>
                
                <div className="space-y-10 max-w-xl">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-4">Current Vulnerabilities</label>
                    <textarea 
                      rows={3}
                      value={formData.painPoints}
                      onChange={e => update({ painPoints: e.target.value })}
                      placeholder="e.g. 50 hours wasted on data entry, no real-time visibility..."
                      className="zen-input w-full text-lg font-light focus:bg-white/50 resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-4">Target Trajectory</label>
                    <textarea 
                      rows={3}
                      value={formData.goals}
                      onChange={e => update({ goals: e.target.value })}
                      placeholder="e.g. Automate billing ingestion, consolidate reporting..."
                      className="zen-input w-full text-lg font-light focus:bg-white/50 resize-y"
                    />
                  </div>
                </div>
              </motion.div>
            )}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center">
                    <Target className="w-5 h-5 text-black opacity-80" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif text-black font-semibold mb-1">
                      <HyperText animateOnLoad={true} duration={1000}>Granular Deep Dive (Optional)</HyperText>
                    </h2>
                    <p className="text-[14px] text-black/50 font-light">Supply detailed metrics for extreme precision forecasting.</p>
                  </div>
                </div>
                
                <div className="space-y-10 max-w-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Total Employees</label>
                      <input 
                        type="number" 
                        min="1"
                        value={formData.employeeCount || ""}
                        onChange={e => update({ employeeCount: parseInt(e.target.value) || undefined })}
                        placeholder="e.g. 50"
                        className="zen-input w-full text-lg font-light focus:bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Avg Hourly Labor Cost ($)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={formData.hourlyLaborCost || ""}
                        onChange={e => update({ hourlyLaborCost: parseInt(e.target.value) || undefined })}
                        placeholder="e.g. 35"
                        className="zen-input w-full text-lg font-light focus:bg-white/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Avg Process Time (Hours/Wk)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={formData.averageProcessingTime || ""}
                        onChange={e => update({ averageProcessingTime: parseInt(e.target.value) || undefined })}
                        placeholder="e.g. 15"
                        className="zen-input w-full text-lg font-light focus:bg-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-[0.1em] text-black/40 mb-2">Est. Manual Tasks (Per Wk)</label>
                      <input 
                        type="number" 
                        min="1"
                        value={formData.estimatedVolume || ""}
                        onChange={e => update({ estimatedVolume: parseInt(e.target.value) || undefined })}
                        placeholder="e.g. 500"
                        className="zen-input w-full text-lg font-light focus:bg-white/50"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end pt-10 border-t border-black/5 mt-8 relative z-10 gap-4">
          <button
            onClick={handleNext}
            disabled={!formData.name}
            className={`px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-all duration-300 text-[14px] tracking-wide ${!formData.name ? 'opacity-30 cursor-not-allowed bg-black/10 text-black' : 'bg-black text-white hover:scale-105 shadow-xl'}`}
          >
            {step === 4 ? "Initialize Architect" : (step === 3 ? "Detailed Deep Dive" : "Proceed")} <ArrowRight className="w-4 h-4" />
          </button>
          
          {step === 3 && (
            <button
              onClick={() => onComplete(formData as BusinessContext)}
              disabled={!formData.name}
              className={`px-8 py-4 rounded-full font-medium flex items-center gap-3 transition-all duration-300 text-[14px] tracking-wide border border-black hover:bg-black hover:text-white ${!formData.name ? 'opacity-30 cursor-not-allowed bg-black/10 text-black border-none' : 'bg-white text-black hover:scale-105 shadow-md'}`}
            >
              Skip & Initialize
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
