package io.github.joaomlneto.advent_of_code.day15;

public class Ingredient {

	private String name;
	private int capacity;
	private int durability;
	private int flavor;
	private int texture;
	private int calories;
	private int quantity = 0;

	public Ingredient(String name, int capacity, int durability, int flavor, int texture, int calories) {
		this.name = name;
		this.capacity = capacity;
		this.durability = durability;
		this.flavor = flavor;
		this.texture = texture;
		this.calories = calories;
	}
	
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
	public String getName() {
		return name;
	}
	
	public int getQuantity() {
		return quantity;
	}
	
	public int getCapacity(int qty) {
		return capacity * qty;
	}
	
	public int getDurability(int qty) {
		return durability * qty;
	}
	
	public int getFlavor(int qty) {
		return flavor * qty;
	}
	
	public int getTexture(int qty) {
		return texture * qty;
	}
	
	public int getCalories(int qty) {
		return calories * qty;
	}
	
	public String toString() {
		return getName() +
		       " cap="+capacity+
		       " dur="+durability+
		       " flv="+flavor+
		       " tex="+texture+
		       " cal="+calories;
	}

}
