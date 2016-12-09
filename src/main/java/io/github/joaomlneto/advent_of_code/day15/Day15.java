package io.github.joaomlneto.advent_of_code.day15;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day15 extends Solver {
	
	public static final int MAX_TEASPOONS = 100;
	
	Recipe recipe = new Recipe();

	public Day15(String input) {
		super(input);
		init();
	}

	private void init() {
		String[] lines = input.split("\\r?\\n");
		for (String line : lines) {
			String[] words = line.split(" ");
			String name = words[0];
			int capacity = Integer.parseInt(words[2].substring(0, words[2].length()-1));
			int durability = Integer.parseInt(words[4].substring(0, words[4].length()-1));
			int flavor = Integer.parseInt(words[6].substring(0, words[6].length()-1));
			int texture = Integer.parseInt(words[8].substring(0, words[8].length()-1));
			int calories = Integer.parseInt(words[10]);
			recipe.addIngredient(new Ingredient(name, capacity, durability, flavor, texture, calories));
		}
	}

	@Override
	public String getFirstAnswerDescription() {
		return "Highest Score";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "???";
	}

	@Override
	public String getFirstAnswer() {
		int maxScore = 0;
		return Integer.toString(maxScore);
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(0);
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day15.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day15(input));
	}
}
