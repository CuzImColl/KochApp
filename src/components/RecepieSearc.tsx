import React, { useState, useMemo } from 'react';
import { Search, Clock, ChefHat, CheckCircle, Circle, Filter, Heart } from 'lucide-react';
import type { Recipe, Ingredient } from '../App';

interface RecipeSearchProps {
  recipes: Recipe[];
  userIngredients: Ingredient[];
  addMyRecipe: (recipe: Recipe) => void;
}

const categories = [
  'Alle', 'Vorspeise', 'Hauptgericht', 'Dessert', 'Snack', 
  'Getränk', 'Beilage', 'Suppe', 'Salat'
];

const difficulties = ['Alle', 'Einfach', 'Mittel', 'Schwer'];

const dietaryOptions = [
  'Vegetarisch', 'Vegan', 'Glutenfrei', 'Laktosefrei', 'Low-Carb'
];

export const RecipeSearch: React.FC<RecipeSearchProps> = ({ recipes, userIngredients, addMyRecipe }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Alle');
  const [filterDifficulty, setFilterDifficulty] = useState('Alle');
  const [filterMaxCookingTime, setFilterMaxCookingTime] = useState<number | null>(null);
  const [filterDietary, setFilterDietary] = useState<string[]>([]);
  
  const userIngredientNames = userIngredients.map(ing => ing.name.toLowerCase());
  
  const filteredRecipes = useMemo(() => {
    return recipes
      .filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(recipe => filterCategory === 'Alle' || recipe.category === filterCategory)
      .filter(recipe => filterDifficulty === 'Alle' || recipe.difficulty === filterDifficulty)
      .filter(recipe => !filterMaxCookingTime || recipe.cookingTime <= filterMaxCookingTime)
      .filter(recipe => {
        if (filterDietary.length === 0) return true;
        return filterDietary.every(diet => recipe.dietary?.includes(diet));
      })
      .sort((a, b) => {
        const aMatches = a.ingredients.filter(ing => 
          userIngredientNames.includes(ing.toLowerCase())
        ).length;
        const bMatches = b.ingredients.filter(ing => 
          userIngredientNames.includes(ing.toLowerCase())
        ).length;
        return bMatches - aMatches;
      });
  }, [recipes, searchTerm, userIngredientNames, filterCategory, filterDifficulty, filterMaxCookingTime, filterDietary]);

  const getIngredientMatch = (recipeIngredients: string[]) => {
    const matches = recipeIngredients.filter(ing => 
      userIngredientNames.includes(ing.toLowerCase())
    );
    return {
      matches: matches.length,
      total: recipeIngredients.length,
      percentage: Math.round((matches.length / recipeIngredients.length) * 100)
    };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Einfach': return 'text-green-600 bg-green-100';
      case 'Mittel': return 'text-orange-600 bg-orange-100';
      case 'Schwer': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleDietaryFilter = (dietary: string) => {
    setFilterDietary(prev => 
      prev.includes(dietary) 
        ? prev.filter(d => d !== dietary)
        : [...prev, dietary]
    );
  };

  const clearFilters = () => {
    setFilterCategory('Alle');
    setFilterDifficulty('Alle');
    setFilterMaxCookingTime(null);
    setFilterDietary([]);
  };

  const handleAddToMyRecipes = (recipe: Recipe) => {
    addMyRecipe(recipe);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Rezepte finden</h2>
        <p className="text-gray-600">Entdecke Rezepte basierend auf deinen verfügbaren Zutaten</p>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rezepte durchsuchen..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
              showFilters || filterCategory !== 'Alle' || filterDifficulty !== 'Alle' || filterMaxCookingTime || filterDietary.length > 0
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schwierigkeit</label>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max. Kochzeit (Min)</label>
                <input
                  type="number"
                  value={filterMaxCookingTime || ''}
                  onChange={(e) => setFilterMaxCookingTime(e.target.value ? parseInt(e.target.value) : null)}
                  placeholder="z.B. 30"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ernährungsweise</label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(dietary => (
                  <button
                    key={dietary}
                    onClick={() => toggleDietaryFilter(dietary)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterDietary.includes(dietary)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dietary}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const match = getIngredientMatch(recipe.ingredients);
          return (
            <div
              key={recipe.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:scale-105"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-800 flex-1">{recipe.title}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                    {recipe.difficulty}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.cookingTime} Min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {recipe.calories && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{recipe.calories} kcal</span>
                    )}
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{recipe.category}</span>
                  </div>
                </div>

                {recipe.dietary && recipe.dietary.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.dietary.map(diet => (
                      <span key={diet} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {diet}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Zutaten verfügbar:</span>
                    <span className={`text-sm font-bold ${
                      match.percentage >= 80 ? 'text-green-600' : 
                      match.percentage >= 50 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {match.matches}/{match.total} ({match.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        match.percentage >= 80 ? 'bg-green-500' : 
                        match.percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${match.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Keine Rezepte gefunden</h3>
          <p className="text-gray-500">Versuche es mit anderen Suchbegriffen oder füge mehr Zutaten zu deinem Vorrat hinzu.</p>
        </div>
      )}

      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedRecipe.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{selectedRecipe.cookingTime} Minuten</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                      {selectedRecipe.difficulty}
                    </div>
                    {selectedRecipe.calories && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">{selectedRecipe.calories} kcal</span>
                    )}
                  </div>
                  
                  {selectedRecipe.dietary && selectedRecipe.dietary.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedRecipe.dietary.map(diet => (
                        <span key={diet} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          {diet}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <button
                  onClick={() => handleAddToMyRecipes(selectedRecipe)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Zu Meine Rezepte hinzufügen</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Zutaten</h4>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => {
                      const hasIngredient = userIngredientNames.includes(ingredient.toLowerCase());
                      return (
                        <div
                          key={index}
                          className={`flex items-center space-x-2 p-2 rounded-lg ${
                            hasIngredient ? 'bg-green-50' : 'bg-red-50'
                          }`}
                        >
                          {hasIngredient ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-red-400" />
                          )}
                          <span className={hasIngredient ? 'text-green-800' : 'text-red-700'}>
                            {ingredient}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Zubereitung</h4>
                  <div className="space-y-3">
                    {selectedRecipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex space-x-3">
                        <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 flex-1">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};