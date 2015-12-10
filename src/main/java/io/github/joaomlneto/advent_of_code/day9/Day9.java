package io.github.joaomlneto.advent_of_code.day9;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day9 extends Solver {

	Map<String, Map<String, Integer>> distances = new TreeMap<String, Map<String, Integer>>();

	public Day9(String input) {
		String[] lines = input.split("\\r?\\n");
		for (String line : lines) {
			String[] words = line.split(" ");
			String from = words[0];
			String to = words[2];
			int distance = Integer.parseInt(words[4]);
			// add entries if missing
			if (!distances.containsKey(from)) {
				distances.put(from, new TreeMap<String, Integer>());
			}
			if (!distances.containsKey(to)) {
				distances.put(to, new TreeMap<String, Integer>());
			}
			// insert distance maps
			distances.get(from).put(to, distance);
			distances.get(to).put(from, distance);
		}
	}

	private int shortestDistance() {
		Set<String> cities = distances.keySet();
		int shortestDistance = Integer.MAX_VALUE;
		Iterator<String> it = cities.iterator();
		while (it.hasNext()) {
			String next = it.next();
			Set<String> remainingCities = new HashSet<String>(cities);
			remainingCities.remove(next);
			int distance = shortestDistance(next, remainingCities);
			if (distance < shortestDistance) {
				shortestDistance = distance;
			}
		}
		return shortestDistance;
	}

	private int shortestDistance(String current, Set<String> cities) {
		if (cities.isEmpty()) {
			return 0;
		}
		int shortestDistance = Integer.MAX_VALUE;
		Iterator<String> it = cities.iterator();
		while (it.hasNext()) {
			String next = it.next();
			Set<String> remainingCities = new HashSet<String>(cities);
			remainingCities.remove(next);
			int distance = shortestDistance(next, remainingCities) + distances.get(current).get(next);
			if (distance < shortestDistance) {
				shortestDistance = distance;
			}
		}
		return shortestDistance;
	}

	private int longestDistance() {
		Set<String> cities = distances.keySet();
		int longestDistance = Integer.MIN_VALUE;
		Iterator<String> it = cities.iterator();
		while (it.hasNext()) {
			String next = it.next();
			Set<String> remainingCities = new HashSet<String>(cities);
			remainingCities.remove(next);
			int distance = longestDistance(next, remainingCities);
			if (distance > longestDistance) {
				longestDistance = distance;
			}
		}
		return longestDistance;
	}

	private int longestDistance(String current, Set<String> cities) {
		if (cities.isEmpty()) {
			return 0;
		}
		int longestDistance = Integer.MIN_VALUE;
		Iterator<String> it = cities.iterator();
		while (it.hasNext()) {
			String next = it.next();
			Set<String> remainingCities = new HashSet<String>(cities);
			remainingCities.remove(next);
			int distance = longestDistance(next, remainingCities) + distances.get(current).get(next);
			if (distance > longestDistance) {
				longestDistance = distance;
			}
		}
		return longestDistance;
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(shortestDistance());
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(longestDistance());
	}

	@Override
	public String toString() {
		String nl = System.lineSeparator();
		String ans = getName() + nl;
		ans += "Shortest distance: " + getFirstAnswer() + nl;
		ans += "Longest distance: " + getSecondAnswer();
		return ans;
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day9.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day9(input));
	}
}
