import React from 'react';
import { ShoppingCart, Package, BookOpen, Clock, History, AlertCircle } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  itemCount: number;
  pantryCount: number;
  recurringCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onChangeTab,
  itemCount,
  pantryCount,
  recurringCount,
}) => {
  const tabs = [
    { id: 'list' as ActiveTab, label: 'Lista Spesa', icon: ShoppingCart, badge: itemCount },
    { id: 'pantry' as ActiveTab, label: 'Dispensa', icon: Package, badge: pantryCount },
    { id: 'recipes' as ActiveTab, label: 'Ricette', icon: BookOpen, badge: 0 },
    { id: 'recurring' as ActiveTab, label: 'Da Ricomprare', icon: Clock, badge: recurringCount },
    { id: 'history' as ActiveTab, label: 'Storico', icon: History, badge: 0 },
  ];

  return (
    <nav className="bg-white border-b-2 border-slate-200 shadow-sm sticky top-[76px] sm:top-[84px] z-30">
      <div className="max-w-5xl mx-auto px-2 flex overflow-x-auto no-scrollbar py-2 gap-2 justify-start sm:justify-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-base sm:text-lg transition whitespace-nowrap shadow-xs ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-black ${isActive ? 'bg-amber-400 text-slate-900' : 'bg-emerald-600 text-white'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
