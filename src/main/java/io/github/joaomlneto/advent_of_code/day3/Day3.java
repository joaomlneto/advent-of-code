package io.github.joaomlneto.advent_of_code.day3;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day3 extends Solver {

	private int numHousesYear1 = 0;
	private int numHousesYear2 = 0;

	public Day3(String input) {
		String inputSantaYear2 = "";
		String inputRobotYear2 = "";
		for(int i=0; i<input.length(); i++) {
			if(i%2==0) inputSantaYear2 += input.charAt(i);
			if(i%2==1) inputRobotYear2 += input.charAt(i);
		}
		Santa santaYear1 = new Santa(input);
		Santa santaYear2 = new Santa(inputSantaYear2);
		Santa robotYear2 = new Santa(inputRobotYear2);
		Set<House> housesYear1 = santaYear1.getHousesVisited();
		Set<House> housesYear2 = new HashSet<House>();
		housesYear2.addAll(santaYear2.getHousesVisited());
		housesYear2.addAll(robotYear2.getHousesVisited());
		numHousesYear1 = housesYear1.size();
		numHousesYear2 = housesYear2.size();
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(numHousesYear1);
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(numHousesYear2);
	}

	@Override
	public String toString() {
		String nl = System.lineSeparator();
		String ans = getName() + nl;
		ans += "Year 1: " + getFirstAnswer() + nl;
		ans += "Year 2: " + getSecondAnswer();
		return ans;
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day3.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day3(input));
	}
}
