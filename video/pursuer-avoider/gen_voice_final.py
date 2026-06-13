import os, re, json, shutil, subprocess, requests

KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "V50HFUKIgwPl4QEG3try")
FPS = 30
BIN = os.path.join(os.getcwd(), "node_modules", ".bin", "remotion")

LEADIN = 1.2
GAP = 0.95
TAIL = 2.2

# One segment per scene — matched to the locked deck (v7) wording.
SEGMENTS = [
    "We call it the dance. Why you're stuck in the same argument, and the way back to each other.",
    "An argument starts, and a gap opens up between you. One of you pulls away to cool down. But the more they pull away, the more the other reaches. And the more they reach, the further their partner retreats. One is the pursuer. One is the avoider.",
    "Research has a name for this. Across seventy-four studies, no communication pattern predicts unhappiness more strongly. Four schools of research. One dance.",
    "When you feel disconnected, one of you moves towards, and one of you moves away. Neither of you is wrong.",
    "The pursuer reaches out. Wants to talk now. Asks, follows, seeks reassurance. Underneath sits a fear. If I stop reaching, we'll drift apart.",
    "The avoider goes quiet. Needs space. Calm on the outside, flooded on the inside. Their fear is different. If I engage, I'll only make it worse.",
    "Imago therapy calls them the hailstorm, and the turtle. And these aren't flaws in who you are. The hailstorm often learned, long ago, that they had to be loud to be heard. The turtle learned that going quiet was the only way to feel safe. So the louder it hails, the deeper the turtle hides.",
    "And here's why it spins. To the one reaching, silence feels like being abandoned, so they reach even harder. To the one retreating, the reaching feels like a storm, so they pull even further away. Each of you reads the other's move as the very thing you fear the most. Round, and round, it goes.",
    "But when you see the scared child behind your partner's reaction, the anger begins to turn into empathy.",
    "And the dance can't continue, if one of you changes your steps.",
    "Because it's not your characters. It's a cycle. And a cycle can be changed.",
    "Step one. Name the dance, not the partner. I think we're in our dance right now. Can we slow down?",
    "Step two. The storm softens. If you tend to chase, lead with how you feel, and what you need, not with blame. I'm feeling disconnected, and it's making me anxious. Can we talk when you're ready?",
    "Step three. The turtle returns. If you tend to pull away, ask for space before you flood, give it a time, then come back. I need twenty minutes to settle. Then I'll come back to this.",
    "This week, just notice the dance, and notice which step is yours. Because the goal was never to win the argument. It's to find your way back to each other. Truly connected. Fully present.",
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
    # Locked pronunciation: the opening "dance" uses the confirmed take (Australian).
    if i == 0 and os.path.exists("locked/seg0_locked.mp3"):
        shutil.copy("locked/seg0_locked.mp3", p)
        print("seg 0: using locked opening take")
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
