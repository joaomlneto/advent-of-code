package io.github.joaomlneto.advent_of_code;

public abstract class Solver {

	protected String input;

	public Solver(String input) {
		this.input = input;
	}

	public abstract String getFirstAnswerDescription();

	public abstract String getSecondAnswerDescription();

	public abstract String getFirstAnswer();

	public abstract String getSecondAnswer();

	public String toString() {
		String nl = System.lineSeparator();
		String ans = getName() + nl;
		ans += getFirstAnswerDescription() + ": " + getFirstAnswer() + nl;
		ans += getSecondAnswerDescription() + ": " + getSecondAnswer();
		return ans;
	}

	public String getName() {
		return getClass().getSimpleName();
	}
}
