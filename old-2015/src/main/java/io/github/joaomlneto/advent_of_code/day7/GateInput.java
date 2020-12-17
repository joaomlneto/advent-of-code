package io.github.joaomlneto.advent_of_code.day7;

import org.apache.commons.lang3.StringUtils;

public class GateInput {
	
	private LogicBoard board;
	private String ref;
	
	public GateInput(LogicBoard board, String ref) {
		this.board = board;
		this.ref = ref;
	}
	
	public int getValue() {
		if(StringUtils.isNumeric(this.ref)) {
			return Integer.parseInt(ref);
		}
		else {
			return board.getGate(this.ref).getValue();
		}
	}

}
