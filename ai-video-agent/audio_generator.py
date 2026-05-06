from pathlib import Path
from elevenlabs.client import ElevenLabs


def generate_audio_segments(
    script: dict, audio_dir: Path, config: dict
) -> list[Path]:
    client = ElevenLabs(api_key=config["ELEVENLABS_API_KEY"])
    voice_id = config["ELEVENLABS_VOICE_ID"]
    paths = []

    for i, section in enumerate(script["sections"]):
        out_path = audio_dir / f"section_{i:02d}.mp3"

        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=section["narration"],
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )

        with open(out_path, "wb") as f:
            for chunk in audio:
                f.write(chunk)

        print(f"  Audio {i + 1}/{len(script['sections'])}: {out_path.name}")
        paths.append(out_path)

    return paths
