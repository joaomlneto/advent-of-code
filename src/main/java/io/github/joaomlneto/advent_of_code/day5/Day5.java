package io.github.joaomlneto.advent_of_code.day5;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.PuzzleSolver;

public class Day5 extends PuzzleSolver {

	public static final int MIN_VOWELS = 3;
	public static final String[] BAD_SUBSTRINGS = { "ab", "cd", "pq", "xy" };

	private int numNiceStringsV1 = 0;
	private int numNiceStringsV2 = 0;

	public Day5(String input) {
		String[] lines = input.split("\\r?\\n");
		for (String line : lines) {
			if (isNiceStringV1(line)) {
				numNiceStringsV1++;
			}
			if (isNiceStringV2(line)) {
				numNiceStringsV2++;
			}
		}
	}

	public boolean isVowel(char c) {
		return "aeiou".indexOf(c) != -1;
	}

	public boolean isNiceStringV1(String str) {
		boolean hasEnoughVowels = false;
		boolean hasConsecutiveLetter = false;
		boolean hasBadSubstrings = false;
		// count vowels
		int numVowels = 0;
		for (int i = 0; i < str.length(); i++) {
			if (isVowel(str.charAt(i)) && (++numVowels >= MIN_VOWELS)) {
				hasEnoughVowels = true;
				break;
			}
		}
		// check for consecutive letters
		for (int i = 0; i < str.length() - 1; i++) {
			if (str.charAt(i) == str.charAt(i + 1)) {
				hasConsecutiveLetter = true;
				break;
			}
		}
		// check for bad substrings
		for (int i = 0; i < BAD_SUBSTRINGS.length; i++) {
			if (str.indexOf(BAD_SUBSTRINGS[i]) != -1) {
				hasBadSubstrings = true;
				break;
			}
		}
		return hasEnoughVowels && hasConsecutiveLetter && !hasBadSubstrings;
	}

	public boolean isNiceStringV2(String str) {
		boolean hasRepeatingLetter = false;
		boolean hasRepeatingPairOfLetters = false;
		// check for repeating letters
		for (int i = 0; i < str.length() - 2; i++) {
			if (str.charAt(i) == str.charAt(i + 2)) {
				hasRepeatingLetter = true;
				break;
			}
		}
		// check for repeating pair of letters
		for (int i = 0; i < str.length() - 2; i++) {
			if(str.substring(i+2).indexOf(str.substring(i, i+2)) != -1) {
				hasRepeatingPairOfLetters = true;
				break;
			}
		}
		return hasRepeatingLetter && hasRepeatingPairOfLetters;
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(numNiceStringsV1);
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(numNiceStringsV2);
	}

	@Override
	public String toString() {
		String nl = System.lineSeparator();
		String ans = getName() + nl;
		ans += "V1: " + getFirstAnswer() + nl;
		ans += "V2: " + getSecondAnswer();
		return ans;
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day5.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day5(input));
	}
}
