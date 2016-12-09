package io.github.joaomlneto.advent_of_code.day15;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class Recipe {
	public static final int MAX_TEASPOONS = 100;

	private List<Ingredient> ingredients;

	public Recipe() {
		ingredients = new ArrayList<Ingredient>();
	}

	public Recipe(Collection<Ingredient> c) {
		ingredients = new ArrayList<Ingredient>(c);
	}

	public void addIngredient(Ingredient ingredient) {
		ingredients.add(ingredient);
	}
	
	public void optimize() {
		
	}

}
