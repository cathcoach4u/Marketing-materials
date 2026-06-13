import os, re, json, shutil, subprocess, requests

KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "V50HFUKIgwPl4QEG3try")
FPS = 30
BIN = os.path.join(os.getcwd(), "node_modules", ".bin", "remotion")

LEADIN = 1.2
GAP = 0.95
TAIL = 2.2

# One segment per scene — re-cut to the Coach4U video framework (Recognition, Validation,
# Simple Understanding, Emotional Shift, Hope, Action, Closure). See ../README.md.
SEGMENTS = [
    # 1 RECOGNITION — lived experience, no labels
    "You have the same argument, over and over. One of you wants to talk it through. The other needs space. The more one reaches, the more the other pulls away. And before long, neither of you feels understood.",
    # 2 name it lightly (+ one line of research, after recognition)
    "We call this the dance. It's the most studied pattern in couples research.",
    # 3 VALIDATION — both make sense, reduce blame
    "When disconnection happens, we tend to move in two different directions. One moves towards, trying to talk, fix, reconnect. The other moves away, trying to settle, think, get some space. Neither is wrong. They're just different responses to the same moment.",
    # 4 what's really happening — both trying to get back to connection
    "Because underneath the behaviour, something more important is happening. The one reaching is often feeling, I'm losing you, I need to fix this. The one pulling away is often feeling, I'm overwhelmed, I need to steady myself. Both are trying, in their own way, to get back to connection.",
    # 5 SIMPLE UNDERSTANDING — one model: hailstorm and turtle
    "But the way they do it pushes the other further away. Imago therapy calls this the hailstorm, and the turtle. The hailstorm learned they had to be loud to be heard. The turtle learned that going quiet was the safest option. So the louder it hails, the deeper the turtle hides.",
    # 6 the trap
    "And here's the trap. To the one reaching, silence feels like abandonment, so they reach harder. To the one pulling away, intensity feels like pressure, so they pull further away. Each becomes the very thing the other fears. Round, and round, it goes.",
    # 7 EMOTIONAL SHIFT, part one — what's underneath (the pivot, slow)
    "The problem is, we only see the behaviour. We don't see what's underneath it. Under the storm, is a need for closeness. Under the silence, is a need to feel safe. And when those don't feel secure, we react in ways that disconnect us even more.",
    # 8 EMOTIONAL SHIFT, part two — the shift
    "But when you start to see what's underneath your partner's reaction, something shifts. The frustration softens. And you begin to see someone who is struggling, not attacking.",
    # 9 HOPE AND AGENCY
    "Because this pattern can change. If it was created by two people, it can be changed by one different step. You're not the problem. The pattern is.",
    # 10 ACTION step one
    "So how do you change the dance? Step one. Name the pattern, not the partner. I think we're in that pattern again. Can we slow this down?",
    # 11 step two — the one who moves towards
    "Step two. If you move towards, soften how you reach. I'm feeling disconnected, and it's making me anxious. Can we talk when you're ready?",
    # 12 step three — the one who moves away
    "Step three. If you move away, stay connected while taking space. I'm getting overwhelmed. I need twenty minutes. Then I'll come back.",
    # 13 CLOSURE — meaning and reconnection
    "Small changes. Different steps. But they change the whole dance. This week, just notice it. Because the goal was never to win the argument. It was to find your way back to each other. Truly connected. Fully present.",
]

os.makedirs("build_audio_final", exist_ok=True)
os.makedirs("public", exist_ok=True)


def probe_dur(path):
    out = subprocess.run([BIN, "ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True)
    try:
        return float(out.stdout.strip())
    except ValueError:
        info = subprocess.run([BIN, "ffmpeg", "-i", path], capture_output=True, text=True)
        m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", info.stderr)
        h, mn, s = m.groups()
        return int(h) * 3600 + int(mn) * 60 + float(s)


def tts(text, settings, path):
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}",
        headers={"xi-api-key": KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        json={"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": settings},
        timeout=120,
    )
    if r.status_code != 200:
        print("TTS error", path, r.status_code, r.text[:200]); raise SystemExit(1)
    open(path, "wb").write(r.content)


# ── Scene 0: the standing Coach4U intro stamp (NO atempo — keep crisp) ──
# Brand "4U" spelled "for you" so it lands soft; tagline flows as one phrase.
tts("A Coach for you video.",
    {"stability": 0.55, "similarity_boost": 0.8, "style": 0.18, "use_speaker_boost": True},
    "build_audio_final/intro_brand.mp3")
tts("Helping those in relationships be truly connected, and fully present with each other.",
    {"stability": 0.6, "similarity_boost": 0.78, "style": 0.1, "use_speaker_boost": True},
    "build_audio_final/intro_body.mp3")
# 0.9s lead -> brand -> 0.7s full-stop pause -> body -> 1.0s tail
ir = subprocess.run([BIN, "ffmpeg", "-y", "-i", "build_audio_final/intro_brand.mp3",
                     "-i", "build_audio_final/intro_body.mp3", "-filter_complex",
                     "[0]adelay=900|900,apad=pad_dur=0.7[a];[1]apad=pad_dur=1.0[b];[a][b]concat=n=2:v=0:a=1[out]",
                     "-map", "[out]", "-c:a", "libmp3lame", "-q:a", "3",
                     "build_audio_final/intro.mp3"], capture_output=True, text=True)
if ir.returncode != 0:
    print("intro concat failed:\n", ir.stderr[-1200:]); raise SystemExit(1)
intro_dur = probe_dur("build_audio_final/intro.mp3")
intro_frames = round(intro_dur * FPS)
print(f"intro: {intro_dur:.2f}s ({intro_frames} frames)")

spoken = []
for i, seg in enumerate(SEGMENTS):
    r = requests.post(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}",
        headers={"xi-api-key": KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        json={"text": seg, "model_id": "eleven_multilingual_v2",
              "voice_settings": {"stability": 0.55, "similarity_boost": 0.75, "style": 0.0, "use_speaker_boost": True}},
        timeout=120,
    )
    if r.status_code != 200:
        print("TTS error", i, r.status_code, r.text[:200]); raise SystemExit(1)
    p = f"build_audio_final/seg{i}.mp3"
    open(p, "wb").write(r.content)
    spoken.append(probe_dur(p))
    print(f"seg {i}: {spoken[i]:.2f}s")

scene_dur = []
for i in range(len(SEGMENTS)):
    lead = LEADIN if i == 0 else 0.0
    tail = TAIL if i == len(SEGMENTS) - 1 else GAP
    scene_dur.append(lead + spoken[i] + tail)

cum = [0.0]
for d in scene_dur:
    cum.append(cum[-1] + d)
start_f = [round(t * FPS) for t in cum]
frames = [start_f[i + 1] - start_f[i] for i in range(len(SEGMENTS))]

inputs = []
filt = []
for i in range(len(SEGMENTS)):
    inputs += ["-i", f"build_audio_final/seg{i}.mp3"]
    lead = LEADIN if i == 0 else 0.0
    tail = TAIL if i == len(SEGMENTS) - 1 else GAP
    pre = f"adelay={int(lead*1000)}|{int(lead*1000)}," if lead > 0 else ""
    filt.append(f"[{i}]{pre}apad=pad_dur={tail}[a{i}]")
concat_in = "".join(f"[a{i}]" for i in range(len(SEGMENTS)))
filt.append(f"{concat_in}concat=n={len(SEGMENTS)}:v=0:a=1[out]")
cmd = [BIN, "ffmpeg", "-y"] + inputs + ["-filter_complex", ";".join(filt),
       "-map", "[out]", "-c:a", "libmp3lame", "-q:a", "3", "build_audio_final/segbody.mp3"]
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("ffmpeg concat failed:\n", res.stderr[-1500:]); raise SystemExit(1)

# Final track = intro stamp + the narration body
fr = subprocess.run([BIN, "ffmpeg", "-y", "-i", "build_audio_final/intro.mp3",
                     "-i", "build_audio_final/segbody.mp3", "-filter_complex",
                     "[0][1]concat=n=2:v=0:a=1[out]", "-map", "[out]",
                     "-c:a", "libmp3lame", "-q:a", "3", "public/voiceover-final.mp3"],
                    capture_output=True, text=True)
if fr.returncode != 0:
    print("final concat failed:\n", fr.stderr[-1200:]); raise SystemExit(1)

all_frames = [intro_frames] + frames
json.dump({"frames": all_frames, "total": sum(all_frames)}, open("src/timing-final.json", "w"))
print("total:", round(sum(all_frames) / FPS, 1), "s  frames:", all_frames)
