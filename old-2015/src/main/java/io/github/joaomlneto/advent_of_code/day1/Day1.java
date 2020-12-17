package io.github.joaomlneto.advent_of_code.day1;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day1 extends Solver {
	private int currentFloor = 0;
	private int basementIndex = 0;
	private boolean enteredBasement = false;

	public Day1(String input) {
		super(input);
		for (int i = 0; i < input.length(); i++) {
			char c = input.charAt(i);
			switch (c) {
			case '(':
				currentFloor++;
				break;
			case ')':
				currentFloor--;
				break;
			}
			if (!enteredBasement && currentFloor < 0) {
				enteredBasement = true;
				basementIndex = i + 1;
			}
		}
	}

	@Override
	public String getFirstAnswerDescription() {
		return "Current floor";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "Basement index";
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(currentFloor);
	}

	@Override
	public String getSecondAnswer() {
		return (enteredBasement ? Integer.toString(basementIndex) : "Did not enter basement");
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day1.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day1(input));
	}
}
