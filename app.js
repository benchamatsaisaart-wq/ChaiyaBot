// 1. นำ API Key ที่ได้จาก Google AI Studio มาใส่ในเครื่องหมายคำพูด
const API_KEY = "AIzaSyAd8dv1PM-OCtGV_PBM17urbkvHRNDnBuo"; 

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const display = document.getElementById('chat-display');
const input = document.getElementById('user-input');
const btn = document.getElementById('send-btn');

async function askAI(question) {
    addMessage(question, 'user');
    input.value = '';

    // Prompt context
    const prompt = `คุณเป็นมัคคุเทศก์ผู้เชี่ยวชาญพระบรมธาตุไชยา จังหวัดสุราษฎร์ธานี ให้ตอบคำถามนี้ด้วยความเป็นกันเองและถูกต้อง: ${question}`;

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();

        // 1. เช็คก่อนว่า API ตอบกลับมาแบบ Error หรือไม่
        if (!response.ok) {
            console.error("API Error:", data); // ดู Error จริงๆ ใน Console
            throw new Error(data.error?.message || "เกิดข้อผิดพลาดจาก Server");
        }

        // 2. เช็คว่ามีคำตอบ (candidates) กลับมาจริงไหม
        if (data.candidates && data.candidates.length > 0) {
            const reply = data.candidates[0].content.parts[0].text;
            addMessage(reply, 'bot');
        } else {
            // กรณี AI ไม่ตอบ (อาจเพราะติด Safety Filter)
            addMessage("ขออภัยครับ AI ไม่สามารถตอบคำถามนี้ได้ (อาจเป็นเนื้อหาที่ไม่เหมาะสม)", 'bot');
        }

    } catch (error) {
        console.error("System Error:", error); // ดู Error ใน Console
        addMessage("ขออภัยครับ ระบบขัดข้องเล็กน้อย (ลองกด F12 ดู Console)", 'bot');
    }
}

function addMessage(text, side) {
    const div = document.createElement('div');
    div.className = `msg ${side}`;
    div.innerText = text;
    display.appendChild(div);
    display.scrollTop = display.scrollHeight;
}

btn.addEventListener('click', () => askAI(input.value));
input.addEventListener('keypress', (e) => { if(e.key === 'Enter') askAI(input.value); });