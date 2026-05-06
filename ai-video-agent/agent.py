import argparse
import json
from pathlib import Path

from config import load_config
from script_writer import write_script
from audio_generator import generate_audio_segments
from slide_generator import generate_slides
from video_assembler import assemble_video


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Coach4U AI Video Agent — turn a topic or script into a branded MP4."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--topic",
        help="Topic or description. Claude will write a structured script from this.",
    )
    group.add_argument(
        "--script",
        help="Path to an existing script JSON file (skips Claude script writing).",
    )
    parser.add_argument(
        "--output",
        default="output/output.mp4",
        help="Output video path (default: output/output.mp4).",
    )
    args = parser.parse_args()

    cfg = load_config()

    output_dir = Path("output")
    slides_dir = output_dir / "slides"
    audio_dir = output_dir / "audio"
    for d in (output_dir, slides_dir, audio_dir):
        d.mkdir(parents=True, exist_ok=True)

    if args.topic:
        print(f"Writing script for: {args.topic}")
        script = write_script(args.topic, cfg)
        script_path = output_dir / "script.json"
        script_path.write_text(json.dumps(script, indent=2))
        print(f"Script saved to {script_path}")
    else:
        script = json.loads(Path(args.script).read_text())
        print(f"Loaded script: {script['title']}")

    print(f"\nGenerating audio for {len(script['sections'])} sections...")
    audio_paths = generate_audio_segments(script, audio_dir, cfg)

    print("\nGenerating slides...")
    slide_paths = generate_slides(script, slides_dir)

    print("\nAssembling video...")
    assemble_video(slide_paths, audio_paths, args.output)

    print(f"\nDone. Output: {args.output}")


if __name__ == "__main__":
    main()
