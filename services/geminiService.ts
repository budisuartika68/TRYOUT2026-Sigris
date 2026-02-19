
import { GoogleGenAI } from "@google/genai";

export const getProctorResponse = async (message: string): Promise<string> => {
  try {
    // Corrected initialization: Always use direct reference to process.env.API_KEY as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `Anda adalah Asisten Pengawas Ujian AI (SIGRIS Proctor) untuk SMP PGRI 7 Denpasar. 
        Bahasa: Indonesia Resmi.
        Nada: Tegas, profesional, waspada, dan berwibawa.
        Aturan: 
        1. Siswa dilarang pindah tab (ALT+TAB).
        2. Siswa dilarang merubah ukuran layar (Resize).
        3. Kamera dan GPS harus aktif.
        4. Pelanggaran akan berakibat pada penambahan waktu hukuman (Lockout).
        PENTING: Jangan pernah memberikan jawaban ujian atau bocoran materi. Jika ditanya soal ujian, ingatkan tentang integritas dan kejujuran.`,
        temperature: 0.7,
      },
    });
    // Correct: Access the .text property directly from the GenerateContentResponse object
    return response.text || "Sistem tidak dapat merespon saat ini.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Asisten AI sedang sibuk. Tetap fokus pada lembar soal Anda.";
  }
};
