// ===== CHATBOT THẢO CẦM VIÊN SÀI GÒN =====

// API KEY
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
  if (!zooData) return null;

  const q = normalize(question);

  // Tra loi uu tien cho cau hoi co/khong ve dong vat cu the.
  if (Array.isArray(zooData?.info?.animals) && zooData.info.animals.length) {
    const animalsNormalized = zooData.info.animals.map((name) => ({
      raw: name,
      norm: normalize(name),
    }));

    const animalAliases = {
      "gau meo": "gau meo",
      raccoon: "gau meo",
    };

    const detectedAnimal = animalsNormalized.find((a) => q.includes(a.norm));
    let animalQuery = detectedAnimal?.raw || null;

    if (!animalQuery) {
      for (const [alias, canonicalNorm] of Object.entries(animalAliases)) {
        if (!q.includes(alias)) continue;
        const hit = animalsNormalized.find((a) => a.norm === canonicalNorm);
        if (hit) {
          animalQuery = hit.raw;
          break;
        }
      }
    }

    const asksHasAnimal =
      /co|khong|trong|thao cam vien|so thu|o day/.test(q) &&
      /(con|loai|dong vat|co khong|co o)/.test(q);

    if (animalQuery && asksHasAnimal) {
      return `Co, ${animalQuery} co trong Thao Cam Vien theo du lieu hien tai.`;
    }
  }

  if (Array.isArray(zooData.faq)) {
    for (const item of zooData.faq) {
      for (const keyword of item.keywords || []) {
        if (q.includes(normalize(keyword))) {
          return item.answer;
        }
      }
    }
  }

  const info = zooData.info || {};
  const infoRules = [
    {
      keywords: ["gio mo cua", "mo cua", "dong cua", "moi ngay may gio"],
      answer: info.open_time
        ? `Thao Cam Vien mo cua tu ${info.open_time} moi ngay.`
        : null,
    },
    {
      keywords: ["gia ve", "ve nguoi lon", "ve tre em", "bao nhieu tien"],
      answer: (info.adult_ticket || info.child_ticket)
        ? `Gia ve hien tai: nguoi lon ${info.adult_ticket || "dang cap nhat"}, tre em ${info.child_ticket || "dang cap nhat"}.`
        : null,
    },
    {
      keywords: ["dia chi", "o dau", "vi tri"],
      answer: info.address
        ? `Dia chi: ${info.address}.`
        : null,
    },
    {
      keywords: ["gui xe", "bai xe", "cho de xe"],
      answer: info.parking
        ? `${info.parking}.`
        : null,
    },
    {
      keywords: ["thanh lap", "lich su", "nam thanh lap"],
      answer: info.founded
        ? `Thao Cam Vien duoc thanh lap nam ${info.founded}.`
        : null,
    },
    {
      keywords: ["dong vat", "co con gi", "loai vat"],
      answer: Array.isArray(info.animals) && info.animals.length
        ? `Mot so loai dong vat noi bat: ${info.animals.join(", ")}.`
        : null,
    },
  ];

  for (const rule of infoRules) {
    if (!rule.answer) continue;
    if (rule.keywords.some((k) => q.includes(k))) {
      return rule.answer;
    }
  }

  return null;

}

// ---------------- GỌI OPENAI ----------------
async function askOpenAI(userMessage) {
  const internalInfo = zooData?.info
    ? JSON.stringify(zooData.info, null, 2)
    : "Du lieu noi bo tam thoi chua tai xong.";

  const systemPrompt = `
Bạn là trợ lý AI của Thảo Cầm Viên Sài Gòn.

Muc tieu: Tra loi dung, ngan gon, huu ich. Uu tien su chinh xac hon la tra loi dai.

Nguyen tac bat buoc:
1) Neu cau hoi lien quan Thao Cam Vien va co du lieu noi bo, uu tien dung du lieu noi bo.
2) Neu du lieu noi bo khong du, van duoc tra loi kien thuc chung nhu ChatGPT.
3) Tuyet doi khong doan boi, khong bịa chi tiet (ten rieng, so lieu, moc thoi gian) khi khong chac.
4) Neu khong chac, phai noi ro muc do khong chac (vi du: "Minh khong chac 100%...") va dua huong kiem tra.
5) Voi cau hoi can do chinh xac cao (y te, phap ly, tai chinh, so lieu hien hanh, tin tuc moi), luon kem canh bao xac minh nguon chinh thuc.
6) Khong tra loi theo kieu "khong co thong tin" chung chung. Thay vao do: dua cau tra loi an toan + neu ro gioi han.

Du lieu noi bo:
${internalInfo}
`;

  const payload = {

    model: "openai/gpt-4o-mini",

    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],

    temperature: 0,
    top_p: 0.2,
    max_tokens: 512
  };

  try {

    const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

const data = await response.json();

if (data.error) {
  return "Lỗi AI: " + data.error.message;
}

if (data.choices?.length > 0) {
  return data.choices[0].message.content.trim();
}

return "Minh chua nhan duoc phan hoi hoan chinh tu AI. Ban thu gui lai cau hoi nhe.";
             


  } catch (error) {

    console.error("❌ Lỗi OpenAI:", error);

    return "Xin lỗi, có lỗi khi kết nối AI.";

  }

}

// ---------------- KHỞI TẠO CHATBOT ----------------
function initChatbot() {

  loadData();
  const BOT_AVATAR = "../assets1/logo4.jpg";

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

      avatar.src = BOT_AVATAR;
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

    // Uu tien cau tra loi tu data local truoc
    let reply = findLocalAnswer(message);

    // Neu data local khong co, goi AI tra loi tu do nhu ChatGPT
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