package io.github.joaomlneto.advent_of_code.day8;

import org.apache.commons.lang3.StringEscapeUtils;

public class SantaString {
	
	private String original;
	
	public SantaString(String original) {
		this.original = original;
	}
	
	public String getOriginal() {
		return this.original;
	}
	
	public String getDecoded() {
		String decoded = original;
		decoded.substring(1, decoded.length() - 1);
		decoded = decoded.replaceAll("\\\\x([0-9a-fA-F]{1,2})", "@");
		decoded = StringEscapeUtils.unescapeJava(decoded);
		return decoded;
	}
	
	public String getEncoded() {
		String encoded = original;
		encoded = StringEscapeUtils.escapeJava(encoded);
		return '"' + encoded + '"';
	}
	
	public String toString() {
		String nl = System.lineSeparator();
		String ans = "";
		ans += "ORIGINAL: " + original     + "[" + original.length()     + "]" + nl;
		//ans += "DECODED:  " + getDecoded() + "[" + getDecoded().length() + "]" + nl;
		ans += "ENCODED:  " + getDecoded() + "[" + getEncoded().length() + "]" + nl;
		return ans;
	}

}
