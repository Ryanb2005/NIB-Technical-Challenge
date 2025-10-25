export interface Recipe {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory: string;
    strArea: string;
    strInstructions?: string;
    strYoutube?: string;
    strSource?: string;
    [key: string]: string | undefined;
  }