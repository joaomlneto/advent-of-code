package io.github.joaomlneto.advent_of_code.day8;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day8 extends Solver {
	
	private List<SantaString> strings = new ArrayList<SantaString>();

	public Day8(String input) {
		String[] lines = input.split("\\r?\\n");
		for (String line : lines) {
			strings.add(new SantaString(line));
		}
	}

	@Override
	public String getFirstAnswer() {
		int bytesOriginal = 0;
		int bytesDecoded = 0;
		for(SantaString s : strings) {
			bytesOriginal += s.getOriginal().length();
			bytesDecoded += s.getDecoded().length();
		}
		return Integer.toString(bytesOriginal - bytesDecoded);
	}

	@Override
	public String getSecondAnswer() {
		int bytesOriginal = 0;
		int bytesEncoded = 0;
		for(SantaString s : strings) {
			bytesOriginal += s.getOriginal().length();
			bytesEncoded += s.getEncoded().length();
		}
		return Integer.toString(bytesEncoded - bytesOriginal);
	}

	@Override
	public String toString() {
		String nl = System.lineSeparator();
		String ans = getName() + nl;
		ans += "diff encoded: " + getFirstAnswer() + nl;
		ans += "diff decoded: " + getSecondAnswer();
		return ans;
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day8.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day8(input));
	}
}
