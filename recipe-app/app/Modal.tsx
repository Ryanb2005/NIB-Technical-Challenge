"use client";

import { Recipe } from "@/src/types/Recipe";
import Button from "@/src/components/Button";
import Link from "@/src/components/Link";

interface ModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export default function Modal({ recipe, onClose }: ModalProps) {
  console.log("🚀 ~ Modal ~ recipe:", recipe);
  console.log("🚀 ~ Modal ~ recipe:", recipe?.strInstructions);

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
                <p className="instructions-text">{recipe.strInstructions}</p>
              </div>
            )}
            <div className="buttons">
              {recipe.strYoutube && (
                <div className="youtube-link">
                  <Link href={recipe.strYoutube} className="btn btn-primary">
                    Watch on YouTube
                  </Link>
                </div>
              )}

              {recipe.strSource && (
                <div className="source-link">
                  <Link href={recipe.strSource} className="btn btn-primary">
                    View Source
                  </Link>
                </div>
              )}

              <Button onClick={() => {}} className="btn btn-success">
                Add to My Shopping List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
