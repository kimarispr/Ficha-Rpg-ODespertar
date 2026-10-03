import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, Heart, Activity, Zap, BookOpen, Package, User, 
  Plus, Minus, Trash2, Edit3, Save, RotateCcw, Crosshair, 
  Search, Sparkles, ChevronRight, History, Flame, Eye, Skull,
  AlertTriangle, RefreshCw, Layers, CheckCircle2, Award, Wand2,
  Sword, Feather, Dices, Scroll, Coins
} from 'lucide-react';

const D20Icon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 22 8.5 17 19.5 7 19.5 2 8.5 12 2" />
    <polyline points="12 2 12 12 2 8.5" />
    <polyline points="12 12 22 8.5" />
    <polyline points="12 12 7 19.5" />
    <polyline points="12 12 17 19.5" />
    <line x1="2" y1="8.5" x2="22" y2="8.5" />
    <line x1="7" y1="19.5" x2="17" y2="19.5" />
  </svg>
);

const DEFAULT_DD5E_SKILLS = [
  { name: 'Acrobacia', attr: 'DEX', profDegree: 0 },
  { name: 'Adestrar Animais', attr: 'WIS', profDegree: 0 },
  { name: 'Arcanismo', attr: 'INT', profDegree: 0 },
  { name: 'Atletismo', attr: 'STR', profDegree: 0 },
  { name: 'Atuação', attr: 'CHA', profDegree: 0 },
  { name: 'Enganação', attr: 'CHA', profDegree: 0 },
  { name: 'História', attr: 'INT', profDegree: 0 },
  { name: 'Intimidação', attr: 'CHA', profDegree: 0 },
  { name: 'Intuição', attr: 'WIS', profDegree: 0 },
  { name: 'Investigação', attr: 'INT', profDegree: 0 },
  { name: 'Medicina', attr: 'WIS', profDegree: 0 },
  { name: 'Natureza', attr: 'INT', profDegree: 0 },
  { name: 'Percepção', attr: 'WIS', profDegree: 0 },
  { name: 'Persuasão', attr: 'CHA', profDegree: 0 },
  { name: 'Prestidigitação', attr: 'DEX', profDegree: 0 },
  { name: 'Religião', attr: 'INT', profDegree: 0 },
  { name: 'Sobrevivência', attr: 'WIS', profDegree: 0 },
  { name: 'Furtividade', attr: 'DEX', profDegree: 0 },
];

const INITIAL_DD5E_CHARACTER = {
  name: 'Valerius Vane',
  player: 'Jogador 1',
  class: 'Mago',
  subclass: 'Escola de Evocação',
  race: 'Elfo da Lua',
  background: 'Sábio',
  alignment: 'Neutro e Bom',
  level: 5,
  xp: 6500,
  speed: '9m',
  armorClassBonus: 0,
  
  // D&D 5e Core Abilities (Score 1-30)
  attributes: {
    STR: 10,
    DEX: 14,
    CON: 14,
    INT: 18,
    WIS: 12,
    CHA: 8
  },

  // Saving Throw Proficiencies
  savingThrowProfs: {
    STR: false,
    DEX: false,
    CON: false,
    INT: true,
    WIS: true,
    CHA: false
  },

  status: {
    hpMax: 32,
    hpCurrent: 32,
    hpTemp: 0,
    hitDiceMax: '5d6',
    hitDiceCurrent: 5,
    deathSavesSuccess: 0,
    deathSavesFailure: 0
  },

  skills: DEFAULT_DD5E_SKILLS,

  coins: {
    pc: 25,
    pp: 14,
    po: 120,
    pl: 0
  },

  weapons: [
    { id: 'w1', name: 'Cajado Arcano', attr: 'STR', atkBonus: 0, damage: '1d6', dmgType: 'Concussão', description: 'Pode ser usado como foco arcano.' },
    { id: 'w2', name: 'Adaga de Prata', attr: 'DEX', atkBonus: 1, damage: '1d4+1', dmgType: 'Perfurante', description: 'Acuidade, Arremesso (6/18m).' }
  ],

  inventory: [
    { id: '1', name: 'Manto Arcano com Capuz', category: 'Equipamento', weight: 1.5, description: 'Proteção contra intempéries.', equipped: true },
    { id: '2', name: 'Livro de Magias (Grimório)', category: 'Ferramenta', weight: 1.0, description: 'Contém todas as magias conhecidas.', equipped: true },
    { id: '3', name: 'Bolsa de Componentes', category: 'Magia', weight: 1.0, description: 'Possui componentes materiais comuns sem custo.', equipped: true },
    { id: '4', name: 'Poção de Cura', category: 'Consumível', weight: 0.5, description: 'Restaura 2d4+2 PV ao ser ingerida.', equipped: false }
  ],

  spellcasting: {
    ability: 'INT',
    slots: {
      1: { max: 4, used: 1 },
      2: { max: 3, used: 2 },
      3: { max: 2, used: 0 },
      4: { max: 0, used: 0 },
      5: { max: 0, used: 0 }
    }
  },

  spells: [
    { id: 's1', level: 0, name: 'Raio de Fogo', school: 'Evocação', castingTime: '1 ação', range: '36m', duration: 'Instantânea', components: 'V, S', description: 'Ataque à distância. Causa 2d10 de dano de fogo.' },
    { id: 's2', level: 0, name: 'Luz', school: 'Transmutação', castingTime: '1 ação', range: 'Toque', duration: '1 hora', components: 'V, M', description: 'Faz um objeto brilhar com luz plena em 6m.' },
    { id: 's3', level: 1, name: 'Míssil Mágico', school: 'Evocação', castingTime: '1 ação', range: '36m', duration: 'Instantânea', components: 'V, S', description: 'Cria 3 dardos. Cada dardo causa 1d4+1 de dano de força automaticamente.' },
    { id: 's4', level: 1, name: 'Escudo Arcano', school: 'Adivinhação', castingTime: '1 reação', range: 'Pessoal', duration: '1 rodada', components: 'V, S', description: '+5 na CA e imunidade a Míssil Mágico até seu próximo turno.' },
    { id: 's5', level: 2, name: 'Passo Nebuloso', school: 'Conjuração', castingTime: '1 ação bônus', range: 'Pessoal', duration: 'Instantânea', components: 'V', description: 'Teleporta-se instantaneamente até 9m para um local visível.' },
    { id: 's6', level: 3, name: 'Bola de Fogo', school: 'Evocação', castingTime: '1 ação', range: '45m', duration: 'Instantânea', components: 'V, S, M', description: 'Explosão de 6m de raio. Causa 8d6 de dano de fogo (Resistência de DEX reduz à metade).' }
  ],

  notes: 'Membro da Guilda dos Eruditos de Solm. Investiga ruínas antigas em busca de artefatos da Era dos Fragmentos.'
};

const getAbilityModifier = (score) => Math.floor((score - 10) / 2);
const formatModifier = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

export default function App() {
  const [character, setCharacter] = useState(() => {
    const saved = localStorage.getItem('cris_dd5e_character_v1');
    return saved ? JSON.parse(saved) : INITIAL_DD5E_CHARACTER;
  });

  const [activeTab, setActiveTab] = useState('skills'); // skills, combat, spells, inventory, notes
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [rollHistory, setRollHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentRollResult, setCurrentRollResult] = useState(null);
  const [rollMode, setRollMode] = useState('normal'); // 'normal', 'advantage', 'disadvantage'
  const [searchTerm, setSearchTerm] = useState('');

  // Quick dice roller inputs
  const [customDiceQty, setCustomDiceQty] = useState(1);

  // Modals for adding entries
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'Geral', weight: 0.5, description: '' });

  const [showNewWeaponModal, setShowNewWeaponModal] = useState(false);
  const [newWeapon, setNewWeapon] = useState({ name: '', attr: 'STR', atkBonus: 0, damage: '1d6', dmgType: 'Perfurante', description: '' });

  const [showNewSpellModal, setShowNewSpellModal] = useState(false);
  const [newSpell, setNewSpell] = useState({ name: '', level: 1, school: 'Evocação', castingTime: '1 ação', range: '18m', duration: 'Instantânea', components: 'V, S', description: '' });

  useEffect(() => {
    localStorage.setItem('cris_dd5e_character_v1', JSON.stringify(character));
  }, [character]);

  const profBonus = useMemo(() => {
    return Math.ceil(1 + character.level / 4);
  }, [character.level]);

  const dexMod = useMemo(() => getAbilityModifier(character.attributes.DEX), [character.attributes.DEX]);
  const wisMod = useMemo(() => getAbilityModifier(character.attributes.WIS), [character.attributes.WIS]);
  const strMod = useMemo(() => getAbilityModifier(character.attributes.STR), [character.attributes.STR]);

  const totalAC = useMemo(() => {
    return 10 + dexMod + character.armorClassBonus;
  }, [dexMod, character.armorClassBonus]);

  const passivePerception = useMemo(() => {
    const perceptionSkill = character.skills.find(s => s.name === 'Percepção');
    const profMult = perceptionSkill ? perceptionSkill.profDegree : 0;
    return 10 + wisMod + (profMult * profBonus);
  }, [wisMod, profBonus, character.skills]);

  const maxWeight = useMemo(() => {
    return character.attributes.STR * 7.5; // Weight capacity in kg (15 lbs = ~7.5kg per STR)
  }, [character.attributes.STR]);

  const currentWeight = useMemo(() => {
    return character.inventory.reduce((acc, item) => acc + (Number(item.weight) || 0), 0);
  }, [character.inventory]);

  const spellcastingMod = useMemo(() => {
    const attr = character.spellcasting.ability || 'INT';
    return getAbilityModifier(character.attributes[attr]);
  }, [character.spellcasting.ability, character.attributes]);

  const spellSaveDC = useMemo(() => 8 + profBonus + spellcastingMod, [profBonus, spellcastingMod]);
  const spellAttackBonus = useMemo(() => profBonus + spellcastingMod, [profBonus, spellcastingMod]);

  const rollD20Check = (title, bonus = 0, modeOverride = rollMode) => {
    const roll1 = Math.floor(Math.random() * 20) + 1;
    const roll2 = Math.floor(Math.random() * 20) + 1;

    let selectedDice = roll1;
    let modeText = 'Normal';

    if (modeOverride === 'advantage') {
      selectedDice = Math.max(roll1, roll2);
      modeText = 'Vantagem';
    } else if (modeOverride === 'disadvantage') {
      selectedDice = Math.min(roll1, roll2);
      modeText = 'Desvantagem';
    }

    const isCritical = selectedDice === 20;
    const isFumble = selectedDice === 1;
    const total = selectedDice + bonus;

    const resultObj = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title,
      rolls: modeOverride === 'normal' ? [roll1] : [roll1, roll2],
      selectedDice,
      bonus,
      total,
      isCritical,
      isFumble,
      modeText
    };

    setCurrentRollResult(resultObj);
    setRollHistory(prev => [resultObj, ...prev.slice(0, 19)]);
  };

  const rollDamageDice = (diceNotation, title) => {
    // Parse notation like "2d6+3" or "1d8"
    const match = diceNotation.match(/^(\d+)d(\d+)(?:\+([+-]?\d+))?/i);
    let rolls = [];
    let total = 0;
    let bonus = 0;
    let sides = 6;
    let qty = 1;

    if (match) {
      qty = parseInt(match[1]) || 1;
      sides = parseInt(match[2]) || 6;
      bonus = parseInt(match[3]) || 0;

      for (let i = 0; i < qty; i++) {
        const val = Math.floor(Math.random() * sides) + 1;
        rolls.push(val);
        total += val;
      }
      total += bonus;
    } else {
      // Fallback
      const val = Math.floor(Math.random() * 20) + 1;
      rolls.push(val);
      total = val;
    }

    const resultObj = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      title: `${title} (${diceNotation})`,
      rolls,
      selectedDice: total - bonus,
      bonus,
      total,
      isDamage: true
    };

    setCurrentRollResult(resultObj);
    setRollHistory(prev => [resultObj, ...prev.slice(0, 19)]);
  };

  const updateAttributeScore = (attr, newScore) => {
    const val = Math.max(1, Math.min(30, parseInt(newScore) || 10));
    setCharacter(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: val }
    }));
  };

  const toggleSavingThrowProf = (attr) => {
    setCharacter(prev => ({
      ...prev,
      savingThrowProfs: {
        ...prev.savingThrowProfs,
        [attr]: !prev.savingThrowProfs[attr]
      }
    }));
  };

  const updateStatus = (field, delta) => {
    setCharacter(prev => {
      const maxField = field === 'hpCurrent' ? 'hpMax' : null;
      const currentVal = prev.status[field];
      const limit = maxField ? prev.status[maxField] : 999;
      const newVal = Math.max(0, Math.min(limit, currentVal + delta));

      return {
        ...prev,
        status: { ...prev.status, [field]: newVal }
      };
    });
  };

  const cycleSkillProficiency = (skillName) => {
    setCharacter(prev => {
      const updatedSkills = prev.skills.map(s => {
        if (s.name === skillName) {
          // 0: Sem Proficiência, 1: Proficiente, 2: Especialista (Expertise)
          const next = (s.profDegree + 1) % 3;
          return { ...s, profDegree: next };
        }
        return s;
      });
      return { ...prev, skills: updatedSkills };
    });
  };

  const updateSpellSlot = (level, delta) => {
    setCharacter(prev => {
      const slotInfo = prev.spellcasting.slots[level] || { max: 0, used: 0 };
      const newUsed = Math.max(0, Math.min(slotInfo.max, slotInfo.used + delta));
      return {
        ...prev,
        spellcasting: {
          ...prev.spellcasting,
          slots: {
            ...prev.spellcasting.slots,
            [level]: { ...slotInfo, used: newUsed }
          }
        }
      };
    });
  };

  const handleAddInventoryItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    setCharacter(prev => ({
      ...prev,
      inventory: [...prev.inventory, { ...newItem, id: Date.now().toString(), equipped: false }]
    }));
    setNewItem({ name: '', category: 'Geral', weight: 0.5, description: '' });
    setShowNewItemModal(false);
  };

  const handleAddWeapon = (e) => {
    e.preventDefault();
    if (!newWeapon.name.trim()) return;
    setCharacter(prev => ({
      ...prev,
      weapons: [...prev.weapons, { ...newWeapon, id: Date.now().toString() }]
    }));
    setNewWeapon({ name: '', attr: 'STR', atkBonus: 0, damage: '1d6', dmgType: 'Perfurante', description: '' });
    setShowNewWeaponModal(false);
  };

  const handleAddSpell = (e) => {
    e.preventDefault();
    if (!newSpell.name.trim()) return;
    setCharacter(prev => ({
      ...prev,
      spells: [...prev.spells, { ...newSpell, id: Date.now().toString() }]
    }));
    setNewSpell({ name: '', level: 1, school: 'Evocação', castingTime: '1 ação', range: '18m', duration: 'Instantânea', components: 'V, S', description: '' });
    setShowNewSpellModal(false);
  };

  const filteredSkills = character.skills.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.attr.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-600 selection:text-white pb-12">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950 to-slate-950 pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 border-b border-purple-900/40 bg-slate-900/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-purple-600 to-indigo-800 p-0.5 shadow-lg shadow-purple-900/40 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                <D20Icon className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-400 to-cyan-400">
                C.R.I.S. <span className="text-xs px-2 py-0.5 rounded bg-purple-950 border border-purple-700/50 text-amber-300 font-normal">System D&D 5E</span>
              </h1>
              <p className="text-xs text-slate-400">Ficha de Personagem D&D 5ª Edição</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistoryModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm transition font-medium"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>Histórico ({rollHistory.length})</span>
            </button>
            <button
              onClick={() => {
                if (confirm('Deseja resetar a ficha para o modelo padrão D&D 5E?')) {
                  setCharacter(INITIAL_DD5E_CHARACTER);
                }
              }}
              title="Resetar Ficha"
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 border border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-6 space-y-6">

        {/* 1. HEADER DO PERSONAGEM (IDENTIFICAÇÃO D&D) */}
        {}
        <div className="bg-slate-900/90 border border-purple-900/40 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase">
              <User className="w-4 h-4" />
              <span>Identificação do Aventureiro</span>
            </div>
            <button 
              onClick={() => setIsEditingHeader(!isEditingHeader)}
              className="flex items-center gap-1.5 text-xs bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-700/50 px-3 py-1 rounded-md transition"
            >
              {isEditingHeader ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditingHeader ? 'Salvar Dados' : 'Editar Ficha'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Nome */}
            <div className="lg:col-span-2">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Nome do Personagem</label>
              {isEditingHeader ? (
                <input
                  type="text"
                  value={character.name}
                  onChange={e => setCharacter({ ...character, name: e.target.value })}
                  className="w-full bg-slate-950 border border-purple-500/50 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-lg"
                />
              ) : (
                <div className="text-2xl font-black text-slate-100 tracking-wide font-mono truncate">{character.name}</div>
              )}
            </div>

            {/* Classe & Subclasse */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Classe & Subclasse</label>
              {isEditingHeader ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={character.class}
                    onChange={e => setCharacter({ ...character, class: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                  <input
                    type="text"
                    value={character.subclass}
                    placeholder="Subclasse"
                    onChange={e => setCharacter({ ...character, subclass: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
              ) : (
                <div className="text-base font-semibold text-purple-300 truncate">
                  {character.class} <span className="text-slate-500 text-xs block truncate">({character.subclass})</span>
                </div>
              )}
            </div>

            {/* Raça & Antecedente */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Raça / Antecedente</label>
              {isEditingHeader ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={character.race}
                    onChange={e => setCharacter({ ...character, race: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                  <input
                    type="text"
                    value={character.background}
                    onChange={e => setCharacter({ ...character, background: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200"
                  />
                </div>
              ) : (
                <div className="text-base font-semibold text-slate-300 truncate">
                  {character.race} <span className="text-slate-500 text-xs block truncate">{character.background}</span>
                </div>
              )}
            </div>

            {/* Nível e Bônus de Proficiência */}
            <div>
              <label className="text-xs font-medium text-amber-400 uppercase tracking-wider block mb-1">Nível & Bônus Prof.</label>
              {isEditingHeader ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={character.level}
                    onChange={e => setCharacter({ ...character, level: parseInt(e.target.value) || 1 })}
                    className="w-16 bg-slate-950 border border-amber-500/50 rounded px-2 py-1 text-amber-300 font-bold text-sm"
                  />
                </div>
              ) : (
                <div className="text-xl font-black text-amber-400 font-mono flex items-center gap-2">
                  <span>Nível {character.level}</span>
                  <span className="text-xs bg-amber-950/80 border border-amber-700/60 px-2 py-0.5 rounded text-amber-300">
                    +{profBonus} Prof
                  </span>
                </div>
              )}
            </div>

            {/* Deslocamento & Percepção Passiva */}
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-1">Mobilidade & Visão</label>
              <div className="flex items-center gap-3 text-sm font-semibold font-mono text-cyan-300">
                <div>Desloc: <span className="text-slate-100">{character.speed}</span></div>
                <div>Perc. Passiva: <span className="text-slate-100">{passivePerception}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ATRIBUTOS D&D 5E + TESTES DE RESISTÊNCIA */}
        {}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* ATRIBUTOS (6 ATRIBUTOS D&D 5E) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-purple-900/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Atributos D&D 5E (Clique para Rolar Teste)
              </h2>

              {/* Mode Selector (Normal, Advantage, Disadvantage) */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
                <button
                  onClick={() => setRollMode('normal')}
                  className={`px-2 py-0.5 rounded transition ${rollMode === 'normal' ? 'bg-purple-900 text-purple-200 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setRollMode('advantage')}
                  className={`px-2 py-0.5 rounded transition ${rollMode === 'advantage' ? 'bg-emerald-900 text-emerald-200 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Vantagem
                </button>
                <button
                  onClick={() => setRollMode('disadvantage')}
                  className={`px-2 py-0.5 rounded transition ${rollMode === 'disadvantage' ? 'bg-red-900 text-red-200 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  Desvantagem
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 my-auto">
              {Object.entries(character.attributes).map(([attrKey, score]) => {
                const labels = {
                  STR: 'Força',
                  DEX: 'Destreza',
                  CON: 'Constituição',
                  INT: 'Intelecto',
                  WIS: 'Sabedoria',
                  CHA: 'Carisma'
                };
                const mod = getAbilityModifier(score);
                const isProficientSave = character.savingThrowProfs[attrKey];
                const saveBonus = mod + (isProficientSave ? profBonus : 0);

                return (
                  <div key={attrKey} className="group relative flex flex-col items-center bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 hover:border-purple-600/60 transition">
                    <span className="text-[11px] font-bold text-amber-400 tracking-wider uppercase mb-1">{attrKey}</span>

                    {/* Modifier Button */}
                    <button
                      onClick={() => rollD20Check(`Teste de ${labels[attrKey]}`, mod)}
                      className="w-full py-2 bg-gradient-to-b from-slate-800 to-slate-900 border border-purple-700/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/20 rounded-lg flex flex-col items-center justify-center transition active:scale-95"
                    >
                      <span className="text-2xl font-black font-mono text-slate-100 group-hover:text-amber-300">{formatModifier(mod)}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Score: {score}</span>
                    </button>

                    {/* Quick Score edit input */}
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={score}
                      onChange={e => updateAttributeScore(attrKey, e.target.value)}
                      className="w-12 text-center bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 my-1.5 focus:border-purple-500"
                    />

                    {/* Saving Throw Toggle */}
                    <button
                      onClick={() => toggleSavingThrowProf(attrKey)}
                      className={`w-full text-[10px] py-0.5 rounded border font-mono transition flex items-center justify-center gap-1 ${
                        isProficientSave 
                          ? 'bg-amber-950/80 border-amber-600/60 text-amber-300' 
                          : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <span>Salv: {formatModifier(saveBonus)}</span>
                      {isProficientSave && <CheckCircle2 className="w-2.5 h-2.5 text-amber-400" />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* AC and Initiative Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Classe de Armadura (CA):</span>
                  <span className="font-bold text-slate-100 text-base font-mono">{totalAC}</span>
                </div>

                <div className="flex items-center gap-2">
                  <D20Icon className="w-4 h-4 text-cyan-400" />
                  <span>Iniciativa:</span>
                  <button
                    onClick={() => rollD20Check('Iniciativa', dexMod)}
                    className="font-bold text-cyan-300 hover:text-cyan-100 text-base font-mono bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded transition"
                  >
                    {formatModifier(dexMod)}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs">
                <span>Bônus CA:</span>
                <input
                  type="number"
                  value={character.armorClassBonus}
                  onChange={e => setCharacter({...character, armorClassBonus: parseInt(e.target.value) || 0})}
                  className="w-12 bg-slate-950 border border-slate-700 rounded px-1 py-0.5 text-slate-200 text-center text-xs"
                />
              </div>
            </div>
          </div>

          {/* STATUS VITAIS (HP, DADOS DE VIDA, SALVAGUARDAS DE MORTE) */}
          {}
          <div className="lg:col-span-4 bg-slate-900/90 border border-purple-900/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
            <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              Condições e Vitalidade
            </h2>

            <div className="space-y-4">
              
              {/* Pontos de Vida (HP) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-400 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-red-500/20" /> Pontos de Vida (PV)
                  </span>
                  <div className="flex items-center gap-1 font-mono">
                    <span className="font-bold text-slate-100 text-sm">{character.status.hpCurrent}</span>
                    <span className="text-slate-500">/</span>
                    <input
                      type="number"
                      value={character.status.hpMax}
                      onChange={e => setCharacter({...character, status: {...character.status, hpMax: parseInt(e.target.value) || 1}})}
                      className="w-12 bg-slate-950 border border-slate-800 rounded px-1 text-center text-slate-400 text-xs focus:text-slate-100"
                    />
                  </div>
                </div>

                {/* HP Progress bar */}
                <div className="h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-red-950/80">
                  <div 
                    className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, (character.status.hpCurrent / character.status.hpMax) * 100))}%` }}
                  />
                </div>

                {/* Quick Controls */}
                <div className="flex items-center justify-end gap-1 text-[11px] pt-0.5">
                  <button onClick={() => updateStatus('hpCurrent', -5)} className="px-1.5 py-0.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40">-5</button>
                  <button onClick={() => updateStatus('hpCurrent', -1)} className="px-1.5 py-0.5 rounded bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/40">-1</button>
                  <button onClick={() => updateStatus('hpCurrent', 1)} className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40">+1</button>
                  <button onClick={() => updateStatus('hpCurrent', 5)} className="px-1.5 py-0.5 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40">+5</button>
                </div>
              </div>

              {/* HP Temporário & Dados de Vida */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">HP Temporário</span>
                  <input
                    type="number"
                    value={character.status.hpTemp}
                    onChange={e => setCharacter({...character, status: {...character.status, hpTemp: parseInt(e.target.value) || 0}})}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-cyan-300 font-bold font-mono"
                  />
                </div>

                <div>
                  <span className="text-slate-400 block mb-1">Dados de Vida</span>
                  <div className="flex items-center gap-1 font-mono">
                    <input
                      type="number"
                      min="0"
                      value={character.status.hitDiceCurrent}
                      onChange={e => setCharacter({...character, status: {...character.status, hitDiceCurrent: parseInt(e.target.value) || 0}})}
                      className="w-10 bg-slate-900 border border-slate-700 rounded text-center text-amber-300 font-bold py-1"
                    />
                    <span className="text-slate-500">/</span>
                    <span className="text-slate-300">{character.status.hitDiceMax}</span>
                  </div>
                </div>
              </div>

              {/* Salvaguardas Morte */}
              <div className="text-xs space-y-1">
                <span className="text-slate-400 font-semibold block">Testes contra a Morte:</span>
                <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase mr-1">Sucessos</span>
                    {[0, 1, 2].map(i => (
                      <button
                        key={i}
                        onClick={() => setCharacter({...character, status: {...character.status, deathSavesSuccess: character.status.deathSavesSuccess === i + 1 ? i : i + 1}})}
                        className={`w-4 h-4 rounded-full border transition ${i < character.status.deathSavesSuccess ? 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/50' : 'bg-slate-900 border-slate-700'}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-red-400 text-[10px] font-bold uppercase mr-1">Falhas</span>
                    {[0, 1, 2].map(i => (
                      <button
                        key={i}
                        onClick={() => setCharacter({...character, status: {...character.status, deathSavesFailure: character.status.deathSavesFailure === i + 1 ? i : i + 1}})}
                        className={`w-4 h-4 rounded-full border transition ${i < character.status.deathSavesFailure ? 'bg-red-500 border-red-400 shadow-sm shadow-red-500/50' : 'bg-slate-900 border-slate-700'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 3. ROLADOR RÁPIDO DE DADOS */}
        {}
        <div className="bg-slate-900/60 border border-purple-900/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
            <D20Icon className="w-4 h-4 text-amber-400" />
            <span>Rolador Rápido de Dados:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[4, 6, 8, 10, 12, 20, 100].map(sides => (
              <button
                key={sides}
                onClick={() => rollDamageDice(`${customDiceQty}d${sides}`, `Rolagem Customizada`)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-purple-900/50 hover:text-amber-300 border border-slate-700 hover:border-amber-500/50 text-xs font-mono transition"
              >
                {customDiceQty > 1 ? `${customDiceQty}d${sides}` : `d${sides}`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Quantidade:</span>
            <input
              type="number"
              min="1"
              max="20"
              value={customDiceQty}
              onChange={e => setCustomDiceQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-center text-slate-200"
            />
          </div>
        </div>

        {/* 4. NAVIGATION TABS */}
        {}
        <div className="border-b border-purple-900/40 flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition border-t border-x ${
                activeTab === 'skills'
                  ? 'bg-slate-900 text-amber-300 border-purple-800/80 border-b-slate-900 -mb-px'
                  : 'bg-slate-950/50 text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Crosshair className="w-4 h-4" />
              <span>Perícias D&D ({character.skills.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('combat')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition border-t border-x ${
                activeTab === 'combat'
                  ? 'bg-slate-900 text-amber-300 border-purple-800/80 border-b-slate-900 -mb-px'
                  : 'bg-slate-950/50 text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Sword className="w-4 h-4" />
              <span>Ataques & Combate ({character.weapons.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('spells')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition border-t border-x ${
                activeTab === 'spells'
                  ? 'bg-slate-900 text-amber-300 border-purple-800/80 border-b-slate-900 -mb-px'
                  : 'bg-slate-950/50 text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Magias ({character.spells.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition border-t border-x ${
                activeTab === 'inventory'
                  ? 'bg-slate-900 text-amber-300 border-purple-800/80 border-b-slate-900 -mb-px'
                  : 'bg-slate-950/50 text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventário ({currentWeight}/{maxWeight}kg)</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition border-t border-x ${
                activeTab === 'notes'
                  ? 'bg-slate-900 text-amber-300 border-purple-800/80 border-b-slate-900 -mb-px'
                  : 'bg-slate-950/50 text-slate-400 border-transparent hover:text-slate-200'
              }`}
            >
              <Scroll className="w-4 h-4" />
              <span>História & Notas</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}
        <div className="bg-slate-900/90 border border-purple-900/40 rounded-b-2xl rounded-tr-2xl p-6 shadow-2xl min-h-[400px]">
          
          {/* TAB 1: PERÍCIAS D&D 5E */}
          {}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              {/* Search Bar & Legend */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Buscar perícia ou atributo..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-600"/> Sem Treino</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"/> Proficiente (+{profBonus})</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400"/> Especialista (+{profBonus * 2})</span>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredSkills.map(skill => {
                  const attrScore = character.attributes[skill.attr];
                  const attrMod = getAbilityModifier(attrScore);
                  const totalBonus = attrMod + (skill.profDegree * profBonus);
                  
                  let degreeBadge = 'Não Proficiente';
                  let degreeColor = 'text-slate-500 border-slate-800';
                  if (skill.profDegree === 1) { degreeBadge = `Proficiente (+${profBonus})`; degreeColor = 'text-amber-400 border-amber-800/50 bg-amber-950/30'; }
                  if (skill.profDegree === 2) { degreeBadge = `Especialista (+${profBonus * 2})`; degreeColor = 'text-cyan-400 border-cyan-800/50 bg-cyan-950/30'; }

                  return (
                    <div
                      key={skill.name}
                      className="group bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3 flex items-center justify-between gap-2 transition"
                    >
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200 text-sm truncate">{skill.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 font-mono text-purple-300">{skill.attr}</span>
                        </div>

                        {/* Training level button */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => cycleSkillProficiency(skill.name)}
                            className={`text-[10px] px-2 py-0.5 rounded border ${degreeColor} hover:brightness-125 transition`}
                          >
                            {degreeBadge}
                          </button>
                        </div>
                      </div>

                      {/* Total Bonus & Roll Button */}
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Total</div>
                          <div className="text-base font-bold font-mono text-slate-100">{formatModifier(totalBonus)}</div>
                        </div>

                        <button
                          onClick={() => rollD20Check(`Perícia: ${skill.name}`, totalBonus)}
                          className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-800 to-amber-800 hover:from-purple-700 hover:to-amber-700 text-white flex items-center justify-center shadow-md active:scale-95 transition"
                          title={`Rolar ${skill.name} (1d20 ${formatModifier(totalBonus)})`}
                        >
                          <D20Icon className="w-5 h-5 text-amber-200" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ATAQUES & COMBATE */}
          {}
          {activeTab === 'combat' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-amber-300">Ataques e Armas</h3>
                  <p className="text-xs text-slate-400">Role ataques (1d20 + Atributo + Proficiência) e rolagens de dano</p>
                </div>

                <button
                  onClick={() => setShowNewWeaponModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/50 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Arma</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {character.weapons.map(wpn => {
                  const attrMod = getAbilityModifier(character.attributes[wpn.attr]);
                  const atkTotal = attrMod + profBonus + wpn.atkBonus;

                  return (
                    <div key={wpn.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-bold text-slate-100 text-base">{wpn.name}</h4>
                            <div className="text-xs text-amber-400 font-mono mt-0.5">
                              Atributo: {wpn.attr} | Dano: {wpn.damage} ({wpn.dmgType})
                            </div>
                          </div>

                          <button
                            onClick={() => setCharacter(prev => ({ ...prev, weapons: prev.weapons.filter(w => w.id !== wpn.id) }))}
                            className="text-slate-600 hover:text-red-400 p-1 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {wpn.description && (
                          <p className="text-xs text-slate-400 mt-2 bg-slate-900/50 p-2 rounded border border-slate-800/80">{wpn.description}</p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-end gap-2">
                        <button
                          onClick={() => rollD20Check(`Ataque: ${wpn.name}`, atkTotal)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900 hover:bg-purple-800 text-purple-200 font-bold text-xs transition"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>Atacar ({formatModifier(atkTotal)})</span>
                        </button>

                        <button
                          onClick={() => rollDamageDice(wpn.damage, `Dano: ${wpn.name}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold text-xs transition"
                        >
                          <Sword className="w-3.5 h-3.5" />
                          <span>Dano ({wpn.damage})</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: MAGIAS D&D 5E */}
          {}
          {activeTab === 'spells' && (
            <div className="space-y-6">
              {/* Spellcasting Header Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-xl border border-purple-900/50">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Habilidade de Conjuração</span>
                  <select
                    value={character.spellcasting.ability}
                    onChange={e => setCharacter({...character, spellcasting: {...character.spellcasting, ability: e.target.value}})}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-amber-300 font-bold"
                  >
                    <option value="INT">INT (Intelecto)</option>
                    <option value="WIS">WIS (Sabedoria)</option>
                    <option value="CHA">CHA (Carisma)</option>
                  </select>
                </div>

                <div className="text-center sm:border-x border-slate-800">
                  <span className="text-xs text-slate-400 block">CD de Resistência a Magia</span>
                  <span className="text-2xl font-black text-amber-300 font-mono">{spellSaveDC}</span>
                </div>

                <div className="text-center">
                  <span className="text-xs text-slate-400 block">Bônus de Ataque com Magia</span>
                  <button
                    onClick={() => rollD20Check('Ataque Mágico', spellAttackBonus)}
                    className="text-2xl font-black text-purple-300 font-mono hover:text-purple-100 transition"
                  >
                    {formatModifier(spellAttackBonus)}
                  </button>
                </div>
              </div>

              {/* Spell Slots Tracker */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Espaços de Magia (Spell Slots)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map(lvl => {
                    const slotInfo = character.spellcasting.slots[lvl] || { max: 0, used: 0 };
                    return (
                      <div key={lvl} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-center space-y-1">
                        <span className="text-xs font-bold text-purple-300 block">{lvl}º Nível</span>
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="9"
                            value={slotInfo.max}
                            onChange={e => {
                              const val = parseInt(e.target.value) || 0;
                              setCharacter(prev => ({
                                ...prev,
                                spellcasting: {
                                  ...prev.spellcasting,
                                  slots: {
                                    ...prev.spellcasting.slots,
                                    [lvl]: { ...slotInfo, max: val }
                                  }
                                }
                              }));
                            }}
                            className="w-10 text-center bg-slate-900 border border-slate-700 rounded text-xs text-slate-200"
                          />
                          <span className="text-slate-500">slots</span>
                        </div>

                        {/* Used slots counter */}
                        <div className="flex items-center justify-center gap-1 pt-1">
                          <button onClick={() => updateSpellSlot(lvl, 1)} className="px-1.5 rounded bg-red-950 text-red-300 text-xs border border-red-800/50">-1</button>
                          <span className="text-xs font-mono text-slate-300">{slotInfo.max - slotInfo.used} rest.</span>
                          <button onClick={() => updateSpellSlot(lvl, -1)} className="px-1.5 rounded bg-emerald-950 text-emerald-300 text-xs border border-emerald-800/50">+1</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Spells List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-sm font-bold text-amber-300">Grimório & Magias Conhecidas</h4>
                  <button
                    onClick={() => setShowNewSpellModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/50 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Magia</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {character.spells.map(spell => (
                    <div key={spell.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-100 text-sm">{spell.name}</h5>
                            <span className="text-[10px] px-2 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                              {spell.level === 0 ? 'Truque' : `${spell.level}º Nível`}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {spell.school} | {spell.castingTime} | {spell.range}
                          </div>
                        </div>

                        <button
                          onClick={() => setCharacter(prev => ({ ...prev, spells: prev.spells.filter(s => s.id !== spell.id) }))}
                          className="text-slate-600 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-2 rounded border border-slate-900">
                        {spell.description}
                      </p>

                      {spell.level > 0 && (
                        <div className="flex items-center justify-end pt-1">
                          <button
                            onClick={() => updateSpellSlot(spell.level, 1)}
                            className="text-[11px] px-2.5 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700/50 transition"
                          >
                            Gastar Slot de {spell.level}º Nível
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INVENTÁRIO & MOEDAS */}
          {}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Currency & Weight Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-slate-800">
                {/* Coins */}
                <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <div className="flex items-center gap-2">
                    <label className="text-amber-400 font-bold">PO:</label>
                    <input
                      type="number"
                      value={character.coins.po}
                      onChange={e => setCharacter({...character, coins: {...character.coins, po: parseInt(e.target.value) || 0}})}
                      className="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center font-mono text-slate-200"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-slate-300 font-bold">PP:</label>
                    <input
                      type="number"
                      value={character.coins.pp}
                      onChange={e => setCharacter({...character, coins: {...character.coins, pp: parseInt(e.target.value) || 0}})}
                      className="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center font-mono text-slate-200"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-amber-600 font-bold">PC:</label>
                    <input
                      type="number"
                      value={character.coins.pc}
                      onChange={e => setCharacter({...character, coins: {...character.coins, pc: parseInt(e.target.value) || 0}})}
                      className="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center font-mono text-slate-200"
                    />
                  </div>
                </div>

                {/* Weight Capacity */}
                <div className="text-sm">
                  <span className="text-slate-400">Carga: </span>
                  <span className={`font-mono font-bold ${currentWeight > maxWeight ? 'text-red-400' : 'text-amber-300'}`}>
                    {currentWeight}kg / {maxWeight}kg Max
                  </span>
                </div>

                <button
                  onClick={() => setShowNewItemModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/80 hover:bg-purple-800 text-purple-200 text-xs font-semibold border border-purple-700/50 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Item</span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {character.inventory.map(item => (
                  <div key={item.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCharacter(prev => ({ ...prev, inventory: prev.inventory.map(i => i.id === item.id ? { ...i, equipped: !i.equipped } : i) }))}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${item.equipped ? 'bg-amber-950 text-amber-300 border-amber-600' : 'bg-slate-900 text-slate-500 border-slate-800'}`}
                      >
                        {item.equipped ? 'Equipado' : 'Mochila'}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-slate-200 text-sm">{item.name}</h5>
                          <span className="text-[10px] text-slate-500 font-mono">{item.weight}kg</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setCharacter(prev => ({ ...prev, inventory: prev.inventory.filter(i => i.id !== item.id) }))}
                      className="text-slate-600 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTAS & ANOTAÇÕES */}
          {}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold text-amber-300">História, Antecedentes e Anotações da Campanha</h3>
                <span className="text-xs text-slate-500">Salvo automaticamente</span>
              </div>

              <textarea
                value={character.notes}
                onChange={e => setCharacter({ ...character, notes: e.target.value })}
                rows={12}
                placeholder="Escreva a história do seu personagem, objetivos, aliados, inimigos ou anotações das sessões..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-600 font-mono leading-relaxed resize-y"
              />
            </div>
          )}

        </div>
      </main>

      {/* RESULT MODAL DA ROLAGEM */}
      {}
      {currentRollResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden text-center space-y-4">
            
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              currentRollResult.isCritical ? 'bg-amber-400' : currentRollResult.isFumble ? 'bg-red-600' : 'bg-purple-600'
            }`} />

            <div className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
              {currentRollResult.title}
            </div>

            <div className="py-2">
              <div className={`text-6xl font-black font-mono tracking-tight ${
                currentRollResult.isCritical ? 'text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]' :
                currentRollResult.isFumble ? 'text-red-500' : 'text-slate-100'
              }`}>
                {currentRollResult.total}
              </div>

              {currentRollResult.isCritical && (
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4" /> Sucesso Crítico Nat 20!
                </div>
              )}
              {currentRollResult.isFumble && (
                <div className="text-xs font-bold text-red-500 uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Falha Crítica Nat 1!
                </div>
              )}
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1 text-left">
              <div className="text-slate-400 flex justify-between">
                <span>Modo:</span>
                <span className="font-mono text-purple-300 font-bold">{currentRollResult.modeText || 'Normal'}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>Dados Rolados:</span>
                <span className="font-mono text-slate-200">[{currentRollResult.rolls.join(', ')}]</span>
              </div>
              {currentRollResult.bonus !== 0 && (
                <div className="text-slate-400 flex justify-between">
                  <span>Bônus/Modificador:</span>
                  <span className="font-mono text-emerald-400">{formatModifier(currentRollResult.bonus)}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setCurrentRollResult(null)}
              className="w-full py-2.5 rounded-xl bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold text-sm transition"
            >
              Fechar Resultado
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE HISTÓRICO DE ROLAGENS */}
      {}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-900/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" /> Histórico de Rolagens D&D
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-100 text-xs">Fechar</button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {rollHistory.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">Nenhum dado rolado nesta sessão.</div>
              ) : (
                rollHistory.map(roll => (
                  <div key={roll.id} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-200">{roll.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        [{roll.rolls.join(', ')}] {roll.bonus ? formatModifier(roll.bonus) : ''}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-amber-300">{roll.total}</div>
                      <div className="text-[9px] text-slate-500">{roll.timestamp}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR ITEM */}
      {}
      {showNewItemModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddInventoryItem} className="bg-slate-900 border border-purple-900/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-100 text-base">Adicionar Item ao Inventário</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nome do Item</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newItem.weight}
                  onChange={e => setNewItem({...newItem, weight: parseFloat(e.target.value) || 0})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descrição</label>
                <textarea
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewItemModal(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs">Cancelar</button>
              <button type="submit" className="px-4 py-1.5 rounded bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold text-xs">Salvar Item</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL ADICIONAR ARMA */}
      {}
      {showNewWeaponModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddWeapon} className="bg-slate-900 border border-purple-900/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-slate-100 text-base">Adicionar Arma / Ataque</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nome da Arma</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Espada Longa, Arco Curto..."
                  value={newWeapon.name}
                  onChange={e => setNewWeapon({...newWeapon, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Atributo Usado</label>
                  <select
                    value={newWeapon.attr}
                    onChange={e => setNewWeapon({...newWeapon, attr: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
                  >
                    <option value="STR">STR (Força)</option>
                    <option value="DEX">DEX (Destreza)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Dado de Dano</label>
                  <input
                    type="text"
                    placeholder="1d8, 2d6+2..."
                    value={newWeapon.damage}
                    onChange={e => setNewWeapon({...newWeapon, damage: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tipo de Dano / Propriedades</label>
                <input
                  type="text"
                  placeholder="Cortante, Acuidade, CORTANTE..."
                  value={newWeapon.dmgType}
                  onChange={e => setNewWeapon({...newWeapon, dmgType: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewWeaponModal(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs">Cancelar</button>
              <button type="submit" className="px-4 py-1.5 rounded bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold text-xs">Salvar Arma</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL ADICIONAR MAGIA */}
      {}
      {showNewSpellModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddSpell} className="bg-slate-900 border border-purple-900/60 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-slate-100 text-base">Aprender Nova Magia D&D</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nome da Magia</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Escudo Arcano, Bola de Fogo..."
                  value={newSpell.name}
                  onChange={e => setNewSpell({...newSpell, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Nível</label>
                  <select
                    value={newSpell.level}
                    onChange={e => setNewSpell({...newSpell, level: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-200"
                  >
                    <option value={0}>Truque (Nível 0)</option>
                    <option value={1}>1º Nível</option>
                    <option value={2}>2º Nível</option>
                    <option value={3}>3º Nível</option>
                    <option value={4}>4º Nível</option>
                    <option value={5}>5º Nível</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Escola</label>
                  <input
                    type="text"
                    placeholder="Evocação, Abjuração..."
                    value={newSpell.school}
                    onChange={e => setNewSpell({...newSpell, school: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Descrição e Efeitos</label>
                <textarea
                  value={newSpell.description}
                  onChange={e => setNewSpell({...newSpell, description: e.target.value})}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowNewSpellModal(false)} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs">Cancelar</button>
              <button type="submit" className="px-4 py-1.5 rounded bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold text-xs">Salvar Magia</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}