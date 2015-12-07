package io.github.joaomlneto.advent_of_code.day6;

public class LightGridV1 extends LightGrid {

	@Override
	public void turnOn(int fromX, int fromY, int toX, int toY) {
		for (int i = fromX; i <= toX; i++)
			for (int j = fromY; j <= toY; j++)
				grid[i][j] = 1;
	}

	@Override
	public void turnOff(int fromX, int fromY, int toX, int toY) {
		for (int i = fromX; i <= toX; i++)
			for (int j = fromY; j <= toY; j++)
				grid[i][j] = 0;
	}

	@Override
	public void toggle(int fromX, int fromY, int toX, int toY) {
		for (int i = fromX; i <= toX; i++)
			for (int j = fromY; j <= toY; j++)
				grid[i][j] = 1 - grid[i][j];
	}

}
