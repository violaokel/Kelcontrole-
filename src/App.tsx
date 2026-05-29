/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Package, 
  ChefHat, 
  Scan, 
  Sparkles, 
  Gift, 
  Lock, 
  Sun, 
  Moon, 
  RefreshCcw, 
  Menu, 
  X,
  Heart,
  AlertTriangle,
  Trash2
} from 'lucide-react';

import { 
  StockItem, 
  Transaction, 
  MenuMeal, 
  ChecklistItem, 
  CleaningLog, 
  BirthdayEmployee, 
  UserRole, 
  SystemLog, 
  WasteRecord 
} from './types';

import { 
  INITIAL_STOCK, 
  INITIAL_MEALS, 
  INITIAL_CHECKLIST, 
  INITIAL_EMPLOYEES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_WASTE, 
  INITIAL_SYSTEM_LOGS 
} from './data/mockData';

// Subcomponents imports
import Dashboard from './components/Dashboard';
import StockManager from './components/StockManager';
import MenuPlanner from './components/MenuPlanner';
import Scanner from './components/Scanner';
import CleaningTracker from './components/CleaningTracker';
import BirthdayCalendar from './components/BirthdayCalendar';
import AuthAndSecurity from './components/AuthAndSecurity';

export default function App() {
  
  // Tab Routing
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Core offline database states
  const [stockList, setStockList] = useState<StockItem[]>(() => {
    const local = localStorage.getItem('merenda_stock');
    return local ? JSON.parse(local) : INITIAL_STOCK;
  });

  const [meals, setMeals] = useState<MenuMeal[]>(() => {
    const local = localStorage.getItem('merenda_meals');
    return local ? JSON.parse(local) : INITIAL_MEALS;
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const local = localStorage.getItem('merenda_checklist');
    return local ? JSON.parse(local) : INITIAL_CHECKLIST;
  });

  const [employees, setEmployees] = useState<BirthdayEmployee[]>(() => {
    const local = localStorage.getItem('merenda_employees');
    return local ? JSON.parse(local) : INITIAL_EMPLOYEES;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const local = localStorage.getItem('merenda_transactions');
    return local ? JSON.parse(local) : INITIAL_TRANSACTIONS;
  });

  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() => {
    const local = localStorage.getItem('merenda_waste');
    return local ? JSON.parse(local) : INITIAL_WASTE;
  });

  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(() => {
    const local = localStorage.getItem('merenda_logs');
    return local ? JSON.parse(local) : INITIAL_SYSTEM_LOGS;
  });

  const [cleaningHistory, setCleaningHistory] = useState<CleaningLog[]>(() => {
    const local = localStorage.getItem('merenda_cleaning_history');
    return local ? JSON.parse(local) : [];
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const local = localStorage.getItem('merenda_role');
    return (local as UserRole) || 'Admin';
  });

  // Custom confirmation modal state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'product' | 'meal' | null;
    id: string;
    name: string;
    info: string;
  }>({
    isOpen: false,
    type: null,
    id: '',
    name: '',
    info: ''
  });

  const [hasAcknowledgedDelete, setHasAcknowledgedDelete] = useState<boolean>(false);

  // Watch dark mode changes and set html attributes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('merenda_stock', JSON.stringify(stockList));
  }, [stockList]);

  useEffect(() => {
    localStorage.setItem('merenda_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('merenda_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem('merenda_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('merenda_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('merenda_waste', JSON.stringify(wasteRecords));
  }, [wasteRecords]);

  useEffect(() => {
    localStorage.setItem('merenda_logs', JSON.stringify(systemLogs));
  }, [systemLogs]);

  useEffect(() => {
    localStorage.setItem('merenda_cleaning_history', JSON.stringify(cleaningHistory));
  }, [cleaningHistory]);

  useEffect(() => {
    localStorage.setItem('merenda_role', currentRole);
  }, [currentRole]);

  // Helper inside logging
  const createLog = (action: string, details: string) => {
    const nameStr = currentRole === 'Admin' ? 'Regina' : currentRole === 'Cozinheira' ? 'Dona Maria' : currentRole === 'Estoquista' ? 'Carlos' : 'Ana Paula';
    const newLog: SystemLog = {
      id: `log-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      username: `${nameStr} (${currentRole})`,
      role: currentRole,
      action,
      details
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  // 1. Stock Operations
  const handleAddProduct = (item: Omit<StockItem, 'id'>) => {
    const newId = `prod-${stockList.length + 1}`;
    const newProduct: StockItem = { ...item, id: newId };
    setStockList(prev => [...prev, newProduct]);
    
    // Log
    createLog("Cadastro de Produto", `Alimento ${item.name} cadastrado com estoque inicial de ${item.quantity} ${item.unit}.`);
    
    if (item.quantity > 0) {
      const newTx: Transaction = {
        id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'entrada',
        productId: newId,
        productName: item.name,
        quantity: item.quantity,
        unit: item.unit,
        date: new Date().toISOString(),
        user: currentRole,
        source: 'manual'
      };
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const handleUpdateQuantity = (id: string, delta: number, source: 'manual' | 'camera') => {
    setStockList(prev => prev.map(item => {
      if (item.id === id) {
        const updatedQty = Math.max(0, item.quantity + delta);
        
        // Log movement
        const newTx: Transaction = {
          id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
          type: delta > 0 ? 'entrada' : 'saida',
          productId: id,
          productName: item.name,
          quantity: Math.abs(delta),
          unit: item.unit,
          date: new Date().toISOString(),
          user: currentRole,
          source
        };
        setTransactions(txs => [newTx, ...txs]);
        
        createLog(
          delta > 0 ? "Ajuste Entrada" : "Ajuste Baixa", 
          `Registrado ${delta > 0 ? 'acrúscimo' : 'decremento'} de ${Math.abs(delta)} ${item.unit} do alimento ${item.name}. Novo estoque: ${updatedQty} ${item.unit}`
        );

        return { ...item, quantity: updatedQty };
      }
      return item;
    }));
  };

  const handleRemoveProduct = (id: string) => {
    if (currentRole !== 'Admin') {
      alert("Acesso Negado: Apenas o perfil Administrador (Regina) tem permissão de excluir produtos permanentemente do estoque.");
      return;
    }

    const item = stockList.find(i => i.id === id);
    if (!item) return;

    setDeleteConfirmation({
      isOpen: true,
      type: 'product',
      id,
      name: item.name,
      info: `Código de Barras: ${item.barcode} | Categoria: ${item.category} | Quantidade Atual: ${item.quantity} ${item.unit}`
    });
  };

  const handleEditProduct = (updatedProduct: StockItem) => {
    if (currentRole !== 'Admin') {
      alert("Acesso Negado: Apenas o perfil Administrador (Regina) tem permissão de editar produtos do estoque.");
      return;
    }

    setStockList(prev => prev.map(item => item.id === updatedProduct.id ? updatedProduct : item));
    createLog("Edição de Produto", `Produto ${updatedProduct.name} de ID ${updatedProduct.id} foi modificado.`);
  };

  // 2. Meal Menu Operations
  const handleAddMeal = (meal: Omit<MenuMeal, 'id'>) => {
    const newId = `meal-${meals.length + Math.floor(1000 + Math.random() * 9000)}`;
    const newMeal: MenuMeal = { ...meal, id: newId };
    setMeals(prev => [...prev, newMeal]);
    createLog("Agenda de Refeição", `Planejado prato "${meal.mealName}" para a data de ${meal.date} para atender ${meal.studentsCount} alunos.`);
  };

  const handleRemoveMeal = (id: string) => {
    if (currentRole !== 'Admin') {
      alert("Acesso Negado: Apenas o perfil Administrador (Regina) tem permissão de remover refeições.");
      return;
    }

    const meal = meals.find(m => m.id === id);
    if (!meal) return;

    setDeleteConfirmation({
      isOpen: true,
      type: 'meal',
      id,
      name: meal.mealName,
      info: `Data Planejada: ${meal.date} | Turno: ${meal.turn || 'Não informado'} | Alunos previstos: ${meal.studentsCount}`
    });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({
      isOpen: false,
      type: null,
      id: '',
      name: '',
      info: ''
    });
    setHasAcknowledgedDelete(false);
  };

  const handleConfirmDelete = () => {
    const { type, id, name } = deleteConfirmation;
    if (!type || !id) return;

    if (type === 'product') {
      setStockList(prev => prev.filter(p => p.id !== id));
      createLog("Exclusão de Produto", `Excluído produto ${name} de ID ${id} do painel de controle.`);
    } else if (type === 'meal') {
      setMeals(prev => prev.filter(m => m.id !== id));
      createLog("Cancelamento de Refeição", `Refeição planejada "${name}" foi cancelada do calendário.`);
    }

    setDeleteConfirmation({
      isOpen: false,
      type: null,
      id: '',
      name: '',
      info: ''
    });
    setHasAcknowledgedDelete(false);
  };

  const handleEditMeal = (updatedMeal: MenuMeal) => {
    if (currentRole !== 'Admin') {
      alert("Acesso Negado: Apenas o perfil Administrador (Regina) tem permissão de editar refeições.");
      return;
    }
    setMeals(prev => prev.map(m => m.id === updatedMeal.id ? updatedMeal : m));
    createLog("Edição de Refeição", `Refeição "${updatedMeal.mealName}" para o dia ${updatedMeal.date} foi modificada.`);
  };

  // AUTOMATIC FOOD STOCK REDUCTION LOGIC!
  const handleServeMeal = (mealId: string) => {
    const mealIndex = meals.findIndex(m => m.id === mealId);
    if (mealIndex === -1) return;
    const meal = meals[mealIndex];
    if (meal.status === 'served') return;

    // Process ingredient stock reduction
    const updatedStock = [...stockList];
    const newTxs: Transaction[] = [];

    meal.ingredients.forEach(ing => {
      const requiredQty = ing.quantityPerStudent * meal.studentsCount;
      
      // Match item by target matchedProductId or find matches in stocks list
      const indexInStock = updatedStock.findIndex(stk => 
        stk.id === ing.matchedProductId || 
        stk.name.toLowerCase().includes(ing.productName.toLowerCase())
      );

      if (indexInStock !== -1) {
        const item = updatedStock[indexInStock];
        updatedStock[indexInStock] = {
          ...item,
          quantity: Math.max(0, parseFloat((item.quantity - requiredQty).toFixed(2)))
        };

        // Create transaction logs
        const newTx: Transaction = {
          id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
          type: 'saida',
          productId: item.id,
          productName: item.name,
          quantity: parseFloat(requiredQty.toFixed(2)),
          unit: item.unit,
          date: new Date().toISOString(),
          user: currentRole,
          source: 'cardapio'
        };
        newTxs.push(newTx);
      }
    });

    // Save states
    setStockList(updatedStock);
    setTransactions(prev => [...newTxs, ...prev]);
    
    // Update meal served status
    const updatedMeals = [...meals];
    updatedMeals[mealIndex] = {
      ...meal,
      status: 'served',
      servedAt: new Date().toISOString()
    };
    setMeals(updatedMeals);

    createLog(
      "Consumo Automático", 
      `Refeição "${meal.mealName}" distribuída. Estoque reduzido para os ingredientes: ${meal.ingredients.map(i => `${i.productName} (-${(i.quantityPerStudent * meal.studentsCount).toFixed(1)}${i.unit})`).join(', ')}.`
    );
  };

  // 3. Hygiene tracker operations
  const handleToggleHygieneTask = (id: string, responsible: string) => {
    setChecklist(prev => prev.map(task => {
      if (task.id === id) {
        const now = new Date();
        const hourStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        createLog(
          task.completed ? "Desmarcar Limpeza" : "Concluir Limpeza", 
          `Tarefa [${task.task}] marcada como ${task.completed ? 'pendente' : 'realizada'} por ${responsible} às ${hourStr}.`
        );

        return {
          ...task,
          completed: !task.completed,
          responsible: responsible || task.responsible,
          completedTime: !task.completed ? hourStr : undefined
        };
      }
      return task;
    }));
  };

  const handleAddHygieneTask = (task: string, defaultResp: string) => {
    const newId = `chk-${checklist.length + 1}`;
    const newTask: ChecklistItem = {
      id: newId,
      task,
      responsible: defaultResp,
      completed: false
    };
    setChecklist(prev => [...prev, newTask]);
    createLog("Adição de Tarefa Higiene", `Adicionada tarefa "${task}" sob responsabilidade de ${defaultResp}.`);
  };

  const handleRemoveHygieneTask = (id: string) => {
    const task = checklist.find(t => t.id === id);
    if (!task) return;
    setChecklist(prev => prev.filter(t => t.id !== id));
    createLog("Exclusão de Tarefa Higiene", `Excluída tarefa "${task.task}" do roterio checklist diário.`);
  };

  const handleSaveDayLog = () => {
    const newLog: CleaningLog = {
      id: `cleaning-${cleaningHistory.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      tasks: [...checklist],
      finishedBy: currentRole
    };
    setCleaningHistory(prev => [newLog, ...prev]);
    
    // Reset all checkboxes for the new day
    setChecklist(prev => prev.map(t => ({ ...t, completed: false, completedTime: undefined })));
    createLog("Fechamento de Lote Higiene", "Checklist diário de limpeza fechado e reiniciado para nova jornada.");
  };

  // 4. Employee birthdays operations
  const handleAddEmployee = (emp: Omit<BirthdayEmployee, 'id'>) => {
    const newId = `emp-${employees.length + 1}`;
    setEmployees(prev => [...prev, { ...emp, id: newId }]);
    createLog("Cadastro de Funcionário", `Cadastrado novo funcionário ${emp.name} (${emp.role}) para acompanhamento.`);
  };

  const handleRemoveEmployee = (id: string) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    setEmployees(prev => prev.filter(e => e.id !== id));
    createLog("Exclusão de Funcionário", `Excluídos dados cadastrais de ${emp.name} do sistema.`);
  };

  // 5. Database Backup overrides
  const handleRestoreBackup = (backupData: any) => {
    if (backupData.stockList) setStockList(backupData.stockList);
    if (backupData.meals) setMeals(backupData.meals);
    if (backupData.checklist) setChecklist(backupData.checklist);
    if (backupData.employees) setEmployees(backupData.employees);
    if (backupData.transactions) setTransactions(backupData.transactions);
    if (backupData.wasteRecords) setWasteRecords(backupData.wasteRecords);
    if (backupData.systemLogs) setSystemLogs(backupData.systemLogs);
    if (backupData.cleaningHistory) setCleaningHistory(backupData.cleaningHistory);

    createLog("Restauração do Banco", "Restauração física de banco de dados completa efetuada com sucesso através de upload JSON.");
  };

  const handleResetToDefaults = () => {
    if (confirm("Deseja redefinir os dados para os valores originais de demonstração comercial escolar? Isso redefinirá estoques e tarefas.")) {
      setStockList(INITIAL_STOCK);
      setMeals(INITIAL_MEALS);
      setChecklist(INITIAL_CHECKLIST);
      setEmployees(INITIAL_EMPLOYEES);
      setTransactions(INITIAL_TRANSACTIONS);
      setWasteRecords(INITIAL_WASTE);
      setSystemLogs(INITIAL_SYSTEM_LOGS);
      setCleaningHistory([]);
      createLog("Restauração de Fábrica", "Todos os dados foram redefinidos para os valores padrões de demonstração da merenda.");
    }
  };

  // Formulate data structure for backup trigger
  const compiledDataJson = {
    stockList,
    meals,
    checklist,
    employees,
    transactions,
    wasteRecords,
    systemLogs,
    cleaningHistory
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 transition-colors duration-305 flex flex-col font-sans`}>
      
      {/* Top Header navbar banner */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-150 shadow-sm px-6 py-4 flex items-center justify-between">
        
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <span className="text-3xl bg-emerald-650 text-white p-1.5 rounded-2xl shadow shadow-emerald-800/20 group-hover:scale-105 transition">🍎</span>
          <div className="text-left">
            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-none group-hover:text-emerald-700 transition">Merenda Escolar</h1>
            <span className="text-[10px] text-gray-400 font-mono font-extrabold uppercase mt-1 tracking-wider block">Sistema de Controle de Estoque</span>
          </div>
        </div>

        {/* Navigation tabs for Desktop screens */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-slate-50'}`}
          >
            <Home className="w-4 h-4" />
            Tela Inicial
          </button>
          
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === 'stock' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-slate-50'}`}
          >
            <Package className="w-4 h-4" />
            Controle de Estoque
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === 'menu' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-slate-50'}`}
          >
            <ChefHat className="w-4 h-4" />
            Cardápio Escolar
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === 'scanner' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-slate-50'}`}
          >
            <Scan className="w-4 h-4" />
            Leitor de Câmera (EAN)
          </button>

          <button
            onClick={() => setActiveTab('cleaning')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === 'cleaning' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-slate-50'}`}
          >
            <Sparkles className="w-4 h-4" />
            Controle de Limpeza
          </button>

          <button
            onClick={() => setActiveTab('birthdays')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === 'birthdays' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-slate-50'}`}
          >
            <Gift className="w-4 h-4" />
            Aniversariantes
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === 'security' ? 'bg-emerald-600 text-white shadow' : 'text-gray-600 hover:bg-slate-50'}`}
          >
            <Lock className="w-4 h-4" />
            Perfis & Logs
          </button>
        </nav>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-2">
          
          <span className="hidden sm:inline-block bg-slate-100 font-mono text-[10px] font-bold text-gray-500 border border-gray-250 px-2 py-1.5 rounded-xl">
             Modo: Local Offline
          </span>

          <button
            onClick={handleResetToDefaults}
            className="p-2 rounded-xl text-gray-500 hover:text-emerald-700 bg-slate-50 hover:bg-slate-100 border border-gray-200 transition"
            title="Redefinir Banco de Dados Padrão"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>

          {/* Trigger display side menu on tablet */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border flex lg:hidden text-gray-600 hover:bg-slate-50 transition"
            title="Abrir Menu de Guias"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Sub menu drawers for Mobile and Tablet layout switches */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-200 w-full flex flex-col p-4 space-y-1 block md:grid md:grid-cols-2 md:gap-2 text-left z-30"
          >
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-gray-600'}`}
            >
              <Home className="w-4 h-4 text-emerald-600" />
              Painel Geral Escolar
            </button>
            <button
              onClick={() => { setActiveTab('stock'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'stock' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-gray-600'}`}
            >
              <Package className="w-4 h-4 text-emerald-600" />
              Controle de Estoque
            </button>
            <button
              onClick={() => { setActiveTab('menu'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'menu' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-gray-600'}`}
            >
              <ChefHat className="w-4 h-4 text-emerald-600" />
              Cardápio Merenda
            </button>
            <button
              onClick={() => { setActiveTab('scanner'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'scanner' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-gray-600'}`}
            >
              <Scan className="w-4 h-4 text-emerald-600" />
              Leitor Código Câmera
            </button>
            <button
              onClick={() => { setActiveTab('cleaning'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'cleaning' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-gray-600'}`}
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Controle de Limpeza
            </button>
            <button
              onClick={() => { setActiveTab('birthdays'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'birthdays' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-gray-600'}`}
            >
              <Gift className="w-4 h-4 text-emerald-600" />
              Aniversariantes
            </button>
            <button
              onClick={() => { setActiveTab('security'); setMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-xs font-bold transition flex items-center gap-2 ${activeTab === 'security' ? 'bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-gray-600'}`}
            >
              <Lock className="w-4 h-4 text-emerald-600" />
              Perfis & Logs Auditoria
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Viewport routing */}
      <main className="flex-1 pb-24 lg:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard
                stockList={stockList}
                meals={meals}
                cleaningChecklist={checklist}
                birthdays={employees}
                transactions={transactions}
                wasteRecords={wasteRecords}
                onQuickServe={handleServeMeal}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                currentUserRole={currentRole}
              />
            )}

            {activeTab === 'stock' && (
              <StockManager
                stockList={stockList}
                onAddProduct={handleAddProduct}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveProduct={handleRemoveProduct}
                onEditProduct={handleEditProduct}
                transactions={transactions}
                wasteRecords={wasteRecords}
                onAddWasteRecord={(waste) => {
                  const newId = `w-${wasteRecords.length + 1}`;
                  setWasteRecords(prev => [{ ...waste, id: newId }, ...prev]);
                  createLog("Controle de Desperdício", `Pesado descarte alimentar de ${waste.wasteQuantityKg}kg na refeição "${waste.mealName}".`);
                }}
                currentUserRole={currentRole}
              />
            )}

            {activeTab === 'menu' && (
              <MenuPlanner
                meals={meals}
                stockList={stockList}
                onAddMeal={handleAddMeal}
                onRemoveMeal={handleRemoveMeal}
                onEditMeal={handleEditMeal}
                onServeMeal={handleServeMeal}
                currentUserRole={currentRole}
              />
            )}

            {activeTab === 'scanner' && (
              <Scanner
                stockList={stockList}
                onScanSuccess={(item, type, qty) => {
                  const delta = type === 'entrada' ? qty : -qty;
                  handleUpdateQuantity(item.id, delta, 'camera');
                }}
                currentUser={currentRole}
              />
            )}

            {activeTab === 'cleaning' && (
              <CleaningTracker
                checklist={checklist}
                onToggleTask={handleToggleHygieneTask}
                onAddTask={handleAddHygieneTask}
                onRemoveTask={handleRemoveHygieneTask}
                cleaningHistory={cleaningHistory}
                onSaveDayLog={handleSaveDayLog}
                currentUserRole={currentRole}
              />
            )}

            {activeTab === 'birthdays' && (
              <BirthdayCalendar
                employees={employees}
                onAddEmployee={handleAddEmployee}
                onRemoveEmployee={handleRemoveEmployee}
                currentUserRole={currentRole}
              />
            )}

            {activeTab === 'security' && (
              <AuthAndSecurity
                currentRole={currentRole}
                onSwitchRole={(role) => {
                  setCurrentRole(role);
                  createLog("Alternância de Perfil", `Usuário simulou transição de credenciais para a função de ${role}.`);
                }}
                systemLogs={systemLogs}
                onClearLogs={() => {
                  setSystemLogs([]);
                  createLog("Excluir Histórico", "Administrador executou a exclusão e limpeza completa de logs do sistema.");
                }}
                onRestoreBackup={handleRestoreBackup}
                onBackupTrigger={() => createLog("Exportar Backup", "Exportado lote completo de auditoria e tabelas do SQLite local em JSON format.")}
                stockDataJson={compiledDataJson}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* APK Styled Bottom Navigation Rail for Mobile Screens (Max 640px viewport) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-150 p-2 py-2 flex items-center justify-around lg:hidden shadow-lg shadow-black/20 text-center">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center p-1 font-extrabold ${activeTab === 'dashboard' ? 'text-emerald-700' : 'text-gray-400'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Inicial</span>
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`flex flex-col items-center justify-center p-1 font-extrabold ${activeTab === 'stock' ? 'text-emerald-700' : 'text-gray-400'}`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Estoque</span>
        </button>

        <button
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center p-1 font-extrabold ${activeTab === 'menu' ? 'text-emerald-700' : 'text-gray-400'}`}
        >
          <ChefHat className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Cardápio</span>
        </button>

        <button
          onClick={() => setActiveTab('scanner')}
          className={`flex flex-col items-center justify-center p-1 font-extrabold ${activeTab === 'scanner' ? 'text-emerald-700' : 'text-gray-400'}`}
        >
          <Scan className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Scanner</span>
        </button>

        <button
          onClick={() => setActiveTab('cleaning')}
          className={`flex flex-col items-center justify-center p-1 font-extrabold ${activeTab === 'cleaning' ? 'text-emerald-700' : 'text-gray-400'}`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Limpeza</span>
        </button>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelDelete}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm dark:bg-black/80"
              id="delete-modal-backdrop"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-150 dark:border-gray-700 overflow-hidden z-10"
              id="delete-modal-content"
            >
              {/* Alert Ribbon Header */}
              <div className="bg-gradient-to-r from-amber-500 to-rose-600 p-6 text-white flex items-center gap-3.5">
                <div className="p-2 bg-white/20 rounded-2xl">
                  <AlertTriangle className="w-6 h-6 text-yellow-100 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg leading-snug">Exclusão Definitiva</h3>
                  <p className="text-[10px] text-amber-100 uppercase tracking-widest font-mono">Ação Crítica &amp; Irreversível</p>
                </div>
                <button
                  onClick={handleCancelDelete}
                  className="ml-auto p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detail Content */}
              <div className="p-6">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-sans text-left leading-relaxed">
                  Você está prestes a excluir definitivamente o seguinte registro do sistema. Esta ação removerá o item e ajustará os registros históricos de forma definitiva.
                </p>

                {/* Target Information Card */}
                <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl mb-5 text-left">
                  <div className="text-[10px] text-red-500 dark:text-red-400 uppercase tracking-wider font-extrabold font-mono mb-1">
                    {deleteConfirmation.type === 'product' ? '📦 PRODUTO / ALIMENTO NO ESTOQUE' : '🍽️ REFEIÇÃO PLANEJADA / CARDÁPIO'}
                  </div>
                  <h4 className="font-sans font-extrabold text-gray-900 dark:text-white text-base leading-tight break-words mb-3">
                    {deleteConfirmation.name}
                  </h4>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 font-mono space-y-1.5 bg-white/50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
                    {deleteConfirmation.info.split('|').map((chunk, idx) => {
                      const parts = chunk.split(':');
                      if (parts.length < 2) {
                        return (
                          <div key={idx} className="text-gray-750 dark:text-gray-300">
                            {chunk.trim()}
                          </div>
                        );
                      }
                      return (
                        <div key={idx} className="flex justify-between gap-2 text-[11px]">
                          <span className="text-gray-400 dark:text-gray-500 font-medium">{parts[0].trim()}:</span>
                          <span className="font-bold text-gray-750 dark:text-gray-200 text-right">{parts.slice(1).join(':').trim()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Safety Checkbox */}
                <label className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-750 rounded-2xl border border-gray-150 dark:border-gray-700 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 cursor-pointer transition select-none mb-6">
                  <input
                    type="checkbox"
                    checked={hasAcknowledgedDelete}
                    onChange={(e) => setHasAcknowledgedDelete(e.target.checked)}
                    className="mt-0.5 rounded border-gray-300 dark:border-gray-600 text-red-600 focus:ring-red-500 h-4 w-4 transition"
                  />
                  <div className="text-left">
                    <span className="block text-xs font-semibold text-gray-800 dark:text-gray-250">
                      Confirmar exclusão definitiva
                    </span>
                    <span className="block text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                      Estou ciente de que as informações serão apagadas permanentemente.
                    </span>
                  </div>
                </label>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancelDelete}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-250 dark:bg-gray-700 dark:hover:bg-gray-650 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-2xl transition"
                  >
                    Mudei de ideia
                  </button>
                  <button
                    type="button"
                    disabled={!hasAcknowledgedDelete}
                    onClick={handleConfirmDelete}
                    className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-bold rounded-2xl transition shadow-md ${
                      hasAcknowledgedDelete
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/10'
                        : 'bg-gray-100 text-gray-300 dark:bg-gray-750 dark:text-gray-600 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir de vez
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
