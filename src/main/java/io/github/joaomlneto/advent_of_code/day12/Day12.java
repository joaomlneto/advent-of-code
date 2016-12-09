package io.github.joaomlneto.advent_of_code.day12;

import java.io.File;
import java.io.IOException;
import java.util.Scanner;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day12 extends Solver {

	public Day12(String input) {
		super(input);
	}

	@Override
	public String getFirstAnswerDescription() {
		return "Sum of Integers";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "?????";
	}

	@Override
	public String getFirstAnswer() {
		String integers = input.replaceAll("[^0-9\\-]", " ");
		Scanner s = new Scanner(integers);
		int sum = 0;
		while (s.hasNextInt()) {
			sum += s.nextInt();
		}
		s.close();
		return Integer.toString(sum);
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(0);
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day12.txt");
		String input = FileUtils.readFileToString(f);
		input = "{a: [1,-2,3]}";
		System.out.println(new Day12(input));
	}
}
