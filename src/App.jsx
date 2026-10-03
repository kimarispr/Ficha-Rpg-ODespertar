import React, { useState, useEffect } from 'react';
import { Shield, Heart, Zap, Sparkles, Sword, Flame, BookOpen, Layers } from 'lucide-react';

export default function App() {
  // --- ESTADOS DO PERSONAGEM ---
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('char_avatar') || '');
  const [name, setName] = useState(() => localStorage.getItem('char_name') || 'Valerius Vane');
  const [mutationName, setMutationName] = useState(() => localStorage.getItem('char_mutation') || 'Chamas de Mana');
  const [mutationType, setMutationType] = useState(() => localStorage.getItem('char_mutation_type') || 'Tipo E');
  const [powerClass, setPowerClass] = useState(() => localStorage.getItem('char_class') || 'Arauto');
  const [level, setLevel] = useState(() => Number(localStorage.getItem('char_level')) || 1);

  // Atributos Base
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

  // Bônus/Ajustes Manuais para Valores Máximos e Defesas
  const [customBonus, setCustomBonus] = useState(() => {
    const saved = localStorage.getItem('char_custom_bonus');
    return saved ? JSON.parse(saved) : {
      hp: 0,
      energy: 0,
      resFisica: 0,
      resEspiritual: 0,
      ca: 0
    };
  });

  // Modificador genérico = Math.floor((valor - 10) / 2)
  const getMod = (val) => Math.floor((val - 10) / 2);

  const modVit = getMod(stats.vitalidade);
  const modAgi = getMod(stats.agilidade);
  const modInt = getMod(stats.inteligencia);
  const modFor = getMod(stats.forca);

  // Poder escala +5 por nível
  const poderTotal = stats.poder + ((level - 1) * 5);

  // --- TABELA DO SISTEMA O DESPERTAR ---
  const classData = {
    Arauto: { hpDice: 12, energyDice: 8, mainAttr: 'vitalidade' },
    Velocista: { hpDice: 8, energyDice: 8, mainAttr: 'agilidade' },
    Espiritualista: { hpDice: 6, energyDice: 12, mainAttr: 'inteligencia' },
    Brutamontes: { hpDice: 10, energyDice: 10, mainAttr: 'forca' },
    Manipulador: { hpDice: 8, energyDice: 10, mainAttr: 'carisma' },
    Sábio: { hpDice: 6, energyDice: 12, mainAttr: 'sabedoria' }
  };

  const currentClassInfo = classData[powerClass] || classData.Arauto;

  // Cálculos Automáticos de Máximos
  const calculatedMaxHp = 10 + modVit + currentClassInfo.hpDice + poderTotal + Number(customBonus.hp);
  const calculatedMaxEnergy = 16 + currentClassInfo.energyDice + poderTotal + Number(customBonus.energy);
  
  // Defesas
  const calculatedResFisica = 10 + stats.vitalidade + stats.forca + Number(customBonus.resFisica);
  const calculatedResEspiritual = 10 + stats.vitalidade + stats.inteligencia + Number(customBonus.resEspiritual);
  const calculatedCa = 10 + Math.max(modAgi, modVit) + Number(customBonus.ca);

  // Controle de Mana
  const controleLevel = Math.min(5, Math.floor((level - 1) / 3));
  const gastoMinimoMana = Math.max(1, 15 - controleLevel);

  // Valores Atuais de Jogo
  const [currentHp, setCurrentHp] = useState(() => Number(localStorage.getItem('char_current_hp')) || calculatedMaxHp);
  const [currentEnergy, setCurrentEnergy] = useState(() => Number(localStorage.getItem('char_current_energy')) || calculatedMaxEnergy);

  // Salvar alterações
  useEffect(() => {
    localStorage.setItem('char_avatar', avatarUrl);
    localStorage.setItem('char_name', name);
    localStorage.setItem('char_mutation', mutationName);
    localStorage.setItem('char_mutation_type', mutationType);
    localStorage.setItem('char_class', powerClass);
    localStorage.setItem('char_level', level);
    localStorage.setItem('char_stats', JSON.stringify(stats));
    localStorage.setItem('char_custom_bonus', JSON.stringify(customBonus));
    localStorage.setItem('char_current_hp', currentHp);
    localStorage.setItem('char_current_energy', currentEnergy);
  }, [avatarUrl, name, mutationName, mutationType, powerClass, level, stats, customBonus, currentHp, currentEnergy]);

  const handleStatChange = (stat, value) => {
    setStats(prev => ({ ...prev, [stat]: Number(value) }));
  };

  const handleBonusChange = (field, value) => {
    setCustomBonus(prev => ({ ...prev, [field]: Number(value) }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* CABEÇALHO DESIGN ESTILO D&D */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            {/* Foto / Imagem do Personagem */}
            <div className="relative group w-28 h-28 rounded-lg border-2 border-slate-700 bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Retrato" className="w-full h-full object-cover" onError={() => setAvatarUrl('')} />
              ) : (
                <div className="text-center p-2 text-slate-600">
                  <span className="text-xs">Foto</span>
                </div>
              )}
              <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[10px] text-amber-400 font-bold p-1 text-center">
                Alterar Foto
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

            {/* Campos de Nome, Classe e Mutação */}
            <div className="flex-1 space-y-3 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase text-amber-500 font-bold tracking-wider mb-1">Nome do Personagem</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-lg font-bold text-slate-100 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-amber-500 font-bold tracking-wider mb-1">Nível</label>
                  <input type="number" min="1" max="30" value={level} onChange={(e) => setLevel(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-center font-bold text-amber-400 focus:border-amber-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-semibold mb-1">Classe de Poder</label>
                  <select value={powerClass} onChange={(e) => setPowerClass(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-200 focus:border-amber-500 outline-none">
                    <option value="Arauto">Arauto (d12 HP / d8 Energ.)</option>
                    <option value="Velocista">Velocista (d8 HP / d8 Energ.)</option>
                    <option value="Espiritualista">Espiritualista (d6 HP / d12 Energ.)</option>
                    <option value="Brutamontes">Brutamontes (d10 HP / d10 Energ.)</option>
                    <option value="Manipulador">Manipulador (d8 HP / d10 Energ.)</option>
                    <option value="Sábio">Sábio (d6 HP / d12 Energ.)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-semibold mb-1">Mutação</label>
                  <input type="text" value={mutationName} onChange={(e) => setMutationName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-200 focus:border-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-semibold mb-1">Tipo de Mutação</label>
                  <select value={mutationType} onChange={(e) => setMutationType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-purple-400 focus:border-amber-500 outline-none">
                    <option value="Tipo U">Tipo U (Único)</option>
                    <option value="Tipo N">Tipo N (Natural)</option>
                    <option value="Tipo T">Tipo T (Terreno)</option>
                    <option value="Tipo E">Tipo E (Elemental)</option>
                    <option value="Tipo M">Tipo M (Mental)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BARRAS DE STATUS ESTILO CLÁSSICO D&D */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Pontos de Vida (HP) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-red-400 font-bold">
                <Heart className="w-5 h-5 fill-red-400/20" /> Pontos de Vida
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <span>Edit. Máx:</span>
                <input type="number" value={customBonus.hp} onChange={(e) => handleBonusChange('hp', e.target.value)} className="w-12 bg-slate-950 border border-slate-800 text-center font-bold text-red-400 rounded" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <input type="number" value={currentHp} onChange={(e) => setCurrentHp(Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-800 rounded py-1 text-center font-mono text-2xl font-bold text-red-400 focus:outline-none" />
              <span className="text-slate-500 text-xl font-bold">/</span>
              <span className="text-2xl font-bold font-mono text-slate-300">{calculatedMaxHp}</span>
            </div>

            {/* Barra Visual */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-red-500 h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (currentHp / calculatedMaxHp) * 100))}%` }} />
            </div>
          </div>

          {/* Energia / Mana */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Zap className="w-5 h-5 fill-cyan-400/20" /> Energia / Mana
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <span>Edit. Máx:</span>
                <input type="number" value={customBonus.energy} onChange={(e) => handleBonusChange('energy', e.target.value)} className="w-12 bg-slate-950 border border-slate-800 text-center font-bold text-cyan-400 rounded" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input type="number" value={currentEnergy} onChange={(e) => setCurrentEnergy(Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-800 rounded py-1 text-center font-mono text-2xl font-bold text-cyan-400 focus:outline-none" />
              <span className="text-slate-500 text-xl font-bold">/</span>
              <span className="text-2xl font-bold font-mono text-slate-300">{calculatedMaxEnergy}</span>
            </div>

            {/* Barra Visual */}
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-cyan-500 h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (currentEnergy / calculatedMaxEnergy) * 100))}%` }} />
            </div>
          </div>

        </div>

        {/* DEFESAS & RESISTÊNCIAS ESTILO ESCUDOS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Classe de Armadura</span>
            <span className="text-2xl font-bold text-amber-400">{calculatedCa}</span>
            <div className="flex justify-center items-center gap-1 text-[10px] text-slate-500">
              <span>Bônus:</span>
              <input type="number" value={customBonus.ca} onChange={(e) => handleBonusChange('ca', e.target.value)} className="w-10 bg-slate-950 text-center text-amber-400 border border-slate-800 rounded" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Res. Física</span>
            <span className="text-2xl font-bold text-slate-200">{calculatedResFisica}</span>
            <div className="flex justify-center items-center gap-1 text-[10px] text-slate-500">
              <span>Bônus:</span>
              <input type="number" value={customBonus.resFisica} onChange={(e) => handleBonusChange('resFisica', e.target.value)} className="w-10 bg-slate-950 text-center text-slate-200 border border-slate-800 rounded" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Res. Espiritual</span>
            <span className="text-2xl font-bold text-indigo-400">{calculatedResEspiritual}</span>
            <div className="flex justify-center items-center gap-1 text-[10px] text-slate-500">
              <span>Bônus:</span>
              <input type="number" value={customBonus.resEspiritual} onChange={(e) => handleBonusChange('resEspiritual', e.target.value)} className="w-10 bg-slate-950 text-center text-indigo-400 border border-slate-800 rounded" />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Controle / Gasto</span>
            <span className="text-lg font-bold text-purple-400">Nível {controleLevel}</span>
            <span className="block text-[10px] text-cyan-400">Min. {gastoMinimoMana} Mana</span>
          </div>

        </div>

        {/* ATRIBUTOS ESTILO BLOCOS D&D */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-2">
            <Sword className="w-4 h-4" /> Atributos Base
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { id: 'vitalidade', label: 'Vitalidade', val: stats.vitalidade },
              { id: 'agilidade', label: 'Agilidade', val: stats.agilidade },
              { id: 'inteligencia', label: 'Inteligência', val: stats.inteligencia },
              { id: 'forca', label: 'Força', val: stats.forca },
              { id: 'carisma', label: 'Carisma', val: stats.carisma },
              { id: 'sabedoria', label: 'Sabedoria', val: stats.sabedoria },
              { id: 'poder', label: 'Poder', val: stats.poder },
            ].map((attr) => {
              const mod = getMod(attr.val);
              const isMainAttr = currentClassInfo.mainAttr === attr.id;

              return (
                <div key={attr.id} className={`bg-slate-950 border rounded-lg p-3 text-center flex flex-col items-center justify-between ${isMainAttr ? 'border-amber-500' : 'border-slate-800'}`}>
                  <span className="text-[10px] font-bold uppercase text-slate-400">{attr.label}</span>
                  
                  {/* Modificador Grande em Destaque */}
                  {attr.id !== 'poder' ? (
                    <span className="text-xl font-bold text-amber-400 my-1">
                      {mod >= 0 ? `+${mod}` : mod}
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-cyan-400 my-1">
                      {poderTotal}
                    </span>
                  )}

                  {/* Valor Bruto Pequeno Embaixo */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 border-t border-slate-900 pt-1 w-full justify-center">
                    <span>Valor:</span>
                    <input 
                      type="number" 
                      value={attr.val} 
                      onChange={(e) => handleStatChange(attr.id, e.target.value)} 
                      className="w-8 bg-transparent text-center font-bold text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}