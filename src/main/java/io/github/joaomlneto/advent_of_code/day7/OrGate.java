package io.github.joaomlneto.advent_of_code.day7;

public class OrGate extends Gate {
	
	private GateInput input1;
	private GateInput input2;

	public OrGate(LogicBoard board, String id, String inputRef1, String inputRef2) {
		super(board, id);
		input1 = createGateInput(inputRef1);
		input2 = createGateInput(inputRef2);
	}

	@Override
	public int evaluateValue() {
		return input1.getValue() | input2.getValue();
	}

}
