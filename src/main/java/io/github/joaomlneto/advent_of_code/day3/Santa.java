package io.github.joaomlneto.advent_of_code.day3;

import java.util.HashSet;
import java.util.Set;

public class Santa {

	private House current = new House(0, 0);
	private Set<House> houses = new HashSet<House>();

	public Santa(String directions) {
		// deliver present to initial house
		houses.add(current);
		// solve year 1
		for (int i = 0; i < directions.length(); i++) {
			switch (directions.charAt(i)) {
			case '^':
				current = new House(current.x, current.y + 1);
				houses.add(current);
				break;
			case 'v':
				current = new House(current.x, current.y - 1);
				houses.add(current);
				break;
			case '<':
				current = new House(current.x - 1, current.y);
				houses.add(current);
				break;
			case '>':
				current = new House(current.x + 1, current.y);
				houses.add(current);
				break;
			}
		}
	}

	public Set<House> getHousesVisited() {
		return houses;
	}

}
