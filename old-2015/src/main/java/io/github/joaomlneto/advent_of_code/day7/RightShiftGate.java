package io.github.joaomlneto.advent_of_code.day7;

public class RightShiftGate extends Gate {
	
	private GateInput input;
	private int shiftAmount;

	public RightShiftGate(LogicBoard board, String id, String inputRef, int shiftAmount) {
		super(board, id);
		this.input = createGateInput(inputRef);
		this.shiftAmount = shiftAmount;
	}

	@Override
	public int evaluateValue() {
		return input.getValue() >> shiftAmount;
	}

}
