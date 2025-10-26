"use client";

import Image from "next/image";
import { Recipe } from "@/src/types/Recipe";
import Button from "@/src/components/Button";
import Link from "@/src/components/Link";

interface ModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

const updateShoppingList = (recipe: Recipe) => {
  const ingredients = Object.entries(recipe).filter(
    ([key, value]) => key.startsWith("strIngredient") && value
  );
  const measurements = Object.entries(recipe).filter(
    ([key, value]) => key.startsWith("strMeasure") && value
  );
  const newItems = ingredients.map((value, index) => {
    return {
      id: `${recipe.idMeal}-${index}-${value[1]}-${measurements[index][1]}`,
      ingredient: value[1],
      measurement: measurements[index][1],
    };
  });

  // Get existing shopping list from localStorage
  const existingList = JSON.parse(localStorage.getItem("shoppingList") || "[]");

  // Add new items to existing list
  const updatedList = [...existingList, ...newItems];

  // Save updated list back to localStorage
  localStorage.setItem("shoppingList", JSON.stringify(updatedList));
};

export default function Modal({ recipe, onClose }: ModalProps) {
  if (!recipe) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{recipe.strMeal}</h2>
          <Button onClick={onClose} className="modal-close">
            ×
          </Button>
        </div>

        <div className="modal-body">
          <div className="modal-image-container">
            <Image
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              width={300}
              height={200}
              className="modal-image"
            />
          </div>
          <div className="modal-info">
            <p>
              <strong>Category:</strong> {recipe.strCategory}
            </p>
            <p>
              <strong>Area:</strong> {recipe.strArea}
            </p>

            {recipe.strInstructions && (
              <div className="instructions">
                <h3>Instructions:</h3>
                <p>{recipe.strInstructions}</p>
              </div>
            )}
            <div className="buttons">
              {recipe.strYoutube && (
                <div className="youtube-link">
                  <Link
                    href={recipe.strYoutube}
                    className="button button-primary"
                  >
                    Watch on YouTube
                  </Link>
                </div>
              )}

              {recipe.strSource && (
                <div className="source-link">
                  <Link
                    href={recipe.strSource}
                    className="button button-primary"
                  >
                    View Source
                  </Link>
                </div>
              )}

              <Button
                onClick={() => updateShoppingList(recipe)}
                className="button button-success"
              >
                Add to My Shopping List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
