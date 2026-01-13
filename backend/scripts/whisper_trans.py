import sys
import whisper 
import os

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Audio file path is missing.", file=sys.stderr)
        sys.exit(1)

    audio_path = sys.argv[1]

    if not os.path.exists(audio_path):
        print(f"Error: Audio file not found at {audio_path}", file=sys.stderr)
        sys.exit(1)

    try:
        model = whisper.load_model("base")

        result = model.transcribe(audio_path)

        print(result["text"].strip())

    except Exception as e:
        print(f"Whisper execution failed: {e}", file=sys.stderr)
        sys.exit(1)
