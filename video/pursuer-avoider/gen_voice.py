import os, re, json, subprocess, requests

KEY = os.environ["ELEVENLABS_API_KEY"]
VOICE = os.environ.get("ELEVENLABS_VOICE_ID", "V50HFUKIgwPl4QEG3try")
FPS = 30
BIN = os.path.join(os.getcwd(), "node_modules", ".bin", "remotion")

# Pauses (seconds): lead-in before the first words, a beat between scenes, a tail at the end.
LEADIN = 1.2
GAP = 0.95
TAIL = 1.9

# One segment per scene — see script.md. Wording matched closely to the on-screen text.
SEGMENTS = [
    "Have you noticed that the harder one of you tries to talk, the more the other one pulls away? You are not imagining it. It is a dance, and it has a name.",
    "One of you moves towards. You want to talk about it now, fix it now, feel close again now. That is the pursuer.",
    "The other moves away. You go quiet, you need space, you wait for things to settle. That is the avoider.",
    "Harville Hendrix calls this the hailstorm and the turtle. The hailstorm gets louder and bigger. The turtle pulls deeper into its shell. Different researchers, same dance.",
    "Here is the trap. The pursuing feels like a storm, so the turtle hides. The hiding feels like abandonment, so the storm grows. Each of you is protecting yourself, and each move sets off the other.",
    "Underneath, the pursuer fears that if they stop reaching, you will drift apart. The avoider fears that if they engage, they will get it wrong and make it worse. Both fears make sense. Neither of you is the villain.",
    "This is the part to hold onto. It is not your characters. It is a cycle. And a cycle can be changed.",
    "So name it when you see it. I think we are in our dance right now. The turtle comes out enough to say when they will be back. And the storm softens enough to let them.",
    "This week, you do not have to fix it. Just notice the dance, and notice which step is yours. Noticing is the first step out.",
    "You are not opponents. You are partners learning the same dance. I will see you in our next session.",
]

os.makedirs("build_audio", exist_ok=True)
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
    p = f"build_audio/seg{i}.mp3"
    open(p, "wb").write(r.content)
    spoken.append(probe_dur(p))
    print(f"seg {i}: {spoken[i]:.2f}s")

# Scene durations = lead-in (scene 0) + spoken + trailing gap (tail on the last).
scene_dur = []
for i in range(len(SEGMENTS)):
    lead = LEADIN if i == 0 else 0.0
    tail = TAIL if i == len(SEGMENTS) - 1 else GAP
    scene_dur.append(lead + spoken[i] + tail)

# Frames from cumulative time (no drift).
cum = [0.0]
for d in scene_dur:
    cum.append(cum[-1] + d)
start_f = [round(t * FPS) for t in cum]
frames = [start_f[i + 1] - start_f[i] for i in range(len(SEGMENTS))]

# Build one mp3: pad each segment with its silence, lead-in on the first, then concat.
inputs = []
filt = []
for i in range(len(SEGMENTS)):
    inputs += ["-i", f"build_audio/seg{i}.mp3"]
    lead = LEADIN if i == 0 else 0.0
    tail = TAIL if i == len(SEGMENTS) - 1 else GAP
    pre = f"adelay={int(lead*1000)}|{int(lead*1000)}," if lead > 0 else ""
    filt.append(f"[{i}]{pre}apad=pad_dur={tail}[a{i}]")
concat_in = "".join(f"[a{i}]" for i in range(len(SEGMENTS)))
filt.append(f"{concat_in}concat=n={len(SEGMENTS)}:v=0:a=1[out]")
cmd = [BIN, "ffmpeg", "-y"] + inputs + ["-filter_complex", ";".join(filt),
       "-map", "[out]", "-c:a", "libmp3lame", "-q:a", "3", "public/voiceover.mp3"]
res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("ffmpeg concat failed:\n", res.stderr[-1500:]); raise SystemExit(1)

json.dump({"frames": frames, "total": sum(frames)}, open("src/timing.json", "w"))
print("total:", round(sum(frames) / FPS, 1), "s  frames:", frames)
