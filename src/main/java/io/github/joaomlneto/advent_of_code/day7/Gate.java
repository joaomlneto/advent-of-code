package io.github.joaomlneto.advent_of_code.day7;

public abstract class Gate {
	
	protected LogicBoard board;
	private String id;
	private boolean valueCached = false;
	private boolean isEvaluating = false;
	private int value;
	
	public Gate(LogicBoard board, String id) {
		this.board = board;
		this.id = id;
	}
	
	public String getId() {
		return this.id;
	}
	
	public int getValue() {
		if(isEvaluating) {
			System.out.println("circuit has cycles!");
			System.exit(-1);
		}
		if(!valueCached) {
			isEvaluating = true;
			value = evaluateValue();
			valueCached = true;
			isEvaluating = false;
		}
		return value;
	}
	
	protected abstract int evaluateValue();
	
	public GateInput createGateInput(String ref) {
		return new GateInput(board, ref);
	}
	
	public String toString() {
		return Integer.toString(getValue());
	}

}
