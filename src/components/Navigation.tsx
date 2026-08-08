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
    <nav className="bg-white border-b border-slate-200 shadow-xs sticky top-[52px] sm:top-[60px] z-30">
      <div className="max-w-5xl mx-auto px-2 flex overflow-x-auto no-scrollbar py-1.5 gap-1.5 justify-start sm:justify-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition whitespace-nowrap shadow-2xs ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs ring-1 ring-amber-400'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-sky-200' : 'text-slate-500'} />
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${isActive ? 'bg-sky-500 text-white' : 'bg-amber-600 text-white'}`}>
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
