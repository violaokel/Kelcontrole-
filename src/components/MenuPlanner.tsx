/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  ChefHat, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Share2, 
  Trash2, 
  Plus, 
  CheckCircle, 
  Minus,
  HelpCircle,
  TrendingDown,
  Pencil
} from 'lucide-react';
import { MenuMeal, StockItem, MealIngredient } from '../types';

interface MenuPlannerProps {
  meals: MenuMeal[];
  stockList: StockItem[];
  onAddMeal: (meal: Omit<MenuMeal, 'id'>) => void;
  onRemoveMeal: (id: string) => void;
  onEditMeal?: (meal: MenuMeal) => void;
  onServeMeal: (mealId: string) => void;
  currentUserRole: string;
}

export default function MenuPlanner({
  meals,
  stockList,
  onAddMeal,
  onRemoveMeal,
  onEditMeal,
  onServeMeal,
  currentUserRole
}: MenuPlannerProps) {

  // Current selected day view
  const [selectedWeekDay, setSelectedWeekDay] = useState<string>('2026-05-29'); // Today!

  // Form states to create custom meal
  const [isCreatingMeal, setIsCreatingMeal] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealDate, setMealDate] = useState('2026-05-29');
  const [studentsCount, setStudentsCount] = useState<number>(120);
  const [mealType, setMealType] = useState<'merenda' | 'almoco'>('almoco');
  const [mealTurn, setMealTurn] = useState<'manha' | 'tarde' | 'noite' | 'integral'>('manha');
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  
  // Ingredients dynamic row composer
  const [ingredientsInput, setIngredientsInput] = useState<MealIngredient[]>([
    { productName: '', quantityPerStudent: 0.05, unit: 'kg' }
  ]);

  // Handle adding ingredient row
  const handleAddIngredientRow = () => {
    setIngredientsInput([...ingredientsInput, { productName: '', quantityPerStudent: 0.05, unit: 'kg' }]);
  };

  // Handle removing ingredient row
  const handleRemoveIngredientRow = (idx: number) => {
    if (ingredientsInput.length === 1) return;
    setIngredientsInput(ingredientsInput.filter((_, i) => i !== idx));
  };

  const handleIngredientRowChange = (idx: number, field: keyof MealIngredient, value: any) => {
    const copy = [...ingredientsInput];
    
    if (field === 'productName') {
      // Find matches in inventory to link automatically!
      const matched = stockList.find(s => s.name.toLowerCase() === value.toLowerCase() || s.id === value);
      copy[idx] = {
        ...copy[idx],
        productName: value,
        matchedProductId: matched ? matched.id : undefined,
        unit: matched ? matched.unit : copy[idx].unit
      };
    } else {
      copy[idx] = {
        ...copy[idx],
        [field]: value
      };
    }
    setIngredientsInput(copy);
  };

  const handleStartEdit = (meal: MenuMeal) => {
    setEditingMealId(meal.id);
    setMealName(meal.mealName);
    setMealDate(meal.date);
    setStudentsCount(meal.studentsCount);
    setMealType(meal.mealType);
    setMealTurn(meal.turn || 'manha');
    setIngredientsInput(meal.ingredients.map(ing => ({
      productName: ing.productName,
      quantityPerStudent: ing.quantityPerStudent,
      unit: ing.unit,
      matchedProductId: ing.matchedProductId
    })));
    setIsCreatingMeal(true);
    
    const formEl = document.getElementById('menu-planner-view');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelClick = () => {
    setMealName('');
    setIngredientsInput([{ productName: '', quantityPerStudent: 0.05, unit: 'kg' }]);
    setMealType('almoco');
    setMealTurn('manha');
    setEditingMealId(null);
    setIsCreatingMeal(false);
  };

  const handleSubmitMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim() || ingredientsInput.some(ing => !ing.productName.trim())) {
      alert("Por favor, preencha o nome da refeição e todos os ingredientes antes de salvar.");
      return;
    }

    // Attempt to map ingredients based on inventory stocks name list
    const mappedIngredients = ingredientsInput.map(ing => {
      const match = stockList.find(s => 
        s.name.toLowerCase() === ing.productName.toLowerCase() || 
        s.id === ing.matchedProductId ||
        s.name.toLowerCase().includes(ing.productName.toLowerCase())
      );
      return {
        ...ing,
        matchedProductId: match ? match.id : undefined,
        unit: match ? match.unit : ing.unit
      };
    });

    if (editingMealId && onEditMeal) {
      onEditMeal({
        id: editingMealId,
        date: mealDate,
        mealName: mealName,
        studentsCount: studentsCount,
        ingredients: mappedIngredients,
        status: meals.find(m => m.id === editingMealId)?.status || 'planned',
        mealType: mealType,
        turn: mealTurn
      });
      // Reset Form
      setMealName('');
      setIngredientsInput([{ productName: '', quantityPerStudent: 0.05, unit: 'kg' }]);
      setMealType('almoco');
      setMealTurn('manha');
      setEditingMealId(null);
      setIsCreatingMeal(false);
      alert("Refeição atualizada no cardápio escolar com sucesso!");
    } else {
      onAddMeal({
        date: mealDate,
        mealName: mealName,
        studentsCount: studentsCount,
        ingredients: mappedIngredients,
        status: 'planned',
        mealType: mealType,
        turn: mealTurn
      });
      // Reset Form
      setMealName('');
      setIngredientsInput([{ productName: '', quantityPerStudent: 0.05, unit: 'kg' }]);
      setMealType('almoco');
      setMealTurn('manha');
      setIsCreatingMeal(false);
      alert("Nova refeição agendada no cardápio escolar com sucesso!");
    }
  };

  const renderMealCard = (meal: MenuMeal) => {
    const isServed = meal.status === 'served';
    const isSnack = meal.mealType === 'merenda';
    
    return (
      <div key={meal.id} className="p-4 rounded-2xl border bg-slate-50/50 border-slate-200/80 space-y-4 relative text-left">
        
        {/* Controls card container header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isServed 
                  ? 'bg-emerald-600 text-white' 
                  : isSnack 
                    ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                    : 'bg-teal-100 text-teal-900 border border-teal-200'
              }`}>
                {isServed ? '✓ Consumo Efetuado' : `⚡ Aguardando ${isSnack ? 'Merenda' : 'Almoço'}`}
              </span>
              <span className="text-[10px] text-gray-450 font-mono">ID: {meal.id.toUpperCase()}</span>
            </div>
            
            <h4 id={`meal-title-${meal.id}`} className="font-extrabold text-gray-950 text-base flex flex-wrap items-center gap-1.5">
              <span>{isSnack ? '🍎' : '🍲'} {meal.mealName}</span>
              {meal.turn && (
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  meal.turn === 'manha' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : meal.turn === 'tarde'
                      ? 'bg-sky-100 text-sky-805 border border-sky-200'
                      : meal.turn === 'noite'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {meal.turn === 'manha' ? '☀️ Manhã' : meal.turn === 'tarde' ? '⛅ Tarde' : meal.turn === 'noite' ? '🌙 Noite' : '🔁 Integral'}
                </span>
              )}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              Distribuição calculada para <strong>{meal.studentsCount} alunos</strong> do turno{' '}
              <strong>
                {meal.turn === 'manha' 
                  ? 'da Manhã' 
                  : meal.turn === 'tarde' 
                    ? 'da Tarde' 
                    : meal.turn === 'noite' 
                      ? 'da Noite' 
                      : 'Integral'}
              </strong>.
            </p>
          </div>

          {/* Top corner actions */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
            <button
              onClick={() => handleShareMenu(meal)}
              className="p-1 px-2.5 bg-white border hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
              title="Compartilhar cardápio e porções"
            >
              <Share2 className="w-3.5 h-3.5" />
              Condensar
            </button>

            {currentUserRole === 'Admin' && (
              <>
                <button
                  type="button"
                  onClick={() => handleStartEdit(meal)}
                  className="p-1 px-2.5 bg-white border border-amber-200 hover:bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                  title="Editar refeição"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button
                  onClick={() => onRemoveMeal(meal.id)}
                  className="p-1 px-1.5 bg-white border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-lg text-xs transition shadow-sm"
                  title="Remover refeição"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Ingredients calculations tables */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/70 text-xs shadow-inner">
          <div className="grid grid-cols-12 font-bold text-slate-800 border-b pb-1.5 mb-2 font-mono">
            <div className="col-span-6">Ingrediente da Receita</div>
            <div className="col-span-3 text-right">Unitário</div>
            <div className="col-span-3 text-right">Lote Total</div>
          </div>

          <div className="space-y-1 divide-y divide-slate-100">
            {meal.ingredients.map((ing, iCount) => {
              const studentQty = ing.quantityPerStudent;
              const combinedQty = (studentQty * meal.studentsCount).toFixed(2);
              
              // Try to see if stock has enough
              const actualStock = stockList.find(s => s.id === ing.matchedProductId);
              const hasEnough = actualStock ? actualStock.quantity >= parseFloat(combinedQty) : false;

              return (
                <div key={iCount} className="grid grid-cols-12 py-1.5 first:pt-0 last:pb-0 font-medium items-center">
                  <div className="col-span-6 text-gray-800 flex items-center gap-1 truncate" title={ing.productName}>
                    <span className="truncate">🌱 {ing.productName}</span>
                    {actualStock && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full ${hasEnough ? 'bg-green-150 text-green-700' : 'bg-red-150 text-red-700'}`}>
                        ({actualStock.quantity} {actualStock.unit} disp.)
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 text-right font-mono text-gray-500">{studentQty} {ing.unit}</div>
                  <div className="col-span-3 text-right font-bold text-slate-905 font-mono">{combinedQty} {ing.unit}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions footer for this meal recipe */}
        <div className="flex sm:justify-end">
          {isServed ? (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 w-full font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>
                Refeição distribuída pela equipe da cozinha com sucesso. Ingredientes reduzidos automaticamente do estoque!
              </span>
            </div>
          ) : (
            <button
              type="button"
              id={`btn-serve-meal-${meal.id}`}
              onClick={() => onServeMeal(meal.id)}
              className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              Pesporcionar & Registrar Consumo {isSnack ? 'da Merenda' : 'do Almoço'}
            </button>
          )}
        </div>

      </div>
    );
  };

  // Group meals for easier week visualization (Monday 25th to Friday 29th, 2026)
  const weekDays = [
    { label: 'Segunda (25/Mai)', date: '2026-05-25' },
    { label: 'Terça (26/Mai)', date: '2026-05-26' },
    { label: 'Quarta (27/Mai)', date: '2026-05-27' },
    { label: 'Quinta (28/Mai)', date: '2026-05-28' },
    { label: 'Sexta (29/Mai) Hoje', date: '2026-05-29' },
    { label: 'Segunda (01/Jun)', date: '2026-06-01' },
    { label: 'Terça (02/Jun)', date: '2026-06-02' }
  ];

  const currentDayMeals = meals.filter(m => m.date === selectedWeekDay);

  // Generate a mock Whatsapp or PDF share text structure
  const handleShareMenu = (meal: MenuMeal) => {
    try {
      const text = `🍽️ *CARDÁPIO ESCOLAR - MERENDA* 🍽️\n📅 *Data:* ${meal.date}\n🥣 *Prato principal:* ${meal.mealName}\n👥 *Fórmula estimada:* ${meal.studentsCount} Alunos\n🌿 _Ingredientes selecionados:_ \n${meal.ingredients.map(i => `• ${i.productName} (${(i.quantityPerStudent * meal.studentsCount).toFixed(1)}${i.unit})`).join('\n')}\n\n_Gerado automaticamente pelo aplicativo de Controle de Merenda._`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Cardápio Merenda Escolar',
          text: text,
        }).catch(err => console.log(err));
      } else {
        navigator.clipboard.writeText(text);
        alert("Texto formatado para envio copiado para a Área de Transferência! Você já pode colar no WhatsApp ou e-mail de fornecedores.");
      }
    } catch (e) {
      console.error("Failed sharing", e);
    }
  };

  return (
    <div id="menu-planner-view" className="p-4 max-w-7xl mx-auto space-y-6">
      
      {/* Top Title Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-emerald-600" />
            Cardápio Semanal & Planejador Alimentar
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Cadastre receitas, estime ingredientes necessários e dê baixa automática no estoque ao servir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatingMeal(!isCreatingMeal)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Refeição
          </button>
          
          <button
            onClick={() => window.print()}
            className="bg-gray-100 hover:bg-gray-200 border text-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Imprimir Quadro
          </button>
        </div>
      </div>

      {/* Sub Collapsible form: Create Meal menu */}
      {isCreatingMeal && (
        <form onSubmit={handleSubmitMeal} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {editingMealId ? `Editar Refeição ID: ${editingMealId.toUpperCase()}` : 'Inserir Prato & Receita no Calendário'}
            </h3>
            <button
              type="button"
              onClick={handleCancelClick}
              className="text-xs text-red-500 hover:text-red-700 uppercase font-extrabold"
            >
              Cancelar Edição
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-xs font-semibold text-gray-650 font-sans">
            <div className="space-y-1">
              <label>Nome do Prato/Refeição *</label>
              <input
                type="text"
                required
                placeholder="Ex: Risoto de Frango com Queijo e Milho"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Tipo de Cardápio *</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as 'merenda' | 'almoco')}
                className="w-full p-2.5 border rounded-xl font-medium outline-none focus:border-emerald-500 bg-white"
              >
                <option value="merenda">🍎 Merenda (Lanche por Turno)</option>
                <option value="almoco">🍲 Almoço (Refeição Principal)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label>Turno / Período *</label>
              <select
                value={mealTurn}
                onChange={(e) => setMealTurn(e.target.value as 'manha' | 'tarde' | 'noite' | 'integral')}
                className="w-full p-2.5 border rounded-xl font-medium outline-none focus:border-emerald-500 bg-white"
              >
                <option value="manha">☀️ Turno da Manhã</option>
                <option value="tarde">⛅ Turno da Tarde</option>
                <option value="noite">🌙 Turno da Noite</option>
                <option value="integral">🔁 Integral (Uso Geral)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label>Data para Servir *</label>
              <input
                type="date"
                required
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Número Estimado de Alunos *</label>
              <input
                type="number"
                min="10"
                required
                value={studentsCount}
                onChange={(e) => setStudentsCount(parseInt(e.target.value) || 120)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Dinamic ingredients section */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Ingredientes Fornecidos na Receita</span>
              <button
                type="button"
                onClick={handleAddIngredientRow}
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px] px-2.5 py-1 rounded-lg border border-emerald-200 transition flex items-center gap-0.5"
              >
                + Adicionar Ingrediente
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {ingredientsInput.map((row, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-2">
                  
                  {/* Select corresponding stock item dropdown or manually write description details */}
                  <select
                    value={row.matchedProductId || row.productName}
                    onChange={(e) => handleIngredientRowChange(idx, 'productName', e.target.value)}
                    className="w-full sm:flex-1 p-2 bg-white border rounded-xl text-xs outline-none"
                  >
                    <option value="">-- Selecione o Alimento do Estoque --</option>
                    {stockList.map(stk => (
                      <option key={stk.id} value={stk.id}>
                        {stk.name} ({stk.quantity} {stk.unit} disp.)
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-gray-500">Qtd. Aluno:</span>
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={row.quantityPerStudent}
                      onChange={(e) => handleIngredientRowChange(idx, 'quantityPerStudent', parseFloat(e.target.value) || 0.05)}
                      className="w-20 p-2 border rounded-xl text-xs font-bold text-center outline-none"
                    />
                    <span className="text-xs font-bold text-gray-650 w-12 text-left">{row.unit}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveIngredientRow(idx)}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition border border-rose-200"
                    title="Remover linha"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={handleCancelClick}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-250 text-gray-750 rounded-xl text-xs font-bold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-save-new-meal"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-505 text-white rounded-xl text-xs font-bold transition"
            >
              {editingMealId ? 'Atualizar Refeição' : 'Salvar Refeição'}
            </button>
          </div>
        </form>
      )}

      {/* Week Calendar Picker strip */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center space-y-4">
        <span className="text-xs font-extrabold text-gray-500 uppercase tracking-widest font-mono">Quadro de Refeições Escolar</span>
        
        <div className="flex overflow-x-auto w-full gap-2 py-1 justify-between select-none">
          {weekDays.map((day, idx) => {
            const isToday = day.date === '2026-05-29';
            const isSelected = selectedWeekDay === day.date;
            // Filter meals of this date
            const dayMeals = meals.filter(m => m.date === day.date);
            const mealCount = dayMeals.length;
            const hasMerenda = dayMeals.some(m => m.mealType === 'merenda');
            const hasAlmoco = dayMeals.some(m => m.mealType === 'almoco');
            const allServed = mealCount > 0 && dayMeals.every(m => m.status === 'served');

            return (
              <button
                key={idx}
                type="button"
                id={`calendar-picker-${day.date}`}
                onClick={() => setSelectedWeekDay(day.date)}
                className={`py-3 px-2 rounded-2xl flex-1 text-center transition flex flex-col justify-between min-w-[95px] border-2 relative ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-990 shadow-sm shadow-emerald-100'
                    : isToday
                      ? 'border-dashed border-amber-300 bg-amber-50/20 text-gray-700 hover:bg-gray-50'
                      : 'border-transparent bg-slate-50 text-gray-550 hover:bg-slate-100'
                }`}
              >
                <div className="text-[10px] uppercase font-bold tracking-tight block">
                   {day.label.split(' ')[0]}
                </div>
                
                <div className="text-sm font-black font-mono leading-none my-1">
                  {day.label.split('(')[1]?.replace(')', '') || day.date.slice(-5)}
                </div>

                <div className="mt-1 flex flex-col gap-0.5 items-center justify-center">
                  {mealCount > 0 ? (
                    <div className="flex flex-col gap-0.5 w-full items-center">
                      {hasMerenda && (
                        <span className="text-[8px] font-bold px-1 py-0.2 bg-amber-100 text-amber-900 rounded shrink-0 leading-none">🍎 Merenda</span>
                      )}
                      {hasAlmoco && (
                        <span className="text-[8px] font-bold px-1 py-0.2 bg-teal-100 text-teal-900 rounded shrink-0 leading-none">🍲 Almoço</span>
                      )}
                      {allServed && (
                        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-150 px-1 py-0.2 rounded mt-0.5 leading-none">✓ Feito</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[8px] text-gray-400 font-light">Sem prato</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left Column (7): Meal Description & ingredient calculations */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5 font-mono">
                <ChefHat className="w-5 h-5 text-emerald-600 animate-pulse" />
                Refeições Planejadas para esta data ({selectedWeekDay})
              </h3>
              <span className="text-xs bg-emerald-50 text-emerald-850 font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-150">
                {currentDayMeals.length} prato(s) agendado(s)
              </span>
            </div>

            {currentDayMeals.length > 0 ? (
              <div className="space-y-8 divide-y divide-gray-100">
                
                {/* Snack Menu Block */}
                <div className="space-y-4 pt-1 first:pt-0">
                  <div className="flex items-center gap-2 border-l-4 border-amber-500 pl-2.5 bg-amber-50/40 p-2 rounded-r-xl">
                    <span className="text-sm font-black text-amber-950 uppercase tracking-wide flex items-center gap-1.5">
                      🍎 Cardápio da Merenda (Lanches)
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-black px-2 py-0.5 rounded-full">
                      {currentDayMeals.filter(m => m.mealType === 'merenda').length} itens
                    </span>
                  </div>
                  
                  {currentDayMeals.filter(m => m.mealType === 'merenda').length > 0 ? (
                    <div className="space-y-6">
                      {['manha', 'tarde', 'noite', 'integral'].map(turnKey => {
                        const mealsInTurn = currentDayMeals.filter(m => m.mealType === 'merenda' && (m.turn === turnKey || (turnKey === 'manha' && !m.turn)));
                        if (mealsInTurn.length === 0) return null;

                        const turnTitle = turnKey === 'manha' 
                          ? '☀️ Turno da Manhã (Período Matutino)' 
                          : turnKey === 'tarde' 
                            ? '⛅ Turno da Tarde (Período Vespertino)' 
                            : turnKey === 'noite' 
                              ? '🌙 Turno da Noite (Período Noturno)' 
                              : '🔁 Uso Geral / Integral';

                        const turnColor = turnKey === 'manha'
                          ? 'text-amber-900 bg-amber-50 border border-amber-100'
                          : turnKey === 'tarde'
                            ? 'text-sky-900 bg-sky-50 border border-sky-100'
                            : turnKey === 'noite'
                              ? 'text-indigo-900 bg-indigo-50 border border-indigo-100'
                              : 'text-slate-800 bg-slate-50 border border-slate-105';

                        return (
                          <div key={turnKey} className="space-y-3 p-3 bg-gray-50/40 rounded-2xl border border-gray-100">
                            <div className={`p-2 px-3 rounded-xl text-[11px] font-black font-sans uppercase tracking-wider flex items-center justify-between shadow-sm ${turnColor}`}>
                              <span>{turnTitle}</span>
                              <span className="text-[10px] font-extrabold bg-white px-2 py-0.5 rounded-full border">
                                {mealsInTurn.length} {mealsInTurn.length === 1 ? 'receita' : 'receitas'}
                              </span>
                            </div>
                            <div className="space-y-4">
                              {mealsInTurn.map(meal => renderMealCard(meal))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-5 text-center bg-amber-50/10 border border-dashed border-amber-200/50 rounded-2xl text-xs text-amber-800">
                      Nenhuma merenda/lanche agendado para este dia.
                      <button
                        type="button"
                        onClick={() => { setMealType('merenda'); setIsCreatingMeal(true); }}
                        className="block mx-auto mt-2 font-black text-amber-750 underline bg-amber-50 px-2 py-1 rounded border border-amber-200 cursor-pointer"
                      >
                        + Cadastrar Merenda para Hoje
                      </button>
                    </div>
                  )}
                </div>

                {/* Lunch Menu Block */}
                <div className="space-y-4 pt-6">
                  <div className="flex items-center gap-2 border-l-4 border-teal-500 pl-2.5 bg-teal-50/40 p-2 rounded-r-xl">
                    <span className="text-sm font-black text-teal-950 uppercase tracking-wide flex items-center gap-1.5">
                      🍲 Cardápio do Almoço (Refeições Principais)
                    </span>
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-black px-2 py-0.5 rounded-full">
                      {currentDayMeals.filter(m => m.mealType === 'almoco').length} itens
                    </span>
                  </div>
                  
                  {currentDayMeals.filter(m => m.mealType === 'almoco').length > 0 ? (
                    <div className="space-y-4">
                      {currentDayMeals.filter(m => m.mealType === 'almoco').map(meal => renderMealCard(meal))}
                    </div>
                  ) : (
                    <div className="p-5 text-center bg-teal-50/15 border border-dashed border-teal-200/50 rounded-2xl text-xs text-teal-800">
                      Nenhum almoço principal agendado para este dia.
                      <button
                        type="button"
                        onClick={() => { setMealType('almoco'); setIsCreatingMeal(true); }}
                        className="block mx-auto mt-2 font-black text-teal-750 underline bg-teal-50 px-2 py-1 rounded border border-teal-200 cursor-pointer"
                      >
                        + Cadastrar Almoço para Hoje
                      </button>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="p-10 text-center bg-gray-50 border border-dashed text-gray-400 rounded-3xl block text-sm">
                Nenhum prato/menu agendado para o dia selecionado ({selectedWeekDay}).
                <button
                  type="button"
                  onClick={() => setIsCreatingMeal(true)}
                  className="block mx-auto mt-2 text-xs font-extrabold text-emerald-600 bg-white border border-gray-200 px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer"
                >
                  Cadastrar Primeira Refeição do Dia
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Right Column (4): Nutrological Tips & Formulas Guidelines */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border shadow-sm border-gray-150 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase block leading-none">Anotações da Nutricionista</span>
            <h3 className="font-extrabold text-gray-800 text-sm">Diretrizes do cardápio escolar PNAE</h3>
            
            <p className="text-xs text-gray-600 leading-relaxed">
              O Programa Nacional de Alimentação Escolar (PNAE) exige restrições de sódio e açúcares e garante o fornecimento correto de carboidratos, proteínas e legumes semanalmente para os estudantes de ensino básico.
            </p>

            <div className="space-y-2 pt-1 font-medium text-xs">
              <div className="p-2.5 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-100 flex items-start gap-1">
                🧁 <span className="leading-tight">Açúcares artificiais e industrializados devem ser reduzidos a no máximo 1 refeição por semana.</span>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-110 flex items-start gap-2">
                🥬 <span className="leading-tight">Garantir ao menos 2 porções semanais de saladas frescas ou frutas inteiras de hortifrúti.</span>
              </div>
            </div>
            
            <p className="text-[10px] text-gray-400 font-mono mt-1">Contato Nutricionista: dr.juliana@merenda.gov</p>
          </div>
        </div>

      </div>

    </div>
  );
}
