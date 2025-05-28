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
        messages: [ 
            { role: "system", content: 'You are a financial analysis assistant specializing in stock market data for beginners. Follow these guidelines: 1) Use simple, non-technical language accessible to new investors; 2) Provide accurate, fact-based information with citations from reputable sources when available; 3) Always follow the exact output format specified in the user prompt; 4) If the user prompt requests JSON, ensure your response is valid, properly formatted JSON that exactly matches the requested structure. Your primary goal is to make financial information understandable while maintaining accuracy.' }, 
            { role: "user", content: prompt }
        ],
        pf_enable_citations: true,
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

  console.log('Sonar API response:', { 
    citationsExists: 'citations' in json,
    citationsType: typeof json.citations,
    citationsValue: json.citations,
    hasContent: 'choices' in json && json.choices.length > 0,
    contentLength: raw.length
  });
  
  const citations = Array.isArray(json.citations) 
    ? json.citations.map((url: string) => ({
        title: url,  
        url,
      }))
    : [];
    
  console.log('Processed citations:', citations);

  return { answer, citations };
}