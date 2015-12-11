package io.github.joaomlneto.advent_of_code.day11;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day11 extends Solver {

	String input;

	public Day11(String input) {
		this.input = input;
	}

	public boolean isValidPassword(String password) {
		char[] chars = password.toCharArray();
		// has increasing straight of 3 letters
		boolean hasIncreasingStraight = false;
		for (int i = 0; i < chars.length - 2; i++) {
			if ((chars[i] + 1 == chars[i + 1]) && (chars[i + 1] + 1 == chars[i + 2])) {
				hasIncreasingStraight = true;
				break;
			}
		}
		// no restricted letters
		for (int i = 0; i < chars.length; i++) {
			switch (chars[i]) {
			case 'i':
			case 'l':
			case 'o':
				return false;
			}
		}
		// has pairs of letters
		int numPairs = 0;
		for (int i = 0; i < chars.length - 1; i++) {
			if (chars[i] == chars[i + 1]) {
				numPairs++;
				i++;
				if (numPairs == 2)
					break;
			}
		}
		return hasIncreasingStraight && (numPairs >= 2);
	}
	
	public String incrementPassword(String password) {
		char[] chars = password.toCharArray();
		chars[chars.length-1]++;
		for(int i=chars.length-1; i>=0; i--) {
			if(chars[i]>'z') {
				chars[i] = 'a';
				chars[i-1]++; // FIXME 8-char overflow!
			}
		}
		return new String(chars);
	}

	public String nextPassword(String input) {
		do {
			input = incrementPassword(input);
		} while(!isValidPassword(input));
		return input;
	}

	@Override
	public String getFirstAnswer() {
		this.input = nextPassword(this.input);
		return this.input;
	}

	@Override
	public String getSecondAnswer() {
		this.input = nextPassword(this.input);
		return this.input;
	}

	@Override
	public String toString() {
		String nl = System.lineSeparator();
		String ans = getName() + nl;
		ans += "next password: " + getFirstAnswer() + nl;
		ans += "next next password: " + getSecondAnswer();
		return ans;
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day11.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day11(input));
	}
}
