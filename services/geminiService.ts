
import { GoogleGenAI } from "@google/genai";
import { StudentData, PredictionResult } from "../types";

// Injected by environment
const API_KEY = process.env.API_KEY;

/**
 * Helper to extract JSON from a potentially messy string containing markdown or grounding text.
 */
const extractJson = (text: string) => {
  try {
    // Attempt to find the first '{' and last '}'
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      const jsonStr = text.substring(startIdx, endIdx + 1);
      return JSON.parse(jsonStr);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Extraction failed:", e, "Original text:", text);
    throw new Error("The AI returned an invalid data format. Please try again.");
  }
};

export const predictColleges = async (student: StudentData): Promise<PredictionResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure your environment is configured.");
  }

  // Use a new instance to ensure we pick up the latest key
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prevYear = student.targetYear - 1;

  const prompt = `
    As a TNEA (Tamil Nadu Engineering Admissions) Expert Counselor, predict the top 8 eligible colleges for a student with the following profile for the upcoming ${student.targetYear} academic year:
    - Cutoff: ${student.cutoff}
    - Category: ${student.category}
    - Quota: ${student.quota}
    - Preferred Course: ${student.preferredCourse}
    - Preferred District: ${student.district || 'Any'}

    IMPORTANT CONTEXT:
    If the Quota is '7.5% Govt School Reservation', this is a horizontal reservation for students who studied in TN Government Schools from 6th to 12th Std. Cutoffs for this quota are significantly lower than General academic cutoffs. Use specific TNEA 7.5% reservation historical data for accuracy.

    TASK:
    1. Search for official ${prevYear} TNEA cutoff data (specifically for ${student.quota} if applicable) and projected ${student.targetYear} trends.
    2. Analyze trends for ${student.preferredCourse} in the ${student.category} category within the specified ${student.quota}.
    3. For each college, provide:
       - 'lastYearCutoff': The official ${prevYear} closing mark for this specific quota/category.
       - 'expectedCutoff': Your prediction for the ${student.targetYear} (present year) closing mark.
       - 'officialLink': The official website URL for the college.
    4. Categorize colleges into: 'Safe', 'Moderate', or 'Reach'.
    5. Provide admission probability (0-100%).

    RESPONSE FORMAT:
    Return ONLY a valid JSON object. Do not include extra text.
    {
      "predictions": [
        {
          "collegeName": "string",
          "collegeCode": "string",
          "course": "string",
          "lastYearCutoff": number,
          "expectedCutoff": number,
          "probability": number,
          "tier": "Safe" | "Moderate" | "Reach",
          "location": "string",
          "officialLink": "string"
        }
      ],
      "insights": "Detailed advice for the student based on trends and the specific impacts of their chosen quota.",
      "sources": [
        { "title": "string", "uri": "string" }
      ]
    }
  `;

  try {
    // Note: We avoid responseMimeType: "application/json" here because it often fails 
    // when combined with the googleSearch tool due to grounding metadata injection.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Low temperature for more consistent JSON
      },
    });

    const result = extractJson(response.text);

    // Extract grounding URLs if the model didn't explicitly include them in the JSON
    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || `Official TNEA Data Source`,
      uri: chunk.web?.uri || "#"
    })) || [];

    return {
      predictions: result.predictions || [],
      insights: result.insights || "No insights available.",
      sources: (result.sources && result.sources.length > 0) ? result.sources : groundingSources
    };
  } catch (error: any) {
    console.error("Prediction Error Details:", error);
    
    // Check if it's a transient error and suggest a retry
    if (error.message?.includes("Rpc failed") || error.message?.includes("500")) {
      throw new Error("The AI service is currently busy or experiencing a network glitch. Please try clicking 'Analyze' again.");
    }
    
    throw new Error(error.message || "Failed to reach AI counselor. Check your connection.");
  }
};
