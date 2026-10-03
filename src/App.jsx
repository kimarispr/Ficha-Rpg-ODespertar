import React, { useState, useEffect } from 'react';
import { 
  Shield, Heart, Zap, Sparkles, Sword, BookOpen, 
  Target, Backpack, FileText, Trash2, PlusCircle, Dices, X 
} from 'lucide-react';

export default function App() {
  // --- NAVEGAÇÃO DE ABAS ---
  const [activeTab, setActiveTab] = useState('geral');

  // --- HISTÓRICO DE ROLAGENS DE DADOS ---
  const [rollResult, setRollResult] = useState(null);

  // --- MODAIS CUSTOMIZADOS ---
  const [modalType, setModalType] = useState(null); // 'weapon' | 'skill' | 'inventory'
  const [selectedCategory, setSelectedCategory] = useState('simples'); // Para habilidades

  // Formulário Modal: Arma
  const [weaponForm, setWeaponForm] = useState({ name: '', dice: '1d8', bonus: '+0', type: 'Corte', desc: '' });
  // Formulário Modal: Habilidade
  const [skillForm, setSkillForm] = useState({ name: '', dice: '2d6', cost: '5 Mana', desc: '' });
  // Formulário Modal: Item
  const [itemForm, setItemForm] = useState({ item: '', quantity: 1, weight: '0.5kg' });

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

  // --- HABILIDADES / MAGIAS POR NÍVEL ---
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
  const profBonus = Math.ceil(1 + (level / 4));

  const poderTotal = stats.poder + ((level - 1) * 5);

  const classData = {
    Arauto: { hpDice: 12, energyDice: 8, mainAttr: 'vitalidade' },
    Velocista: { hpDice: 8, energyDice: 8, mainAttr: 'agilidade' },
    Espiritualista: { hpDice: 6, energyDice: 12, mainAttr: 'inteligencia' },
    Brutamontes: { hpDice: 10, energyDice: 10, mainAttr: 'forca' },
    Manipulador: { hpDice: 8, energyDice: 10, mainAttr: 'carisma' },
    Sábio: { hpDice: 6, energyDice: 12, mainAttr: 'sabedoria' }
  };

  const currentClassInfo = classData[powerClass] || classData.Arauto;

  const calculatedMaxHp = 10 + modVit + currentClassInfo.hpDice + poderTotal;
  const calculatedMaxEnergy = 16 + currentClassInfo.energyDice + poderTotal;
  
  const calculatedResFisica = 10 + stats.vitalidade + stats.forca;
  const calculatedResEspiritual = 10 + stats.vitalidade + stats.inteligencia;
  const calculatedCa = 10 + Math.max(modAgi, modVit);

  const maxHp = customValues.maxHp !== null && customValues.maxHp !== '' ? Number(customValues.maxHp) : calculatedMaxHp;
  const maxEnergy = customValues.maxEnergy !== null && customValues.maxEnergy !== '' ? Number(customValues.maxEnergy) : calculatedMaxEnergy;
  const resFisica = customValues.resFisica !== null && customValues.resFisica !== '' ? Number(customValues.resFisica) : calculatedResFisica;
  const resEspiritual = customValues.resEspiritual !== null && customValues.resEspiritual !== '' ? Number(customValues.resEspiritual) : calculatedResEspiritual;
  const ca = customValues.ca !== null && customValues.ca !== '' ? Number(customValues.ca) : calculatedCa;

  const controleLevel = Math.min(5, Math.floor((level - 1) / 3));
  const gastoMinimoMana = Math.max(1, 15 - controleLevel);

  const [currentHp, setCurrentHp] = useState(() => Number(localStorage.getItem('char_current_hp')) || maxHp);
  const [currentEnergy, setCurrentEnergy] = useState(() => Number(localStorage.getItem('char_current_energy')) || maxEnergy);

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

  const adjustHp = (amount) => {
    setCurrentHp(prev => Math.min(maxHp, Math.max(0, prev + amount)));
  };

  const adjustEnergy = (amount) => {
    setCurrentEnergy(prev => Math.min(maxEnergy, Math.max(0, prev + amount)));
  };

  // --- MOTOR DE ROLAGEM DE DADOS AUTOMÁTICO ---
  const parseAndRollDice = (expression) => {
    if (!expression) return { rolls: [], total: 0 };
    
    const match = expression.replace(/\s+/g, '').match(/^(\d+)d(\d+)([\+\-]\d+)?$/i);
    if (!match) {
      const val = parseInt(expression, 10);
      return { rolls: [], total: isNaN(val) ? 0 : val };
    }

    const count = parseInt(match[1], 10);
    const faces = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;

    let rolls = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * faces) + 1;
      rolls.push(roll);
      sum += roll;
    }

    return { rolls, faces, count, modifier, total: sum + modifier };
  };

  const rollCheck = (title, bonus, isD20 = true) => {
    if (isD20) {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const total = d20 + bonus;
      setRollResult({
        title,
        detail: `1d20 (${d20}) ${bonus >= 0 ? '+' : ''}${bonus}`,
        total,
        isCrit: d20 === 20,
        isFail: d20 === 1
      });
    } else {
      const res = parseAndRollDice(bonus);
      setRollResult({
        title,
        detail: `${res.count ? `${res.count}d${res.faces}` : ''} [${res.rolls.join(', ')}] ${res.modifier >= 0 ? '+' : ''}${res.modifier || 0}`,
        total: res.total
      });
    }
  };

  // HANDLERS PARA ADICIONAR ITENS VIA MODAL
  const handleAddWeapon = (e) => {
    e.preventDefault();
    if (!weaponForm.name) return;
    setWeapons(prev => [...prev, { ...weaponForm, id: Date.now() }]);
    setWeaponForm({ name: '', dice: '1d8', bonus: '+0', type: 'Corte', desc: '' });
    setModalType(null);
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!skillForm.name) return;
    setSkills(prev => ({
      ...prev,
      [selectedCategory]: [...prev[selectedCategory], { ...skillForm, id: Date.now() }]
    }));
    setSkillForm({ name: '', dice: '2d6', cost: '5 Mana', desc: '' });
    setModalType(null);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemForm.item) return;
    setInventory(prev => [...prev, { ...itemForm, id: Date.now() }]);
    setItemForm({ item: '', quantity: 1, weight: '0.5kg' });
    setModalType(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans pb-24 relative">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CABEÇALHO */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-amber-500" />
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
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

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'geral', label: 'Geral & Status', icon: Shield },
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
            {/* BARRAS DE STATUS COM BOTÕES */}
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

                  <div className="flex gap-1">
                    <button onClick={() => adjustHp(-10)} className="bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold px-2 py-1.5 rounded border border-red-800/50">-10</button>
                    <button onClick={() => adjustHp(-1)} className="bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold px-2 py-1.5 rounded border border-red-800/50">-1</button>
                    <button onClick={() => adjustHp(1)} className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-2 py-1.5 rounded border border-emerald-800/50">+1</button>
                    <button onClick={() => adjustHp(10)} className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-2 py-1.5 rounded border border-emerald-800/50">+10</button>
                  </div>
                </div>

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

                  <div className="flex gap-1">
                    <button onClick={() => adjustEnergy(-10)} className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-bold px-2 py-1.5 rounded border border-cyan-800/50">-10</button>
                    <button onClick={() => adjustEnergy(-1)} className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-bold px-2 py-1.5 rounded border border-cyan-800/50">-1</button>
                    <button onClick={() => adjustEnergy(1)} className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-2 py-1.5 rounded border border-emerald-800/50">+1</button>
                    <button onClick={() => adjustEnergy(10)} className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-2 py-1.5 rounded border border-emerald-800/50">+10</button>
                  </div>
                </div>

                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-cyan-500 h-full transition-all" style={{ width: `${Math.min(100, Math.max(0, (currentEnergy / maxEnergy) * 100))}%` }} />
                </div>
              </div>

            </div>

            {/* DEFESAS & RESISTÊNCIAS */}
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

            {/* ATRIBUTOS BASE */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-2">
                <Sword className="w-4 h-4" /> Atributos Base <span className="text-[10px] text-slate-500 font-normal">(Clique para rolar 1d20)</span>
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
                    <div key={attr.id} className={`bg-slate-950 border rounded-lg p-3 text-center flex flex-col items-center justify-between group transition-all ${isMainAttr ? 'border-amber-500' : 'border-slate-800 hover:border-amber-500/50'}`}>
                      <button 
                        onClick={() => rollCheck(`Teste de ${attr.label}`, attr.id === 'poder' ? poderTotal : mod)}
                        className="w-full flex flex-col items-center cursor-pointer"
                        title="Clique para Rolar"
                      >
                        <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-amber-400 transition-colors">{attr.label}</span>
                        
                        {attr.id !== 'poder' ? (
                          <span className="text-xl font-bold text-amber-400 my-1 group-hover:scale-110 transition-transform">
                            {mod >= 0 ? `+${mod}` : mod}
                          </span>
                        ) : (
                          <span className="text-xl font-bold text-cyan-400 my-1 group-hover:scale-110 transition-transform">
                            {poderTotal}
                          </span>
                        )}
                      </button>

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

            {/* SEÇÃO DE PERÍCIAS INTEGRADA */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Perícias <span className="text-[10px] text-slate-500 font-normal">(Clique no nome para rolar)</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">Proficiência: <strong className="text-amber-400">+{profBonus}</strong></span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(proficiencies).map(([key, item]) => {
                  const attrMod = getMod(stats[item.attr] || 10);
                  const totalBonus = attrMod + (item.prof ? profBonus : 0);

                  return (
                    <div key={key} className="flex items-center justify-between bg-slate-950 border border-slate-800 p-2.5 rounded-lg hover:border-slate-700 transition-all">
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
                        <button 
                          onClick={() => rollCheck(`Perícia: ${item.name}`, totalBonus)}
                          className="text-left hover:text-amber-400 transition-colors"
                        >
                          <span className="block text-xs font-bold text-slate-200">{item.name}</span>
                          <span className="text-[10px] uppercase text-slate-500">{item.attr}</span>
                        </button>
                      </div>

                      <button 
                        onClick={() => rollCheck(`Perícia: ${item.name}`, totalBonus)}
                        className={`font-mono font-bold text-sm px-2 py-0.5 rounded transition-all hover:scale-105 ${item.prof ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-400 bg-slate-900'}`}
                      >
                        {totalBonus >= 0 ? `+${totalBonus}` : totalBonus}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- ABA 2: COMBATE & ARMAS --- */}
        {activeTab === 'combate' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
                <Sword className="w-4 h-4" /> Armas & Equipamentos de Combate
              </h3>
              <button
                onClick={() => setModalType('weapon')}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Nova Arma
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weapons.map((w) => (
                <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative group hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-100 text-base">{w.name}</h4>
                      <span className="text-[10px] font-semibold uppercase text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">{w.type}</span>
                    </div>
                    <button 
                      onClick={() => setWeapons(prev => prev.filter(item => item.id !== w.id))}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      title="Excluir Arma"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {w.desc && <p className="text-xs text-slate-400 leading-relaxed">{w.desc}</p>}

                  <div className="flex gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => {
                        const bonusNum = parseInt(w.bonus, 10) || 0;
                        rollCheck(`Ataque com ${w.name}`, bonusNum);
                      }}
                      className="flex-1 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 text-slate-200 transition-colors"
                    >
                      <Dices className="w-4 h-4 text-amber-400" /> Rolar Ataque ({w.bonus || '+0'})
                    </button>
                    <button
                      onClick={() => rollCheck(`Dano: ${w.name}`, `${w.dice}${w.bonus}`, false)}
                      className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 text-amber-400 transition-colors"
                    >
                      <Sword className="w-4 h-4" /> Rolar Dano ({w.dice})
                    </button>
                  </div>
                </div>
              ))}
              {weapons.length === 0 && (
                <div className="col-span-full bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
                  Nenhuma arma cadastrada. Clique em "Nova Arma" para adicionar.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ABA 3: HABILIDADES & MAGIAS --- */}
        {activeTab === 'habilidades' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Habilidades & Magias
              </h3>
              <button
                onClick={() => setModalType('skill')}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" /> Nova Habilidade
              </button>
            </div>

            {/* Categorias de Habilidades */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-800 pb-2">
              {[
                { id: 'simples', label: 'Simples' },
                { id: 'normais', label: 'Normais' },
                { id: 'grandes', label: 'Grandes' },
                { id: 'grandiosa', label: 'Grandiosa' },
                { id: 'supremas', label: 'Supremas' },
                { id: 'absolutas', label: 'Absolutas' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat.label} ({skills[cat.id]?.length || 0})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(skills[selectedCategory] || []).map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 relative group hover:border-slate-700 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-100 text-base">{s.name}</h4>
                      {s.cost && <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">{s.cost}</span>}
                    </div>
                    <button 
                      onClick={() => setSkills(prev => ({
                        ...prev,
                        [selectedCategory]: prev[selectedCategory].filter(item => item.id !== s.id)
                      }))}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      title="Excluir Habilidade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {s.desc && <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>}

                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => rollCheck(`Efeito: ${s.name}`, s.dice, false)}
                      className="w-full bg-purple-950/50 hover:bg-purple-900/50 border border-purple-800/50 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 text-purple-300 transition-colors"
                    >
                      <Dices className="w-4 h-4 text-purple-400" /> Rolar Efeito / Dano ({s.dice})
                    </button>
                  </div>
                </div>
              ))}
              {(!skills[selectedCategory] || skills[selectedCategory].length === 0) && (
                <div className="col-span-full bg-slate-900/50 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
                  Nenhuma habilidade nesta categoria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- ABA 4: INVENTÁRIO --- */}
        {activeTab === 'inventario' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
                <Backpack className="w-4 h-4" /> Inventário & Itens
              </h3>
              <button
                onClick={() => setModalType('inventory')}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
              >
                <PlusCircle className="w-4 h-4" /> Adicionar Item
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 text-center">Qtd</th>
                    <th className="p-3 text-center">Peso</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {inventory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-slate-200">{inv.item}</td>
                      <td className="p-3 text-center font-mono">{inv.quantity}</td>
                      <td className="p-3 text-center text-slate-400">{inv.weight}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setInventory(prev => prev.filter(i => i.id !== inv.id))}
                          className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                          title="Remover Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan="4" className="p-6 text-center text-slate-500">
                        Inventário vazio.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ABA 5: ANOTAÇÕES --- */}
        {activeTab === 'anotacoes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-amber-500 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Anotações & Diário da Campanha
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escreva suas anotações, histórico da sessão, pistas, metas..."
              className="w-full h-96 bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 resize-y leading-relaxed font-sans"
            />
          </div>
        )}

        {/* BANNER FLUTUANTE DE ROLAGEM DE DADOS */}
        {rollResult && (
          <div className="fixed bottom-6 right-6 bg-slate-900 border-2 border-amber-500/80 rounded-2xl p-5 shadow-2xl z-50 max-w-xs w-full">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">{rollResult.title}</span>
              <button onClick={() => setRollResult(null)} className="text-slate-400 hover:text-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-baseline justify-between my-2">
              <span className="text-3xl font-extrabold font-mono text-slate-100">{rollResult.total}</span>
              <span className="text-xs text-slate-400 font-mono">{rollResult.detail}</span>
            </div>
            {rollResult.isCrit && <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest text-center mt-1 bg-emerald-950/60 py-1 rounded border border-emerald-800/50">Sucesso Crítico! (20)</div>}
            {rollResult.isFail && <div className="text-xs font-extrabold text-red-400 uppercase tracking-widest text-center mt-1 bg-red-950/60 py-1 rounded border border-red-800/50">Falha Crítica! (1)</div>}
          </div>
        )}

        {/* MODAL: ADICIONAR ARMA */}
        {modalType === 'weapon' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-amber-500 text-sm uppercase">Adicionar Nova Arma</h3>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddWeapon} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Nome da Arma</label>
                  <input type="text" required value={weaponForm.name} onChange={e => setWeaponForm({...weaponForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:border-amber-500 outline-none" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Dado Dano</label>
                    <input type="text" value={weaponForm.dice} onChange={e => setWeaponForm({...weaponForm, dice: e.target.value})} placeholder="1d8" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-100 focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Bônus Ataque</label>
                    <input type="text" value={weaponForm.bonus} onChange={e => setWeaponForm({...weaponForm, bonus: e.target.value})} placeholder="+2" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-100 focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Tipo Dano</label>
                    <input type="text" value={weaponForm.type} onChange={e => setWeaponForm({...weaponForm, type: e.target.value})} placeholder="Corte" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-100 focus:border-amber-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Descrição / Notas</label>
                  <textarea value={weaponForm.desc} onChange={e => setWeaponForm({...weaponForm, desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:border-amber-500 outline-none h-20 resize-none" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 rounded-lg">Salvar Arma</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADICIONAR HABILIDADE */}
        {modalType === 'skill' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-purple-400 text-sm uppercase">Adicionar Nova Habilidade / Magia</h3>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddSkill} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Categoria</label>
                  <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:border-purple-500 outline-none">
                    <option value="simples">Simples</option>
                    <option value="normais">Normais</option>
                    <option value="grandes">Grandes</option>
                    <option value="grandiosa">Grandiosa</option>
                    <option value="supremas">Supremas</option>
                    <option value="absolutas">Absolutas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Nome da Habilidade</label>
                  <input type="text" required value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:border-purple-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Dado / Efeito</label>
                    <input type="text" value={skillForm.dice} onChange={e => setSkillForm({...skillForm, dice: e.target.value})} placeholder="2d6" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-100 focus:border-purple-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Custo Mana/Energia</label>
                    <input type="text" value={skillForm.cost} onChange={e => setSkillForm({...skillForm, cost: e.target.value})} placeholder="5 Mana" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-100 focus:border-purple-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Descrição do Efeito</label>
                  <textarea value={skillForm.desc} onChange={e => setSkillForm({...skillForm, desc: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-100 focus:border-purple-500 outline-none h-20 resize-none" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white rounded-lg">Salvar Habilidade</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: ADICIONAR ITEM AO INVENTÁRIO */}
        {modalType === 'inventory' && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-amber-500 text-sm uppercase">Adicionar Item ao Inventário</h3>
                <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-100"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddItem} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Nome do Item</label>
                  <input type="text" required value={itemForm.item} onChange={e => setItemForm({...itemForm, item: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-sm text-slate-100 focus:border-amber-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Quantidade</label>
                    <input type="number" min="1" value={itemForm.quantity} onChange={e => setItemForm({...itemForm, quantity: Number(e.target.value)})} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-100 focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1">Peso</label>
                    <input type="text" value={itemForm.weight} onChange={e => setItemForm({...itemForm, weight: e.target.value})} placeholder="0.5kg" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-sm text-slate-100 focus:border-amber-500 outline-none" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setModalType(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 rounded-lg">Salvar Item</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}