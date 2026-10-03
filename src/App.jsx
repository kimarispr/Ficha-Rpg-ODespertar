import React, { useState, useEffect } from 'react';
import { 
  Shield, Heart, Zap, Sparkles, Sword, Flame, BookOpen, 
  Layers, Minus, Plus, Target, Backpack, FileText, Trash2, PlusCircle 
} from 'lucide-react';

export default function App() {
  // --- NAVEGAÇÃO DE ABAS ---
  const [activeTab, setActiveTab] = useState('geral');

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

  // Edição Manual Direta (Max HP/Energia e Defesas/Resistências)
  const [customValues, setCustomValues] = useState(() => {
    const saved = localStorage.getItem('char_custom_values');
    return saved ? JSON.parse(saved) : {
      maxHp: null,
      maxEnergy: null,
      resFisica: null,
      resEspiritual: null,
      ca: null
    };
  });

  // --- HABILIDADES / MAGIAS COM SEPARAÇÃO POR NÍVEL ---
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('char_skills');
    return saved ? JSON.parse(saved) : {
      simples: [],
      normais: [],
      grandes: [],
      grandiosa: [],
      supremas: [],
      absolutas: []
    };
  });

  // --- ARMAS / COMBATE ---
  const [weapons, setWeapons] = useState(() => {
    const saved = localStorage.getItem('char_weapons');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Espada Longa', type: 'Corte', dice: '1d8', bonus: '+2', desc: 'Arma de uma mão' }
    ];
  });

  // --- INVENTÁRIO ---
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('char_inventory');
    return saved ? JSON.parse(saved) : [
      { id: 1, item: 'Poção de Vida', quantity: 3, weight: '0.5kg' }
    ];
  });

  // --- PERÍCIAS D&D (PROEFICIÊNCIAS) ---
  const initialSkillsDnd = {
    acrobacia: { name: 'Acrobacia', attr: 'agilidade', prof: false },
    adestrarAnimais: { name: 'Adestrar Animais', attr: 'sabedoria', prof: false },
    arcanismo: { name: 'Arcanismo', attr: 'inteligencia', prof: false },
    atletismo: { name: 'Atletismo', attr: 'forca', prof: false },
    atuacao: { name: 'Atuação', attr: 'carisma', prof: false },
    enganacao: { name: 'Enganação', attr: 'carisma', prof: false },
    furtividade: { name: 'Furtividade', attr: 'agilidade', prof: false },
    historia: { name: 'História', attr: 'inteligencia', prof: false },
    intimidacao: { name: 'Intimidação', attr: 'carisma', prof: false },
    intuicao: { name: 'Intuição', attr: 'sabedoria', prof: false },
    investigacao: { name: 'Investigação', attr: 'inteligencia', prof: false },
    medicina: { name: 'Medicina', attr: 'sabedoria', prof: false },
    natureza: { name: 'Natureza', attr: 'inteligencia', prof: false },
    percepcao: { name: 'Percepção', attr: 'sabedoria', prof: false },
    persuasao: { name: 'Persuasão', attr: 'carisma', prof: false },
    prestidigitacao: { name: 'Prestidigitação', attr: 'agilidade', prof: false },
    religiao: { name: 'Religião', attr: 'inteligencia', prof: false },
    sobrevivencia: { name: 'Sobrevivência', attr: 'sabedoria', prof: false }
  };

  const [proficiencies, setProficiencies] = useState(() => {
    const saved = localStorage.getItem('char_proficiencies');
    return saved ? JSON.parse(saved) : initialSkillsDnd;
  });

  // --- ANOTAÇÕES ---
  const [notes, setNotes] = useState(() => localStorage.getItem('char_notes') || '');

  // Modificador genérico
  const getMod = (val) => Math.floor((val - 10) / 2);

  const modVit = getMod(stats.vitalidade);
  const modAgi = getMod(stats.agilidade);
  const modInt = getMod(stats.inteligencia);
  const modFor = getMod(stats.forca);
  const profBonus = Math.ceil(1 + (level / 4)); // Bônus de Proficiência escala com nível

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
  const calculatedMaxHp = 10 + modVit + currentClassInfo.hpDice + poderTotal;
  const calculatedMaxEnergy = 16 + currentClassInfo.energyDice + poderTotal;
  
  // Defesas Automáticas
  const calculatedResFisica = 10 + stats.vitalidade + stats.forca;
  const calculatedResEspiritual = 10 + stats.vitalidade + stats.inteligencia;
  const calculatedCa = 10 + Math.max(modAgi, modVit);

  // Valores Finais (Auto ou Editados Manualmente)
  const maxHp = customValues.maxHp !== null && customValues.maxHp !== '' ? Number(customValues.customMaxHp ?? customValues.maxHp) : calculatedMaxHp;
  const maxEnergy = customValues.maxEnergy !== null && customValues.maxEnergy !== '' ? Number(customValues.customMaxEnergy ?? customValues.maxEnergy) : calculatedMaxEnergy;
  const resFisica = customValues.resFisica !== null && customValues.resFisica !== '' ? Number(customValues.resFisica) : calculatedResFisica;
  const resEspiritual = customValues.resEspiritual !== null && customValues.resEspiritual !== '' ? Number(customValues.resEspiritual) : calculatedResEspiritual;
  const ca = customValues.ca !== null && customValues.ca !== '' ? Number(customValues.ca) : calculatedCa;

  // Controle de Mana
  const controleLevel = Math.min(5, Math.floor((level - 1) / 3));
  const gastoMinimoMana = Math.max(1, 15 - controleLevel);

  // Valores Atuais de HP e Energia
  const [currentHp, setCurrentHp] = useState(() => Number(localStorage.getItem('char_current_hp')) || maxHp);
  const [currentEnergy, setCurrentEnergy] = useState(() => Number(localStorage.getItem('char_current_energy')) || maxEnergy);

  // Salvar alterações
  useEffect(() => {
    localStorage.setItem('char_avatar', avatarUrl);
    localStorage.setItem('char_name', name);
    localStorage.setItem('char_mutation', mutationName);
    localStorage.setItem('char_mutation_type', mutationType);
    localStorage.setItem('char_class', powerClass);
    localStorage.setItem('char_level', level);
    localStorage.setItem('char_stats', JSON.stringify(stats));
    localStorage.setItem('char_custom_values', JSON.stringify(customValues));
    localStorage.setItem('char_current_hp', currentHp);
    localStorage.setItem('char_current_energy', currentEnergy);
    localStorage.setItem('char_skills', JSON.stringify(skills));
    localStorage.setItem('char_weapons', JSON.stringify(weapons));
    localStorage.setItem('char_inventory', JSON.stringify(inventory));
    localStorage.setItem('char_proficiencies', JSON.stringify(proficiencies));
    localStorage.setItem('char_notes', notes);
  }, [avatarUrl, name, mutationName, mutationType, powerClass, level, stats, customValues, currentHp, currentEnergy, skills, weapons, inventory, proficiencies, notes]);

  const handleStatChange = (stat, value) => {
    setStats(prev => ({ ...prev, [stat]: Number(value) }));
  };

  const handleCustomValueChange = (field, value) => {
    setCustomValues(prev => ({ ...prev, [field]: value === '' ? null : Number(value) }));
  };

  // Manipuladores de Botões de Modificação (-1, +1, -10, +10)
  const adjustHp = (amount) => {
    setCurrentHp(prev => Math.min(maxHp, Math.max(0, prev + amount)));
  };

  const adjustEnergy = (amount) => {
    setCurrentEnergy(prev => Math.min(maxEnergy, Math.max(0, prev + amount)));
  };

  // Funções de Gerenciamento de Habilidades
  const addSkill = (category) => {
    const name = prompt('Nome da Habilidade:');
    if (!name) return;
    const desc = prompt('Descrição / Custo de Mana / Efeito:') || '';
    setSkills(prev => ({
      ...prev,
      [category]: [...prev[category], { id: Date.now(), name, desc }]
    }));
  };

  const removeSkill = (category, id) => {
    setSkills(prev => ({
      ...prev,
      [category]: prev[category].filter(s => s.id !== id)
    }));
  };

  // Armas
  const addWeapon = () => {
    const name = prompt('Nome da Arma:');
    if (!name) return;
    const dice = prompt('Dados de Dano (ex: 1d8, 2d6):') || '1d6';
    const bonus = prompt('Bônus de Dano/Ataque (ex: +3):') || '+0';
    const type = prompt('Tipo de Dano (ex: Corte, Perfuração):') || 'Físico';
    const desc = prompt('Observações:') || '';

    setWeapons(prev => [...prev, { id: Date.now(), name, dice, bonus, type, desc }]);
  };

  const removeWeapon = (id) => {
    setWeapons(prev => prev.filter(w => w.id !== id));
  };

  // Inventário
  const addItem = () => {
    const item = prompt('Nome do Item:');
    if (!item) return;
    const quantity = Number(prompt('Quantidade:') || 1);
    const weight = prompt('Peso/Info:') || '-';

    setInventory(prev => [...prev, { id: Date.now(), item, quantity, weight }]);
  };

  const removeItem = (id) => {
    setInventory(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

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

        {/* NAVEGAÇÃO ENTRE ABAS */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'geral', label: 'Geral & Status', icon: Shield },
            { id: 'pericias', label: 'Perícias', icon: Target },
            { id: 'combate', label: 'Combate & Armas', icon: Sword },
            { id: 'habilidades', label: 'Habilidades & Magias', icon: Sparkles },
            { id: 'inventario', label: 'Inventário', icon: Backpack },
            { id: 'anotacoes', label: 'Anotações', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                  active 
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* --- ABA 1: GERAL & STATUS --- */}
        {activeTab === 'geral' && (
          <div className="space-y-6">
            {/* BARRAS DE STATUS COM BOTÕES DE EDICIONAL -1, +1, -10, +10 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pontos de Vida (HP) */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-red-400 font-bold">
                    <Heart className="w-5 h-5 fill-red-400/20" /> Pontos de Vida
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <span>Editar Máx:</span>
                    <input 
                      type="number" 
                      placeholder={calculatedMaxHp}
                      value={customValues.maxHp ?? ''} 
                      onChange={(e) => handleCustomValueChange('maxHp', e.target.value)} 
                      className="w-14 bg-slate-950 border border-slate-800 text-center font-bold text-red-400 rounded py-0.5 focus:outline-none focus:border-red-500" 
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="number" value={currentHp} onChange={(e) => setCurrentHp(Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-800 rounded py-1 text-center font-mono text-2xl font-bold text-red-400 focus:outline-none" />
                    <span className="text-slate-500 text-xl font-bold">/</span>
                    <span className="text-2xl font-bold font-mono text-slate-300">{maxHp}</span>
                  </div>

                  {/* Botões de Alteração Rápida */}
                  <div className="flex gap-1">
                    <button onClick={() => adjustHp(-10)} className="bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold px-2 py-1.5 rounded border border-red-800/50">-10</button>
                    <button onClick={() => adjustHp(-1)} className="bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold px-2 py-1.5 rounded border border-red-800/50">-1</button>
                    <button onClick={() => adjustHp(1)} className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-2 py-1.5 rounded border border-emerald-800/50">+1</button>
                    <button onClick={() => adjustHp(10)} className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-2 py-1.5 rounded border border-emerald-800/50">+10</button>
                  </div>
                </div>

                {/* Barra Visual */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-red-500 h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (currentHp / maxHp) * 100))}%` }} />
                </div>
              </div>

              {/* Energia / Mana */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <Zap className="w-5 h-5 fill-cyan-400/20" /> Energia / Mana
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <span>Editar Máx:</span>
                    <input 
                      type="number" 
                      placeholder={calculatedMaxEnergy}
                      value={customValues.maxEnergy ?? ''} 
                      onChange={(e) => handleCustomValueChange('maxEnergy', e.target.value)} 
                      className="w-14 bg-slate-950 border border-slate-800 text-center font-bold text-cyan-400 rounded py-0.5 focus:outline-none focus:border-cyan-500" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input type="number" value={currentEnergy} onChange={(e) => setCurrentEnergy(Number(e.target.value))} className="w-24 bg-slate-950 border border-slate-800 rounded py-1 text-center font-mono text-2xl font-bold text-cyan-400 focus:outline-none" />
                    <span className="text-slate-500 text-xl font-bold">/</span>
                    <span className="text-2xl font-bold font-mono text-slate-300">{maxEnergy}</span>
                  </div>

                  {/* Botões de Alteração Rápida */}
                  <div className="flex gap-1">
                    <button onClick={() => adjustEnergy(-10)} className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-bold px-2 py-1.5 rounded border border-cyan-800/50">-10</button>
                    <button onClick={() => adjustEnergy(-1)} className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-bold px-2 py-1.5 rounded border border-cyan-800/50">-1</button>
                    <button onClick={() => adjustEnergy(1)} className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-2 py-1.5 rounded border border-emerald-800/50">+1</button>
                    <button onClick={() => adjustEnergy(10)} className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-2 py-1.5 rounded border border-emerald-800/50">+10</button>
                  </div>
                </div>

                {/* Barra Visual */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-cyan-500 h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (currentEnergy / maxEnergy) * 100))}%` }} />
                </div>
              </div>

            </div>

            {/* DEFESAS & RESISTÊNCIAS COM EDIÇÃO DIRETA NO VALOR */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Classe de Armadura</span>
                <input 
                  type="number" 
                  value={ca} 
                  onChange={(e) => handleCustomValueChange('ca', e.target.value)} 
                  className="w-full bg-transparent text-center text-2xl font-bold text-amber-400 focus:outline-none" 
                />
                <span className="block text-[9px] text-slate-500">Base Auto: {calculatedCa}</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Res. Física</span>
                <input 
                  type="number" 
                  value={resFisica} 
                  onChange={(e) => handleCustomValueChange('resFisica', e.target.value)} 
                  className="w-full bg-transparent text-center text-2xl font-bold text-slate-200 focus:outline-none" 
                />
                <span className="block text-[9px] text-slate-500">Base Auto: {calculatedResFisica}</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Res. Espiritual</span>
                <input 
                  type="number" 
                  value={resEspiritual} 
                  onChange={(e) => handleCustomValueChange('resEspiritual', e.target.value)} 
                  className="w-full bg-transparent text-center text-2xl font-bold text-indigo-400 focus:outline-none" 
                />
                <span className="block text-[9px] text-slate-500">Base Auto: {calculatedResEspiritual}</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-1 flex flex-col justify-center">
                <span className="block text-[10px] font-bold uppercase text-slate-400">Controle de Mana</span>
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
                      
                      {attr.id !== 'poder' ? (
                        <span className="text-xl font-bold text-amber-400 my-1">
                          {mod >= 0 ? `+${mod}` : mod}
                        </span>
                      ) : (
                        <span className="text-xl font-bold text-cyan-400 my-1">
                          {poderTotal}
                        </span>
                      )}

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
        )}

        {/* --- ABA 2: PERÍCIAS (D&D 5E) --- */}
        {activeTab === 'pericias' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
                <Target className="w-4 h-4" /> Perícias do Personagem
              </h3>
              <span className="text-xs text-slate-400 font-mono">Bônus de Proficiência: <strong className="text-amber-400">+{profBonus}</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(proficiencies).map(([key, item]) => {
                const attrMod = getMod(stats[item.attr] || 10);
                const totalBonus = attrMod + (item.prof ? profBonus : 0);

                return (
                  <div key={key} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-2.5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={item.prof} 
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setProficiencies(prev => ({
                            ...prev,
                            [key]: { ...prev[key], prof: checked }
                          }));
                        }}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                      <div>
                        <span className="block text-xs font-bold text-slate-200">{item.name}</span>
                        <span className="text-[10px] uppercase text-slate-500">{item.attr}</span>
                      </div>
                    </div>

                    <span className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${item.prof ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-400'}`}>
                      {totalBonus >= 0 ? `+${totalBonus}` : totalBonus}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- ABA 3: COMBATE & ARMAS --- */}
        {activeTab === 'combate' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
                <Sword className="w-4 h-4" /> Armas & Ataques
              </h3>
              <button onClick={addWeapon} className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded text-xs transition-all">
                <PlusCircle className="w-3.5 h-3.5" /> Adicionar Arma
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weapons.map((w) => (
                <div key={w.id} className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2 relative group">
                  <button onClick={() => removeWeapon(w.id)} className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <h4 className="font-bold text-amber-400 text-base">{w.name}</h4>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-900 rounded border border-slate-800/80">
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">Dados Dano</span>
                      <strong className="text-slate-200">{w.dice}</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">Bônus</span>
                      <strong className="text-amber-400">{w.bonus}</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-slate-500">Tipo</span>
                      <strong className="text-purple-400">{w.type}</strong>
                    </div>
                  </div>

                  {w.desc && <p className="text-xs text-slate-400 italic">{w.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ABA 4: HABILIDADES & MAGIAS POR CATEGORIA --- */}
        {activeTab === 'habilidades' && (
          <div className="space-y-6">
            {[
              { id: 'simples', name: 'Habilidades Simples', color: 'border-slate-700 text-slate-300' },
              { id: 'normais', name: 'Habilidades Normais', color: 'border-blue-800 text-blue-400' },
              { id: 'grandes', name: 'Habilidades Grandes', color: 'border-purple-800 text-purple-400' },
              { id: 'grandiosa', name: 'Habilidades Grandiosas', color: 'border-amber-800 text-amber-400' },
              { id: 'supremas', name: 'Habilidades Supremas', color: 'border-red-800 text-red-400' },
              { id: 'absolutas', name: 'Habilidades Absolutas', color: 'border-cyan-500 text-cyan-300' },
            ].map((cat) => (
              <div key={cat.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className={`text-sm font-bold uppercase tracking-wider ${cat.color}`}>{cat.name}</h4>
                  <button onClick={() => addSkill(cat.id)} className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-2.5 py-1 rounded transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skills[cat.id]?.map((s) => (
                    <div key={s.id} className="bg-slate-950 border border-slate-800 rounded p-3 relative space-y-1">
                      <button onClick={() => removeSkill(cat.id, s.id)} className="absolute top-2.5 right-2.5 text-slate-600 hover:text-red-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <h5 className="font-bold text-xs text-slate-200">{s.name}</h5>
                      <p className="text-xs text-slate-400">{s.desc}</p>
                    </div>
                  ))}
                  {skills[cat.id]?.length === 0 && (
                    <span className="text-xs text-slate-600 italic">Nenhuma habilidade cadastrada nesta categoria.</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- ABA 5: INVENTÁRIO --- */}
        {activeTab === 'inventario' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
                <Backpack className="w-4 h-4" /> Inventário & Equipamentos
              </h3>
              <button onClick={addItem} className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded text-xs transition-all">
                <PlusCircle className="w-3.5 h-3.5" /> Adicionar Item
              </button>
            </div>

            <div className="space-y-2">
              {inventory.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs">
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-200">{item.item}</span>
                    <span className="text-slate-500">Qtd: <strong className="text-amber-400">{item.quantity}</strong></span>
                    <span className="text-slate-500">Peso: <strong className="text-slate-400">{item.weight}</strong></span>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ABA 6: ANOTAÇÕES --- */}
        {activeTab === 'anotacoes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Anotações da Campanha
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escreva aqui suas anotações, pistas, nomes de NPCs, locais..."
              className="w-full h-80 bg-slate-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-none font-mono"
            />
          </div>
        )}

      </div>
    </div>
  );
}