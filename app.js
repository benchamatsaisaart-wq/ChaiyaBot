// 1. กลับมาใช้ Key ตัวใหม่ที่ลงท้ายด้วย IZBq0WY
const API_KEY = "AIzaSyB8GNtdhngkTrHEq02rwNPopiy-jDxdcKo";

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');

// กด Enter เพื่อส่งได้
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        askAI();
    }
});

async function askAI() {
    const question = input.value.trim();
    if (!question) return;

    // 1. แสดงข้อความผู้ใช้
    addMessage(question, 'user-message');
    input.value = '';
    
    // 2. แสดงสถานะกำลังพิมพ์ (Loading)
    const loadingId = addMessage('<i class="fa-solid fa-circle-notch fa-spin"></i> กำลังค้นหาข้อมูล...', 'bot-message');

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        // Prompt สั่งให้ตอบกระชับและจัดรูปแบบสวยงาม
                        text: `คุณคือมัคคุเทศก์ผู้เชี่ยวชาญ "พระบรมธาตุไชยา" จังหวัดสุราษฎร์ธานี 
                        - ให้ตอบคำถามเกี่ยวกับประวัติศาสตร์ การเดินทาง หรือของฝาก อย่างผู้เชี่ยวชาญ
                        - คำตอบต้อง: "กระชับ" "เข้าใจง่าย" และ "เป็นกันเอง"
                        - จัดรูปแบบ: ใช้ Bullet point สำหรับรายการ, ใช้ตัวหนาสำหรับคำสำคัญ
                        - ห้ามตอบยาวเหยียดจนน่าเบื่อ
                        คำถาม: ${question}`
                    }]
                }]
            })
        });

        // เช็คโควตาเต็ม
        if (response.status === 429) {
            updateMessage(loadingId, "⚠️ ขออภัยครับ คนใช้งานเยอะเกินโควตา โปรดรอ 1 นาทีแล้วลองใหม่นะ");
            return;
        }

        const data = await response.json();
        
        if (data.candidates) {
            let reply = data.candidates[0].content.parts[0].text;
            // จัดรูปแบบข้อความให้น่าอ่าน (แปลง Markdown เบื้องต้น)
            reply = formatText(reply); 
            updateMessage(loadingId, reply);
        } else {
            updateMessage(loadingId, "ขออภัยครับ ไม่พบข้อมูลในขณะนี้");
        }

    } catch (error) {
        console.error("Error:", error);
        updateMessage(loadingId, "❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
}

function addMessage(htmlContent, type) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    div.innerHTML = `<div class="msg-content">${htmlContent}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
    return div; // คืนค่า element เพื่อใช้อัปเดตข้อความทีหลัง
}

function updateMessage(element, newHtml) {
    const contentDiv = element.querySelector('.msg-content');
    contentDiv.innerHTML = newHtml;
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ฟังก์ชันแปลง Markdown เป็น HTML ง่ายๆ
function formatText(text) {
    // แปลงตัวหนา **text** -> <b>text</b>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    // แปลง bullet point * -> •
    formatted = formatted.replace(/^\* /gm, '• ');
    // แปลงการขึ้นบรรทัดใหม่
    formatted = formatted.replace(/\n/g, '<br>');
    return formatted;
}