import React, { useState } from 'react';
import { Header } from './components/Header';
import { IngredientManager } from './components/IngredientManager';
import { RecipeSearch } from './components/RecipeSearch';
import { RecipeCreator } from './components/RecipeCreator';
import { MyRecipes } from './components/MyRecipes';

export type Ingredient = {
  id: string;
  name: string;
  category: string;
  quantity?: string;
  unit?: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  difficulty: 'Einfach' | 'Mittel' | 'Schwer';
  category: string;
  dietary: string[];
  calories?: number;
  isUserCreated?: boolean;
  folderId?: string;
};

export type Folder = {
  id: string;
  name: string;
};

function App() {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'recipes' | 'create' | 'my-recipes'>('ingredients');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Tomaten', category: 'Gemüse', quantity: '500', unit: 'g' },
    { id: '2', name: 'Zwiebeln', category: 'Gemüse', quantity: '2', unit: 'Stück' },
    { id: '3', name: 'Knoblauch', category: 'Gewürze', quantity: '3', unit: 'Zehen' },
    { id: '4', name: 'Olivenöl', category: 'Öle & Essig', quantity: '250', unit: 'ml' },
  ]);
  
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      title: 'Mediterrane Tomatenpfanne',
      description: 'Ein einfaches und schmackhaftes Gericht mit frischen Tomaten und Zwiebeln.',
      ingredients: ['Tomaten', 'Zwiebeln', 'Knoblauch', 'Olivenöl'],
      instructions: [
        'Zwiebeln und Knoblauch in Olivenöl anbraten',
        'Tomaten hinzufügen und 15 Minuten köcheln lassen',
        'Mit Salz und Pfeffer abschmecken'
      ],
      cookingTime: 20,
      difficulty: 'Einfach',
      category: 'Hauptgericht',
      dietary: ['Vegetarisch', 'Vegan'],
      calories: 180
    },
    {
      id: '2',
      title: 'Knoblauch-Öl Pasta',
      description: 'Klassische italienische Pasta mit Knoblauch und Olivenöl.',
      ingredients: ['Knoblauch', 'Olivenöl'],
      instructions: [
        'Pasta nach Packungsanweisung kochen',
        'Knoblauch in dünne Scheiben schneiden',
        'Knoblauch in Olivenöl goldbraun braten',
        'Pasta mit der Knoblauch-Öl-Mischung vermengen'
      ],
      cookingTime: 15,
      difficulty: 'Einfach',
      category: 'Hauptgericht',
      dietary: ['Vegetarisch', 'Vegan'],
      calories: 420
    }
  ]);

  const [myRecipes, setMyRecipes] = useState<Recipe[]>([]);
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: 'Lieblingsrezepte' },
    { id: '2', name: 'Schnelle Gerichte' }
  ]);

  const addIngredient = (ingredient: Omit<Ingredient, 'id'>) => {
    const newIngredient = {
      ...ingredient,
      id: Date.now().toString()
    };
    setIngredients(prev => [...prev, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(prev => prev.filter(ingredient => ingredient.id !== id));
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      isUserCreated: true
    };
    setRecipes(prev => [...prev, newRecipe]);
  };

  const addMyRecipe = (recipe: Recipe) => {
    setMyRecipes(prev => {
      const exists = prev.find(r => r.id === recipe.id);
      if (exists) return prev;
      return [...prev, recipe];
    });
  };

  const removeMyRecipe = (id: string) => {
    setMyRecipes(prev => prev.filter(recipe => recipe.id !== id));
  };

  const updateMyRecipeFolder = (recipeId: string, folderId: string | undefined) => {
    setMyRecipes(prev => prev.map(recipe => 
      recipe.id === recipeId ? { ...recipe, folderId } : recipe
    ));
  };

  const addFolder = (name: string) => {
    const newFolder = {
      id: Date.now().toString(),
      name: name.trim()
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const removeFolder = (id: string) => {
    setFolders(prev => prev.filter(folder => folder.id !== id));
    // Remove folder assignment from recipes
    setMyRecipes(prev => prev.map(recipe => 
      recipe.folderId === id ? { ...recipe, folderId: undefined } : recipe
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'ingredients' && (
            <IngredientManager
              ingredients={ingredients}
              addIngredient={addIngredient}
              removeIngredient={removeIngredient}
            />
          )}
          
          {activeTab === 'recipes' && (
            <RecipeSearch
              recipes={recipes}
              userIngredients={ingredients}
              addMyRecipe={addMyRecipe}
            />
          )}
          
          {activeTab === 'create' && (
            <RecipeCreator
              addRecipe={addRecipe}
              availableIngredients={ingredients}
            />
          )}
          
          {activeTab === 'my-recipes' && (
            <MyRecipes
              myRecipes={myRecipes}
              folders={folders}
              removeMyRecipe={removeMyRecipe}
              updateMyRecipeFolder={updateMyRecipeFolder}
              addFolder={addFolder}
              removeFolder={removeFolder}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;