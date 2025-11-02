import { GoogleGenAI } from "@google/genai";
import { IpInfo } from '../types';

export const generateConflictAnalysis = async (conflicts: IpInfo[]): Promise<string> => {
    // Fix: Removed manual API key check as per guidelines, assuming it's always set.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const formattedConflicts = conflicts.map(c => 
        `IP: ${c.ip}, MACs: [${c.macAddresses.join(', ')}]`
    ).join('\n');

    const prompt = `
        You are a senior network engineer providing an analysis of an IP address conflict scan.
        The user has provided the following list of IP conflicts detected on their network:
        ${formattedConflicts}

        Please provide a clear, well-structured analysis in markdown format. Your analysis should include:
        1.  **Summary:** A brief explanation of what an IP address conflict is and why it's a critical network issue.
        2.  **Impact Analysis:** Describe the potential problems these conflicts could cause on the network (e.g., connectivity issues, service disruptions).
        3.  **Troubleshooting Steps:** Provide a step-by-step guide on how to resolve these conflicts. Be specific. For example:
            - Identify the devices involved using their MAC addresses.
            - Explain how to find a device on a physical network from a MAC address (e.g., checking switch MAC tables).
            - Suggest solutions like correcting static IP configurations or fixing DHCP server issues.
        4.  **Prevention:** Offer best practices to prevent future IP conflicts (e.g., using DHCP reservations, proper network documentation).

        Structure the response with clear headings (e.g., using '**' for bold).
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "An error occurred while analyzing the results with Gemini. Please check the console for details.";
    }
};