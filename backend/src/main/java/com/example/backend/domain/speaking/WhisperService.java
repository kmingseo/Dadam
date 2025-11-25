package com.example.backend.domain.speaking;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

@Service
public class WhisperService {

    // ⭐️ Python 실행 파일 경로 (하드코딩)
    private static final String PYTHON_EXECUTABLE = "/opt/anaconda3/envs/dadam/bin/python";

    // ⭐️ Python 스크립트 경로 (하드코딩)
    private static final String WHISPER_SCRIPT_PATH = "/Users/m1/Desktop/Dadam/backend/scripts/whisper_trans.py";

    public String transcribeAudio(File audioFile) throws Exception {

        ProcessBuilder pb = new ProcessBuilder(
                PYTHON_EXECUTABLE,
                WHISPER_SCRIPT_PATH,
                audioFile.getAbsolutePath()
        );
        // pb.redirectErrorStream(true); // 에러와 출력을 합치려면 주석 해제

        Process process = pb.start();

        // 1. Python 스크립트의 정상 출력(stdout) 읽기
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "UTF-8"));
        String line;
        StringBuilder output = new StringBuilder();
        while ((line = reader.readLine()) != null) {
            output.append(line);
        }

        // 2. Python 스크립트의 오류 출력(stderr) 읽기 (디버깅용)
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream(), "UTF-8"));
        String errorLine;
        StringBuilder errorOutput = new StringBuilder();
        while ((errorLine = errorReader.readLine()) != null) {
            errorOutput.append(errorLine).append("\n");
        }

        // 3. 프로세스가 종료될 때까지 대기
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            // Python 스크립트 실행 중 오류 발생 시 예외 처리
            String errorMessage = "Whisper Script Error (Exit Code " + exitCode + "):\n" + errorOutput.toString();
            throw new RuntimeException(errorMessage);
        }

        // 4. 인식된 텍스트 반환
        return output.toString().trim();
    }
}