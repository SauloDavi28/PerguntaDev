import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1";

const MODEL_ID = "onnx-community/Qwen2.5-0.5B-Instruct";
const SYSTEM_PROMPT = "Você é o PerguntaDev, um assistente de programação para iniciantes. Responda em português brasileiro, com clareza e concisão. Explique conceitos e exemplos de código. Se não souber, diga que não tem certeza. Não invente resultados de execução nem fontes. Avise quando uma resposta depender de contexto que não foi fornecido.";

const statusEl = document.querySelector("#status");
const messagesEl = document.querySelector("#messages");
const form = document.querySelector("#chat-form");
const questionEl = document.querySelector("#question");
const sendButton = document.querySelector("#send");
let generator = null;
let history = [];
let busy = false;

function setStatus(text, state = "info") {
  statusEl.textContent = text;
  statusEl.dataset.state = state;
}

function addBubble(text, role) {
  const bubble = document.createElement("div");
  bubble.className = `bubble ${role}`;
  bubble.textContent = text;
  messagesEl.appendChild(bubble);
  bubble.scrollIntoView({ behavior: "smooth", block: "end" });
  return bubble;
}

async function loadModel() {
  const webgpuAvailable = Boolean(navigator.gpu);
  if (webgpuAvailable) {
    try {
      setStatus("Baixando e preparando o modelo para WebGPU. Na primeira vez pode demorar.");
      generator = await pipeline("text-generation", MODEL_ID, {
        device: "webgpu",
        dtype: "q4",
      });
      sendButton.disabled = false;
      setStatus("Modelo pronto · inferência no navegador com WebGPU.", "ready");
      return;
    } catch (error) {
      console.warn("WebGPU indisponível; tentando WASM.", error);
    }
  }

  try {
    setStatus("Preparando o modelo em modo WASM/CPU. A geração pode ser mais lenta.");
    generator = await pipeline("text-generation", MODEL_ID, {
      device: "wasm",
      dtype: "q4",
    });
    sendButton.disabled = false;
    setStatus("Modelo pronto · inferência no navegador com WASM/CPU.", "ready");
  } catch (error) {
    console.error(error);
    setStatus("Não foi possível carregar o modelo. Recarregue a página ou tente outro navegador.", "error");
  }
}

async function answer(question) {
  const recentHistory = history.slice(-6);
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...recentHistory,
    { role: "user", content: question },
  ];
  const result = await generator(messages, {
    max_new_tokens: 160,
    do_sample: true,
    temperature: 0.7,
    top_p: 0.9,
    repetition_penalty: 1.08,
  });
  const generated = result?.[0]?.generated_text;
  if (Array.isArray(generated)) return generated.at(-1)?.content?.trim() || "Não consegui gerar uma resposta.";
  return String(generated || "Não consegui gerar uma resposta.").trim();
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const question = questionEl.value.trim();
  if (!question || !generator || busy) return;

  busy = true;
  sendButton.disabled = true;
  questionEl.disabled = true;
  addBubble(question, "user");
  questionEl.value = "";
  const pending = addBubble("Gerando resposta…", "assistant pending");
  setStatus("O modelo está gerando a resposta…");

  try {
    const reply = await answer(question);
    pending.textContent = reply;
    history.push({ role: "user", content: question }, { role: "assistant", content: reply });
    history = history.slice(-8);
    setStatus("Resposta gerada. Revise informações e código antes de usar.", "ready");
  } catch (error) {
    console.error(error);
    pending.textContent = "Ocorreu um erro ao gerar. Tente novamente com uma pergunta mais curta.";
    setStatus("Falha durante a geração.", "error");
  } finally {
    busy = false;
    questionEl.disabled = false;
    sendButton.disabled = !generator;
    questionEl.focus();
  }
});

document.querySelectorAll(".example").forEach((button) => {
  button.addEventListener("click", () => {
    questionEl.value = button.textContent;
    questionEl.focus();
  });
});

loadModel();
