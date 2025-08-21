import React from 'react';
import { ChefHat, Package, Search, PlusCircle, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'ingredients' | 'recipes' | 'create' | 'my-recipes';
  setActiveTab: (tab: 'ingredients' | 'recipes' | 'create' | 'my-recipes') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'ingredients' as const, label: 'Mein Vorrat', icon: Package },
    { id: 'recipes' as const, label: 'Rezepte finden', icon: Search },
    { id: 'create' as const, label: 'Rezept erstellen', icon: PlusCircle },
    { id: 'my-recipes' as const, label: 'Meine Rezepte', icon: BookOpen },
  ];

  return (
    <header className="bg-white shadow-lg border-b-4 border-green-500">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-orange-500 p-2 rounded-xl">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Küchenheld</h1>
              <p className="text-sm text-gray-600">Dein kulinarischer Begleiter</p>
            </div>
          </div>
        </div>
        
        <nav className="flex space-x-1 pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};