package io.github.joaomlneto.advent_of_code.day7;

public class NotGate extends Gate {
	
	private GateInput input;

	public NotGate(LogicBoard board, String id, String inputRef) {
		super(board, id);
		input = createGateInput(inputRef);
	}

	@Override
	public int evaluateValue() {
		return ~input.getValue();
	}

}
