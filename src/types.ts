/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StockItem {
  id: string;
  name: string;
  barcode: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  minQuantity: number;
  supplier: string;
  storageLocation: string;
}

export interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  date: string;
  user: string;
  source: 'manual' | 'camera' | 'cardapio';
}

export interface MealIngredient {
  productName: string;
  quantityPerStudent: number;
  unit: string;
  matchedProductId?: string;
}

export interface MenuMeal {
  id: string;
  date: string; // YYYY-MM-DD
  mealName: string;
  ingredients: MealIngredient[];
  status: 'planned' | 'served';
  studentsCount: number;
  servedAt?: string;
  mealType: 'merenda' | 'almoco';
  turn?: 'manha' | 'tarde' | 'noite' | 'integral';
}

export interface ChecklistItem {
  id: string;
  task: string;
  responsible: string;
  completed: boolean;
  completedTime?: string;
}

export interface CleaningLog {
  id: string;
  date: string; // YYYY-MM-DD
  tasks: ChecklistItem[];
  finishedBy?: string;
}

export interface BirthdayEmployee {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  role: string;
  avatar: string;
}

export type UserRole = 'Admin' | 'Estoquista' | 'Cozinheira' | 'Diretor';

export interface UserProfile {
  role: UserRole;
  name: string;
  avatar: string;
  permissions: string[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  username: string;
  role: UserRole;
  action: string;
  details: string;
}

export interface WasteRecord {
  id: string;
  date: string; // YYYY-MM-DD
  mealName: string;
  studentsRegistered: number;
  studentsServed: number;
  wasteQuantityKg: number; // estimated food waste
  reason: string;
}
