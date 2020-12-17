package io.github.joaomlneto.advent_of_code.day3;

import java.awt.Point;

public class House extends Point {
	private int numPresents = 0;

	public House(int x, int y) {
		super(x, y);
	}

	public void deliverPresent() {
		numPresents++;
	}

	public int getNumPresents() {
		return numPresents;
	}

}
