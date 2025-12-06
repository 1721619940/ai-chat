import config from "../config/config.js";

export async function generateAIReply(message) {
   const apiKey = config.openRouterKey;
   const model = config.aiModel;

  if (!apiKey) {
    console.warn("OPENROUTER_API_KEY not set – returning dummy reply");
    return "AI is not configured yet. Please set OPENROUTER_API_KEY.";
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are a helpful customer support agent.",
        },
        { role: "user", content: message },
      ],
    }),
  });

  if (!res.ok) {
    console.error("OpenRouter error:", await res.text());
    throw new Error("AI provider error");
  }

  const data = await res.json();
  return (
    data.choices?.[0]?.message?.content ?? "Sorry, I had trouble replying."
  );
}
