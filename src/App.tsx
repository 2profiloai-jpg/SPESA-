import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ShoppingListView } from './components/ShoppingListView';
import { PantryView } from './components/PantryView';
import { RecipesView } from './components/RecipesView';
import { RecurringView } from './components/RecurringView';
import { HistoryView } from './components/HistoryView';
import { ShareModal } from './components/ShareModal';
import { VoiceModal } from './components/VoiceModal';
import {
  ShoppingList,
  ListItem,
  PantryItem,
  HistoryItem,
  SmartSuggestion,
  ActiveTab,
  SupermarketCategory
} from './types';

const INITIAL_LISTS: ShoppingList[] = [
  { id: '1', name: 'Spesa Settimanale', createdAt: new Date().toISOString() },
  { id: '2', name: 'Cena con Famiglia', createdAt: new Date().toISOString() }
];

const INITIAL_ITEMS: ListItem[] = [
  { id: '101', listId: '1', name: 'Latte fresco', quantity: '2 litri', category: 'Latticini', checked: false, addedAt: new Date().toISOString() },
  { id: '102', listId: '1', name: 'Pane integrale', quantity: '1 filone', category: 'Dispensa', checked: false, addedAt: new Date().toISOString() },
  { id: '103', listId: '1', name: 'Mele Golden', quantity: '1 kg', category: 'Frutta e verdura', checked: true, addedAt: new Date().toISOString() },
];

const INITIAL_PANTRY: PantryItem[] = [
  { id: 'p1', name: 'Olio extravergine', category: 'Dispensa', quantity: '1 bottiglia' },
  { id: 'p2', name: 'Sale fino', category: 'Dispensa', quantity: '1 pacco' },
  { id: 'p3', name: 'Zucchero semolato', category: 'Dispensa', quantity: '1 kg' },
];

const INITIAL_HISTORY: HistoryItem[] = [
  { id: 'h1', name: 'Latte fresco', category: 'Latticini', frequency: 5, lastBought: new Date().toISOString() },
  { id: 'h2', name: 'Pane integrale', category: 'Dispensa', frequency: 4, lastBought: new Date().toISOString() },
  { id: 'h3', name: 'Acqua naturale', category: 'Bevande', frequency: 8, lastBought: new Date().toISOString() },
];

export default function App() {
  // Load from localStorage or defaults
  const [lists, setLists] = useState<ShoppingList[]>(() => {
    const saved = localStorage.getItem('spesa_lists');
    return saved ? JSON.parse(saved) : INITIAL_LISTS;
  });

  const [activeListId, setActiveListId] = useState<string>(() => {
    return lists[0]?.id || '1';
  });

  const [items, setItems] = useState<ListItem[]>(() => {
    const saved = localStorage.getItem('spesa_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });

  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const saved = localStorage.getItem('spesa_pantry');
    return saved ? JSON.parse(saved) : INITIAL_PANTRY;
  });

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('spesa_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('list');
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('spesa_lists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    localStorage.setItem('spesa_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('spesa_pantry', JSON.stringify(pantryItems));
  }, [pantryItems]);

  useEffect(() => {
    localStorage.setItem('spesa_history', JSON.stringify(historyItems));
  }, [historyItems]);

  // Text size classes for elderly accessibility
  const textSizeClass = textSize === 'normal'
    ? 'text-base'
    : textSize === 'large'
    ? 'text-xl'
    : 'text-2xl';

  // Fetch smart suggestions from server backend
  const fetchSmartSuggestions = async (itemName: string, currentItems: string[]) => {
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, currentListItems: currentItems }),
      });
      const data = await res.json();
      if (res.ok && data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (e) {
      console.error('Error fetching suggestions:', e);
    }
  };

  // Add item
  const handleAddItem = (name: string, quantity: string, category: SupermarketCategory) => {
    const newItem: ListItem = {
      id: Date.now().toString(),
      listId: activeListId,
      name,
      quantity,
      category,
      checked: false,
      addedAt: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);

    // Update history
    setHistoryItems(prev => {
      const existing = prev.find(h => h.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        return prev.map(h => h.id === existing.id ? { ...h, frequency: h.frequency + 1, lastBought: new Date().toISOString() } : h);
      } else {
        return [{ id: Date.now().toString(), name, category, frequency: 1, lastBought: new Date().toISOString() }, ...prev];
      }
    });

    // Fetch smart suggestions
    const currentListNames = items.filter(i => i.listId === activeListId).map(i => i.name);
    fetchSmartSuggestions(name, currentListNames);
  };

  // Toggle item checked
  const handleToggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Create list
  const handleCreateList = (name: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };
    setLists(prev => [...prev, newList]);
    setActiveListId(newList.id);
  };

  // Voice transcript handler
  const handleVoiceTranscript = async (transcript: string) => {
    try {
      const res = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await res.json();
      if (res.ok && data.name) {
        handleAddItem(data.name, data.quantity || '1', data.category || 'Dispensa');
        setActiveTab('list');
      } else {
        handleAddItem(transcript, '1', 'Dispensa');
        setActiveTab('list');
      }
    } catch (e) {
      handleAddItem(transcript, '1', 'Dispensa');
      setActiveTab('list');
    }
  };

  // Add suggestion
  const handleAddSuggestion = (sug: SmartSuggestion) => {
    handleAddItem(sug.name, '1', sug.category);
    setSuggestions(prev => prev.filter(s => s.name !== sug.name));
  };

  // Pantry handlers
  const handleAddPantryItem = (name: string, quantity: string, category: SupermarketCategory) => {
    const newPantry: PantryItem = {
      id: Date.now().toString(),
      name,
      quantity,
      category,
    };
    setPantryItems(prev => [newPantry, ...prev]);
  };

  const handleDeletePantryItem = (id: string) => {
    setPantryItems(prev => prev.filter(p => p.id !== id));
  };

  const handleMovePantryToShopping = (item: PantryItem) => {
    handleAddItem(item.name, item.quantity, item.category);
    setActiveTab('list');
  };

  // Recipes handler
  const handleAddRecipeIngredients = (ingredients: { name: string; quantity: string; category: SupermarketCategory }[]) => {
    const newItems: ListItem[] = ingredients.map((ing, idx) => ({
      id: (Date.now() + idx).toString(),
      listId: activeListId,
      name: ing.name,
      quantity: ing.quantity,
      category: ing.category,
      checked: false,
      addedAt: new Date().toISOString(),
    }));
    setItems(prev => [...newItems, ...prev]);
    setActiveTab('list');
  };

  // Recurring items (dummy generated from history)
  const recurringItems = historyItems
    .filter(h => h.frequency >= 2)
    .map(h => ({
      name: h.name,
      category: h.category,
      quantity: '1 confezione',
      daysAgo: Math.floor(Math.random() * 5) + 3,
    }));

  const activeList = lists.find(l => l.id === activeListId) || lists[0];
  const activeListItems = items.filter(i => i.listId === activeListId);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans pb-16">
      <Header
        lists={lists}
        activeListId={activeListId}
        onSelectList={setActiveListId}
        onCreateList={handleCreateList}
        onOpenVoice={() => setShowVoiceModal(true)}
        onOpenShare={() => setShowShareModal(true)}
        textSize={textSize}
        onChangeTextSize={setTextSize}
        textSizeClass={textSizeClass}
      />

      <Navigation
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        itemCount={activeListItems.filter(i => !i.checked).length}
        pantryCount={pantryItems.length}
        recurringCount={recurringItems.length}
      />

      <main className="py-4">
        {activeTab === 'list' && (
          <ShoppingListView
            items={activeListItems}
            onAddItem={handleAddItem}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
            onOpenVoice={() => setShowVoiceModal(true)}
            suggestions={suggestions}
            onAddSuggestion={handleAddSuggestion}
            textSizeClass={textSizeClass}
          />
        )}

        {activeTab === 'pantry' && (
          <PantryView
            pantryItems={pantryItems}
            onAddPantryItem={handleAddPantryItem}
            onDeletePantryItem={handleDeletePantryItem}
            onMoveToShoppingList={handleMovePantryToShopping}
            textSizeClass={textSizeClass}
          />
        )}

        {activeTab === 'recipes' && (
          <RecipesView
            onAddRecipeIngredients={handleAddRecipeIngredients}
            textSizeClass={textSizeClass}
          />
        )}

        {activeTab === 'recurring' && (
          <RecurringView
            recurringItems={recurringItems}
            onAddRecurringItem={(name, qty, cat) => handleAddItem(name, qty, cat)}
            textSizeClass={textSizeClass}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            historyItems={historyItems}
            onAddHistoryItem={(name, cat) => handleAddItem(name, '1', cat)}
            textSizeClass={textSizeClass}
          />
        )}
      </main>

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        activeList={activeList}
        items={activeListItems}
        textSizeClass={textSizeClass}
      />

      <VoiceModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onTranscript={handleVoiceTranscript}
        textSizeClass={textSizeClass}
      />
    </div>
  );
}
