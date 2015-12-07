package io.github.joaomlneto.advent_of_code.day6;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.PuzzleSolver;

public class Day6 extends PuzzleSolver {

	LightGrid gridV1 = new LightGridV1();
	LightGrid gridV2 = new LightGridV2();

	public Day6(String input) {
		String[] lines = input.split("\\r?\\n");
		for (String command : lines) {
			gridV1.parseCommand(command);
			gridV2.parseCommand(command);
		}
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(gridV1.getLuminosity());
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(gridV2.getLuminosity());
	}

	@Override
	public String toString() {
		String nl = System.lineSeparator();
		String ans = getName() + nl;
		ans += "Luminosity V1: " + getFirstAnswer() + nl;
		ans += "Luminosity V2: " + getSecondAnswer();
		return ans;
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day6.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day6(input));
	}
}
