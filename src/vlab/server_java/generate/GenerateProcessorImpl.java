package vlab.server_java.generate;

import rlcp.generate.GeneratingResult;
import rlcp.server.processor.generate.GenerateProcessor;

import java.util.Random;

/**
 * Simple GenerateProcessor implementation. Supposed to be changed as needed to
 * provide necessary Generate method support.
 */
public class GenerateProcessorImpl implements GenerateProcessor {

    @Override
    public GeneratingResult generate(String condition) {
        String text = "Your variant is ready";
        String code = "";
        String instructions = "";
        String[] variants = {"18", "03", "27", "28"};
        Random random = new Random();
        int variant_number = random.nextInt(4);
        code = variants[variant_number];
        return new GeneratingResult(text, code, instructions);
    }
}
