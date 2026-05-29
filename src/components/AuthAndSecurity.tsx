/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  History, 
  Database, 
  Lock, 
  Unlock, 
  Download, 
  Upload, 
  Key, 
  Activity,
  AlertTriangle
} from 'lucide-react';
import { UserRole, UserProfile, SystemLog } from '../types';

interface AuthAndSecurityProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  systemLogs: SystemLog[];
  onClearLogs: () => void;
  onRestoreBackup: (backupData: any) => void;
  onBackupTrigger: () => void; // standard trigger
  stockDataJson: any; // complete context payload
}

export default function AuthAndSecurity({
  currentRole,
  onSwitchRole,
  systemLogs,
  onClearLogs,
  onRestoreBackup,
  onBackupTrigger,
  stockDataJson
}: AuthAndSecurityProps) {

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Switchable school roles definitions
  const USER_PROFILES: Record<UserRole, UserProfile> = {
    Admin: {
      role: 'Admin',
      name: 'Regina Vasconcellos (Administradora)',
      avatar: '👑',
      permissions: ['Gerência Total', 'Excluir Lotes', 'Lançar Validade', 'Forçar Sincronização', 'Exportações de Relatórios', 'Editar Usuários']
    },
    Estoquista: {
      role: 'Estoquista',
      name: 'Carlos Oliveira (Estoque de Merenda)',
      avatar: '👨‍📦',
      permissions: ['Registrar Entrada', 'Registrar Baixas', 'Consultar Validade', 'Sincronizar Lotes offline', 'Emitir Alerta Crítico']
    },
    Cozinheira: {
      role: 'Cozinheira',
      name: 'Maria de Souza (Dona Maria de Merendeira)',
      avatar: '👩‍🍳',
      permissions: ['Sinalizar Cardápio do Dia como Servido', 'Marcar Checklist de Limpeza', 'Inserir Checklist', 'Visualizar Receitas']
    },
    Diretor: {
      role: 'Diretor',
      name: 'Ana Paula Medeiros (Diretoria Geral)',
      avatar: '👩‍💼',
      permissions: ['Consultar Painel Geral', 'Download Relatório Anual Excel', 'Consultar Desperdício', 'Visualizar Alertas Sanitários']
    }
  };

  const activeUserProfile = USER_PROFILES[currentRole];

  // Backup downloader handler
  const handleDownloadBackupFile = () => {
    try {
      const backupObj = {
        app: "Controle de Merenda Escolar",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        data: stockDataJson
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Merenda_Backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      onBackupTrigger();
    } catch (e) {
      console.error("Download backup failed", e);
    }
  };

  // Upload restore file handler
  const handleUploadBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.app === "Controle de Merenda Escolar" && parsed.data) {
          onRestoreBackup(parsed.data);
          alert("✓ Banco de Dados restaurado integralmente com sucesso! Sua merenda e produtos foram carregados.");
        } else {
          alert("Erro: Arquivo JSON de backup inválido.");
        }
      } catch (err) {
        alert("Falha ao analisar o arquivo JSON de backup.");
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <div id="auth-security-view" className="p-4 max-w-7xl mx-auto space-y-6 text-left">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Lock className="w-6 h-6 text-emerald-600" />
            Configurações, Usuários & Segurança do Sistema
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Gerencie perfis de acesso escolar, acompanhe histórico de modificações e faça downloads de segurança.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5): Profile Switcher and credentials checker */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Active Profile Info card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-mono">USUÁRIO AUTENTICADO</span>
            
            <div className="flex items-center gap-4 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
              <span className="text-4xl p-2 bg-white rounded-2xl shadow-sm border">{activeUserProfile.avatar}</span>
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-850 bg-emerald-200 px-2.5 py-0.5 rounded-full inline-block">
                  {activeUserProfile.role}
                </span>
                <h3 className="font-extrabold text-gray-950 mt-1">{activeUserProfile.name}</h3>
                <span className="text-[10px] text-gray-400 block mt-0.5">Nível de Permissão: {activeUserProfile.role === 'Admin' ? 'Superuser' : 'Específico'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-650 block">Suas Permissões Ativas na Merenda Escolar:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeUserProfile.permissions.map(perm => (
                  <span key={perm} className="bg-slate-100 text-slate-700 font-medium text-[11px] px-2 py-1 rounded-lg">
                    ✓ {perm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Role Switcher trigger buttons */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Simulador de Perfis de Login
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Clique nos botões abaixo para alternar de perfil escolar instantaneamente e testar as telas e permissões de cada um:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {Object.keys(USER_PROFILES).map(rName => {
                const profile = USER_PROFILES[rName as UserRole];
                const isActive = currentRole === rName;
                
                return (
                  <button
                    key={rName}
                    type="button"
                    id={`btn-login-role-${rName}`}
                    onClick={() => onSwitchRole(rName as UserRole)}
                    className={`p-3 rounded-xl border-2 transition text-left flex items-start gap-2.5 ${
                      isActive 
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold' 
                        : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-gray-600'
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{profile.avatar}</span>
                    <div className="leading-tight">
                      <span className="text-[10px] text-gray-400 block font-mono font-bold uppercase">{rName}</span>
                      <strong className="text-xs font-bold block truncate max-w-[100px] mt-0.5" title={profile.name}>{profile.name.split(' ')[0]}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Backup Database controls */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Database className="w-5 h-5 text-emerald-600" />
              Sincronização & Backup de Emergência (SQLite / JSON)
            </h3>
            
            <p className="text-xs text-gray-600 leading-relaxed">
              O Controle de Merenda funciona de forma offline utilizando seu navegador. Baixe backups digitais de segurança para guardar seus dados em arquivos externos e reinjetá-los quando necessário.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                id="btn-download-backup"
                onClick={handleDownloadBackupFile}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs p-3.5 rounded-xl transition flex flex-col items-center justify-center gap-2"
              >
                <Download className="w-6 h-6 text-emerald-600" />
                <span>Exportar Backup (.json)</span>
              </button>

              <button
                type="button"
                id="btn-trigger-upload`"
                onClick={() => fileInputRef.current?.click()}
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs p-3.5 rounded-xl transition flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-6 h-6 text-slate-600" />
                <span>Restaurar Backup</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadBackupFile}
              accept=".json"
              className="hidden"
            />
          </div>

        </div>

        {/* Right Column (7): System logs showing history */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                <History className="w-5 h-5 text-emerald-600" />
                Histórico Geral de Atividades (Auditoria de Ações)
              </h3>
              
              <button 
                onClick={onClearLogs}
                className="text-xs text-rose-600 font-medium hover:underline bg-rose-50 border border-rose-100 px-2 py-1 rounded-lg"
              >
                Limpar Logs
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Acompanhe as ações efetuadas por cada usuário escolar em conformidade com as exigências do programa alimentar.
            </p>

            <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
              {systemLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs text-left space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-gray-800">{log.username}</span>
                      <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-bold">
                        {log.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 font-semibold pb-1 border-b border-gray-200/50">
                    <span className="text-emerald-700">{log.action}</span>
                    <span className="text-[9px] text-slate-400 font-mono">ID: {log.id}</span>
                  </div>
                  
                  <p className="text-gray-600 text-[11px] leading-relaxed pt-0.5 italic">{log.details}</p>
                </div>
              ))}
            </div>

            {/* Offline syncing simulator indicator banner */}
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-150 rounded-2xl flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-600 shrink-0 animate-pulse" />
              <div className="text-xs">
                <strong className="text-emerald-950 font-bold block">Sincronizador Automático Nuvem Ativo</strong>
                <p className="text-emerald-800 opacity-90 mt-0.5">Todas as suas modificações no SQLite local do navegador são guardadas em background e preparadas para sincronia de dados imediata ao reconectar.</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
