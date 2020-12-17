package io.github.joaomlneto.advent_of_code.day14;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day14 extends Solver {

	public final static int RACE_DURATION = 2503;
	private List<Reindeer> reindeers = new ArrayList<Reindeer>();

	public Day14(String input) {
		super(input);
		init();
	}

	private void init() {
		// process input
		String[] lines = input.split("\\r?\\n");
		for (String line : lines) {
			String[] words = line.split(" ");
			String name = words[0];
			int flySpeed = Integer.parseInt(words[3]);
			int flyDuration = Integer.parseInt(words[6]);
			int restDuration = Integer.parseInt(words[13]);
			Reindeer r = new Reindeer(name, flySpeed, flyDuration, restDuration);
			reindeers.add(r);
		}
	}

	@Override
	public String getFirstAnswerDescription() {
		return "Distance Winner";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "Points Winner";
	}

	private int getMaxDistance(int timeElapsed) {
		int maxDistance = 0;
		for (Reindeer r : reindeers) {
			maxDistance = Math.max(maxDistance, r.distanceTraveled(timeElapsed));
		}
		return maxDistance;
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(getMaxDistance(RACE_DURATION));
	}

	@Override
	public String getSecondAnswer() {
		int maxPoints = 0;
		// award race points
		for (int t = 1; t < RACE_DURATION; t++) {
			int maxDistance = getMaxDistance(t);
			for (Reindeer r : reindeers) {
				if (r.distanceTraveled(t) >= maxDistance) {
					r.awardPoint();
				}
			}
		}
		// check who has most points
		for (Reindeer r : reindeers) {
			maxPoints = Math.max(maxPoints, r.getPoints());
		}
		return Integer.toString(maxPoints);
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day14.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day14(input));
	}
}
