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

const systemInstruction = `You are "ZEN Better", the world's most advanced business transformation architect. 
You act as an elite business architect, operations strategist, automation engineer, and agent-orchestration designer. 
Your mission is to find every revenue leak, every manual hour wasted, and every structural redundancy, then design a state-of-the-art automation ecosystem.

CORE DIRECTIVES:
1. MAX GRANULARITY: Every automation or agent suggestion MUST include specific, quantified labor and dollar savings. 
2. PLATFORM SPECIFICITY: Suggest real-world platforms (e.g., Make.com, Replicate, Pinecone, Retool, LangGraph, etc.) instead of generic "Automation Tool".
3. DETAILED IMPLEMENTATION: Provide an array of implementationSteps for each automation.
4. METRIC PRECISION: You must generate estimates for:
   - laborHoursPerWeek: Number of human hours freed.
   - dollarsPerYear: Estimated operational or revenue impact.
   - emailsAutomatedPerWeek: Number of communications handled by agents.
   - errorRateReduction: Percentage reduction in operational errors.

CRITICAL SCORING INSTRUCTIONS:
- You must score every automation opportunity using our proprietary dual-axis matrix (Value vs Friction) out of 100 points each.
- Value Score Formula (1-100 total): (revenueImpact * 3) + (costReduction * 2) + (timeSavings * 2.5) + (cxImprovement * 1.5) + (strategicLeverage * 1) -> scaled to 100 max. Each metric evaluates from 1 to 10.
- Friction Score Formula (1-100 total): (complexity * 4) + ((10 - implementationEase) * 3) + (maintenanceBurden * 2) + (risk * 1) -> scaled to 100 max. Each metric evaluates from 1 to 10.

Output EXACTLY categorized string literals:
- "Can do now" (Value > 60, Friction < 40)
- "Requires infrastructure first" (Value > 60, Friction >= 40)
- "Should do next" (Value <= 60, Friction < 40)
- "Not worth doing yet" (Value <= 60, Friction >= 40)
`;

export async function generatePlaybook(context: BusinessContext): Promise<Playbook> {
  if (!ai) {
    throw new Error("AI service is not configured.");
  }

  const prompt = `Analyze the following business and generate a high-fidelity operational architecture for "ZEN Better".

BUSINESS CONTEXT:
${JSON.stringify(context, null, 2)}

Requirements:
- Identify at least 5-8 high-impact automation opportunities.
- Be extremely granular about the 'metrics' object for each automation.
- Detail the implementation 'logic' and 'platforms' used.
- Ensure the 'diagnosis' is a deep, strategic teardown of their current operational state.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
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
                metrics: {
                  type: Type.OBJECT,
                  properties: {
                    laborHoursPerWeek: { type: Type.NUMBER },
                    dollarsPerYear: { type: Type.NUMBER },
                    emailsAutomatedPerWeek: { type: Type.NUMBER },
                    errorRateReduction: { type: Type.NUMBER }
                  },
                  required: ["laborHoursPerWeek", "dollarsPerYear", "emailsAutomatedPerWeek", "errorRateReduction"]
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
              required: ["title", "description", "impacts", "problemSolved", "triggers", "inputs", "outputs", "integrations", "metrics", "platforms", "implementationSteps", "scores", "valueScore", "frictionScore", "category", "complexity", "impact"]
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
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["phase", "title", "timeframe", "items"]
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
