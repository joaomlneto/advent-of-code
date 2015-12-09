package io.github.joaomlneto.advent_of_code.day7;

import java.util.Map;
import java.util.TreeMap;

public class LogicBoard {

	private Map<String, Gate> gates = new TreeMap<String, Gate>();

	public LogicBoard() {
	}
	
	public LogicBoard(LogicBoard initial) {
		gates = new TreeMap<String, Gate>(initial.getAllGates());
	}

	public void putGate(String id, Gate gate) {
		gates.put(id, gate);
	}

	public Gate getGate(String id) {
		return gates.get(id);
	}
	
	public Map<String, Gate> getAllGates() {
		return gates;
	}

	public boolean hasGate(String id) {
		return gates.containsKey(id);
	}

	public String toString() {
		String nl = System.lineSeparator();
		String ans = "";
		for (String id : gates.keySet()) {
			ans += id + ": " + gates.get(id) + nl;
		}
		return ans;
	}

}
