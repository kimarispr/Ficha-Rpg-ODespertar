import React, { useState, useEffect } from 'react';
import { User, Shield, Heart, Zap, Sparkles, Sword, Flame, BookOpen, Layers } from 'lucide-react';

export default function App() {
  // --- ESTADOS DO PERSONAGEM ---
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('char_avatar') || '');
  const [name, setName] = useState(() => localStorage.getItem('char_name') || 'Valerius Vane');
  const [mutationName, setMutationName] = useState(() => localStorage.getItem('char_mutation') || 'Chamas de Mana');
  const [mutationType, setMutationType] = useState(() => localStorage.getItem('char_mutation_type') || 'Elemental');
  const [powerClass, setPowerClass] = useState(() => localStorage.getItem('char_class') || 'Arauto');
  const [level, setLevel] = useState(() => Number(localStorage.getItem('char_level')) || 1);

  // Atributos base (Livro "O Despertar")
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('char_stats');
    return saved ? JSON.parse(saved) : {
      vitalidade: 10,
      agilidade: 10,
      inteligencia: 10,
      forca: 10,
      carisma: 10,
      sabedoria: 10,
      poder: 5
    };
  });

  // Estados Atuais de Vida e Energia (Para alterar em jogo)
  const [currentHp, setCurrentHp] = useState(() => Number(localStorage.getItem('char_current_hp')) || 20);
  const [currentEnergy, setCurrentEnergy] = useState(() => Number(localStorage.getItem('char_current_energy')) || 25);

  // --- CÁLCULOS DO SISTEMA ---
  // Modificador = Math.floor((valor - 10) / 2)
  const getMod = (val) => Math.floor((val - 10) / 2);

  const modVit = getMod(stats.vitalidade);
  const modAgi = getMod(stats.agilidade);
  const modInt = getMod(stats.inteligencia);
  const modFor = getMod(stats.forca);

  // Poder escala +5 a cada nível
  const poderTotal = stats.poder + ((level - 1) * 5);

  // Dado da Classe
  const getClassDice = () => {
    switch (powerClass) {
      case 'Arauto': return { hp: 12, energy: 8 };
      case 'Velocista': return { hp: 8, energy: 8 };
      case 'Espiritualista': return { hp: 6, energy: 12 };
      case 'Brutamontes': return { hp: 10, energy: 10 };
      case 'Manipulador': return { hp: 8, energy: 10 };
      case 'Sábio': return { hp: 6, energy: 12 };
      default: return { hp: 8, energy: 8 };
    }
  };

  const classDice = getClassDice();

  // Fórmulas Base do Livro "O Despertar":
  // HP Máximo Base = 10 + Mod. Vitalidade + Dado da Classe + Poder Total
  const maxHp = 10 + modVit + classDice.hp + poderTotal;

  // Energia Máxima Base = 16 + Dado da Classe + Poder Total
  const maxEnergy = 16 + classDice.energy + poderTotal;

  // Controle de Mana (Nível de controle sobe a cada 3 níveis)
  const controleLevel = Math.min(5, Math.floor((level - 1) / 3));
  const gastoMinimoMana = 15 - controleLevel;

  // CA (Classe de Armadura) = 10 + Maior entre Mod. Agilidade e Mod. Vitalidade
  const ca = 10 + Math.max(modAgi, modVit);

  // Resistências Física e Espiritual
  const resFisica = 10 + stats.vitalidade + stats.forca;
  const resEspiritual = 10 + stats.vitalidade + stats.inteligencia;

  // SALVAR NO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem('char_avatar', avatarUrl);
    localStorage.setItem('char_name', name);
    localStorage.setItem('char_mutation', mutationName);
    localStorage.setItem('char_mutation_type', mutationType);
    localStorage.setItem('char_class', powerClass);
    localStorage.setItem('char_level', level);
    localStorage.setItem('char_stats', JSON.stringify(stats));
    localStorage.setItem('char_current_hp', currentHp);
    localStorage.setItem('char_current_energy', currentEnergy);
  }, [avatarUrl, name, mutationName, mutationType, powerClass, level, stats, currentHp, currentEnergy]);

  const handleStatChange = (stat, value) => {
    setStats(prev => ({ ...prev, [stat]: Number(value) }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CABEÇALHO / IDENTIFICAÇÃO DO PERSONAGEM */}
        <div className="bg-slate-900/90 border border-purple-900/50 rounded-xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-500 font-bold mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="tracking-wider text-sm uppercase">Ficha O Despertar (v1.5)</span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Foto / Avatar */}
            <div className="relative group w-36 h-36 rounded-xl border-2 border-dashed border-purple-500/50 overflow-hidden bg-slate-950 flex flex-col items-center justify-center shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Retrato" className="w-full h-full object-cover" onError={() => setAvatarUrl('')} />
              ) : (
                <div className="text-center p-2 text-slate-500">
                  <User className="w-10 h-10 mx-auto mb-1 opacity-40" />
                  <span className="text-xs">Foto do Mutante</span>
                </div>
              )}

              <label className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-xs text-purple-300 font-medium p-2 text-center">
                <span>Carregar Imagem</span>
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

            {/* Inputs Principais */}
            <div className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Nome</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Classe de Poder</label>
                  <select value={powerClass} onChange={(e) => setPowerClass(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm focus:border-purple-500 outline-none">
                    <option value="Arauto">Arauto (Vitalidade)</option>
                    <option value="Velocista">Velocista (Agilidade)</option>
                    <option value="Espiritualista">Espiritualista (Inteligência)</option>
                    <option value="Brutamontes">Brutamontes (Força)</option>
                    <option value="Manipulador">Manipulador (Carisma)</option>
                    <option value="Sábio">Sábio (Sabedoria)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Nível</label>
                  <input type="number" min="1" max="30" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-amber-400 font-bold font-mono text-sm focus:border-purple-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Nome da Mutação</label>
                  <input type="text" value={mutationName} onChange={(e) => setMutationName(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:border-purple-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase text-slate-400 font-semibold mb-1">Tipo de Mutação</label>
                  <select value={mutationType} onChange={(e) => setMutationType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-purple-300 font-mono text-sm focus:border-purple-500 outline-none">
                    <option value="Tipo U">Tipo U (Único)</option>
                    <option value="Tipo N">Tipo N (Natural)</option>
                    <option value="Tipo T">Tipo T (Terreno)</option>
                    <option value="Tipo E">Tipo E (Elemental)</option>
                    <option value="Tipo M">Tipo M (Mental/Sensorial)</option>
                  </select>
                </div>
              </div>

              {/* URL Alternativa */}
              <div>
                <input type="text" placeholder="Ou cole a URL da imagem aqui..." value={avatarUrl.startsWith('data:') ? '' : avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full bg-slate-950/40 border border-slate-800 rounded px-2 py-1 text-xs text-slate-400 focus:outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* BARRAS DE STATUS PRINCIPAIS (HP, ENERGIA/MANA, CA, CONTROLE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Vida (HP) */}
          <div className="bg-slate-900/80 border border-red-900/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-red-400 font-bold mb-2">
              <div className="flex items-center gap-2"><Heart className="w-5 h-5" /> Vida (HP)</div>
              <span className="text-xs bg-red-950 px-2 py-0.5 rounded text-red-300">Max: {maxHp}</span>
            </div>
            <div className="flex items-center gap-2 my-2">
              <input type="number" value={currentHp} onChange={(e) => setCurrentHp(Number(e.target.value))} className="w-full bg-slate-950 border border-red-800 text-center font-mono text-2xl font-bold text-red-400 rounded py-1" />
              <span className="text-slate-500 font-bold">/</span>
              <span className="text-xl font-bold font-mono text-slate-400">{maxHp}</span>
            </div>
          </div>

          {/* Energia / Mana */}
          <div className="bg-slate-900/80 border border-cyan-900/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-cyan-400 font-bold mb-2">
              <div className="flex items-center gap-2"><Zap className="w-5 h-5" /> Energia / Mana</div>
              <span className="text-xs bg-cyan-950 px-2 py-0.5 rounded text-cyan-300">Max: {maxEnergy}</span>
            </div>
            <div className="flex items-center gap-2 my-2">
              <input type="number" value={currentEnergy} onChange={(e) => setCurrentEnergy(Number(e.target.value))} className="w-full bg-slate-950 border border-cyan-800 text-center font-mono text-2xl font-bold text-cyan-400 rounded py-1" />
              <span className="text-slate-500 font-bold">/</span>
              <span className="text-xl font-bold font-mono text-slate-400">{maxEnergy}</span>
            </div>
          </div>

          {/* Armadura e Resistências */}
          <div className="bg-slate-900/80 border border-amber-900/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
              <Shield className="w-5 h-5" /> Defesas
            </div>
            <div className="grid grid-cols-2 gap-2 text-center my-1">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-400 uppercase">CA Base</span>
                <span className="text-xl font-bold text-amber-400">{ca}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="block text-[10px] text-slate-400 uppercase">Res. Física</span>
                <span className="text-xl font-bold text-slate-200">{resFisica}</span>
              </div>
            </div>
          </div>

          {/* Controle de Mana */}
          <div className="bg-slate-900/80 border border-purple-900/50 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
              <Layers className="w-5 h-5" /> Controle de Mana
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>Nível Controle:</span> <strong className="text-purple-300">Nível {controleLevel}</strong></div>
              <div className="flex justify-between"><span>Gasto Mínimo:</span> <strong className="text-cyan-300">{gastoMinimoMana} Mana</strong></div>
              <div className="flex justify-between"><span>Res. Espiritual:</span> <strong className="text-indigo-300">{resEspiritual}</strong></div>
            </div>
          </div>

        </div>

        {/* PAINEL DE ATRIBUTOS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-amber-500 mb-4 flex items-center gap-2">
            <Sword className="w-5 h-5" /> Atributos do Mutante
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { id: 'vitalidade', label: 'Vitalidade', val: stats.vitalidade },
              { id: 'agilidade', label: 'Agilidade', val: stats.agilidade },
              { id: 'inteligencia', label: 'Inteligência', val: stats.inteligencia },
              { id: 'forca', label: 'Força', val: stats.forca },
              { id: 'carisma', label: 'Carisma', val: stats.carisma },
              { id: 'sabedoria', label: 'Sabedoria', val: stats.sabedoria },
              { id: 'poder', label: 'Poder Base', val: stats.poder },
            ].map((attr) => {
              const mod = getMod(attr.val);
              return (
                <div key={attr.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-center flex flex-col justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{attr.label}</span>
                  <input 
                    type="number" 
                    value={attr.val} 
                    onChange={(e) => handleStatChange(attr.id, e.target.value)}
                    className="w-full bg-transparent text-center font-mono text-2xl font-bold text-amber-400 my-1 focus:outline-none"
                  />
                  {attr.id !== 'poder' ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 text-purple-300 border border-slate-800">
                      Mod: {mod >= 0 ? `+${mod}` : mod}
                    </span>
                  ) : (
                    <span className="text-[10px] text-cyan-400 font-semibold">
                      Total: {poderTotal}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}