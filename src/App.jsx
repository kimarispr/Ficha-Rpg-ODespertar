import React, { useState, useEffect } from 'react';
import { User, Shield, Heart, Zap, Award, Plus, Trash2, D20, BookOpen, Scroll } from 'lucide-react';

export default function App() {
  // Estado do Avatar / Imagem
  const [avatarUrl, setAvatarUrl] = useState(() => {
    return localStorage.getItem('character_avatar') || '';
  });

  // Estado das Informações Básicas
  const [characterName, setCharacterName] = useState(() => {
    return localStorage.getItem('character_name') || 'Valerius Vane';
  });

  const [characterClass, setCharacterClass] = useState(() => {
    return localStorage.getItem('character_class') || 'Guerreiro';
  });

  const [level, setLevel] = useState(() => {
    return Number(localStorage.getItem('character_level')) || 1;
  });

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('character_avatar', avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    localStorage.setItem('character_name', characterName);
  }, [characterName]);

  useEffect(() => {
    localStorage.setItem('character_class', characterClass);
  }, [characterClass]);

  useEffect(() => {
    localStorage.setItem('character_level', level);
  }, [level]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* CABEÇALHO / IDENTIFICAÇÃO DO AVENTUREIRO */}
        <div className="bg-slate-900/80 border border-purple-900/50 rounded-xl p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-amber-500 font-bold mb-4">
            <User className="w-5 h-5" />
            <span className="tracking-wider text-sm uppercase">Identificação do Aventureiro</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Campo do Avatar / Imagem */}
            <div className="relative group w-32 h-32 rounded-xl border-2 border-dashed border-purple-500/40 overflow-hidden bg-slate-950/60 flex flex-col items-center justify-center shrink-0">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Retrato do Personagem" 
                  className="w-full h-full object-cover"
                  onError={() => setAvatarUrl('')}
                />
              ) : (
                <div className="text-center p-2 text-slate-500">
                  <User className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px]">Sem Imagem</span>
                </div>
              )}

              {/* Input ao passar o mouse */}
              <label className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-xs text-purple-300 font-medium p-2 text-center">
                <span>Clique para Carregar Foto</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setAvatarUrl(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Informações do Personagem */}
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Nome do Personagem
                  </label>
                  <input 
                    type="text" 
                    value={characterName} 
                    onChange={(e) => setCharacterName(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-lg focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Valerius Vane"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Classe / Arquétipo
                  </label>
                  <input 
                    type="text" 
                    value={characterClass} 
                    onChange={(e) => setCharacterClass(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-lg focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Guerreiro"
                  />
                </div>
              </div>

              {/* Cole o Link/URL da Imagem */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                  Ou cole o Link (URL) de uma imagem da Web
                </label>
                <input 
                  type="text" 
                  value={avatarUrl.startsWith('data:') ? '' : avatarUrl} 
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-slate-950/40 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
                  placeholder="https://imgur.com/sua-imagem.png"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}