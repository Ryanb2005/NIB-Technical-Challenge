"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "../src/components/Modal";

import { Recipe } from "@/src/types/Recipe";
import Button from "@/src/components/Button";

const apiURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const randomAPIURL = "https://www.themealdb.com/api/json/v1/1/random.php";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<
    { ingredient: string; measurement: string; id: string }[]
  >([]);

  // Fetch data when user presses Enter
  const handleSearch = async () => {
    if (searchTerm.length === 0) {
      setResults([]);
      setError(null);
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`${apiURL}${searchTerm}`);

      const data = await res.json();

      // Handle case where API returns null or no meals
      if (!data.meals) {
        setResults([]);
        setError(
          `No recipes found for "${searchTerm}". Try a different search term.`
        );
        return;
      }

      setResults(data.meals);
    } catch (error) {
      console.error("Error:", error);
      setResults([]);
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShoppingList([]);
      handleSearch();
    }
  };

  // Handle recipe card click
  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const showShoppingList = () => {
    const list = localStorage.getItem("shoppingList");
    setShoppingList(
      JSON.parse(list || "[]").sort(
        (a: { ingredient: string }, b: { ingredient: string }) =>
          a.ingredient.localeCompare(b.ingredient)
      )
    );
    if (results.length > 0) {
      setResults([]); 
    }
  };

  const randomise = async () => {
    setBusy(true);
    setError(null);

    try {
      const res = await fetch(`${randomAPIURL}`);

      const data = await res.json();

      // Handle case where API returns null or no meals
      if (!data.meals) {
        setError(`No random recip-e found. Please try again.`);
        return;
      }

      // Open the random recipe directly in the modal
      setSelectedRecipe(data.meals[0]);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to fetch random recipe. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1>Recipe Finder</h1>
      <div className="search-container">
        <div className="search-row">
          <Button onClick={showShoppingList} className="button button-primary">
            View Shopping List
          </Button>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Search recipes..."
            className="search-input"
          />

          <Button onClick={randomise} className="button button-secondary">
            Randomise
          </Button>
        </div>
        {busy && <p className="loading-text">Searching...</p>}
        {error && <p className="error-text">{error}</p>}
      </div>

      {results.length > 0 && (
        <div className="recipe-grid">
          {results.map((result: Recipe) => (
            <div
              key={result?.idMeal}
              className="recipe-card"
              onClick={() => handleRecipeClick(result)}
            >
              <Image
                src={result.strMealThumb}
                alt={result.strMeal}
                width={400}
                height={500}
                className="recipe-image"
              />
              <div className="recipe-content">
                <h2 className="recipe-title">{result.strMeal}</h2>
                <p className="recipe-data">
                  <span className="recipe-data-label">Category: </span>
                  {result.strCategory}
                </p>
                <p className="recipe-data">
                  <span className="recipe-data-label">Area: </span>
                  {result.strArea}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {shoppingList.length > 0 && (
        <div className="shopping-list-container">
          <h2>Shopping List</h2>
          <ul className="shopping-list">
            {shoppingList.map((item) => (
              <li key={item.id}>
                {item.ingredient} - {item.measurement}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Modal recipe={selectedRecipe} onClose={handleCloseModal} />
    </div>
  );
}
