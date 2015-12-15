package io.github.joaomlneto.advent_of_code.day2;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day2 extends Solver {

	private int paperArea = 0;
	private int ribbonLength = 0;

	public Day2(String input) {
		super(input);
		String[] lines = input.split("\\r?\\n");
		for (int i = 0; i < lines.length; i++) {
			String line = lines[i];
			String[] dimensions = line.split("x");
			int l = Integer.parseInt(dimensions[0]);
			int w = Integer.parseInt(dimensions[1]);
			int h = Integer.parseInt(dimensions[2]);
			paperArea += 2 * (l * w + w * h + h * l) + Math.min(Math.min(l * w, w * h), h * l);
			ribbonLength += l * w * h + 2 * (l + w + h - Math.max(Math.max(l, w), h));
		}
	}

	@Override
	public String getFirstAnswerDescription() {
		return "Paper area";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "Ribbon Length";
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(paperArea);
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(ribbonLength);
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day2.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day2(input));
	}
}
