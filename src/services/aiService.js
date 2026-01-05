import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = ""; // USER NEEDS TO FILL THIS

export const analyzeLocation = async (imageSrc, itemName, roomName) => {
    if (!API_KEY) {
        console.warn("Gemini API Key missing, returning mock data.");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`这是对 ${itemName} 在 ${roomName} 中位置的模拟描述。请在 CameraCapture.vue 或 aiService.js 中配置 API Key 以启用真实分析。`);
            }, 1500);
        });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    我拍了一张照片，并在其中用红圈圈出了一个物品：${itemName}。
    这个房间是：${roomName}。
    请帮我详细描述这个物品存放的精准位置，比如“在XX的左边”、“XX柜子的第几层”等。
    描述要自然、智能，方便我以后寻找。
    直接给出一段话描述即可，不要有多余的文字。
  `;

    const base64Data = imageSrc.split(',')[1];
    const imagePart = {
        inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
        }
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
};
