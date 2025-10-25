"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";

import { Recipe } from "@/src/types/Recipe";

const apiURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

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
    if (searchTerm.length === 0) {
      setResults([]);
      return;
    }
    if (e.key === "Enter") {
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

  return (
    <div>
      <h1>Recipe Finder</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search recipes..."
          className="search-input"
        />
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
                <p className="recipe-meta">
                  <span className="recipe-meta-label">Category: </span>
                  {result.strCategory}
                </p>
                <p className="recipe-meta">
                  <span className="recipe-meta-label">Area: </span>
                  {result.strArea}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal recipe={selectedRecipe} onClose={handleCloseModal} />
    </div>
  );
}
