import React, { useEffect, useState } from 'react';
import { 
  Dices, History, Trash2, Heart, Zap, Shield, User, BookOpen, 
  Sparkles, Backpack, Scroll, Plus, Minus, Swords, Crosshair, X, PackagePlus
} from 'lucide-react';

const initialSkills = [
  { name: 'Acrobacia', attr: 'Agilidade' },
  { name: 'Adestrar Animais', attr: 'Sabedoria' },
  { name: 'Arcanismo', attr: 'Inteligência' },
  { name: 'Atletismo', attr: 'Força' },
  { name: 'Atuação', attr: 'Carisma' },
  { name: 'Enganação', attr: 'Carisma' },
  { name: 'Furtividade', attr: 'Agilidade' },
  { name: 'História', attr: 'Inteligência' },
  { name: 'Intimidação', attr: 'Carisma' },
  { name: 'Intuição', attr: 'Sabedoria' },
  { name: 'Investigação', attr: 'Inteligência' },
  { name: 'Medicina', attr: 'Sabedoria' },
  { name: 'Natureza', attr: 'Inteligência' },
  { name: 'Percepção', attr: 'Sabedoria' },
  { name: 'Persuasão', attr: 'Carisma' },
  { name: 'Prestidigitação', attr: 'Agilidade' },
  { name: 'Religião', attr: 'Inteligência' },
  { name: 'Sobrevivência', attr: 'Sabedoria' }
];

// As habilidades escolhem individualmente qual atributo utilizar.
const ABILITY_ATTRIBUTES = [
  'Força',
  'Agilidade',
  'Vitalidade',
  'Inteligência',
  'Sabedoria',
  'Carisma'
];

const STORAGE_KEY = 'ficha-rpg-local-v1';

const loadSavedState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;
    const data = JSON.parse(saved);
    return Object.prototype.hasOwnProperty.call(data, key) ? data[key] : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('geral');
  
  // Perfil do Personagem & Mutação
  const [charInfo, setCharInfo] = useState(() => loadSavedState('charInfo', {
    name: '',
    level: 1,
    mutation: '',
    baseClass: '',
    advClass: 'Nenhuma'
  }));

  // Status Vitais
  const [hp, setHp] = useState(() => loadSavedState('hp', { current: 10, max: 10 }));
  const [energy, setEnergy] = useState(() => loadSavedState('energy', { current: 15, max: 15 }));
  const [armorClass, setArmorClass] = useState(() => loadSavedState('armorClass', 10));
  const [profBonus, setProfBonus] = useState(() => loadSavedState('profBonus', 2));

  // Atributos
  const [attributes, setAttributes] = useState(() => loadSavedState('attributes', {
    Força: 10,
    Agilidade: 10,
    Vitalidade: 10,
    Inteligência: 10,
    Sabedoria: 10,
    Carisma: 10,
    Poder: 5 // Poder não possui modificador negativo/fórmula tradicional
  }));

  // Perícias Proficientes
  const [proficientSkills, setProficientSkills] = useState(() => loadSavedState('proficientSkills', []));

  // Armas de Combate
  const [weapons, setWeapons] = useState(() => loadSavedState('weapons', []));

  // Habilidades
  const [abilities, setAbilities] = useState(() => loadSavedState('abilities', []));

  // Inventário
  const [gold, setGold] = useState(() => loadSavedState('gold', 10));
  const [inventory, setInventory] = useState(() => loadSavedState('inventory', []));

  // Anotações
  const [notes, setNotes] = useState(() => loadSavedState('notes', ''));
  // Foto do personagem (salva localmente neste navegador como imagem comprimida).
  const [characterImage, setCharacterImage] = useState(() => loadSavedState('characterImage', ''));

  // Poder é calculado automaticamente pelo nível: 5 no nível 1 e +5 por nível.
  useEffect(() => {
    const level = Math.max(1, Number(charInfo.level) || 1);
    const powerByLevel = level * 5;

    setAttributes(prev => {
      if (prev.Poder === powerByLevel) return prev;
      return { ...prev, Poder: powerByLevel };
    });
  }, [charInfo.level]);

  // Salva automaticamente a ficha neste navegador.
  // Os dados não são enviados para o servidor nem compartilhados com outros jogadores.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        charInfo,
        hp,
        energy,
        armorClass,
        profBonus,
        attributes,
        proficientSkills,
        weapons,
        abilities,
        gold,
        inventory,
        notes,
        characterImage
      }));
    } catch (error) {
      console.warn('Não foi possível salvar a ficha localmente:', error);
    }
  }, [
    charInfo,
    hp,
    energy,
    armorClass,
    profBonus,
    attributes,
    proficientSkills,
    weapons,
    abilities,
    gold,
    inventory,
    notes,
    characterImage
  ]);



  // Modais de Cadastro
  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
  const [isAbilityModalOpen, setIsAbilityModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Modal de Resultado de Rolagem Flutuante (Centro)
  const [activeRollResult, setActiveRollResult] = useState(null);

  // Histórico de Rolagens (Canto Inferior Direito)
  const [rollHistory, setRollHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Formulários temporários dos Modais
  const [newWeapon, setNewWeapon] = useState({ name: '', dmg: '1d8', attr: 'Força', prop: '' });
  const [newAbility, setNewAbility] = useState({ name: '', tier: 'Simples (1-2x)', cost: 2, attr: 'Força', damage: '1d6', area: '3m', dur: 'Instantânea', desc: '' });
  const [newItem, setNewItem] = useState({ name: '', qty: 1, weight: '0.5 kg', desc: '' });

  // Funções de Cálculo
  const getMod = (val) => Math.floor((val - 10) / 2);

  // Função Principal de Rolagem com Alerta Central
  const triggerRoll = ({ label, diceRoll, mod = 0, isDamage = false, notation = '' }) => {
    const total = diceRoll + mod;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const isCrit = !isDamage && diceRoll === 20;
    const isFail = !isDamage && diceRoll === 1;

    const rollData = {
      id: Date.now(),
      label,
      diceRoll,
      mod,
      total,
      time,
      isCrit,
      isFail,
      isDamage,
      notation
    };

    // Atualiza Histórico
    setRollHistory((prev) => [rollData, ...prev]);

    // Exibe Pop-up no Centro da Tela
    setActiveRollResult(rollData);
  };

  const rollD20 = (mod, label) => {
    const diceRoll = Math.floor(Math.random() * 20) + 1;
    triggerRoll({ label, diceRoll, mod });
  };

  const rollDamage = (diceNotation, label, extraMod = 0) => {
    const parts = diceNotation.toLowerCase().replace(/\s+/g, '').split('+');
    let total = 0;
    
    // Tratamento básico para notações do tipo XdX + Y.
    // extraMod é o modificador do atributo da classe (quando aplicável).
    const dicePart = parts[0];
    const bonus = (parts[1] ? parseInt(parts[1]) || 0 : 0) + extraMod;

    if (dicePart.includes('d')) {
      const [count, sides] = dicePart.split('d').map(n => parseInt(n) || 1);
      for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
      }
    } else {
      total = parseInt(dicePart) || 0;
    }

    triggerRoll({
      label: `Dano: ${label}`,
      diceRoll: total,
      mod: bonus,
      isDamage: true,
      notation: diceNotation
    });
  };

  const toggleSkillProf = (skillName) => {
    setProficientSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  // Funções de Adição através de Modais
  const handleAddWeapon = () => {
    if (!newWeapon.name) return;
    setWeapons([...weapons, { ...newWeapon, id: Date.now() }]);
    setNewWeapon({ name: '', dmg: '1d8', attr: 'Força', prop: '' });
    setIsWeaponModalOpen(false);
  };

  const handleAddAbility = () => {
    if (!newAbility.name) return;
    setAbilities([...abilities, { ...newAbility, id: Date.now(), cost: Number(newAbility.cost) }]);
    setNewAbility({ name: '', tier: 'Simples (1-2x)', cost: 2, attr: 'Força', damage: '1d6', area: '3m', dur: 'Instantânea', desc: '' });
    setIsAbilityModalOpen(false);
  };

  const handleAddItem = () => {
    if (!newItem.name) return;
    setInventory([...inventory, { ...newItem, id: Date.now(), qty: Number(newItem.qty) }]);
    setNewItem({ name: '', qty: 1, weight: '0.5 kg', desc: '' });
    setIsItemModalOpen(false);
  };

  const castAbility = (ability) => {
    const abilityAttribute = ability.attr || 'Força';
    const attributeMod = getMod(attributes[abilityAttribute] || 10);
    const attackMod = attributeMod + profBonus;
    const rollLabel = `Habilidade: ${ability.name} (${abilityAttribute})`;

    if (energy.current >= ability.cost) {
      setEnergy((prev) => ({ ...prev, current: prev.current - ability.cost }));

      if (ability.damage) {
        // O modificador do atributo escolhido é somado ao resultado final do dano/efeito.
        rollDamage(ability.damage, rollLabel, attributeMod);
      } else {
        // O teste/ataque da habilidade usa o modificador do atributo + proficiência.
        rollD20(attackMod, rollLabel);
      }
    } else {
      alert('Energia insuficiente para conjurar esta habilidade!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans relative">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CABEÇALHO DO PERSONAGEM */}
        <header className="bg-slate-900 border border-amber-500/30 p-6 rounded-xl shadow-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* Foto do Personagem */}
            <div className="flex items-center justify-center md:justify-start">
              <div className="relative">
                <label
                  htmlFor="character-image-upload"
                  className="w-28 h-28 md:w-32 md:h-32 rounded-xl border border-amber-500/40 bg-slate-950 overflow-hidden flex items-center justify-center cursor-pointer hover:border-amber-400 transition shadow-lg"
                  title="Adicionar ou trocar foto do personagem"
                >
                  {characterImage ? (
                    <img
                      src={characterImage}
                      alt="Retrato do personagem"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-slate-500 px-2">
                      <User size={34} className="mx-auto mb-1" />
                      <span className="text-[10px] uppercase tracking-wide">Adicionar foto</span>
                    </div>
                  )}
                </label>
                <input
                  id="character-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCharacterImage}
                  className="hidden"
                />
                {characterImage && (
                  <button
                    type="button"
                    onClick={removeCharacterImage}
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-950 border border-rose-700 text-rose-300 hover:bg-rose-900 flex items-center justify-center"
                    title="Remover foto"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Nome e Nível */}
            <div className="space-y-1 md:col-span-1">
              <input
                type="text"
                value={charInfo.name}
                onChange={(e) => setCharInfo({ ...charInfo, name: e.target.value })}
                className="text-2xl font-bold text-amber-400 bg-transparent border-b border-slate-700 focus:border-amber-400 outline-none w-full"
                placeholder="Nome do Personagem"
              />
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Nível:</span>
                <input
                  type="number"
                  value={charInfo.level}
                  onChange={(e) => setCharInfo({ ...charInfo, level: Math.max(1, Number(e.target.value) || 1) })}
                  className="w-12 bg-slate-950 border border-slate-700 rounded text-center text-amber-400 font-bold"
                />
              </div>
            </div>

            {/* Mutação e Classes */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Tipo de Mutação:</label>
                <select
                  value={charInfo.mutation}
                  onChange={(e) => setCharInfo({ ...charInfo, mutation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-1.5 rounded focus:border-amber-500"
                >
                  <option value="U">Tipo U (Único)</option>
                  <option value="N">Tipo N (Natural)</option>
                  <option value="T">Tipo T (Terreno)</option>
                  <option value="E">Tipo E (Elemental)</option>
                  <option value="M">Tipo M (Mental)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Classe de Poder:</label>
                <input
                  type="text"
                  value={charInfo.baseClass}
                  onChange={(e) => setCharInfo({ ...charInfo, baseClass: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-1 rounded focus:border-amber-500"
                  placeholder="Ex.: Espiritualista"
                />
                {getAbilityAttribute() && (
                  <p className="text-[10px] text-cyan-400 mt-1">
                    Habilidades usam: <strong>{getAbilityAttribute()}</strong>
                  </p>
                )}
              </div>
            </div>

            {/* Proficiência e Classe Avançada */}
            <div className="flex flex-col md:items-end justify-between gap-2">
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 uppercase">Proficiência:</span>
                <input
                  type="number"
                  value={profBonus}
                  onChange={(e) => setProfBonus(Number(e.target.value))}
                  className="w-12 bg-slate-900 border border-amber-500/50 rounded text-center text-amber-400 font-bold p-0.5 text-sm"
                />
              </div>

              <div className="w-full md:w-auto text-xs">
                <label className="text-slate-400 block mb-0.5 md:text-right">Classe Avançada:</label>
                <input
                  type="text"
                  value={charInfo.advClass}
                  onChange={(e) => setCharInfo({ ...charInfo, advClass: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-1 rounded focus:border-amber-500 md:text-right"
                />
              </div>
            </div>

          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={resetCharacterSheet}
              className="text-xs bg-slate-950 hover:bg-rose-950/50 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-800 px-3 py-1.5 rounded-lg transition"
              title="Apagar a ficha salva neste navegador"
            >
              Nova ficha / Limpar ficha
            </button>
          </div>

          {/* BARRAS DE STATUS VITAIS (HP, ENERGIA, CA) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-800">
            
            {/* VIDA / HP */}
            <div className="bg-slate-950 p-3 rounded-lg border border-rose-900/50 flex flex-col justify-between space-y-2">
              <div className="flex justify-between items-center text-rose-400 font-bold text-sm">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Pontos de Vida (HP)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={hp.current}
                    onChange={(e) => setHp({ ...hp, current: Number(e.target.value) })}
                    className="w-12 bg-slate-900 text-right text-rose-400 font-bold rounded px-1"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={hp.max}
                    onChange={(e) => setHp({ ...hp, max: Number(e.target.value) })}
                    className="w-12 bg-slate-900 text-left text-slate-400 text-xs rounded px-1"
                  />
                </div>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-rose-600 h-full transition-all" 
                  style={{ width: `${Math.min(100, Math.max(0, (hp.current / hp.max) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between gap-1 pt-1">
                <button onClick={() => setHp(prev => ({ ...prev, current: prev.current - 10 }))} className="px-2 py-0.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs font-bold">-10</button>
                <button onClick={() => setHp(prev => ({ ...prev, current: prev.current - 1 }))} className="px-2 py-0.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs font-bold">-1</button>
                <button onClick={() => setHp(prev => ({ ...prev, current: Math.min(prev.max, prev.current + 1) }))} className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded text-xs font-bold">+1</button>
                <button onClick={() => setHp(prev => ({ ...prev, current: Math.min(prev.max, prev.current + 10) }))} className="px-2 py-0.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded text-xs font-bold">+10</button>
              </div>
            </div>

            {/* ENERGIA */}
            <div className="bg-slate-950 p-3 rounded-lg border border-cyan-900/50 flex flex-col justify-between space-y-2">
              <div className="flex justify-between items-center text-cyan-400 font-bold text-sm">
                <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Energia</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={energy.current}
                    onChange={(e) => setEnergy({ ...energy, current: Number(e.target.value) })}
                    className="w-12 bg-slate-900 text-right text-cyan-400 font-bold rounded px-1"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={energy.max}
                    onChange={(e) => setEnergy({ ...energy, max: Number(e.target.value) })}
                    className="w-12 bg-slate-900 text-left text-slate-400 text-xs rounded px-1"
                  />
                </div>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full transition-all" 
                  style={{ width: `${Math.min(100, Math.max(0, (energy.current / energy.max) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between gap-1 pt-1">
                <button onClick={() => setEnergy(prev => ({ ...prev, current: Math.max(0, prev.current - 10) }))} className="px-2 py-0.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs font-bold">-10</button>
                <button onClick={() => setEnergy(prev => ({ ...prev, current: Math.max(0, prev.current - 1) }))} className="px-2 py-0.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs font-bold">-1</button>
                <button onClick={() => setEnergy(prev => ({ ...prev, current: Math.min(prev.max, prev.current + 1) }))} className="px-2 py-0.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs font-bold">+1</button>
                <button onClick={() => setEnergy(prev => ({ ...prev, current: Math.min(prev.max, prev.current + 10) }))} className="px-2 py-0.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs font-bold">+10</button>
              </div>
            </div>

            {/* CLASSE DE ARMADURA (CA) */}
            <div className="bg-slate-950 p-3 rounded-lg border border-amber-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Shield className="w-6 h-6" />
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400">Classe de Armadura</p>
                  <p className="text-2xl font-black">{armorClass}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => setArmorClass(c => c + 1)} className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700">
                  <Plus className="w-3 h-3" />
                </button>
                <button onClick={() => setArmorClass(c => Math.max(0, c - 1))} className="p-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700">
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* NAVEGAÇÃO POR ABAS */}
        <nav className="flex border-b border-slate-800 space-x-2 overflow-x-auto pb-1">
          {[
            { id: 'geral', label: 'Geral & Atributos', icon: User },
            { id: 'combate', label: 'Combate & Armas', icon: Swords },
            { id: 'habilidades', label: 'Habilidades & Grandiosidade', icon: Sparkles },
            { id: 'inventario', label: 'Inventário & Itens', icon: Backpack },
            { id: 'anotacoes', label: 'História & Notas', icon: Scroll }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold text-sm transition whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-t-2 border-amber-300'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ABA GERAL & ATRIBUTOS */}
        {activeTab === 'geral' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ATRIBUTOS */}
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <User className="w-5 h-5" /> Atributos Base
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(attributes).map(([attr, val]) => {
                  const isPoder = attr === 'Poder';
                  // Poder não tem modificador negativo/cálculo d20 padrão
                  const mod = isPoder ? val : getMod(val);
                  const modText = isPoder ? `${val}` : (mod >= 0 ? `+${mod}` : mod);

                  return (
                    <div 
                      key={attr} 
                      className={`p-3 rounded-lg border text-center flex flex-col justify-between ${
                        isPoder ? 'bg-cyan-950/40 border-cyan-500/50' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <span className={`text-xs uppercase font-bold ${isPoder ? 'text-cyan-400' : 'text-slate-400'}`}>
                        {attr}
                      </span>
                      <div className="my-1 flex items-center justify-center gap-1">
                        <span className={`text-2xl font-black ${isPoder ? 'text-cyan-300' : 'text-amber-400'}`}>
                          {modText}
                        </span>
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => setAttributes({ ...attributes, [attr]: Math.max(0, Number(e.target.value)) })}
                          className="w-10 text-xs bg-slate-900 text-slate-400 text-center rounded border border-slate-800"
                        />
                      </div>
                      <button
                        onClick={() => rollD20(isPoder ? val : mod, `Atributo: ${attr}`)}
                        className={`mt-1 flex items-center justify-center gap-1 text-xs py-1 px-2 rounded transition border ${
                          isPoder 
                            ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-500/40' 
                            : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <Dices className="w-3.5 h-3.5" /> Rolar
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PERÍCIAS */}
            <section className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Perícias
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-2">
                {initialSkills.map((skill) => {
                  const isProf = proficientSkills.includes(skill.name);
                  const attrVal = attributes[skill.attr] || 10;
                  const attrMod = getMod(attrVal);
                  const totalSkillMod = attrMod + (isProf ? profBonus : 0);
                  const modText = totalSkillMod >= 0 ? `+${totalSkillMod}` : totalSkillMod;

                  return (
                    <div key={skill.name} className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isProf}
                          onChange={() => toggleSkillProf(skill.name)}
                          className="accent-amber-500 rounded cursor-pointer"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-200">{skill.name}</p>
                          <p className="text-[10px] text-slate-500">{skill.attr}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-amber-400 w-8 text-right">{modText}</span>
                        <button
                          onClick={() => rollD20(totalSkillMod, `Perícia: ${skill.name}`)}
                          className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded transition"
                          title={`Rolar ${skill.name}`}
                        >
                          <Dices className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}

        {/* ABA COMBATE & ARMAS */}
        {activeTab === 'combate' && (
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Swords className="w-5 h-5" /> Gestão de Armas & Ataques
              </h2>
              <button
                onClick={() => setIsWeaponModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Cadastrar Nova Arma
              </button>
            </div>

            {/* Lista de Armas */}
            <div className="space-y-3">
              {weapons.map((w) => {
                const attrMod = getMod(attributes[w.attr] || 10);
                const attackMod = attrMod + profBonus;

                return (
                  <div key={w.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-950 p-4 rounded-lg border border-slate-800 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-amber-300 text-base">{w.name}</h3>
                        <span className="text-xs bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                          Atributo: {w.attr}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Dano: <strong className="text-slate-200">{w.dmg}</strong> | Propriedades: {w.prop || 'Nenhuma'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => rollD20(attackMod, `Ataque (${w.name})`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs py-1.5 px-3 rounded font-semibold transition"
                      >
                        <Crosshair className="w-3.5 h-3.5" /> Atacar (+{attackMod})
                      </button>
                      <button
                        onClick={() => rollDamage(w.dmg, w.name)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs py-1.5 px-3 rounded font-semibold transition"
                      >
                        <Dices className="w-3.5 h-3.5" /> Dano ({w.dmg})
                      </button>
                      <button
                        onClick={() => setWeapons(weapons.filter((item) => item.id !== w.id))}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ABA HABILIDADES & GRANDIOSIDADE */}
        {activeTab === 'habilidades' && (
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Habilidades e Poderes
              </h2>
              <button
                onClick={() => setIsAbilityModalOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" /> Registrar Habilidade
              </button>
            </div>

            {/* Lista de Habilidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {abilities.map((ability) => (
                <div key={ability.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-amber-300">{ability.name}</h3>
                      <div className="flex flex-wrap gap-1 justify-end">
                        <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                          {ability.tier} | {ability.cost} Energia
                        </span>
                        <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded">
                          Atributo: {ability.attr || 'Força'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ability.desc}</p>
                    <p className="text-[10px] text-slate-500 mt-2">
                      <strong>Dano/Efeito:</strong> {ability.damage || 'N/A'} | <strong>Área:</strong> {ability.area} | <strong>Duração:</strong> {ability.dur}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => castAbility(ability)}
                      className="flex-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs py-1.5 rounded font-semibold transition"
                    >
                      Conjurar / Gastar Energia
                    </button>
                    <button
                      onClick={() => setAbilities(abilities.filter((item) => item.id !== ability.id))}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ABA INVENTÁRIO */}
        {activeTab === 'inventario' && (
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Backpack className="w-5 h-5" /> Inventário & Equipamentos
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded font-bold text-sm">
                  <span>💰 PO:</span>
                  <input
                    type="number"
                    value={gold}
                    onChange={(e) => setGold(Number(e.target.value))}
                    className="w-16 bg-slate-900 text-center text-amber-300 border border-slate-800 rounded"
                  />
                </div>
                <button
                  onClick={() => setIsItemModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition"
                >
                  <PackagePlus className="w-4 h-4" /> Adicionar Item
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {inventory.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm">
                  <div>
                    <span className="font-medium text-slate-200">{item.name} (x{item.qty})</span>
                    {item.desc && <p className="text-xs text-slate-500">{item.desc}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{item.weight}</span>
                    <button
                      onClick={() => setInventory(inventory.filter((i) => i.id !== item.id))}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ABA ANOTAÇÕES */}
        {activeTab === 'anotacoes' && (
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <Scroll className="w-5 h-5" /> História & Anotações da Campanha
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50"
              placeholder="Escreva a história do seu personagem ou notas da aventura aqui..."
            />
          </section>
        )}

      </div>

      {/* POP-UP DE RESULTADO DA ROLAGEM NO CENTRO DA TELA */}
      {activeRollResult && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4 relative animate-in fade-in zoom-in">
            <button
              onClick={() => setActiveRollResult(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {activeRollResult.label}
            </p>

            <div className="my-2">
              <span className={`text-6xl font-black ${
                activeRollResult.isCrit ? 'text-emerald-400' : activeRollResult.isFail ? 'text-rose-500' : 'text-amber-400'
              }`}>
                {activeRollResult.total}
              </span>
            </div>

            {activeRollResult.isCrit && (
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">🎉 Acerto Crítico!</p>
            )}
            {activeRollResult.isFail && (
              <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">⚠️ Falha Crítica!</p>
            )}

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-400">
              {activeRollResult.isDamage ? (
                <span>Notação de Dano: <strong>{activeRollResult.notation}</strong></span>
              ) : (
                <span>Dado d20: <strong>{activeRollResult.diceRoll}</strong> {activeRollResult.mod >= 0 ? `+ ${activeRollResult.mod}` : `- ${Math.abs(activeRollResult.mod)}`} (Modificador)</span>
              )}
            </div>

            <button
              onClick={() => setActiveRollResult(null)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-sm transition"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* BOTÃO E HISTÓRICO FLUTUANTE NO CANTO INFERIOR DIREITO */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {isHistoryOpen && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl w-80 max-h-80 overflow-y-auto space-y-2 mb-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1">
                <History className="w-3.5 h-3.5" /> Histórico de Testes
              </h3>
              <button onClick={() => setRollHistory([])} className="text-[10px] text-rose-400 hover:underline">
                Limpar
              </button>
            </div>
            {rollHistory.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-2">Nenhum teste efetuado.</p>
            ) : (
              rollHistory.map((roll) => (
                <div key={roll.id} className="bg-slate-950 p-2 rounded border border-slate-800 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-slate-200">{roll.label}</p>
                    <p className="text-[10px] text-slate-500">{roll.time}</p>
                  </div>
                  <span className={`font-bold text-sm ${
                    roll.isCrit ? 'text-emerald-400' : roll.isFail ? 'text-rose-500' : 'text-amber-400'
                  }`}>
                    {roll.total}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm transition"
        >
          <History className="w-4 h-4" /> Histórico ({rollHistory.length})
        </button>
      </div>

      {/* MODAL ADICIONAR ARMA */}
      {isWeaponModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-amber-400">Cadastrar Nova Arma</h3>
              <button onClick={() => setIsWeaponModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nome da Arma</label>
                <input
                  type="text"
                  value={newWeapon.name}
                  onChange={(e) => setNewWeapon({ ...newWeapon, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  placeholder="Ex: Espada Longa"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Dano Base</label>
                  <input
                    type="text"
                    value={newWeapon.dmg}
                    onChange={(e) => setNewWeapon({ ...newWeapon, dmg: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                    placeholder="Ex: 1d8 + 2"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Atributo Utilizado</label>
                  <select
                    value={newWeapon.attr}
                    onChange={(e) => setNewWeapon({ ...newWeapon, attr: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  >
                    <option value="Força">Força</option>
                    <option value="Agilidade">Agilidade (Destreza)</option>
                    <option value="Inteligência">Inteligência (Intelecto)</option>
                    <option value="Sabedoria">Sabedoria</option>
                    <option value="Carisma">Carisma</option>
                    <option value="Vitalidade">Vitalidade</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Propriedades</label>
                <input
                  type="text"
                  value={newWeapon.prop}
                  onChange={(e) => setNewWeapon({ ...newWeapon, prop: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  placeholder="Ex: Versátil, Leve"
                />
              </div>
            </div>
            <button
              onClick={handleAddWeapon}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-sm transition"
            >
              Salvar Arma
            </button>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR HABILIDADE */}
      {isAbilityModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-amber-400">Registrar Habilidade</h3>
              <button onClick={() => setIsAbilityModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nome da Habilidade</label>
                <input
                  type="text"
                  value={newAbility.name}
                  onChange={(e) => setNewAbility({ ...newAbility, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  placeholder="Ex: Bola de Fogo"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Categoria/Grandiosidade</label>
                  <select
                    value={newAbility.tier}
                    onChange={(e) => setNewAbility({ ...newAbility, tier: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  >
                    <option>Simples (1-2x)</option>
                    <option>Normal (3-5x)</option>
                    <option>Grande (6-15x)</option>
                    <option>Grandiosa (16-30x)</option>
                    <option>Suprema (31-59x)</option>
                    <option>Absoluta (60x+)</option>
                    <option>Passiva</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Custo de Energia</label>
                  <input
                    type="number"
                    value={newAbility.cost}
                    onChange={(e) => setNewAbility({ ...newAbility, cost: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Atributo utilizado pela habilidade</label>
                <select
                  value={newAbility.attr}
                  onChange={(e) => setNewAbility({ ...newAbility, attr: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                >
                  {ABILITY_ATTRIBUTES.map((attr) => (
                    <option key={attr} value={attr}>{attr}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  O modificador deste atributo será usado no teste e somado ao dano/efeito da habilidade.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Dados de Dano/Efeito</label>
                  <input
                    type="text"
                    value={newAbility.damage}
                    onChange={(e) => setNewAbility({ ...newAbility, damage: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                    placeholder="Ex: 2d6 + 4"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Alcance / Área</label>
                  <input
                    type="text"
                    value={newAbility.area}
                    onChange={(e) => setNewAbility({ ...newAbility, area: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                    placeholder="Ex: 6m de Raio"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Descrição</label>
                <textarea
                  value={newAbility.desc}
                  onChange={(e) => setNewAbility({ ...newAbility, desc: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  placeholder="Efeitos da habilidade..."
                />
              </div>
            </div>
            <button
              onClick={handleAddAbility}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2 rounded-lg text-sm transition"
            >
              Salvar Habilidade
            </button>
          </div>
        </div>
      )}

      {/* MODAL ADICIONAR ITEM NO INVENTÁRIO */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-amber-400">Adicionar Item ao Inventário</h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nome do Item</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  placeholder="Ex: Corda de Cânhamo"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Quantidade</label>
                  <input
                    type="number"
                    value={newItem.qty}
                    onChange={(e) => setNewItem({ ...newItem, qty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Peso</label>
                  <input
                    type="text"
                    value={newItem.weight}
                    onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                    placeholder="Ex: 1.0 kg"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Descrição / O que ele faz</label>
                <textarea
                  value={newItem.desc}
                  onChange={(e) => setNewItem({ ...newItem, desc: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                  placeholder="Detalhes ou propriedades do item..."
                />
              </div>
            </div>
            <button
              onClick={handleAddItem}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-sm transition"
            >
              Adicionar ao Inventário
            </button>
          </div>
        </div>
      )}

    </div>
  );
}