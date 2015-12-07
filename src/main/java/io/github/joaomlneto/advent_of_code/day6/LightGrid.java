package io.github.joaomlneto.advent_of_code.day6;

public abstract class LightGrid {

	public static final int LENGTH = 1000;

	protected int[][] grid = new int[LENGTH][LENGTH];

	protected void parseCommand(String command) {
		String[] words = command.split(" ");
		if (words[0].equals("turn")) {
			int fromX = Integer.parseInt(words[2].split(",")[0]);
			int fromY = Integer.parseInt(words[2].split(",")[1]);
			int toX = Integer.parseInt(words[4].split(",")[0]);
			int toY = Integer.parseInt(words[4].split(",")[1]);
			if (words[1].equals("on"))
				turnOn(fromX, fromY, toX, toY);
			if (words[1].equals("off"))
				turnOff(fromX, fromY, toX, toY);
		}
		if (words[0].equals("toggle")) {
			int fromX = Integer.parseInt(words[1].split(",")[0]);
			int fromY = Integer.parseInt(words[1].split(",")[1]);
			int toX = Integer.parseInt(words[3].split(",")[0]);
			int toY = Integer.parseInt(words[3].split(",")[1]);
			toggle(fromX, fromY, toX, toY);
		}
	}

	public int getLuminosity() {
		int luminosity = 0;
		for (int i = 0; i < LENGTH; i++)
			for (int j = 0; j < LENGTH; j++)
				luminosity += grid[i][j];
		return luminosity;
	}

	public abstract void turnOn(int fromX, int fromY, int toX, int toY);

	public abstract void turnOff(int fromX, int fromY, int toX, int toY);

	public abstract void toggle(int fromX, int fromY, int toX, int toY);

}
