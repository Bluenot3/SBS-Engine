import { GoogleGenAI, Type } from "@google/genai";
import { BusinessContext, Playbook, ScoringCriteria } from "../types";

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });
} catch (e) {
  console.warn("Could not initialize Google Gen AI. Ensure GEMINI_API_KEY is set.");
}

const systemInstruction = `You are the Smart Business Solution Engine by ZEN AI Co. 
You act as an elite business architect, operations strategist, automation engineer, and agent-orchestration designer. 
Your purpose is to transform raw business information into operational intelligence, system maps, automation blueprints, agent ecosystems, playbooks, and implementation plans.
Outputs must be McKinsey-grade, deeply customized, far-reaching, and realistic. 
Avoid generic automation tips or "use Zapier" fluff. Provide nuanced diagnosis and role-aware logic.

CRITICAL SCORING INSTRUCTIONS:
You must score every automation opportunity using our proprietary dual-axis matrix (Value vs Friction) out of 100 points each.
Value Score Formula (1-100 total): (revenueImpact * 3) + (costReduction * 2) + (timeSavings * 2.5) + (cxImprovement * 1.5) + (strategicLeverage * 1) -> scaled to 100 max. Each metric evaluates from 1 to 10.
Friction Score Formula (1-100 total): (complexity * 4) + ((10 - implementationEase) * 3) + (maintenanceBurden * 2) + (risk * 1) -> scaled to 100 max. Each metric evaluates from 1 to 10.

Based on Total Value Score and Total Friction Score, categorize into ONE of four exact string literals:
- "Can do now" (Value > 60, Friction < 40)
- "Requires infrastructure first" (Value > 60, Friction >= 40)
- "Should do next" (Value <= 60, Friction < 40)
- "Not worth doing yet" (Value <= 60, Friction >= 40)
`;

export async function generatePlaybook(context: BusinessContext): Promise<Playbook> {
  if (!ai) {
    throw new Error("AI service is not configured.");
  }

  const prompt = `Analyze the following business and generate a highly detailed operational intelligence playbook, including automation architectures and agent ecosystems.

BUSINESS CONTEXT:
Name: ${context.name}
Industry: ${context.industry}
Scale: ${context.scale} (${context.locationCount} locations)
Model: ${context.operatingModel}
Current Tech Stack: ${context.currentStack}
Pain Points/Bottlenecks: ${context.painPoints}
Goals: ${context.goals}
Budget Sensitivity: ${context.budgetSensitivity}

Generate a comprehensive JSON playbook outlining the Diagnosis, Automation Opportunities, Agent Architectures, Implementation Roadmap, and a Prioritization Matrix ensuring strict compliance with the scoring schema provided.`;

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
                humanInLoop: { type: Type.STRING },
                expectedValue: { type: Type.STRING },
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
                valueScore: { type: Type.NUMBER, description: "Total Value Score (0-100)" },
                frictionScore: { type: Type.NUMBER, description: "Total Friction Score (0-100)" },
                category: { type: Type.STRING, enum: ["Can do now", "Should do next", "Requires infrastructure first", "Not worth doing yet"] },
                complexity: { type: Type.NUMBER, description: "Legacy fallback 1-10 scale" },
                impact: { type: Type.NUMBER, description: "Legacy fallback 1-10 scale" }
              },
              required: ["title", "description", "impacts", "problemSolved", "triggers", "inputs", "outputs", "integrations", "humanInLoop", "expectedValue", "scores", "valueScore", "frictionScore", "category", "complexity", "impact"]
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
