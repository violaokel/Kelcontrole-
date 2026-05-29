/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Gift, 
  Calendar, 
  Plus, 
  Trash2, 
  Mail, 
  Smile, 
  Cake, 
  Award, 
  Bell, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { BirthdayEmployee } from '../types';

interface BirthdayCalendarProps {
  employees: BirthdayEmployee[];
  onAddEmployee: (emp: Omit<BirthdayEmployee, 'id'>) => void;
  onRemoveEmployee: (id: string) => void;
  currentUserRole: string;
}

export default function BirthdayCalendar({
  employees,
  onAddEmployee,
  onRemoveEmployee,
  currentUserRole
}: BirthdayCalendarProps) {

  // New Employee fields state
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [role, setRole] = useState('Merendeira / Cozinheira');
  const [avatar, setAvatar] = useState('👩‍🍳');

  // Month query to filter display
  const [filterMonth, setFilterMonth] = useState<number>(4); // Default to current month May index (4)

  const MONTHS_NAMES = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const AVATAR_TEMPLATES = ["👩‍🍳", "👨‍🍳", "👩‍💼", "👨‍📦", "👩‍⚕️", "👩‍🏫", "👨‍🏫", "🤝", "🍎"];

  // Filter employees of the selected month
  const filteredEmployeesList = useMemo(() => {
    return employees.filter(emp => {
      const bDate = new Date(emp.birthDate);
      return bDate.getMonth() === filterMonth;
    });
  }, [employees, filterMonth]);

  // Check if someone has a birthday TODAY (May 29)
  const usersWithBirthdayToday = useMemo(() => {
    return employees.filter(emp => {
      const bDate = new Date(emp.birthDate);
      return bDate.getDate() === 29 && bDate.getMonth() === 4; // May 29, month 4 list
    });
  }, [employees]);

  const handleSubmitEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) {
      alert("Por favor, preencha o Nome e a Data de Nascimento.");
      return;
    }

    onAddEmployee({
      name,
      birthDate,
      role,
      avatar
    });

    // Reset Form
    setName('');
    setBirthDate('');
    setIsAdding(false);
    alert(`Funcionário ${name} cadastrado com sucesso!`);
  };

  const handleSendGreetingMsg = (emp: BirthdayEmployee) => {
    const textMsg = `🎉 *PARABÉNS DA ESCOLA!* 🎂\n\nQuerido(a) *${emp.name}*, nós da equipe do Controle de Merenda desejamos um feliz aniversário com muita saúde e alegria! Agradecemos imensamente por todo o seu carinho e dedicação diária servindo nossas crianças. Parabéns! 🎈🥇`;
    
    // Copy mockup or trigger sharing
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textMsg);
      alert(`Mensagem eletrônica copiada com sucesso para a área de transferência! Envie para o funcionário pelo Chat Escolar ou Whatsapp:\n\n"${textMsg.slice(0, 80)}..."`);
    } else {
      alert(`Parabéns congratulado com sucesso a ${emp.name}!`);
    }
  };

  return (
    <div id="birthday-calendar-view" className="p-4 max-w-7xl mx-auto space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Gift className="w-6 h-6 text-emerald-600" />
            Aniversariantes do Mês da Merenda
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Cadastre funcionários e confira datas importantes para parabenizar a equipe de merendeiras, nutricionistas e armazenadores.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Funcionário
          </button>
        </div>
      </div>

      {/* Sub collapsible signup Form */}
      {isAdding && (
        <form onSubmit={handleSubmitEmployee} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-4 animate-fade-in text-left">
          <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider block">Preencha os dados do Funcionário</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-gray-600">
            <div className="space-y-1">
              <label>Nome Completo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Roberto da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Data de Nascimento *</label>
              <input
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label>Cargo / Função</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2.5 border rounded-xl font-normal bg-white outline-none focus:border-emerald-500"
              >
                <option value="Merendeira / Cozinheira">Cozinheira / Merendeira</option>
                <option value="Auxiliar de Cozinha">Auxiliar de Cozinha</option>
                <option value="Estoquista Chefe">Estoquista Chefe</option>
                <option value="Nutricionista Técnica">Nutricionista Técnica</option>
                <option value="Diretor Escolar">Diretor Escolar</option>
                <option value="Auxiliar Geral">Auxiliar Geral</option>
              </select>
            </div>

            <div className="space-y-1">
              <label>Avatar / Ícone Representativo</label>
              <div className="grid grid-cols-5 gap-1.5 p-1 border rounded-xl bg-slate-50">
                {AVATAR_TEMPLATES.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setAvatar(item)}
                    className={`p-1.5 rounded text-base text-center transition ${avatar === item ? 'bg-emerald-600 text-white' : 'hover:bg-gray-200'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-250 text-gray-770 rounded-xl text-xs font-bold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-505 text-white rounded-xl text-xs font-bold transition"
            >
              Adicionar Funcionário
            </button>
          </div>
        </form>
      )}

      {/* Birthday alerts banner */}
      {usersWithBirthdayToday.length > 0 && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
          <div className="flex items-center gap-4 text-left">
            <span className="text-4xl animate-bounce">🎂</span>
            <div>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full uppercase font-bold tracking-widest text-amber-100">ALERTA ANIVERSÁRIOS</span>
              <h3 className="text-lg font-extrabold mt-0.5">Parabéns aos aniversariantes de hoje!</h3>
              <p className="text-sm font-medium opacity-90">
                Garantindo alegria na equipe: {usersWithBirthdayToday.map(e => `${e.name} (${e.role})`).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {usersWithBirthdayToday.map(e => (
              <button
                key={e.id}
                type="button"
                onClick={() => handleSendGreetingMsg(e)}
                className="bg-white hover:bg-amber-100 text-rose-700 font-extrabold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-md"
              >
                <Mail className="w-4 h-4" />
                Mensagem Automática para {e.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Month Calendar Quick Picker & List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Left column: Month selector */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">SELECIONAR MÊS</span>
            
            <div className="grid grid-cols-1 gap-1">
              {MONTHS_NAMES.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`month-picker-${idx}`}
                  onClick={() => setFilterMonth(idx)}
                  className={`py-2 px-3 text-left rounded-xl transition text-xs font-bold flex justify-between items-center ${
                    filterMonth === idx
                      ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-50 text-gray-600'
                  }`}
                >
                  <span>🗓️ {m}</span>
                  <span className="font-mono text-[10px] bg-slate-100 px-1.5 rounded-full font-bold text-gray-500">
                    {employees.filter(e => new Date(e.birthDate).getMonth() === idx).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Employees list under selected month */}
        <div className="lg:col-span-9 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <Cake className="w-5 h-5 text-emerald-600" />
                Quadro de aniversariantes do mês de {MONTHS_NAMES[filterMonth]}
              </h3>
              <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                {filteredEmployeesList.length} funcionários(as)
              </span>
            </div>

            {filteredEmployeesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredEmployeesList.map(emp => {
                  const bDate = new Date(emp.birthDate);
                  const day = bDate.getDate();
                  const age = 2026 - bDate.getFullYear();
                  
                  return (
                    <div 
                      key={emp.id} 
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        day === 29 && filterMonth === 4
                          ? 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 shadow-sm shadow-pink-100'
                          : 'bg-slate-50/50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left min-w-0">
                        <span className="text-3xl p-1.5 bg-white border rounded-2xl shadow-sm inline-block">{emp.avatar || "👤"}</span>
                        
                        <div className="min-w-0">
                          <h4 className="font-black text-gray-900 text-sm truncate flex items-center gap-1">
                            {emp.name}
                            {day === 29 && filterMonth === 4 && <span className="text-[9px] uppercase font-bold text-pink-700 bg-pink-100 px-1.5 rounded-full">Hoje!</span>}
                          </h4>
                          <p className="text-xs text-gray-500 font-semibold">{emp.role}</p>
                          <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">Nascimento: {emp.birthDate} ({age} anos)</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                          Dia {day}
                        </span>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleSendGreetingMsg(emp)}
                            className="p-1.5 bg-white hover:bg-slate-100 border text-gray-600 hover:text-emerald-700 rounded-lg transition"
                            title="Dar Parabéns"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            id={`btn-remove-employee-${emp.id}`}
                            onClick={() => onRemoveEmployee(emp.id)}
                            className="p-1.5 bg-white border border-rose-100 hover:bg-rose-50 text-gray-300 hover:text-rose-600 rounded-lg transition"
                            title="Excluir cadastro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-center text-gray-500 py-12 bg-slate-50/50 rounded-2xl border border-dashed border-gray-200">
                Nenhum funcionário faz aniversário cadastrado neste mês de {MONTHS_NAMES[filterMonth]}.
              </p>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
