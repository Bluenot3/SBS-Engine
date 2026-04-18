import { GoogleGenAI, Type } from "@google/genai";
import { BusinessContext, Playbook, ScoringCriteria } from "../types";

let ai: GoogleGenAI | null = null;
try {
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.warn("Could not initialize Google Gen AI. Ensure GEMINI_API_KEY is set.");
}

const systemInstruction = `You are "ZEN Better", the world's most advanced business transformation architect and quantitative forecaster. 
Your mission is to formulate C-Suite ready operational architecture. Every plan must contain world-class mathematical forecasting, risk modeling, and granular structural overhauls.

CORE DIRECTIVES:
1. MAX GRANULARITY: Calculate specific dollar and hour savings broken down per-person and per-team across time horizons (hour, day, week, month, year, decade).
2. MATHEMATICAL FORECASTING: Provide rigorous ROI modeling, break-even months, and 10-year enterprise cumulative savings. 
3. OBSTACLE MITIGATION: Anticipate road-blocks. For each obstacle outline its probability, risk-impact, alternative routing (pivots), and rectification steps.
4. ROADMAP PRECISION: Every roadmap phase must include exact dependencies, assigned operational teams, duration, and day offsets.

CRITICAL SCORING INSTRUCTIONS:
- Value Score Formula (1-100 total): (revenueImpact * 3) + (costReduction * 2) + (timeSavings * 2.5) + (cxImprovement * 1.5) + (strategicLeverage * 1). Scale to 100 max. 
- Friction Score Formula (1-100 total): (complexity * 4) + ((10 - implementationEase) * 3) + (maintenanceBurden * 2) + (risk * 1). Scale to 100 max.

Output EXACTLY categorized string literals:
- "Can do now" (Value > 60, Friction < 40)
- "Requires infrastructure first" (Value > 60, Friction >= 40)
- "Should do next" (Value <= 60, Friction < 40)
- "Not worth doing yet" (Value <= 60, Friction >= 40)
`;

// Helper schema for Granular Metrics
const granularMetricsSchema = {
  type: Type.OBJECT,
  properties: {
    hour: { type: Type.NUMBER },
    day: { type: Type.NUMBER },
    week: { type: Type.NUMBER },
    month: { type: Type.NUMBER },
    year: { type: Type.NUMBER },
    decade: { type: Type.NUMBER }
  },
  required: ["hour", "day", "week", "month", "year", "decade"]
};

export async function generatePlaybook(context: BusinessContext): Promise<Playbook> {
  if (!ai) {
    throw new Error("AI service is not configured.");
  }

  const prompt = `Analyze the following business and generate a high-fidelity operational architecture for "ZEN Better".

BUSINESS CONTEXT:
${JSON.stringify(context, null, 2)}

Requirements:
- Identify 5-8 high-impact automation opportunities with extreme precision.
- Provide mathematically sound long-term forecasting (10-year scale) and ROI.
- Anticipate roadblocks and provide tactical pivoting mechanics ("alternativeRoutes").
- Ensure the 'diagnosis' is a deep, strategic teardown of their operational state.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          diagnosis: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              currentPainPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              structuralInefficiencies: { type: Type.ARRAY, items: { type: Type.STRING } },
              scalingRisks: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["executiveSummary", "currentPainPoints", "structuralInefficiencies", "scalingRisks"]
          },
          automations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impacts: { type: Type.STRING },
                problemSolved: { type: Type.STRING },
                triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
                inputs: { type: Type.ARRAY, items: { type: Type.STRING } },
                outputs: { type: Type.ARRAY, items: { type: Type.STRING } },
                integrations: { type: Type.ARRAY, items: { type: Type.STRING } },
                platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
                implementationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                humanInLoop: { type: Type.STRING },
                expectedValue: { type: Type.STRING },
                forecast: {
                  type: Type.OBJECT,
                  properties: {
                    initialImplementationCost: { type: Type.NUMBER },
                    monthlyOperationalCost: { type: Type.NUMBER },
                    breakEvenMonth: { type: Type.NUMBER },
                    tenYearCumulativeSavings: { type: Type.NUMBER },
                    ROI: { type: Type.NUMBER }
                  },
                  required: ["initialImplementationCost", "monthlyOperationalCost", "breakEvenMonth", "tenYearCumulativeSavings", "ROI"]
                },
                obstacles: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      roadblock: { type: Type.STRING },
                      probability: { type: Type.STRING, enum: ["low", "medium", "high"] },
                      riskImpact: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
                      alternativeRoute: { type: Type.STRING },
                      rectificationSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["roadblock", "probability", "riskImpact", "alternativeRoute", "rectificationSteps"]
                  }
                },
                metrics: {
                  type: Type.OBJECT,
                  properties: {
                    laborHoursPerWeek: { type: Type.NUMBER },
                    dollarsPerYear: { type: Type.NUMBER },
                    emailsAutomatedPerWeek: { type: Type.NUMBER },
                    errorRateReduction: { type: Type.NUMBER },
                    savingsPerPerson: {
                      type: Type.OBJECT,
                      properties: {
                        hours: granularMetricsSchema,
                        dollars: granularMetricsSchema
                      },
                      required: ["hours", "dollars"]
                    },
                    savingsPerTeam: {
                      type: Type.OBJECT,
                      properties: {
                        hours: granularMetricsSchema,
                        dollars: granularMetricsSchema
                      },
                      required: ["hours", "dollars"]
                    },
                    enterpriseTotal: {
                      type: Type.OBJECT,
                      properties: {
                        yearOne: { type: Type.NUMBER },
                        yearFive: { type: Type.NUMBER },
                        yearTen: { type: Type.NUMBER }
                      },
                      required: ["yearOne", "yearFive", "yearTen"]
                    }
                  },
                  required: ["laborHoursPerWeek", "dollarsPerYear", "emailsAutomatedPerWeek", "errorRateReduction", "savingsPerPerson", "savingsPerTeam", "enterpriseTotal"]
                },
                scores: {
                  type: Type.OBJECT,
                  properties: {
                    revenueImpact: { type: Type.NUMBER },
                    costReduction: { type: Type.NUMBER },
                    timeSavings: { type: Type.NUMBER },
                    cxImprovement: { type: Type.NUMBER },
                    strategicLeverage: { type: Type.NUMBER },
                    complexity: { type: Type.NUMBER },
                    implementationEase: { type: Type.NUMBER },
                    maintenanceBurden: { type: Type.NUMBER },
                    risk: { type: Type.NUMBER }
                  },
                  required: ["revenueImpact", "costReduction", "timeSavings", "cxImprovement", "strategicLeverage", "complexity", "implementationEase", "maintenanceBurden", "risk"]
                },
                valueScore: { type: Type.NUMBER },
                frictionScore: { type: Type.NUMBER },
                category: { type: Type.STRING, enum: ["Can do now", "Should do next", "Requires infrastructure first", "Not worth doing yet"] },
                complexity: { type: Type.NUMBER },
                impact: { type: Type.NUMBER }
              },
              required: ["title", "description", "impacts", "problemSolved", "triggers", "inputs", "outputs", "integrations", "metrics", "forecast", "obstacles", "platforms", "implementationSteps", "scores", "valueScore", "frictionScore", "category", "complexity", "impact"]
            }
          },
          agents: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                scope: { type: Type.STRING },
                boundaries: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools: { type: Type.ARRAY, items: { type: Type.STRING } },
                actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                escalationLogic: { type: Type.STRING }
              },
              required: ["role", "scope", "boundaries", "tools", "actions", "escalationLogic"]
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                title: { type: Type.STRING },
                timeframe: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } },
                detailedItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      task: { type: Type.STRING },
                      startDateOffsetDays: { type: Type.NUMBER },
                      durationDays: { type: Type.NUMBER },
                      dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                      assignedTeam: { type: Type.STRING }
                    },
                    required: ["task", "startDateOffsetDays", "durationDays", "dependencies", "assignedTeam"]
                  }
                }
              },
              required: ["phase", "title", "timeframe", "items", "detailedItems"]
            }
          },
          prioritizationMatrix: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                valueScore: { type: Type.NUMBER },
                frictionScore: { type: Type.NUMBER },
                category: { type: Type.STRING, enum: ["Can do now", "Should do next", "Requires infrastructure first", "Not worth doing yet"] }
              },
              required: ["title", "valueScore", "frictionScore", "category"]
            }
          }
        },
        required: ["diagnosis", "automations", "agents", "roadmap", "prioritizationMatrix"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No text returned from Gemini");
  }

  try {
    return JSON.parse(text) as Playbook;
  } catch (e) {
    console.error("Failed to parse JSON:", text);
    throw new Error("Failed to parse the structured solution playbook.");
  }
}
