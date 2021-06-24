package vlab.server_java.check;
import org.json.JSONObject;
import rlcp.check.ConditionForChecking;
import rlcp.generate.GeneratingResult;
import rlcp.server.processor.check.PreCheckProcessor.PreCheckResult;
import rlcp.server.processor.check.PreCheckResultAwareCheckProcessor;


import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Simple CheckProcessor implementation. Supposed to be changed as needed to provide
 * necessary Check method support.
 */
public class CheckProcessorImpl implements PreCheckResultAwareCheckProcessor<String> {

    private class Answer{
        public List<Double> indicators;
        public int dataNumber;

        public Answer(List<Double> indicators, int dataNumber) {
            this.indicators = indicators;
            this.dataNumber = dataNumber;
        }
    }

    @Override
    public CheckingSingleConditionResult checkSingleCondition(ConditionForChecking condition, String instructions, GeneratingResult generatingResult) throws Exception {
        BigDecimal points = new BigDecimal(0.5);
        String comment = "Solution is particular right;\n";
        double resultPoints = 0.0;
        try {
            String[] answers = {
                    "{\"dataNumber\":\"1\",\"indicators\":\"5.678e-07 8.523e-08 0.6667 1.773 0.1921 4.955e-07 7.48e-08 0.6667 1.777 0.1878 1.255e-06 1.869e-07 0.7 1.905 0.2186 8.388e-07 1.589e-07 0.6833 1.796 0.247 3.184e-07 6.568e-08 6.817 6.145 0.1691 2.271e-07 4.688e-08 6.883 6.083 0.1345 4.293e-07 1.126e-07 7.717 6.051 0.1504 2.811e-07 6.995e-08 6.733 6.059 0.1242 2.888e-07 5.656e-08 10.28 10.5 0.2181 2.371e-07 4.955e-08 9.217 10.7 0.2129 8.892e-07 1.437e-07 10.12 10.53 0.2876 3.514e-07 8.061e-08 10.08 10.98 0.2144 1.038e-07 2.337e-08 14.82 20.98 0.2399 1.151e-07 2.453e-08 16.5 20.87 0.2806 2.104e-07 3.828e-08 14.93 20.34 0.204 1.66e-07 3.323e-08 17.67 20.68 0.2352 1.038e-07 2.337e-08 14.82 20.98 0.141 1.151e-07 2.453e-08 16.5 20.87 0.1668 2.104e-07 3.828e-08 14.93 20.34 0.1215 1.66e-07 3.323e-08 17.67 20.68 0.159 \"}",
                    "{\"dataNumber\":\"2\",\"indicators\":\"2.086e-06 2.002e-07 0.65 1.696 0.3417 1.853e-06 2.32e-07 0.7167 1.657 0.3034 1.059e-06 1.742e-07 0.55 1.92 0.2305 7.666e-07 1.84e-07 0.7833 2.044 0.1962 3.49e-07 7.218e-08 4.267 5.772 0.1407 3.601e-07 8.965e-08 5.183 5.947 0.1339 5.188e-07 9.55e-08 6.783 6.072 0.1443 5.535e-07 1.205e-07 7.167 6.136 0.1467 3.343e-07 5.742e-08 10.35 10.68 0.1676 7.466e-07 9.188e-08 9.75 10.39 0.2056 8.154e-07 1.2e-07 10.48 10.93 0.2717 1.417e-06 1.822e-07 9.417 10.33 0.3324 1.31e-07 2.825e-08 16.77 21.01 0.2195 1.865e-07 3.531e-08 14.25 21.21 0.2104 3.421e-07 4.304e-08 21.33 20.85 0.2594 2.984e-07 4.85e-08 19.65 20.45 0.2355 1.31e-07 2.825e-08 16.77 21.01 0.115 1.865e-07 3.531e-08 14.25 21.21 0.1283 3.421e-07 4.304e-08 21.33 20.85 0.08704 2.984e-07 4.85e-08 19.65 20.45 0.08277 \"}",
                    "{\"dataNumber\":\"1\",\"indicators\":\"1.513e-06 1.7e-07 0.5667 1.756 0.2437 1.077e-06 1.748e-07 0.65 1.733 0.2387 9.374e-07 1.465e-07 0.5333 1.86 0.2023 5.171e-07 1.31e-07 1.483 1.985 0.2334 4.048e-07 9.827e-08 5.633 6.055 0.1609 5.776e-07 1.228e-07 5.817 5.923 0.1915 3.057e-07 7.268e-08 4.05 6.111 0.1146 3.336e-07 7.224e-08 4.033 5.803 0.147 5.972e-07 8.461e-08 9.967 10.45 0.2076 2.802e-07 6.185e-08 10.33 10.69 0.1445 9.247e-07 1.456e-07 10.25 10.53 0.344 3.807e-07 7.477e-08 11.08 10.83 0.228 1.55e-07 3.29e-08 19.45 20.95 0.2148 1.397e-07 3.421e-08 15.45 21.47 0.2127 2.008e-07 3.635e-08 18.78 20.53 0.2285 1.552e-07 2.801e-08 19.4 20.9 0.2273 1.55e-07 3.29e-08 19.45 20.95 0.1406 1.397e-07 3.421e-08 15.45 21.47 0.1945 2.008e-07 3.635e-08 18.78 20.53 0.09091 1.552e-07 2.801e-08 19.4 20.9 0.1424 \"}",
                    "{\"dataNumber\":\"2\",\"indicators\":\"1.339e-06 2.384e-07 0.8833 1.831 0.2121 6.913e-07 1.099e-07 0.6167 1.831 0.2104 1.198e-06 1.814e-07 0.7167 1.871 0.2019 1.043e-06 1.775e-07 0.6333 1.886 0.1614 4.837e-07 1.347e-07 5.0 5.983 0.1369 3.161e-07 6.916e-08 6.567 6.043 0.1512 4.197e-07 9.367e-08 6.383 6.036 0.119 4.808e-07 1.21e-07 7.933 6.071 0.1257 8.271e-07 1.37e-07 8.8 10.5 0.2086 3.783e-07 7.454e-08 10.08 10.77 0.2442 7.577e-07 1.556e-07 8.483 10.73 0.2961 1.362e-06 2.387e-07 10.5 10.98 0.3715 3.94e-07 6.75e-08 15.33 20.74 0.2735 1.823e-07 2.934e-08 14.6 20.41 0.2558 4.879e-07 5.298e-08 15.2 19.58 0.2684 3.616e-07 5.731e-08 14.05 19.57 0.2374 3.94e-07 6.75e-08 15.33 20.74 0.1502 1.823e-07 2.934e-08 14.6 20.41 0.1055 4.879e-07 5.298e-08 15.2 19.58 0.09722 3.616e-07 5.731e-08 14.05 19.57 0.07687 \"}"
            };
            HashMap<String, Integer> map = new HashMap<>();
            map.put("18", 0);
            map.put("03", 1);
            map.put("27", 2);
            map.put("28", 3);
            Answer correctAnswer = getUserAnswerFromJson(answers[map.get(generatingResult.getCode())]);
            Answer userAnswer = getUserAnswerFromJson(instructions.replaceAll("&#0045;","-"));


            if (correctAnswer.dataNumber == userAnswer.dataNumber) {
                resultPoints += 0.2;
            } else {
                comment += "Wrong data choice;\n";
            }
            double correct_count = 0;
            double total_count = userAnswer.indicators.size() - 1;
            for (int i = 1; i < userAnswer.indicators.size(); i++) {
                if (userAnswer.indicators.get(i) * 1.05 > userAnswer.indicators.get(i) &&
                        correctAnswer.indicators.get(i) * 0.95 < userAnswer.indicators.get(i)) {
                    correct_count++;
                }
            }
            if (correct_count / total_count >= 0.8) {
                resultPoints += 0.6;
                if (correct_count == total_count) {
                    resultPoints += 0.2;
                } else {
                    comment += "Some indicators are wrong;\n";
                }
            } else {
                comment += "Some indicators are wrong;\n";
            }

            if (resultPoints == 1.0) {
                comment = "Solution is correct;";
            }
            if (resultPoints < 0.6) {
                comment = "Solution is not correct;\n" + comment;
            }
        } catch (Exception e){
            e.printStackTrace();
            resultPoints = 0;
            comment = "Solution is not correct;\n";
        }
        points = BigDecimal.valueOf(resultPoints);

        return new CheckingSingleConditionResult(points, comment);
    }

    private Answer getUserAnswerFromJson(String json) {
        JSONObject obj = new JSONObject(json);
        String histInt = obj.getString("dataNumber");
        String[] histVal = obj.getString("indicators").split(" ");
        int dataNumber;
        List<Double> histValues = new ArrayList<>();
        dataNumber = Integer.parseInt(histInt);

        for (String str : histVal) {
            histValues.add(Double.parseDouble(str));
        }
        return new Answer(histValues,dataNumber);
    }

    @Override
    public void setPreCheckResult(PreCheckResult<String> preCheckResult) {
    }
}
