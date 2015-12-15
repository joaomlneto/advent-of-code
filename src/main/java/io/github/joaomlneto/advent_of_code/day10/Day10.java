package io.github.joaomlneto.advent_of_code.day10;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day10 extends Solver {

	public Day10(String input) {
		super(input);
	}

	public String getStep(String input, int numSteps) {
		for (int i = 0; i < numSteps; i++) {
			input = nextStep(input);
		}
		return input;
	}

	public String nextStep(String input) {
		StringBuilder nextStep = new StringBuilder();
		for (int i = 0; i < input.length();) {
			char c = input.charAt(i);
			int n = 1;
			while (++i < input.length() && input.charAt(i) == c)
				n++;
			nextStep.append(n).append(c);
		}
		return nextStep.toString();
	}

	@Override
	public String getFirstAnswerDescription() {
		return "Step 40 Length";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "Step 50 Length";
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(getStep(input, 40).length());
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(getStep(input, 50).length());
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day10.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day10(input));
	}
}
