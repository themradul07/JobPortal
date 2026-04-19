import express, { json } from "express";
const router = express.Router();
import cloudinary from "cloudinary";

router.post("/upload", async (req, res) => {
    try {
        const { buffer, public_id } = req.body;
        if (public_id) {
            await cloudinary.v2.uploader.destroy(public_id);
        }
        const cloud = await cloudinary.v2.uploader.upload(buffer);
        res.json({
            public_id: cloud.public_id,
            url: cloud.secure_url
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        })

    }
});

import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// router.post("/career", async (req, res) => {
//     try {
//         const { skills } = req.body;
//         if (!skills) {
//             return res.status(400).json({
//                 message: "Skills are required"
//             })
//         }
//         const prompt = ` 
// Based on the following skills: ${skills}. 
 
// Please act as a career advisor and generate a career path suggestion. 
// Your entire response must be in a valid JSON format. Do not include any text or markdown 
// formatting outside of the JSON structure. 
 
// The JSON object should have the following structure: 
// { 
//  "summary": "A brief, encouraging summary of the user's skill set and their general job 
// title.", 
//  "jobOptions": [ 
//  { 
// "title": "The name of the job role.", 
// "responsibilities": "A description of what the user would do in this role.", 
// "why": "An explanation of why this role is a good fit for their skills." 
//  } 
//  ], 
//  "skillsToLearn": [ 
//  { 
// "category": "A general category for skill improvement (e.g., 'Deepen Your Existing Stack 
// Mastery', 'DevOps & Cloud').", 
// "skills": [ 
//  { 
//  "title": "The name of the skill to learn.", 
//  "why": "Why learning this skill is important.", 
//  "how": "Specific examples of how to learn or apply this skill." 
//  } 
// ] 
//  } 
//  ], 
//  "learningApproach": { 
// "title": "How to Approach Learning", 
// "points": ["A bullet point list of actionable advice for learning."] 
//  } 
// } 
//  `;
//         const response = await ai.models.generateContent({
//             model: "gemini-2.5-flash",
//             contents: prompt,
//         });

//         let jsonresponse;
//         console.log(jsonresponse);
//         try {
//             const rawText = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();

//             if (!rawText) {
//                 throw new Error("No text found in response");
//             }

//             jsonresponse = JSON.parse(rawText);
//         } catch (error) {
//             console.error("Error parsing JSON response:", error);
//             jsonresponse = {
//                 summary: "Unable to generate career path at this time.",
//                 jobOptions: [],
//                 skillsToLearn: [],
//                 learningApproach: {
//                     title: "Unable to generate learning approach at this time.",
//                     points: []
//                 }
//             };
//         }
//         res.json({
//             response: response.text
//         })
//     } catch (error: any) {
//         res.status(500).json({
//             message: error.message
//         })
//     }
// });
router.post("/career", async (req, res) => {
    try {
        const { skills } = req.body;

        if (!skills) {
            return res.status(400).json({
                message: "Skills are required"
            });
        }

        const prompt = `
Based on the following skills: ${skills}.

Please act as a career advisor and generate a career path suggestion.

IMPORTANT:
- Return ONLY valid JSON
- Do NOT include markdown (no \`\`\`)
- Do NOT include extra text

Structure:
{
 "summary": "...",
 "jobOptions": [
   {
     "title": "...",
     "responsibilities": "...",
     "why": "..."
   }
 ],
 "skillsToLearn": [
   {
     "category": "...",
     "skills": [
       {
         "title": "...",
         "why": "...",
         "how": "..."
       }
     ]
   }
 ],
 "learningApproach": {
   "title": "...",
   "points": ["..."]
 }
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        let jsonresponse;

        try {
            let rawText = response.text?.trim();

            if (!rawText) {
                throw new Error("No text found in response");
            }

            // 🔥 More robust cleanup
            rawText = rawText
                .replace(/```[a-zA-Z]*\n?/g, '') // remove ```json or ```
                .replace(/```/g, '')
                .trim();

            console.log("RAW TEXT:", rawText); // helpful debug

            jsonresponse = JSON.parse(rawText);

            // ✅ Optional validation
            if (!jsonresponse.summary || !jsonresponse.jobOptions) {
                throw new Error("Invalid JSON structure");
            }

        } catch (error) {
            console.error("Error parsing JSON response:", error);

            jsonresponse = {
                summary: "Unable to generate career path at this time.",
                jobOptions: [],
                skillsToLearn: [],
                learningApproach: {
                    title: "Unable to generate learning approach at this time.",
                    points: []
                }
            };
        }

        // ✅ Return parsed JSON instead of raw text
        res.json({
            data: jsonresponse
        });

    } catch (error: any) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post('/resume-analyser', async (req, res) => {
    try {
        const { pdfBase64 } = req.body;
        if (!pdfBase64) {
            return res.status(400).json({
                message: "Resume is required"
            })
        }
        const prompt = ` 
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume 
and provide: 
1. An ATS compatibility score (0-100) 
2. Detailed suggestions to improve the resume for better ATS performance 
 
Your entire response must be in valid JSON format. Do not include any text or markdown 
formatting outside of the JSON structure. 
 
The JSON object should have the following structure: 
{ 
  "atsScore": 85, 
  "scoreBreakdown": { 
    "formatting": { 
      "score": 90, 
      "feedback": "Brief feedback on formatting" 
    }, 
    "keywords": { 
      "score": 80, 
      "feedback": "Brief feedback on keyword usage" 
    }, 
    "structure": { 
      "score": 85, 
      "feedback": "Brief feedback on resume structure" 
    }, 
    "readability": { 
      "score": 88, 
      "feedback": "Brief feedback on readability" 
    } 
  }, 
  "suggestions": [ 
    { 
      "category": "Category name (e.g., 'Formatting', 'Content', 'Keywords', 
'Structure')", 
      "issue": "Description of the issue found", 
      "recommendation": "Specific actionable recommendation to fix it", 
      "priority": "high/medium/low" 
    } 
  ], 
  "strengths": [ 
    "List of things the resume does well for ATS" 
  ], 
  "summary": "A brief 2-3 sentence summary of the overall ATS performance" 
} 
 
Focus on: - File format and structure compatibility - Proper use of standard section headings - Keyword optimization - Formatting issues (tables, columns, graphics, special characters) - Contact information placement - Date formatting - Use of action verbs and quantifiable achievements - Section organization and flow 
`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: [{
                role: 'user',
                parts: [
                    {
                        text: prompt
                    },
                    {
                        inlineData: {
                            mimeType: "application/pdf",
                            data: pdfBase64.replace(/^data:application\/pdf;base64,/, ''),
                        }
                    }
                ]
            }],
        });
        let jsonresponse;
        try {
            const rawText = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();

            if (!rawText) {
                throw new Error("No text found in response");
            }

            jsonresponse = JSON.parse(rawText);
            res.json(jsonresponse);
        } catch(err){
            console.log(response.text);
            return res.status(500).json({
                message:"Ai returned a response that was not a valid json",
                rawResponse: response.text
            })
        }
    }catch(error:any){
        console.log(error.message)
        res.status(500).json({
            message: error.message
        })
    }
});


export default router;