export type SupermarketCategory =
  | "Frutta e verdura"
  | "Latticini"
  | "Carne e pesce"
  | "Dispensa"
  | "Bevande"
  | "Pulizia casa"
  | "Igiene personale"
  | "Altro";

export interface ListItem {
  id: string;
  listId: string;
  name: string;
  quantity: string;
  category: SupermarketCategory;
  checked: boolean;
  addedAt: string;
  recurrenceDays?: number; // es. ogni 5 giorni
  lastBoughtDate?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: SupermarketCategory;
  quantity: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  category: SupermarketCategory;
  frequency: number; // quante volte comprato
  lastBought: string;
}

export interface SmartSuggestion {
  name: string;
  category: SupermarketCategory;
  reason: string;
}

export type ActiveTab = 'list' | 'pantry' | 'recipes' | 'recurring' | 'history';
