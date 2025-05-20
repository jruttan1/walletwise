import { env } from "@/lib/env"
export interface SonarResponse {
  answer: string
  citations: Array<{ title: string; url: string }>
}

export async function askSonar(prompt: string): Promise<SonarResponse> {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.SONAR_KEY}`,
    },
    body: JSON.stringify({ 
        model: "sonar-reasoning-pro",
        messages: [ //Iterate on system message later
            { role: "system", content: 'You are a helpful assistant that can answer questions about the stock market for those who are new to the stock market. Be concise and precise. Keep your responses to 3 sentences or less. Dont use extensive financial jargon. Keep it simple and easy to understand.' }, 
            { role: "user", content: prompt }
        ],
    }),
  });

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Sonar API error (${res.status}): ${text}`)
  }

  const json = await res.json();
  const raw = json.choices[0].message.content as string;

  const answer = raw.includes('</think>')
  ? raw.split('</think>').pop()!.trim()
  : raw.trim();

  const citations = (json.citations as string[]).map(url => ({
    title: url,  
    url,
  }));

  return { answer, citations };
}