package io.github.joaomlneto.advent_of_code.day14;

public class Reindeer {

	private String name;
	private int flySpeed;
	private int flyDuration;
	private int restDuration;
	private int points = 0;

	public Reindeer(String name, int flySpeed, int flyDuration, int restDuration) {
		this.name = name;
		this.flySpeed = flySpeed;
		this.flyDuration = flyDuration;
		this.restDuration = restDuration;
	}

	public String getName() {
		return name;
	}

	public void awardPoint() {
		points++;
	}

	public int getPoints() {
		return points;
	}

	public int distanceTraveled(int timeElapsed) {
		int cycleTime = flyDuration + restDuration;
		int numCycles = timeElapsed / cycleTime;
		int cycleDistance = flySpeed * flyDuration * numCycles;
		int remainderDistance = flySpeed * Math.min(flyDuration, timeElapsed % cycleTime);
		return cycleDistance + remainderDistance;
	}

}
