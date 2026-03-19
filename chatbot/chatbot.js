// ===== CHATBOT THẢO CẦM VIÊN SÀI GÒN =====

// API KEY
let OPENAI_API_KEY = "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";
let zooData = null;

// ---------------- LOAD DATA ----------------
async function loadData() {
  try {

    const response = await fetch("/chatbot/data.json");

    if (!response.ok) {
      throw new Error("Không tìm thấy data.json");
    }

    zooData = await response.json();

    console.log("✅ Data loaded:", zooData);

  } catch (error) {

    console.error("❌ Lỗi load dữ liệu:", error);

  }
}

// ---------------- TÌM FAQ LOCAL ----------------
function normalize(text){
 return text
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"")
}

function findLocalAnswer(question) {

  if (!zooData || !zooData.faq) return null;

  const q = normalize(question);

  for (const item of zooData.faq) {

    for (const keyword of item.keywords) {

      if (q.includes(normalize(keyword))) {

        return item.answer;

      }

    }

  }

  return null;

}

// ---------------- GỌI OPENAI ----------------
async function askOpenAI(userMessage) {

  if (!zooData)
    return "Xin lỗi, dữ liệu chưa sẵn sàng.";

  const systemPrompt = `
Bạn là trợ lý AI của Thảo Cầm Viên Sài Gòn.

Hãy giúp khách tham quan trả lời các câu hỏi về:

- giờ mở cửa
- giá vé
- các loài động vật
- lịch sử Thảo Cầm Viên
- đường tham quan
- tiện ích

Nếu câu hỏi không liên quan, vẫn có thể trả lời như một trợ lý AI thân thiện.

Dữ liệu:
${JSON.stringify(zooData.info, null, 2)}
`;

  const payload = {

    model: "gpt-3.5-turbo",

    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],

    temperature: 0.3,
    max_tokens: 512
  };

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (data.choices && data.choices[0]) {

      return data.choices[0].message.content.trim();

    }

    return "Xin lỗi, tôi chưa có câu trả lời.";

  } catch (error) {

    console.error("❌ Lỗi OpenAI:", error);

    return "Xin lỗi, có lỗi khi kết nối AI.";

  }

}

// ---------------- KHỞI TẠO CHATBOT ----------------
function initChatbot() {

  loadData();

  const toggle = document.getElementById("chatbot-toggle");
  const closeBtn = document.getElementById("chatbot-close");
  const chatWindow = document.getElementById("chatbot-window");
  const messagesContainer = document.getElementById("chatbot-messages");
  const input = document.getElementById("chatbot-input");
  const sendBtn = document.getElementById("chatbot-send");
  const typingIndicator = document.getElementById("chatbot-typing");

  if (!toggle || !chatWindow) {

    console.error("❌ Không tìm thấy chatbot elements");

    return;

  }

  console.log("🤖 Chatbot Thảo Cầm Viên đã khởi động");

  toggle.onclick = () => {

    chatWindow.classList.add("active");
    toggle.style.display = "none";
    input.focus();

  };

  if (closeBtn)
    closeBtn.onclick = () => {

      chatWindow.classList.remove("active");
      toggle.style.display = "flex";

    };

  if (sendBtn)
    sendBtn.onclick = sendMessage;

  if (input)
    input.onkeypress = (e) => {

      if (e.key === "Enter" && !e.shiftKey) {

        e.preventDefault();
        sendMessage();

      }

    };

  function showTyping() {

    if (typingIndicator)
      typingIndicator.style.display = "flex";

    setTimeout(() => {

      messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

    }, 50);

  }

  function hideTyping() {

    if (typingIndicator)
      typingIndicator.style.display = "none";

  }

  function addMessage(text, isUser = false) {

    if (!messagesContainer) return;

    const msg = document.createElement("div");

    msg.className = `message ${isUser ? "user-message" : "bot-message"}`;

    if (!isUser) {

      const avatar = document.createElement("img");

      avatar.src = "../assets/avartar2.png";
      avatar.alt = "AI";
      avatar.className = "message-avatar";

      msg.appendChild(avatar);

    }

    const bubble = document.createElement("div");

    bubble.className = "message-bubble";

    String(text || "")
      .split("\n")
      .filter(Boolean)
      .forEach((t) => {

        const p = document.createElement("p");
        p.textContent = t;

        bubble.appendChild(p);

      });

    msg.appendChild(bubble);

    messagesContainer.appendChild(msg);

    setTimeout(() => {

      messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

    }, 100);

  }

  async function sendMessage() {

    if (!input) return;

    const message = input.value.trim();

    if (!message) return;

    addMessage(message, true);

    input.value = "";

    if (sendBtn)
      sendBtn.disabled = true;

    showTyping();

    // ƯU TIÊN FAQ
    let reply = findLocalAnswer(message);

    // NẾU KHÔNG CÓ FAQ → GỌI AI
    if (!reply) {

      reply = await askOpenAI(message);

    }

    setTimeout(() => {

      hideTyping();

      addMessage(reply);

      if (sendBtn)
        sendBtn.disabled = false;

      input.focus();

    }, 400);

  }

}

// chạy khi DOM sẵn sàng
if (document.readyState === "loading") {

  document.addEventListener("DOMContentLoaded", initChatbot);

} else {

  initChatbot();

}

console.log("🦁 Chatbot Thảo Cầm Viên Sài Gòn sẵn sàng!");