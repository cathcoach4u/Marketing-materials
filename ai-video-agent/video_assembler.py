import subprocess
import tempfile
from pathlib import Path


def assemble_video(
    slide_paths: list[Path], audio_paths: list[Path], output_path: str
) -> None:
    tmp_dir = Path(tempfile.mkdtemp())
    segment_files: list[Path] = []

    # Title slide: 3 seconds, silent
    title_seg = tmp_dir / "seg_00.mp4"
    _silent_segment(slide_paths[0], 3.0, title_seg)
    segment_files.append(title_seg)

    # One segment per section: section slide + its audio
    section_slides = slide_paths[1:]
    for i, (slide, audio) in enumerate(zip(section_slides, audio_paths)):
        seg = tmp_dir / f"seg_{i + 1:02d}.mp4"
        _audio_segment(slide, audio, seg)
        segment_files.append(seg)

    # Write concat list and merge
    concat_list = tmp_dir / "concat.txt"
    concat_list.write_text(
        "\n".join(f"file '{s.resolve()}'" for s in segment_files) + "\n"
    )

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-f", "concat",
            "-safe", "0",
            "-i", str(concat_list),
            "-c:v", "libx264",
            "-c:a", "aac",
            "-movflags", "+faststart",
            output_path,
        ],
        check=True,
    )
    print(f"  Video assembled: {output_path}")


def _silent_segment(slide: Path, duration: float, output: Path) -> None:
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", str(slide),
            "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
            "-t", str(duration),
            "-c:v", "libx264",
            "-c:a", "aac",
            "-pix_fmt", "yuv420p",
            str(output),
        ],
        check=True,
        capture_output=True,
    )


def _audio_segment(slide: Path, audio: Path, output: Path) -> None:
    subprocess.run(
        [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", str(slide),
            "-i", str(audio),
            "-c:v", "libx264",
            "-c:a", "aac",
            "-pix_fmt", "yuv420p",
            "-shortest",
            str(output),
        ],
        check=True,
        capture_output=True,
    )
