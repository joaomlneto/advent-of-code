package io.github.joaomlneto.advent_of_code.day4;

import java.io.File;
import java.io.IOException;
import java.security.MessageDigest;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day4 extends Solver {

	int fiveZeroesNumber;
	int sixZeroesNumber;

	public Day4(String input) {
		super(input);
		try {
			MessageDigest md = MessageDigest.getInstance("MD5");
			boolean foundFiveZeroesNumber = false;
			boolean foundSixZeroesNumber = false;
			for (int i = 0;; i++) {
				byte[] bytesOfMessage = (input + i).getBytes("UTF-8");
				String digest = Hex.encodeHexString(md.digest(bytesOfMessage));
				if (!foundFiveZeroesNumber && digest.substring(0, 5).equals("00000")) {
					fiveZeroesNumber = i;
					foundFiveZeroesNumber = true;
				}
				if (!foundSixZeroesNumber && digest.substring(0, 6).equals("000000")) {
					sixZeroesNumber = i;
					foundSixZeroesNumber = true;
				}
				if (foundFiveZeroesNumber && foundSixZeroesNumber) {
					break;
				}
			}
		} catch (Exception e) {
			// Gotta catch em all!
			System.out.println("something happened :(");
		}

	}

	@Override
	public String getFirstAnswerDescription() {
		return "Five zeros";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "Six zeros";
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(fiveZeroesNumber);
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(sixZeroesNumber);
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day4.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day4(input));
	}
}
