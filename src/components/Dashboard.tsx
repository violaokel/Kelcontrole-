/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckSquare, 
  Calendar, 
  Gift, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Sparkles,
  ChevronRight,
  ThumbsUp,
  User,
  Coffee,
  Trash2
} from 'lucide-react';
import { StockItem, MenuMeal, ChecklistItem, BirthdayEmployee, Transaction, WasteRecord } from '../types';

interface DashboardProps {
  stockList: StockItem[];
  meals: MenuMeal[];
  cleaningChecklist: ChecklistItem[];
  birthdays: BirthdayEmployee[];
  transactions: Transaction[];
  wasteRecords: WasteRecord[];
  onQuickServe: (mealId: string) => void;
  onNavigateToTab: (tab: string) => void;
  currentUserRole: string;
}

export default function Dashboard({
  stockList,
  meals,
  cleaningChecklist,
  birthdays,
  transactions,
  wasteRecords,
  onQuickServe,
  onNavigateToTab,
  currentUserRole
}: DashboardProps) {

  // Dates references: Current is 2026-05-29 (Friday)
  const todayStr = "2026-05-29";

  // 1. Calculations
  const totalStockItemsCount = useMemo(() => {
    return stockList.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [stockList]);

  const uniqueItemsCount = stockList.length;

  const lowStockItems = useMemo(() => {
    return stockList.filter(item => item.quantity <= item.minQuantity);
  }, [stockList]);

  const expiredItems = useMemo(() => {
    return stockList.filter(item => new Date(item.expiryDate) < new Date(todayStr));
  }, [stockList]);

  const nearExpiryItems = useMemo(() => {
    return stockList.filter(item => {
      const expiry = new Date(item.expiryDate);
      const today = new Date(todayStr);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 10;
    });
  }, [stockList]);

  // Today's meals segregated
  const todayMerendas = useMemo(() => {
    return meals.filter(m => m.date === todayStr && m.mealType === 'merenda');
  }, [meals]);

  const todayAlmocoList = useMemo(() => {
    return meals.filter(m => m.date === todayStr && m.mealType === 'almoco');
  }, [meals]);

  // Cleaning Checklist Completion Rate
  const completedTaskCount = cleaningChecklist.filter(t => t.completed).length;
  const totalTaskCount = cleaningChecklist.length;
  const cleaningPercentage = totalTaskCount > 0 ? Math.round((completedTaskCount / totalTaskCount) * 100) : 0;

  // Birthdays today or in the current month (May)
  const currentMonth = 4; // May is 4 in JS dates (0-indexed)
  const birthdaysThisMonth = useMemo(() => {
    return birthdays.filter(emp => {
      const birthDate = new Date(emp.birthDate);
      return birthDate.getMonth() === currentMonth;
    });
  }, [birthdays]);

  const birthdayToday = useMemo(() => {
    return birthdays.find(emp => {
      const birthDate = new Date(emp.birthDate);
      return birthDate.getDate() === 29 && birthDate.getMonth() === 4; // May 29
    });
  }, [birthdays]);

  // Waste Stats
  const totalWasteKg = useMemo(() => {
    return wasteRecords.reduce((acc, curr) => acc + curr.wasteQuantityKg, 0);
  }, [wasteRecords]);

  const averageWastePerMeal = wasteRecords.length > 0 ? (totalWasteKg / wasteRecords.length).toFixed(1) : "0";

  // Category Distribution
  const categorySummary = useMemo(() => {
    const summary: Record<string, number> = {};
    stockList.forEach(item => {
      summary[item.category] = (summary[item.category] || 0) + item.quantity;
    });
    return Object.entries(summary).map(([category, qty]) => ({ category, qty }));
  }, [stockList]);

  // Total items per category for SVG Chart
  const maxCategoryQty = Math.max(...categorySummary.map(c => c.qty), 1);

  return (
    <div id="school-dashboard-view" className="p-4 max-w-7xl mx-auto space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-black/5 rounded-full blur-xl -mb-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-white/10 backdrop-blur-md text-emerald-150 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10 inline-block">
              Painel Escolar • 2026
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Olá, <span className="text-yellow-300 font-bold">{currentUserRole}</span>!
            </h1>
            <p className="text-sm text-emerald-50 max-w-xl">
              Bem-vindo ao <strong>Controle de Merenda Escolar</strong>. Gerencie refeições, reduza o desperdício alimentar e garanta insumos seguros para os alunos hoje!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 flex items-center gap-3">
            <Calendar className="w-10 h-10 text-yellow-300" />
            <div className="text-left">
              <span className="text-xs text-emerald-100 uppercase tracking-wider block">Hoje</span>
              <strong className="text-base font-bold">29 de Maio, 2026</strong>
              <span className="text-[10px] text-emerald-200 block">Status: Conectado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active stock volume */}
        <div 
          onClick={() => onNavigateToTab('stock')}
          className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-emerald-200 shadow-sm cursor-pointer hover:shadow transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wide">Volume em Estoque</span>
            <div className="flex items-baseline gap-2">
              <strong className="text-2xl font-black text-gray-800">{totalStockItemsCount}</strong>
              <span className="text-xs text-gray-400 font-medium font-mono">itens ({uniqueItemsCount} tipologias)</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 2: Low Stock Alert */}
        <div 
          onClick={() => onNavigateToTab('stock')}
          className={`bg-white p-5 rounded-2xl border shadow-sm cursor-pointer hover:shadow transition flex items-center justify-between group ${lowStockItems.length > 0 ? 'border-amber-150 hover:border-amber-300' : 'border-gray-100'}`}
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wide">Estoque Crítico</span>
            <div className="flex items-baseline gap-1">
              <strong className="text-2xl font-black text-gray-800">{lowStockItems.length}</strong>
              <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Abaixo do Limiar</span>
            </div>
          </div>
          <div className={`p-3 rounded-xl transition ${lowStockItems.length > 0 ? 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' : 'bg-gray-50 text-gray-400'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 3: Expiring / Expired items */}
        <div 
          onClick={() => onNavigateToTab('stock')}
          className={`bg-white p-5 rounded-2xl border shadow-sm cursor-pointer hover:shadow transition flex items-center justify-between group ${expiredItems.length > 0 ? 'border-rose-150 hover:border-rose-300 shadow-rose-100/10' : 'border-gray-100'}`}
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wide">Alertas de Validade</span>
            <div className="flex items-baseline gap-1.5">
              <strong className="text-2xl font-black text-gray-800">{expiredItems.length + nearExpiryItems.length}</strong>
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                ({expiredItems.length} Vencidos / {nearExpiryItems.length} Próx.)
              </span>
            </div>
          </div>
          <div className={`p-3 rounded-xl transition ${expiredItems.length > 0 ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' : 'bg-gray-50 text-gray-400'}`}>
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* KPI 4: Daily Checklist Log status */}
        <div 
          onClick={() => onNavigateToTab('cleaning')}
          className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-cyan-200 shadow-sm cursor-pointer hover:shadow transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 block uppercase tracking-wide">Limpeza da Cozinha</span>
            <div className="flex items-center gap-2">
              <strong className="text-2xl font-black text-gray-800">{cleaningPercentage}%</strong>
              <span className="text-[10px] bg-cyan-50 border border-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded-full font-bold">
                {completedTaskCount}/{totalTaskCount} Feito
              </span>
            </div>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl group-hover:bg-cyan-100 transition">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Body Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Action Panels (Menu of the Day, Hygiene Checklist & Stock charts) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dashboard Panel: Today's Menu & Auto consumption */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Coffee className="w-5 h-5 text-amber-500" />
                Refeições Planejadas de Hoje ({todayStr})
              </h2>
              <button 
                onClick={() => onNavigateToTab('menu')}
                className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-0.5"
              >
                Cardápio Completo <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* TODAY'S MERENDA */}
              {todayMerendas.length > 0 ? (
                todayMerendas.map((meal) => (
                  <div key={meal.id} className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-3 relative text-left">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          🍎 Merenda {meal.turn === 'manha' ? '• Turno Manhã' : meal.turn === 'tarde' ? '• Turno Tarde' : meal.turn === 'noite' ? '• Turno Noite' : ''}
                        </span>
                        <h3 className="font-extrabold text-gray-950 text-sm mt-1">{meal.mealName}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 font-medium text-xs text-gray-750">
                        <span>Reforço estimado:</span>
                        <strong className="bg-white px-2 py-1 rounded-lg border font-mono font-bold text-amber-900">
                          {meal.studentsCount} alunos
                        </strong>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-amber-100/40 space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block font-mono">Cálculo de Porções Unitárias & Lote</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {meal.ingredients.map((ing, k) => {
                          const required = (ing.quantityPerStudent * meal.studentsCount).toFixed(2);
                          const currentStock = stockList.find(s => s.id === ing.matchedProductId);
                          const isStockCrit = currentStock ? currentStock.quantity < parseFloat(required) : true;
                          
                          return (
                            <div key={k} className="flex justify-between p-1 border-b border-gray-50 text-gray-700">
                              <span className="truncate max-w-[120px]">🌱 {ing.productName}</span>
                              <div className="flex items-center gap-1 font-mono font-semibold">
                                <strong>{required} {ing.unit}</strong>
                                <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${isStockCrit ? 'bg-red-105 text-red-700' : 'bg-green-105 text-green-700'}`}>
                                  ({currentStock ? currentStock.quantity : 0} {ing.unit})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-amber-200/50">
                      {meal.status === 'served' ? (
                        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-2 py-1.5 rounded-xl text-xs flex items-center gap-1.5 w-full font-medium">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Consumo registrado e deduzido das prateleiras de estoque!</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-[11px] text-gray-500">Deduzir itens ao servir lanche na escola.</p>
                          <button
                            id={`btn-quick-serve-${meal.id}`}
                            onClick={() => onQuickServe(meal.id)}
                            className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg shrink-0 transition shadow-sm active:scale-95 flex items-center gap-1"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Servir Merenda
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-amber-50/15 border border-dashed border-amber-200/55 rounded-2xl text-center text-xs text-amber-700 py-5">
                  Nenhuma Merenda cadastrada para hoje.
                  <button 
                    onClick={() => onNavigateToTab('menu')}
                    className="block mx-auto mt-1 font-bold text-amber-800 underline"
                  >
                    + Adicionar Lanche de Hoje
                  </button>
                </div>
              )}

              {/* TODAY'S ALMOCO */}
              {todayAlmocoList.length > 0 ? (
                todayAlmocoList.map((meal) => (
                  <div key={meal.id} className="p-4 bg-teal-50/50 rounded-2xl border border-teal-200/50 space-y-3 relative text-left">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-teal-900 bg-teal-100 border border-teal-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          🍲 Almoço {meal.turn === 'manha' ? '• Turno Manhã' : meal.turn === 'tarde' ? '• Turno Tarde' : meal.turn === 'noite' ? '• Turno Noite' : ''}
                        </span>
                        <h3 className="font-extrabold text-gray-950 text-sm mt-1">{meal.mealName}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 font-medium text-xs text-gray-750">
                        <span>Refeições estimadas:</span>
                        <strong className="bg-white px-2 py-1 rounded-lg border font-mono font-bold text-teal-900">
                          {meal.studentsCount} alunos
                        </strong>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-teal-100/40 space-y-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block font-mono">Cálculo de Porções Unitárias & Lote</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {meal.ingredients.map((ing, k) => {
                          const required = (ing.quantityPerStudent * meal.studentsCount).toFixed(2);
                          const currentStock = stockList.find(s => s.id === ing.matchedProductId);
                          const isStockCrit = currentStock ? currentStock.quantity < parseFloat(required) : true;
                          
                          return (
                            <div key={k} className="flex justify-between p-1 border-b border-gray-50 text-gray-700">
                              <span className="truncate max-w-[120px]">🌱 {ing.productName}</span>
                              <div className="flex items-center gap-1 font-mono font-semibold">
                                <strong>{required} {ing.unit}</strong>
                                <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${isStockCrit ? 'bg-red-105 text-red-700' : 'bg-green-105 text-green-700'}`}>
                                  ({currentStock ? currentStock.quantity : 0} {ing.unit})
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-teal-200/50">
                      {meal.status === 'served' ? (
                        <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-2 py-1.5 rounded-xl text-xs flex items-center gap-1.5 w-full font-medium">
                          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Consumo do Almoço registrado e deduzido automaticamente do estoque!</span>
                        </div>
                      ) : (
                        <>
                          <p className="text-[11px] text-gray-500">Deduzir itens ao servir almoço na escola.</p>
                          <button
                            id={`btn-quick-serve-${meal.id}`}
                            onClick={() => onQuickServe(meal.id)}
                            className="bg-emerald-600 hover:bg-emerald-555 text-white font-bold text-[11px] py-1.5 px-3 rounded-lg shrink-0 transition shadow-sm active:scale-95 flex items-center gap-1"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            Servir Almoço
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-teal-50/15 border border-dashed border-teal-200/55 rounded-2xl text-center text-xs text-teal-700 py-5">
                  Nenhum Almoço principal cadastrado para hoje.
                  <button 
                    onClick={() => onNavigateToTab('menu')}
                    className="block mx-auto mt-1 font-bold text-teal-850 underline"
                  >
                    + Adicionar Almoço de Hoje
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic SVG Category Distribution & Waste Analytics Chart */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Diferencial de Insumos & Consumo Mensal (Gráficos)
              </h3>
              <span className="text-[10px] text-gray-400">Em tempo real</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Category SVG Bar Chart */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-600 block mb-2">Resumo de Insumos por Categoria (kg/unidades)</span>
                <div className="space-y-1.5">
                  {categorySummary.slice(0, 5).map(({ category, qty }, index) => {
                    const pct = Math.min(100, Math.round((qty / maxCategoryQty) * 100));
                    const colors = [
                      'bg-emerald-500', 'bg-sky-500', 'bg-amber-500', 'bg-purple-500', 'bg-pink-500'
                    ];
                    return (
                      <div key={index} className="space-y-0.5">
                        <div className="flex justify-between text-[11px] text-gray-500">
                          <span className="font-medium truncate max-w-[120px]">{category}</span>
                          <strong className="font-mono text-gray-700">{qty.toFixed(0)} un/kg</strong>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Waste Stats Graphic bar */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between leading-none mb-1">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    Controle de Desperdício Escolar
                  </span>
                  <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-1.5 rounded">Mensal</span>
                </div>
                
                <p className="text-[11px] text-gray-500 leading-tight">
                  Calculado pela pesagem de restos após as refeições. Ideal menor que 1.5kg p/ dia.
                </p>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Acumulado</span>
                    <strong className="text-lg font-black text-rose-600 font-mono">{totalWasteKg.toFixed(1)}kg</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Média Refeição</span>
                    <strong className="text-lg font-black text-amber-700 font-mono">{averageWastePerMeal}kg</strong>
                  </div>
                </div>

                {/* Waste Alert indicator status */}
                <div className="text-[11px] flex items-center gap-1.5 pt-1 text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${parseFloat(averageWastePerMeal) > 1.8 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  <span>
                    Status Desperdício: {parseFloat(averageWastePerMeal) > 1.8 ? 'Eleve o porcionamento correto!' : 'Estável e Controlado!'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right 5 Columns: Secondary widgets (Cleanliness, Birthdays, Actions) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Birthdays special reminder widget */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Gift className="w-4 h-4 text-emerald-600" />
                Aniversariantes do Mês (Maio)
              </h3>
              <button 
                onClick={() => onNavigateToTab('birthdays')}
                className="text-xs text-emerald-600 font-bold hover:underline"
              >
                Gerenciar Lista
              </button>
            </div>

            {birthdayToday ? (
              <div className="p-3 bg-pink-50 border border-pink-100 rounded-xl flex items-center gap-3 animate-pulse">
                <span className="text-3xl">{birthdayToday.avatar || "🎂"}</span>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-xs font-black text-pink-900 truncate block">{birthdayToday.name}</strong>
                    <span className="bg-pink-200 text-pink-800 text-[8px] uppercase font-bold px-1.5 rounded-full">Hoje!</span>
                  </div>
                  <p className="text-[10px] text-pink-700">{birthdayToday.role}</p>
                </div>
                
                <button
                  onClick={() => alert(`🎉 Mensagem enviada para ${birthdayToday.name}: "Parabéns pelo seu dia, obrigado pelo trabalho incrível na merenda escolar!"`)}
                  className="bg-pink-600 text-white font-bold text-[10px] px-2.5 py-1.5 rounded-lg hover:bg-pink-700 transition"
                >
                  Dar Parabéns
                </button>
              </div>
            ) : null}

            <div className="divide-y max-h-[160px] overflow-y-auto pr-1">
              {birthdaysThisMonth.map(emp => {
                const isToday = emp.id === birthdayToday?.id;
                if (isToday) return null; // Already highlighted
                const bDateStr = emp.birthDate.split('-')[2]; // birth day
                
                return (
                  <div key={emp.id} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
                    <span className="text-xl bg-gray-50 border p-1 rounded-lg">{emp.avatar || "👤"}</span>
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="text-xs font-bold text-gray-800 truncate">{emp.name}</h4>
                      <p className="text-[10px] text-gray-500 truncate">{emp.role}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 bg-gray-150 px-2 py-0.5 rounded-md font-mono">
                      {bDateStr} de Maio
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Hygiene Checklist Checklist Widget */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-500" />
                Checklist de Limpeza Diária
              </h3>
              <span className="text-xs font-bold text-cyan-600 font-mono">{cleaningPercentage}%</span>
            </div>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
              {cleaningChecklist.map(task => (
                <div key={task.id} className="flex items-start gap-2 text-xs text-left">
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 font-bold ${task.completed ? 'bg-cyan-500 border-cyan-500 text-white' : 'border-gray-250 bg-white'}`}>
                    {task.completed && "✓"}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${task.completed ? 'text-gray-450 line-through' : 'text-gray-800'}`}>
                      {task.task}
                    </p>
                    <span className="text-[9px] text-gray-400 font-medium">Resp: {task.responsible} {task.completedTime && ` • Cpd às ${task.completedTime}`}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateToTab('cleaning')}
              className="w-full text-center py-2 bg-slate-50 border hover:bg-slate-100 border-gray-200 text-xs text-slate-700 font-bold rounded-xl transition"
            >
              Acessar Controle de Limpeza Completo
            </button>
          </div>

          {/* Quick Recent Movements log */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Atividades Históricas Recentes</span>
            
            <div className="space-y-2 max-h-[140px] overflow-y-auto text-xs text-left">
              {transactions.slice(0, 3).map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-transparent hover:border-gray-100">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${tx.type === 'entrada' ? 'bg-green-500' : 'bg-rose-500'}`} />
                      <strong className="text-gray-900 truncate font-semibold block text-[11px]">
                        {tx.type === 'entrada' ? 'Entrada' : 'Baixa'}: {tx.productName}
                      </strong>
                    </div>
                    <span className="text-[9px] text-gray-400 block font-mono">Por {tx.user} ({tx.source})</span>
                  </div>
                  <strong className={`font-bold font-mono text-[11px] ${tx.type === 'entrada' ? 'text-green-700' : 'text-rose-700'}`}>
                    {tx.type === 'entrada' ? '+' : '-'}{tx.quantity} {tx.unit}
                  </strong>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
