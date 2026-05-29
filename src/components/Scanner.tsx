/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Scan, Volume2, VolumeX, AlertTriangle, CheckCircle2, Search, PlusCircle, MinusCircle, FileCode } from 'lucide-react';
import { StockItem } from '../types';

interface ScannerProps {
  stockList: StockItem[];
  onScanSuccess: (item: StockItem, type: 'entrada' | 'saida', quantity: number) => void;
  currentUser: string;
}

export default function Scanner({ stockList, onScanSuccess, currentUser }: ScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanType, setScanType] = useState<'entrada' | 'saida'>('entrada');
  const [scanQty, setScanQty] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedWebcamId, setSelectedWebcamId] = useState<string>('');
  const [webcamDevices, setWebcamDevices] = useState<MediaDeviceInfo[]>([]);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [scannerStatus, setScannerStatus] = useState<string>('Disponível para leitura');
  const [manualCode, setManualCode] = useState('');
  const [detectedItem, setDetectedItem] = useState<StockItem | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Play a beautiful synthetic beep sound on success
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime); // High pitched friendly beep
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // Quiet but audible
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1); // 100ms
    } catch (e) {
      console.warn("Synth audio context blocked or unsupported", e);
    }
  };

  // Setup camera stream if isScanning is active
  useEffect(() => {
    if (isScanning) {
      setWebcamError(null);
      setDetectedItem(null);
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoDevs = devices.filter(d => d.kind === 'videoinput');
          setWebcamDevices(videoDevs);
          if (videoDevs.length > 0 && !selectedWebcamId) {
            setSelectedWebcamId(videoDevs[0].deviceId);
          }
        })
        .catch(err => {
          console.error("Error listing webcams", err);
        });

      const constraints: MediaStreamConstraints = {
        video: selectedWebcamId ? { deviceId: { exact: selectedWebcamId } } : { facingMode: 'environment' }
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setScannerStatus('Câmera ativa. Aponte para o código de barras.');
        })
        .catch(err => {
          console.warn("Camera hardware access denied or not found", err);
          setWebcamError("Não foi possível acessar a câmera do dispositivo. Usando o emulador de scanner integrado.");
          setScannerStatus('Aviso: Câmera física indisponível. Utilize o Painel de Simulação.');
        });
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isScanning, selectedWebcamId]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setDetectedItem(null);
  };

  // Simulates scanning one of the active inventory items
  const handleSimulateScan = (item: StockItem) => {
    playBeep();
    setDetectedItem(item);
    setScannerStatus(`Pronto! Identificado: ${item.name}`);
    setManualCode(item.barcode);
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    
    const found = stockList.find(i => i.barcode === manualCode.trim() || i.name.toLowerCase().includes(manualCode.trim().toLowerCase()));
    if (found) {
      playBeep();
      setDetectedItem(found);
      setScannerStatus(`Identificado: ${found.name}`);
    } else {
      setDetectedItem(null);
      setScannerStatus('Nenhum produto correspondente encontrado para este código.');
    }
  };

  const handleConfirmAction = () => {
    if (!detectedItem) return;
    onScanSuccess(detectedItem, scanType, scanQty);
    
    // Feedback
    setScannerStatus(`Sucesso! Registrada ${scanType === 'entrada' ? 'entrada' : 'saída'} de ${scanQty} ${detectedItem.unit} de ${detectedItem.name}`);
    setDetectedItem(null);
    setManualCode('');
    setScanQty(1);
    
    // Auto-close overlay after scanning if preferred, or keep active
  };

  return (
    <div id="scanner-view-container" className="p-4 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-emerald-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Scan className="w-6 h-6 text-emerald-600" />
            Scanner de Código de Barras (Câmera)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Registre entradas ou saídas de merenda escaneando o rótulo pela câmera do celular ou tablet.
          </p>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-sm transition flex items-center gap-1.5 ${soundEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
            title="Ativar/Desativar Som de Scans"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Sons Ativos' : 'Silenciado'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera / Reader interface */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video shadow-lg border border-gray-800 flex flex-col justify-between p-4">
            {/* Overlay Grid lines */}
            {isScanning && !webcamError && (
              <div className="absolute inset-0 border-2 border-emerald-400 pointer-events-none opacity-40 animate-pulse m-8 rounded-xl" />
            )}
            
            {/* The Scanning red line animated */}
            {isScanning && !webcamError && (
              <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,1)] top-1/2 -translate-y-1/2 animate-bounce pointer-events-none z-10" />
            )}

            <div className="flex items-center justify-between z-10 w-full">
              <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-emerald-500 animate-ping' : 'bg-gray-500'}`} />
                {isScanning ? 'LENTE ATIVA' : 'CÂMERA INATIVA'}
              </span>

              {isScanning && webcamDevices.length > 1 && (
                <select
                  value={selectedWebcamId}
                  onChange={(e) => setSelectedWebcamId(e.target.value)}
                  className="bg-black/60 border border-gray-700 rounded-lg px-2 py-1 text-xs text-white max-w-[150px] outline-none"
                >
                  {webcamDevices.map(dev => (
                    <option key={dev.deviceId} value={dev.deviceId}>
                      {dev.label || `Câmera ${webcamDevices.indexOf(dev) + 1}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Video or Mock viewport */}
            <div className="flex-1 flex items-center justify-center">
              {isScanning && !webcamError ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover max-h-56"
                />
              ) : (
                <div id="scanner-emulator-canvas" className="text-center p-6 text-gray-500 flex flex-col items-center justify-center space-y-3">
                  <Camera className="w-12 h-12 text-gray-600 stroke-[1.2] drop-shadow" />
                  <p className="text-sm font-medium text-gray-400">
                    {webcamError ? 'Emulator Ativo para Simulação' : 'Câmera Desligada'}
                  </p>
                  <p className="text-xs text-gray-600 max-w-sm">
                    {webcamError || 'Inicie o scanner para utilizar a câmera traseira do seu celular de merenda.'}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 z-10">
              {!isScanning ? (
                <button
                  id="btn-start-scanner"
                  onClick={() => setIsScanning(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2 rounded-xl text-sm flex items-center gap-2 transition shadow-md shadow-emerald-950/20 active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  Ativar Câmera Scanner
                </button>
              ) : (
                <button
                  id="btn-stop-scanner"
                  onClick={() => setIsScanning(false)}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-medium px-5 py-2 rounded-xl text-sm flex items-center gap-2 transition shadow-md active:scale-95"
                >
                  Desligar Câmera
                </button>
              )}
            </div>
          </div>

          {/* Quick Simulation Panel for Testing in AI Studio Web Environment */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 tracking-wide uppercase flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-slate-500" />
                Painel do Simulador de Código de Barras
              </span>
              <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                AI Studio Testes
              </span>
            </div>
            
            <p className="text-xs text-gray-500">
              Como estamos rodando em uma janela de teste no navegador, você pode escanear instantaneamente qualquer produto abaixo clicando no seu respectivo botão de etiqueta para simular que a câmera reconheceu o código de barras!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
              {stockList.map(item => (
                <button
                  key={item.id}
                  id={`simulate-scan-${item.id}`}
                  onClick={() => handleSimulateScan(item)}
                  type="button"
                  className="text-left p-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 transition text-[11px] group flex flex-col justify-between"
                >
                  <strong className="text-gray-700 group-hover:text-emerald-700 truncate block">{item.name}</strong>
                  <span className="text-[10px] text-mono font-mono text-gray-400 mt-1 bg-gray-50 px-1 py-0.5 rounded max-w-max">
                     {item.barcode.slice(-5)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Registry Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-800 text-lg border-b pb-2">
              Configurar Movimentação
            </h3>

            {/* Input Manual / Search */}
            <form onSubmit={handleManualCodeSubmit} className="space-y-2">
              <label className="block text-xs font-semibold text-gray-600">Busca Rápida ou Código de Barras</label>
              <div className="relative">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Ex: 7891020304012 ou 'Arroz'"
                  className="w-full pl-9 pr-20 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-700"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <button
                  type="submit"
                  id="btn-manual-search"
                  className="absolute right-1.5 top-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Procurar
                </button>
              </div>
            </form>

            {/* Type Switcher: Entrada (Green) or Saída (Red) */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-600 block">Tipo de Operação</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="btn-scan-type-entrada"
                  onClick={() => setScanType('entrada')}
                  className={`py-3 rounded-xl border-2 transition font-bold text-sm text-center flex flex-col items-center justify-center gap-1.5 ${
                    scanType === 'entrada'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-gray-100 bg-gray-50 text-gray-505 hover:bg-gray-100'
                  }`}
                >
                  <PlusCircle className={`w-5 h-5 ${scanType === 'entrada' ? 'text-emerald-600' : 'text-gray-400'}`} />
                  Entrada de Carga(+)
                </button>
                <button
                  type="button"
                  id="btn-scan-type-saida"
                  onClick={() => setScanType('saida')}
                  className={`py-3 rounded-xl border-2 transition font-bold text-sm text-center flex flex-col items-center justify-center gap-1.5 ${
                    scanType === 'saida'
                      ? 'border-rose-500 bg-rose-50 text-rose-800'
                      : 'border-gray-100 bg-gray-50 text-gray-505 hover:bg-gray-100'
                  }`}
                >
                  <MinusCircle className={`w-5 h-5 ${scanType === 'saida' ? 'text-rose-600' : 'text-gray-400'}`} />
                  Consumo/Devolução(-)
                </button>
              </div>
            </div>

            {/* Quantity adjustment */}
            {detectedItem && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-150 space-y-2 animate-fade-in">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{detectedItem.category}</span>
                    <h4 className="font-bold text-gray-900 text-sm mt-0.5">{detectedItem.name}</h4>
                  </div>
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                    Atual: {detectedItem.quantity} {detectedItem.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <span className="text-xs text-gray-500 font-medium">Quantidade a registrar:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setScanQty(Math.max(1, scanQty - 1))}
                      className="p-1 px-2.5 rounded-lg bg-white border font-bold text-gray-700 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={scanQty}
                      onChange={(e) => setScanQty(Math.max(1, parseFloat(e.target.value) || 1))}
                      className="w-14 text-center text-sm font-bold bg-white border rounded-lg py-1 outline-none text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => setScanQty(scanQty + 1)}
                      className="p-1 px-2.5 rounded-lg bg-white border font-bold text-gray-700 hover:bg-gray-100"
                    >
                      +
                    </button>
                    <span className="text-xs font-semibold text-gray-500">{detectedItem.unit}</span>
                  </div>
                </div>

                {scanType === 'saida' && detectedItem.quantity < scanQty && (
                  <div className="p-2 bg-amber-50 text-amber-800 rounded-lg text-xs flex items-start gap-1.5 border border-amber-200 mt-2">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Atenção: A quantidade de saída é maior que o estoque atual ({detectedItem.quantity} {detectedItem.unit}). O estoque ficará negativo.</span>
                  </div>
                )}
              </div>
            )}

            {/* Action button */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                id="btn-confirm-scanner-transaction"
                disabled={!detectedItem}
                onClick={handleConfirmAction}
                className={`w-full py-3 rounded-xl font-bold text-white shadow transition text-center flex items-center justify-center gap-2 ${
                  detectedItem 
                    ? scanType === 'entrada'
                      ? 'bg-emerald-600 hover:bg-emerald-500' 
                      : 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-gray-300 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {scanType === 'entrada' ? <PlusCircle className="w-5 h-5" /> : <MinusCircle className="w-5 h-5" />}
                Confirmar {scanType === 'entrada' ? 'Entrada no Estoque' : 'Baixa do Estoque'}
                {detectedItem && ` (${scanQty} ${detectedItem.unit})`}
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Status:</span>
                <span className="font-medium text-gray-600">{scannerStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
