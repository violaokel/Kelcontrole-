/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  CheckCircle, 
  Plus, 
  Trash2, 
  FileCheck, 
  User, 
  Smile, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ChecklistItem, CleaningLog } from '../types';

interface CleaningTrackerProps {
  checklist: ChecklistItem[];
  onToggleTask: (id: string, responsible: string) => void;
  onAddTask: (task: string, defaultResp: string) => void;
  onRemoveTask: (id: string) => void;
  cleaningHistory: CleaningLog[];
  onSaveDayLog: () => void;
  currentUserRole: string;
}

export default function CleaningTracker({
  checklist,
  onToggleTask,
  onAddTask,
  onRemoveTask,
  cleaningHistory,
  onSaveDayLog,
  currentUserRole
}: CleaningTrackerProps) {

  // New task form state
  const [newTaskName, setNewTaskName] = useState('');
  const [defaultResp, setDefaultResp] = useState('Reginaldo Silva');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Active logging checker
  const [userSignName, setUserSignName] = useState('Dona Maria de Souza');

  const completedCount = checklist.filter(t => t.completed).length;
  const totalCount = checklist.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    onAddTask(newTaskName, defaultResp);
    setNewTaskName('');
    setIsAddingTask(false);
  };

  return (
    <div id="cleaning-tracker-view" className="p-4 max-w-7xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-600" />
            Controle de Higienização e Vigilância Sanitária
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Mantenha o registro de limpeza diária da cozinha, utensílios e despensa para conformidade com a Anvisa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Inserir Tarefa Checklist
          </button>
          
          <button
            onClick={() => {
              if (completedCount < totalCount) {
                if (!confirm("Aviso: Existem tarefas não marcadas no checklist de hoje. Confirmar fechamento do lote diário mesmo assim?")) {
                  return;
                }
              }
              onSaveDayLog();
              alert("Lote diário de higienização arquivado no histórico com êxito!");
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95"
            title="Arquivar dia no histórico"
          >
            <FileCheck className="w-4 h-4" />
            Arquivar Lote Diário
          </button>
        </div>
      </div>

      {/* Sub collapsible task inputs */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="bg-white p-5 rounded-2xl shadow-sm border border-cyan-100 space-y-4 animate-fade-in text-left">
          <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Criar Nova Tarefa para o Checklist de Limpeza</h3>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-[10px] font-bold text-gray-500 block uppercase">Descrição da Higienização</label>
              <input
                type="text"
                required
                placeholder="Ex: Desinfecção profunda com álcool 70% das geladeiras"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg text-xs outline-none focus:border-cyan-500 focus:bg-white text-gray-700"
              />
            </div>
            
            <div className="w-full sm:w-56 space-y-1">
              <label className="text-[10px] font-bold text-gray-500 block uppercase">Funcionário Responsável</label>
              <input
                type="text"
                required
                value={defaultResp}
                onChange={(e) => setDefaultResp(e.target.value)}
                className="w-full p-2 bg-slate-50 border rounded-lg text-xs outline-none focus:border-cyan-500 focus:bg-white text-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
            >
              Salvar Tarefa
            </button>
          </div>
        </form>
      )}

      {/* Checklist execution strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left column (8): Today's Checklist Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-600 tracking-wider">CHECKLIST DE HOJE</span>
                <h3 className="font-extrabold text-gray-900 text-base">Roteiro Diário de Higiene da Merenda</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-gray-650">Nome do Operador Executando:</span>
                <input
                  type="text"
                  value={userSignName}
                  onChange={(e) => setUserSignName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="p-1 px-2 border rounded-lg text-xs font-bold text-cyan-800 bg-cyan-50 focus:outline-none"
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Progresso de Conformidade</span>
                <span className="text-cyan-600 font-mono">{pct}% Concluído ({completedCount}/{totalCount})</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* List items */}
            <div className="space-y-2.5 pt-2">
              {checklist.length > 0 ? (
                checklist.map(task => (
                  <div 
                    key={task.id} 
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      task.completed 
                        ? 'bg-slate-50/70 border-gray-200 opacity-80' 
                        : 'bg-cyan-50/15 border-cyan-100 hover:border-cyan-200'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      {/* Check box trigger */}
                      <button
                        type="button"
                        id={`btn-toggle-hygiene-${task.id}`}
                        onClick={() => onToggleTask(task.id, userSignName)}
                        className={`w-5.5 h-5.5 mt-0.5 rounded-lg border-2 flex items-center justify-center font-bold font-mono transition shrink-0 ${
                          task.completed 
                            ? 'bg-cyan-500 border-cyan-500 text-white' 
                            : 'border-cyan-300 hover:border-cyan-500 bg-white'
                        }`}
                      >
                        {task.completed && "✓"}
                      </button>

                      <div className="text-left space-y-0.5 min-w-0">
                        <p className={`font-bold text-sm ${task.completed ? 'text-gray-450 line-through' : 'text-gray-900'}`}>
                          {task.task}
                        </p>
                        
                        <div className="flex items-center gap-2 text-[10px] text-gray-500 flex-wrap">
                          <span className="flex items-center gap-0.5 font-semibold text-gray-600">
                            <User className="w-3 h-3 text-cyan-600" /> Resp: {task.responsible}
                          </span>
                          
                          {task.completedTime && (
                            <span className="bg-emerald-50 text-emerald-800 font-mono px-1.5 rounded-md flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" /> Entregue às {task.completedTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      id={`btn-remove-hygiene-${task.id}`}
                      onClick={() => onRemoveTask(task.id)}
                      className="p-1 px-1.5 self-end sm:self-auto text-gray-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition"
                      title="Excluir tarefa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500 py-6">
                  Nenhuma atividade inserida no checklist de limpeza para hoje.
                </p>
              )}
            </div>

            {/* Reminder box warning */}
            <div className="p-3 bg-amber-50 text-amber-900 rounded-xl border border-amber-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
              <span>
                Lembrete de conformidade: Todo final de expediente da merenda deve ser higienizado os bancários, retirada de rastro de lixo e varrido com água sanitária para evitar acúmulos sanitários.
              </span>
            </div>

          </div>
        </div>

        {/* Right column (4): Cleaning History log lists */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase block leading-none">Registros Passados</span>
            <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-1">
              <Calendar className="w-4 h-4 text-cyan-600" />
              Histórico de Lotes Concluídos
            </h3>
            
            <p className="text-xs text-gray-600 leading-relaxed pb-1">
              Consulte os lotes fechados arquivados para comprovação jurídica aos diretores.
            </p>

            <div className="space-y-2.5 max-h-[290px] overflow-y-auto pr-1">
              {cleaningHistory.length > 0 ? (
                cleaningHistory.map(log => {
                  const itemsDoneCount = log.tasks.filter(t => t.completed).length;
                  const itemsTotalCount = log.tasks.length;
                  
                  return (
                    <div key={log.id} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs space-y-1.5 text-left">
                      <div className="flex justify-between items-center bg-white p-1 rounded-md border font-bold">
                        <span className="font-mono text-cyan-800 text-[10px]">{log.date}</span>
                        <span className="text-[10px] bg-green-100 text-green-800 px-1.5 rounded-full font-mono font-bold">
                          {itemsDoneCount}/{itemsTotalCount} Ok
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 truncate" title={log.tasks.map(t => t.task).join(', ')}>
                        {log.tasks.map(t => t.task).join(', ')}
                      </p>
                      {log.finishedBy && (
                        <div className="text-[9px] text-gray-400 font-mono">Assinado Responsável: {log.finishedBy}</div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-400 font-light text-center py-6">
                  Nenhum lote arquivado ainda no histórico.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
