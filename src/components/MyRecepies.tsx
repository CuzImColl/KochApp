import React, { useState } from 'react';
import { BookOpen, Plus, X, Folder, FolderOpen, Clock, ChefHat, Heart, Trash2 } from 'lucide-react';
import type { Recipe, Folder } from '../../App';

interface MyRecipesProps {
  myRecipes: Recipe[];
  folders: Folder[];
  removeMyRecipe: (id: string) => void;
  updateMyRecipeFolder: (recipeId: string, folderId: string | undefined) => void;
  addFolder: (name: string) => void;
  removeFolder: (id: string) => void;
}

export const MyRecipes: React.FC<MyRecipesProps> = ({
  myRecipes,
  folders,
  removeMyRecipe,
  updateMyRecipeFolder,
  addFolder,
  removeFolder
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showFolderForm, setShowFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      addFolder(newFolderName.trim());
      setNewFolderName('');
      setShowFolderForm(false);
    }
  };

  const filteredRecipes = selectedFolder 
    ? myRecipes.filter(recipe => recipe.folderId === selectedFolder)
    : myRecipes.filter(recipe => !recipe.folderId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Einfach': return 'text-green-600 bg-green-100';
      case 'Mittel': return 'text-orange-600 bg-orange-100';
      case 'Schwer': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Meine Rezepte</h2>
          <p className="text-gray-600">Deine gespeicherten Lieblingsrezepte</p>
        </div>
        <button
          onClick={() => setShowFolderForm(true)}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Ordner erstellen</span>
        </button>
      </div>

      {showFolderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Neuen Ordner erstellen</h3>
            <form onSubmit={handleAddFolder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordnername *
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="z.B. Italienische Küche"
                  required
                />
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Erstellen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFolderForm(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-4 sticky top-4">
            <h3 className="font-semibold text-gray-800 mb-4">Ordner</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedFolder === null ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Alle Rezepte ({myRecipes.length})</span>
              </button>
              
              <button
                onClick={() => setSelectedFolder('unorganized')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  selectedFolder === 'unorganized' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>Ohne Ordner ({myRecipes.filter(r => !r.folderId).length})</span>
              </button>
              
              {folders.map(folder => {
                const folderRecipeCount = myRecipes.filter(r => r.folderId === folder.id).length;
                return (
                  <div key={folder.id} className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedFolder(folder.id)}
                      className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        selectedFolder === folder.id ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
                      }`}
                    >
                      <FolderOpen className="w-4 h-4" />
                      <span>{folder.name} ({folderRecipeCount})</span>
                    </button>
                    <button
                      onClick={() => removeFolder(folder.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {selectedFolder ? 'Keine Rezepte in diesem Ordner' : 'Noch keine Rezepte gespeichert'}
              </h3>
              <p className="text-gray-500">
                {selectedFolder 
                  ? 'Füge Rezepte zu diesem Ordner hinzu oder wähle einen anderen Ordner aus.'
                  : 'Speichere deine ersten Rezepte über die Rezeptsuche!'
                }
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredRecipes.map((recipe) => (
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

                    <div className="flex items-center justify-between">
                      <select
                        value={recipe.folderId || ''}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateMyRecipeFolder(recipe.id, e.target.value || undefined);
                        }}
                        className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Ohne Ordner</option>
                        {folders.map(folder => (
                          <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                      </select>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMyRecipe(recipe.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">Zutaten</h4>
                  <div className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                        <span className="text-gray-700">{ingredient}</span>
                      </div>
                    ))}
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