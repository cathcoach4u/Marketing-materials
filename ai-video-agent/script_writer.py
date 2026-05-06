import json
import anthropic

SYSTEM_PROMPT = """You are a professional script writer for Coach4U, a strengths-based coaching and counselling practice run by Cath Baker in Sydney, Australia.

Write educational video scripts in a warm, professional, clear tone. Strengths-based, not clinical. Australian English. Short paragraphs. Practical over theoretical.

Return ONLY valid JSON in this exact structure:
{
  "title": "Video title (concise, under 10 words)",
  "sections": [
    {
      "heading": "Section heading",
      "narration": "The spoken narration for this section. 2-4 sentences. Natural, conversational Australian English.",
      "bullets": ["Key point 1", "Key point 2", "Key point 3"]
    }
  ]
}

Guidelines:
- 4-6 sections total (including an intro and a closing section)
- Each narration is 2-4 sentences, suitable for a 30-60 second spoken segment
- Bullets are 3-5 short points shown on screen while narration plays
- Tone: warm, practical, strengths-focused
- No exclamation marks. No em dashes. Australian English.
- Never refer to Coach4U as a psychology practice."""


def write_script(topic: str, config: dict) -> dict:
    client = anthropic.Anthropic(api_key=config["ANTHROPIC_API_KEY"])

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": f"Write a structured video script about: {topic}",
            }
        ],
    )

    raw = message.content[0].text.strip()
    # Strip markdown code fences if the model wraps the JSON
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    return json.loads(raw.strip())
