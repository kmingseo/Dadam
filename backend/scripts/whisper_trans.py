import sys
import whisper # ⭐️ 'pip install openai-whisper'로 설치해야 함
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
        # ⭐️ 사용할 Whisper 모델 지정 ('base', 'small', 'medium' 등)
        model = whisper.load_model("base")

        # 음성 인식 수행
        result = model.transcribe(audio_path)

        # 인식된 텍스트를 표준 출력으로 반환 (Spring Boot가 이 출력을 읽음)
        print(result["text"].strip())

    except Exception as e:
        # 오류 발생 시 표준 오류(stderr)로 출력
        print(f"Whisper execution failed: {e}", file=sys.stderr)
        sys.exit(1)