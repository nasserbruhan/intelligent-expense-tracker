
import { GoogleGenAI, Type } from "@google/genai";
import { ExpenseRecord, AnalysisReport, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    categorizationSummary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          description: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          category: { type: Type.STRING }
        },
        required: ["date", "description", "amount", "category"]
      }
    },
    topCategories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          percentage: { type: Type.NUMBER }
        },
        required: ["category", "amount", "percentage"]
      }
    },
    recurringExpenses: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    spendingSpikes: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    monthlyTrends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          change: { type: Type.STRING },
          trend: { type: Type.STRING }
        },
        required: ["month", "change", "trend"]
      }
    },
    predictions: {
      type: Type.OBJECT,
      properties: {
        nextMonthTotal: { type: Type.NUMBER },
        highRiskCategories: { type: Type.ARRAY, items: { type: Type.STRING } },
        stableCategories: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["nextMonthTotal", "highRiskCategories", "stableCategories"]
    },
    keyInsights: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: [
    "categorizationSummary",
    "topCategories",
    "recurringExpenses",
    "spendingSpikes",
    "monthlyTrends",
    "predictions",
    "keyInsights",
    "recommendations"
  ]
};

export const analyzeExpenses = async (expenses: string): Promise<AnalysisReport> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following expense data and provide a comprehensive intelligence report.
    
    DATA:
    ${expenses}
    
    INSTRUCTIONS:
    1. Categorize each expense using ML reasoning.
    2. Identify top spending categories.
    3. Detect recurring subscriptions and spending spikes.
    4. Calculate month-over-month trends.
    5. Predict next month's spending based on historical growth and volatility.
    6. Use Google Search to research any unfamiliar merchants or current economic trends (like inflation or sector-specific price changes) to provide better context in the recommendations.
    7. Generate high-quality human-readable insights and actionable recommendations.
    
    Do not invent transactions. Base all insights strictly on provided data.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
      temperature: 0.1,
    },
  });

  const parsedReport = JSON.parse(response.text || '{}');
  
  // Extract grounding sources
  const sources: GroundingSource[] = [];
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    groundingChunks.forEach((chunk: any) => {
      if (chunk.web && chunk.web.uri && chunk.web.title) {
        sources.push({ title: chunk.web.title, uri: chunk.web.uri });
      }
    });
  }

  return { ...parsedReport, groundingSources: sources };
};
