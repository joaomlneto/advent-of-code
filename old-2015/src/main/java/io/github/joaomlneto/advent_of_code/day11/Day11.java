package io.github.joaomlneto.advent_of_code.day11;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day11 extends Solver {

	public Day11(String input) {
		super(input);
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
	
	public String nextPassword() {
		return nextPassword(this.input);
	}

	public String nextPassword(String password) {
		do {
			password = incrementPassword(password);
		} while(!isValidPassword(password));
		return password;
	}

	@Override
	public String getFirstAnswerDescription() {
		return "Next Password n+1";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "Next Next Password";
	}

	@Override
	public String getFirstAnswer() {
		return nextPassword();
	}

	@Override
	public String getSecondAnswer() {
		return nextPassword(nextPassword());
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day11.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day11(input));
	}
}
