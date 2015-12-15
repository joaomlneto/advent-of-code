package io.github.joaomlneto.advent_of_code.day7;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import io.github.joaomlneto.advent_of_code.Solver;

public class Day7 extends Solver {

	LogicBoard board1 = new LogicBoard();
	LogicBoard board2 = new LogicBoard();

	public Day7(String input) {
		super(input);
		String[] lines = input.split("\\r?\\n");
		for (String command : lines) {
			String[] words = command.split(" ");
			if (words[0].equals("NOT")) {
				String id = words[3];
				String in = words[1];
				board1.putGate(id, new NotGate(board1, id, in));
				board2.putGate(id, new NotGate(board2, id, in));
			} else if (words[1].equals("AND")) {
				String id = words[4];
				String in1 = words[0];
				String in2 = words[2];
				board1.putGate(id, new AndGate(board1, id, in1, in2));
				board2.putGate(id, new AndGate(board2, id, in1, in2));
			} else if (words[1].equals("OR")) {
				String id = words[4];
				String in1 = words[0];
				String in2 = words[2];
				board1.putGate(id, new OrGate(board1, id, in1, in2));
				board2.putGate(id, new OrGate(board2, id, in1, in2));
			} else if (words[1].equals("LSHIFT")) {
				String id = words[4];
				String in = words[0];
				int shift = Integer.parseInt(words[2]);
				board1.putGate(id, new LeftShiftGate(board1, id, in, shift));
				board2.putGate(id, new LeftShiftGate(board2, id, in, shift));
			} else if (words[1].equals("RSHIFT")) {
				String id = words[4];
				String in = words[0];
				int shift = Integer.parseInt(words[2]);
				board1.putGate(id, new RightShiftGate(board1, id, in, shift));
				board2.putGate(id, new RightShiftGate(board2, id, in, shift));
			} else if (words[1].equals("->")) {
				String id = words[2];
				String in = words[0];
				board1.putGate(id, new SimpleGate(board1, id, in));
				board2.putGate(id, new SimpleGate(board2, id, in));
			}
		}
		// override wire 'b' to use value of 'a' as input
		board2.putGate("b", new SimpleGate(board2, "b", Integer.toString(board1.getGate("a").getValue())));
	}

	@Override
	public String getFirstAnswerDescription() {
		return "board 1";
	}

	@Override
	public String getSecondAnswerDescription() {
		return "board 2";
	}

	@Override
	public String getFirstAnswer() {
		return Integer.toString(board1.getGate("a").getValue());
	}

	@Override
	public String getSecondAnswer() {
		return Integer.toString(board2.getGate("a").getValue());
	}

	public static void main(String[] args) throws IOException {
		File f = new File("src/main/resources/day7.txt");
		String input = FileUtils.readFileToString(f);
		System.out.println(new Day7(input));
	}
}
