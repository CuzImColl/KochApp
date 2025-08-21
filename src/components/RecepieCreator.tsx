import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Recipe, Ingredient } from '../../App';

interface RecipeCreatorProps {
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  availableIngredients: Ingredient[];
}

const difficulties = ['Einfach', 'Mittel', 'Schwer'] as const;
const categories = [
  'Vorspeise', 'Hauptgericht', 'Dessert', 'Snack', 
  'Getränk', 'Beilage', 'Suppe', 'Salat'
];

const dietaryOptions = [
  'Vegetarisch', 'Vegan', 'Glutenfrei', 'Laktosefrei', 'Low-Carb'
];

export const RecipeCreator: React.FC<RecipeCreatorProps> = ({ addRecipe, availableIngredients }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookingTime: 30,
    difficulty: 'Einfach' as const,
    category: 'Hauptgericht',
    calories: undefined as number | undefined
  });
  
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validIngredients = ingredients.filter(ing => ing.trim() !== '');
    const validInstructions = instructions.filter(inst => inst.trim() !== '');
    
    if (formData.title.trim() && validIngredients.length > 0 && validInstructions.length > 0) {
      addRecipe({
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: validIngredients,
        instructions: validInstructions,
        cookingTime: formData.cookingTime,
        difficulty: formData.difficulty,
        category: formData.category,
        dietary: selectedDietary,
        calories: formData.calories
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        cookingTime: 30,
        difficulty: 'Einfach',
        category: 'Hauptgericht',
        calories: undefined
      });
      setIngredients(['']);
      setInstructions(['']);
      setSelectedDietary([]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const toggleDietary = (dietary: string) => {
    setSelectedDietary(prev => 
      prev.includes(dietary) 
        ? prev.filter(d => d !== dietary)
        : [...prev, dietary]
    );
  };

  const addIngredientField = () => {
    setIngredients(prev => [...prev, '']);
  };

  const removeIngredientField = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    setIngredients(prev => prev.map((ing, i) => i === index ? value : ing));
  };

  const addInstructionField = () => {
    setInstructions(prev => [...prev, '']);
  };

  const removeInstructionField = (index: number) => {
    setInstructions(prev => prev.filter((_, i) => i !== index));
  };

  const updateInstruction = (index: number, value: string) => {
    setInstructions(prev => prev.map((inst, i) => i === index ? value : inst));
  };

  const addIngredientFromStock = (ingredientName: string) => {
    const emptyIndex = ingredients.findIndex(ing => ing.trim() === '');
    if (emptyIndex !== -1) {
      updateIngredient(emptyIndex, ingredientName);
    } else {
      setIngredients(prev => [...prev, ingredientName]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Neues Rezept erstellen</h2>
        <p className="text-gray-600">Teile dein Lieblingsrezept mit der Community</p>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center text-green-800">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Rezept erfolgreich erstellt!
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rezept-Titel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="z.B. Mediterraner Nudelsalat"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschreibung
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Eine kurze Beschreibung deines Rezepts..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kochzeit (Minuten)
                </label>
                <input
                  type="number"
                  value={formData.cookingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 30 }))}
                  min="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schwierigkeitsgrad
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as typeof formData.difficulty }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kalorien (optional)
                </label>
                <input
                  type="number"
                  value={formData.calories || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, calories: e.target.value ? parseInt(e.target.value) : undefined }))}
                  min="1"
                  placeholder="z.B. 350"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ernährungsweise
              </label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(dietary => (
                  <button
                    key={dietary}
                    type="button"
                    onClick={() => toggleDietary(dietary)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDietary.includes(dietary)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dietary}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Zutaten *
                </label>
                <button
                  type="button"
                  onClick={addIngredientField}
                  className="text-green-600 hover:text-green-700 flex items-center space-x-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Zutat hinzufügen</span>
                </button>
              </div>
              <div className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="z.B. 500g Nudeln"
                    />
                    {ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredientField(index)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Zubereitung *
                </label>
                <button
                  type="button"
                  onClick={addInstructionField}
                  className="text-green-600 hover:text-green-700 flex items-center space-x-1 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schritt hinzufügen</span>
                </button>
              </div>
              <div className="space-y-3">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <div className="flex-1 flex space-x-2">
                      <textarea
                        value={instruction}
                        onChange={(e) => updateInstruction(index, e.target.value)}
                        rows={2}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Beschreibe diesen Zubereitungsschritt..."
                      />
                      {instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeInstructionField(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Rezept erstellen
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Deine Vorräte</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableIngredients.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Keine Zutaten im Vorrat
                </p>
              ) : (
                availableIngredients.map((ingredient) => (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={() => addIngredientFromStock(ingredient.name)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors"
                  >
                    {ingredient.name}
                    {ingredient.quantity && ingredient.unit && (
                      <span className="text-gray-500 ml-1">
                        ({ingredient.quantity} {ingredient.unit})
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl border border-orange-200 p-4">
            <h4 className="font-semibold text-orange-800 mb-2">💡 Tipp</h4>
            <p className="text-sm text-orange-700">
              Klicke auf deine Vorratszutaten links, um sie schnell zu deinem Rezept hinzuzufügen!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};