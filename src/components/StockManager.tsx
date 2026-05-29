/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  Download, 
  Printer, 
  TrendingUp, 
  PlusCircle, 
  MinusCircle, 
  Minimize2,
  Trash,
  HelpCircle,
  Sparkles,
  Pencil
} from 'lucide-react';
import { StockItem, Transaction, WasteRecord } from '../types';
import { STOCK_CATEGORIES } from '../data/mockData';

interface StockManagerProps {
  stockList: StockItem[];
  onAddProduct: (item: Omit<StockItem, 'id'>) => void;
  onUpdateQuantity: (id: string, delta: number, source: 'manual' | 'camera') => void;
  onRemoveProduct: (id: string) => void;
  onEditProduct: (item: StockItem) => void;
  transactions: Transaction[];
  wasteRecords: WasteRecord[];
  onAddWasteRecord: (waste: Omit<WasteRecord, 'id'>) => void;
  currentUserRole: string;
}

export default function StockManager({
  stockList,
  onAddProduct,
  onUpdateQuantity,
  onRemoveProduct,
  onEditProduct,
  transactions,
  wasteRecords,
  onAddWasteRecord,
  currentUserRole
}: StockManagerProps) {

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<'all' | 'low' | 'expired' | 'near_expiry'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'expiryDate'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Form states to register a new product
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdCategory, setNewProdCategory] = useState(STOCK_CATEGORIES[0] || 'Grãos e Cereais');
  const [newProdQty, setNewProdQty] = useState<number>(0);
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdExpiry, setNewProdExpiry] = useState('');
  const [newProdMinQty, setNewProdMinQty] = useState<number>(10);
  const [newProdSupplier, setNewProdSupplier] = useState('');
  const [newProdLocation, setNewProdLocation] = useState('');

  // Quick Adjustment State
  const [selectedAdjustItem, setSelectedAdjustItem] = useState<StockItem | null>(null);
  const [adjustVal, setAdjustVal] = useState<number>(5);

  // Waste registry state
  const [isAddingWaste, setIsAddingWaste] = useState(false);
  const [wasteDate, setWasteDate] = useState('2026-05-29');
  const [wasteMealName, setWasteMealName] = useState('Almoço Diário');
  const [wasteRegistered, setWasteRegistered] = useState<number>(120);
  const [wasteServed, setWasteServed] = useState<number>(115);
  const [wasteQtyKg, setWasteQtyKg] = useState<number>(1.2);
  const [wasteReason, setWasteReason] = useState('Resto nos pratos dos alunos');

  // Filter application
  const todayStr = "2026-05-29";

  const processedList = useMemo(() => {
    let list = [...stockList];

    // Search query
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.barcode.includes(q) || 
        item.supplier.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== '') {
      list = list.filter(item => item.category === selectedCategory);
    }

    // Status filter
    if (selectedFilterStatus === 'low') {
      list = list.filter(item => item.quantity <= item.minQuantity);
    } else if (selectedFilterStatus === 'expired') {
      list = list.filter(item => new Date(item.expiryDate) < new Date(todayStr));
    } else if (selectedFilterStatus === 'near_expiry') {
      list = list.filter(item => {
        const expiry = new Date(item.expiryDate);
        const today = new Date(todayStr);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 10;
      });
    }

    // Sorting
    list.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [stockList, searchTerm, selectedCategory, selectedFilterStatus, sortBy, sortOrder]);

  const toggleSort = (field: 'name' | 'quantity' | 'expiryDate') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Start Product Edit
  const handleStartEdit = (item: StockItem) => {
    setEditingProductId(item.id);
    setNewProdName(item.name);
    setNewProdBarcode(item.barcode);
    setNewProdCategory(item.category);
    setNewProdQty(item.quantity);
    setNewProdUnit(item.unit);
    setNewProdExpiry(item.expiryDate);
    setNewProdMinQty(item.minQuantity);
    setNewProdSupplier(item.supplier);
    setNewProdLocation(item.storageLocation);
    setIsAddingNew(true);
    
    // Scroll to form or container
    const formEl = document.getElementById('stock-manager-view');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCancelProductEdit = () => {
    setNewProdName('');
    setNewProdBarcode('');
    setNewProdQty(0);
    setNewProdExpiry('');
    setNewProdSupplier('');
    setNewProdLocation('');
    setEditingProductId(null);
    setIsAddingNew(false);
  };

  // Submit product registration
  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdExpiry) {
      alert("Por favor, preencha o Nome e a Data de Validade.");
      return;
    }

    if (editingProductId) {
      onEditProduct({
        id: editingProductId,
        name: newProdName,
        barcode: newProdBarcode || `789${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        category: newProdCategory,
        quantity: Math.max(0, newProdQty),
        unit: newProdUnit,
        expiryDate: newProdExpiry,
        minQuantity: Math.max(1, newProdMinQty),
        supplier: newProdSupplier || "Fornecedor Escolar Padrão",
        storageLocation: newProdLocation || "Despensa Seca Geral"
      });
      alert("Produto atualizado com sucesso!");
    } else {
      onAddProduct({
        name: newProdName,
        barcode: newProdBarcode || `789${Math.floor(1000000000 + Math.random() * 9000000000)}`, // Auto barcode if empty
        category: newProdCategory,
        quantity: Math.max(0, newProdQty),
        unit: newProdUnit,
        expiryDate: newProdExpiry,
        minQuantity: Math.max(1, newProdMinQty),
        supplier: newProdSupplier || "Fornecedor Escolar Padrão",
        storageLocation: newProdLocation || "Despensa Seca Geral"
      });
      alert("Produto cadastrado com sucesso!");
    }

    // Reset fields
    setNewProdName('');
    setNewProdBarcode('');
    setNewProdQty(0);
    setNewProdExpiry('');
    setNewProdSupplier('');
    setNewProdLocation('');
    setEditingProductId(null);
    setIsAddingNew(false);
  };

  // Submit waste log
  const handleSubmitWaste = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWasteRecord({
      date: wasteDate,
      mealName: wasteMealName,
      studentsRegistered: wasteRegistered,
      studentsServed: wasteServed,
      wasteQuantityKg: wasteQtyKg,
      reason: wasteReason
    });
    setIsAddingWaste(false);
    alert("Registro de Desperdício salvo com sucesso!");
  };

  const handleApplyQuickAdjustment = (type: 'entrada' | 'saida') => {
    if (!selectedAdjustItem) return;
    const delta = type === 'entrada' ? adjustVal : -adjustVal;
    onUpdateQuantity(selectedAdjustItem.id, delta, 'manual');
    setSelectedAdjustItem(null);
  };

  // Export to CSV Function
  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Nome,Codigo de Barras,Categoria,Quantidade,Unidade,Validade,Estoque Minimo,Fornecedor,Setor de Armazenamento\r\n";
      
      stockList.forEach(item => {
        const row = [
          item.id,
          `"${item.name}"`,
          `"${item.barcode}"`,
          `"${item.category}"`,
          item.quantity,
          `"${item.unit}"`,
          item.expiryDate,
          item.minQuantity,
          `"${item.supplier}"`,
          `"${item.storageLocation}"`
        ].join(",");
        csvContent += row + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Relatorio_Estoque_Merenda.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("CSV Export failed", e);
    }
  };

  // Print Stock Function
  const handlePrintStock = () => {
    window.print();
  };

  return (
    <div id="stock-manager-view" className="p-4 max-w-7xl mx-auto space-y-6">
      
      {/* Top Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            Controle de Estoque de Alimentos
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gerencie o estoque de merenda, configure lotes crítcos e pesquise produtos rapidamente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Produto
          </button>
          
          <button
            onClick={() => setIsAddingWaste(!isAddingWaste)}
            className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95"
          >
            <TrendingUp className="w-4 h-4" />
            Registrar Desperdício
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-gray-100 border hover:bg-gray-200 text-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            title="Download Planilha Excel"
          >
            <Download className="w-4 h-4" />
            Excel
          </button>

          <button
            onClick={handlePrintStock}
            className="bg-gray-100 border hover:bg-gray-200 text-gray-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5"
            title="Imprimir Relatório"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Sub collapsible panel: Create Product Form */}
      {isAddingNew && (
        <form onSubmit={handleSubmitProduct} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {editingProductId ? `Editar Alimento ID: ${editingProductId.toUpperCase()}` : 'Preencha os Campos do Novo Alimento'}
            </h3>
            <button 
              type="button" 
              onClick={handleCancelProductEdit}
              className="text-xs text-red-500 hover:text-red-700 uppercase font-extrabold"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-gray-600">
            <div className="space-y-1">
              <label>Nome do Insumo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Arroz Tipo 1 5kg"
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Código de Barras (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: 7891020304012"
                value={newProdBarcode}
                onChange={(e) => setNewProdBarcode(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Categoria</label>
              <select
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal bg-white outline-none focus:border-emerald-500"
              >
                {STOCK_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label>Quantidade Inicial</label>
              <input
                type="number"
                min="0"
                value={newProdQty}
                onChange={(e) => setNewProdQty(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Unidade de Medida</label>
              <select
                value={newProdUnit}
                onChange={(e) => setNewProdUnit(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal bg-white outline-none focus:border-emerald-500"
              >
                <option value="kg">Quilogramas (kg)</option>
                <option value="litros">Litros (L)</option>
                <option value="unidades">Unidades (un)</option>
                <option value="caixas">Caixas (cx)</option>
                <option value="sachês">Sachês (sc)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label>Data de Validade *</label>
              <input
                type="date"
                required
                value={newProdExpiry}
                onChange={(e) => setNewProdExpiry(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Quantidade Limiar (Estoque Mínimo)</label>
              <input
                type="number"
                min="1"
                value={newProdMinQty}
                onChange={(e) => setNewProdMinQty(parseInt(e.target.value) || 10)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Fornecedor</label>
              <input
                type="text"
                placeholder="Ex: Companhia de Alimentos Sul"
                value={newProdSupplier}
                onChange={(e) => setNewProdSupplier(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Local de Armazenamento</label>
              <input
                type="text"
                placeholder="Ex: Despensa Seca - Setor A"
                value={newProdLocation}
                onChange={(e) => setNewProdLocation(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={handleCancelProductEdit}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-250 text-gray-750 rounded-xl text-xs font-bold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-save-new-product"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-505 text-white rounded-xl text-xs font-bold transition"
            >
              {editingProductId ? 'Atualizar Alimento' : 'Salvar Alimento'}
            </button>
          </div>
        </form>
      )}

      {/* Sub collapsible panel: Register Waste Log */}
      {isAddingWaste && (
        <form onSubmit={handleSubmitWaste} className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 space-y-4 animate-fade-in text-left">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              Lançar Pesagem de Desperdício (Descarte de Merenda)
            </h3>
            <button 
              type="button" 
              onClick={() => setIsAddingWaste(false)}
              className="text-xs text-gray-400 hover:text-gray-600 uppercase font-semibold"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-semibold text-gray-600">
            <div className="space-y-1">
              <label>Data do Controle</label>
              <input
                type="date"
                required
                value={wasteDate}
                onChange={(e) => setWasteDate(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label>Nome do Prato/Refeição</label>
              <input
                type="text"
                required
                placeholder="Ex: Arroz, feijão e frango desfiado"
                value={wasteMealName}
                onChange={(e) => setWasteMealName(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label>Quantidade Desperdiçada (kg)</label>
              <input
                type="number"
                step="0.01"
                min="0.05"
                required
                value={wasteQtyKg}
                onChange={(e) => setWasteQtyKg(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label>Estudantes Matriculados Previstos</label>
              <input
                type="number"
                min="1"
                value={wasteRegistered}
                onChange={(e) => setWasteRegistered(parseInt(e.target.value) || 120)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label>Alunos que Efetivamente Comeram</label>
              <input
                type="number"
                min="1"
                value={wasteServed}
                onChange={(e) => setWasteServed(parseInt(e.target.value) || 115)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label>Justificativa / Causa Provável</label>
              <input
                type="text"
                placeholder="Ex: Alunos rejeitaram salada rabanete"
                value={wasteReason}
                onChange={(e) => setWasteReason(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsAddingWaste(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-250 text-gray-750 rounded-xl text-xs font-bold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-save-waste"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-505 text-white rounded-xl text-xs font-bold transition"
            >
              Salvar Lançamento
            </button>
          </div>
        </form>
      )}

      {/* Quick Manual Quantity Adjustment overlay helper */}
      {selectedAdjustItem && (
        <div className="bg-slate-50 border border-emerald-150 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="text-left">
            <span className="text-[10px] font-bold text-emerald-600 block uppercase">AJUSTAR ESTOQUE RÁPIDO</span>
            <strong className="text-sm font-bold text-gray-800">{selectedAdjustItem.name}</strong>
            <p className="text-xs text-gray-500">Unidade: {selectedAdjustItem.unit} | Estoque atual: {selectedAdjustItem.quantity}</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-600 font-medium">Quantidade:</span>
              <input
                type="number"
                min="1"
                value={adjustVal}
                onChange={(e) => setAdjustVal(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-16 bg-white border border-gray-300 rounded-lg p-1 text-center font-bold text-sm"
              />
              <span className="text-xs text-gray-500">{selectedAdjustItem.unit}</span>
            </div>

            <div className="flex gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => handleApplyQuickAdjustment('saida')}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg border border-rose-200 transition flex items-center gap-1"
              >
                <MinusCircle className="w-3.5 h-3.5" />
                Baixar (-)
              </button>
              <button
                type="button"
                onClick={() => handleApplyQuickAdjustment('entrada')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Adicionar (+)
              </button>
              <button
                type="button"
                onClick={() => setSelectedAdjustItem(null)}
                className="p-1.5 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-600 transition"
                title="Minimizar"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Searches, Sorting and Category Toggles */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, código ou fornecedor..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-700"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-8 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-white outline-none focus:border-emerald-500"
              >
                <option value="">Todas Categorias</option>
                {STOCK_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3.5" />
            </div>

            {/* Expire / Alert Status Switchers */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-gray-200 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${selectedFilterStatus === 'all' ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterStatus('low')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${selectedFilterStatus === 'low' ? 'bg-white text-amber-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Baixo Estoque
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterStatus('expired')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${selectedFilterStatus === 'expired' ? 'bg-white text-rose-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Validade Vencida
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilterStatus('near_expiry')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${selectedFilterStatus === 'near_expiry' ? 'bg-white text-indigo-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Vence nos Próx. 10d
              </button>
            </div>
          </div>
        </div>

        {/* Dense Stock Grid Table */}
        <div className="overflow-x-auto border border-gray-150 rounded-2xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-150 text-xs font-extrabold text-slate-700 uppercase tracking-widest font-mono select-none">
                <th onClick={() => toggleSort('name')} className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition">
                  <div className="flex items-center gap-1">
                    Nome / Descrição do Alimento
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Código EAN</th>
                <th className="py-3 px-4">Categoria</th>
                <th onClick={() => toggleSort('quantity')} className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition">
                  <div className="flex items-center gap-1">
                    Estoque Atual
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>
                <th onClick={() => toggleSort('expiryDate')} className="py-3 px-4 cursor-pointer hover:bg-gray-100 transition">
                  <div className="flex items-center gap-1">
                    Data de Validade
                    <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Fornecedor / Armário</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {processedList.length > 0 ? (
                processedList.map(item => {
                  const isLow = item.quantity <= item.minQuantity;
                  const isExpired = new Date(item.expiryDate) < new Date(todayStr);
                  
                  // Calculate warning if expires within 10 days
                  const dExp = new Date(item.expiryDate);
                  const dToday = new Date(todayStr);
                  const dDiff = Math.ceil((dExp.getTime() - dToday.getTime()) / (1000 * 300 * 288));
                  const isNearExpiry = dDiff >= 0 && dDiff <= 10;

                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/55 transition ${
                        isExpired 
                          ? 'bg-rose-50/15' 
                          : isNearExpiry 
                            ? 'bg-orange-50/15'
                            : isLow 
                              ? 'bg-amber-50/15' 
                              : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        <div className="flex flex-col">
                          <span>{item.name}</span>
                          {isExpired && (
                            <span className="text-[10px] text-rose-600 font-extrabold uppercase mt-0.5 max-w-max bg-rose-100/65 px-1.5 rounded-full">
                              ❌ VALIDADE VENCIDA
                            </span>
                          )}
                          {isNearExpiry && !isExpired && (
                            <span className="text-[10px] text-amber-700 font-bold uppercase mt-0.5 max-w-max bg-amber-100/65 px-1.5 rounded-full">
                              ⚠️ VENCE EM BREVE ({dDiff} dias)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-mono text-gray-500">
                        {item.barcode}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <strong className={`font-mono text-base ${isLow ? 'text-amber-750 font-black' : 'text-gray-800'}`}>
                            {item.quantity}
                          </strong>
                          <span className="text-xs text-gray-500 font-medium">{item.unit}</span>
                          {isLow && (
                            <span className="bg-amber-100 text-amber-800 p-0.5 rounded" title="Estoque abaixo do limite mínimo!">
                              ⚠️
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {item.expiryDate}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        <div className="font-semibold">{item.supplier}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{item.storageLocation}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5 items-center">
                          <button
                            type="button"
                            id={`btn-adjust-${item.id}`}
                            onClick={() => { setSelectedAdjustItem(item); setAdjustVal(5); }}
                            className="p-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-150 rounded-lg text-xs font-bold transition"
                            title="Ajuste rápido"
                          >
                            Ajustar ±
                          </button>
                          
                          {currentUserRole === 'Admin' ? (
                            <>
                              <button
                                type="button"
                                id={`btn-edit-${item.id}`}
                                onClick={() => handleStartEdit(item)}
                                className="p-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 rounded-lg transition"
                                title="Editar produto"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                id={`btn-delete-${item.id}`}
                                onClick={() => onRemoveProduct(item.id)}
                                className="p-1.5 bg-rose-50 border border-rose-250 hover:bg-rose-100 text-rose-700 rounded-lg transition"
                                title="Excluir produto"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                disabled
                                className="p-1.5 bg-gray-100 border text-gray-300 rounded-lg cursor-not-allowed opacity-60"
                                title="Apenas Administradores (Regina) podem editar produtos do estoque"
                              >
                                <Pencil className="w-3.5 h-3.5 opacity-55" />
                              </button>
                              <button
                                type="button"
                                disabled
                                className="p-1.5 bg-gray-100 border text-gray-300 rounded-lg cursor-not-allowed opacity-60"
                                title="Apenas Administradores (Regina) podem remover itens de estoque"
                              >
                                <Trash className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    Nenhum produto cadastrado corresponde aos critérios de pesquisa e filtro ativos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
