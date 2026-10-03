import React, { useState } from 'react';
import { 
  Dices, History, Trash2, Heart, Zap, Shield, User, BookOpen, 
  Sparkles, Backpack, Scroll, Plus, Minus, Swords, Crosshair, Award 
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

export default function App() {
  const [activeTab, setActiveTab] = useState('geral');
  
  // Perfil do Personagem & Mutação
  const [charInfo, setCharInfo] = useState({
    name: 'Valeros',
    level: 3,
    mutation: 'E', // U, N, T, E, M
    baseClass: 'Brutamontes',
    advClass: 'Colosso'
  });

  // Status Vitais
  const [hp, setHp] = useState({ current: 28, max: 32 });
  const [energy, setEnergy] = useState({ current: 20, max: 30, reserved: 0 });
  const [armorClass, setArmorClass] = useState(16);
  const [profBonus, setProfBonus] = useState(2);

  // Atributos (Incluindo PODER)
  const [attributes, setAttributes] = useState({
    Força: 14,
    Agilidade: 12,
    Vitalidade: 15,
    Inteligência: 10,
    Sabedoria: 13,
    Carisma: 8,
    Poder: 5
  });

  // Perícias Proficientes
  const [proficientSkills, setProficientSkills] = useState(['Percepção', 'Atletismo']);

  // Armas de Combate
  const [weapons, setWeapons] = useState([
    { id: 1, name: 'Espada Grande', dmg: '2d6', attr: 'Força', prop: 'Pesada, Duas Mãos' },
    { id: 2, name: 'Dardo Elemental', dmg: '1d6', attr: 'Poder', prop: 'Distância (18m)' }
  ]);
  const [newWeapon, setNewWeapon] = useState({ name: '', dmg: '1d8', attr: 'Força', prop: '' });

  // Habilidades / Magias
  const [abilities, setAbilities] = useState([
    { id: 1, name: 'Impacto Devastador', tier: 'Normal (3-5x)', cost: 4, area: 'Corpo a Corpo', dur: 'Instantânea', desc: 'Causa dano físico extra + efeito de derrubar o alvo.' },
    { id: 2, name: 'Escudo Elemental', tier: 'Grande (6-15x)', cost: 8, area: '3m', dur: '3 turnos', desc: '+4 na CA e resistência a danos elementais.' }
  ]);
  const [newAbility, setNewAbility] = useState({ name: '', tier: 'Simples (1-2x)', cost: 2, area: '3m', dur: '2 turnos', desc: '' });

  // Histórico de Rolagens
  const [rollHistory, setRollHistory] = useState([]);

  // Inventário e Notas
  const [gold, setGold] = useState(45);
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Escudo de Aço', qty: 1, weight: '3.0 kg' },
    { id: 2, name: 'Poção de Cura', qty: 3, weight: '0.5 kg' }
  ]);
  const [notes, setNotes] = useState('Nascido nas terras do norte, despertou a mutação elemental após sobreviver a um raio...');

  // Funções Auxiliares
  const getMod = (val) => Math.floor((val - 10) / 2);

  const rollD20 = (mod, label) => {
    const diceRoll = Math.floor(Math.random() * 20) + 1;
    const total = diceRoll + mod;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setRollHistory((prev) => [
      {
        id: Date.now(),
        label,
        diceRoll,
        mod,
        total,
        time,
        isCrit: diceRoll === 20,
        isFail: diceRoll === 1
      },
      ...prev
    ]);
  };

  const rollDamage = (diceNotation, label) => {
    // Exemplo simplificado de rolagem de dano
    const parts = diceNotation.toLowerCase().split('d');
    let total = 0;
    if (parts.length === 2) {
      const count = parseInt(parts[0]) || 1;
      const sides = parseInt(parts[1]) || 6;
      for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
      }
    } else {
      total = parseInt(diceNotation) || 0;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setRollHistory((prev) => [
      {
        id: Date.now(),
        label: `Dano: ${label} (${diceNotation})`,
        diceRoll: total,
        mod: 0,
        total,
        time,
        isCrit: false,
        isFail: false
      },
      ...prev
    ]);
  };

  const toggleSkillProf = (skillName) => {
    setProficientSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  // Adicionar Arma
  const handleAddWeapon = () => {
    if (!newWeapon.name) return;
    setWeapons([...weapons, { ...newWeapon, id: Date.now() }]);
    setNewWeapon({ name: '', dmg: '1d8', attr: 'Força', prop: '' });
  };

  // Adicionar Habilidade
  const handleAddAbility = () => {
    if (!newAbility.name) return;
    setAbilities([...abilities, { ...newAbility, id: Date.now(), cost: Number(newAbility.cost) }]);
    setNewAbility({ name: '', tier: 'Simples (1-2x)', cost: 2, area: '3m', dur: '2 turnos', desc: '' });
  };

  // Conjurar Habilidade
  const castAbility = (ability) => {
    if (energy.current >= ability.cost) {
      setEnergy((prev) => ({ ...prev, current: prev.current - ability.cost }));
      rollD20(getMod(attributes.Poder), `Habilidade: ${ability.name}`);
    } else {
      alert('Energia insuficiente para usar esta habilidade!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CABEÇALHO DO PERSONAGEM */}
        <header className="bg-slate-900 border border-amber-500/30 p-6 rounded-xl shadow-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Nome e Nível */}
            <div className="space-y-1">
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
                  onChange={(e) => setCharInfo({ ...charInfo, level: Number(e.target.value) })}
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
                  placeholder="Ex: Brutamontes"
                />
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
                  placeholder="Ex: Colosso"
                />
              </div>
            </div>

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
              {/* Botões Rápidos de HP */}
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
              {/* Botões Rápidos de Energia */}
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
                  const mod = getMod(val);
                  const modText = mod >= 0 ? `+${mod}` : mod;
                  const isPoder = attr === 'Poder';

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
                          onChange={(e) => setAttributes({ ...attributes, [attr]: Number(e.target.value) })}
                          className="w-10 text-xs bg-slate-900 text-slate-400 text-center rounded border border-slate-800"
                        />
                      </div>
                      <button
                        onClick={() => rollD20(mod, `Atributo: ${attr}`)}
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
                          onClick={() => rollD20(totalSkillMod, skill.name)}
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
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <Swords className="w-5 h-5" /> Gestão de Armas & Ataques
            </h2>

            {/* Form de Nova Arma */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-300">Cadastrar Nova Arma</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Nome da Arma"
                  value={newWeapon.name}
                  onChange={(e) => setNewWeapon({ ...newWeapon, name: e.target.value })}
                  className="bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Dano Base (ex: 1d8)"
                  value={newWeapon.dmg}
                  onChange={(e) => setNewWeapon({ ...newWeapon, dmg: e.target.value })}
                  className="bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                />
                <select
                  value={newWeapon.attr}
                  onChange={(e) => setNewWeapon({ ...newWeapon, attr: e.target.value })}
                  className="bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                >
                  <option value="Força">Força</option>
                  <option value="Agilidade">Agilidade</option>
                  <option value="Poder">Poder</option>
                </select>
                <input
                  type="text"
                  placeholder="Propriedades"
                  value={newWeapon.prop}
                  onChange={(e) => setNewWeapon({ ...newWeapon, prop: e.target.value })}
                  className="bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                />
              </div>
              <button
                onClick={handleAddWeapon}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded text-sm transition"
              >
                + Adicionar Arma
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
                        onClick={() => rollD20(attackMod, `Ataque: ${w.name}`)}
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
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Habilidades e Poderes
            </h2>

            {/* Form de Nova Habilidade */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-slate-300">Cadastrar Nova Habilidade</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Nome da Habilidade"
                  value={newAbility.name}
                  onChange={(e) => setNewAbility({ ...newAbility, name: e.target.value })}
                  className="bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                />
                <select
                  value={newAbility.tier}
                  onChange={(e) => setNewAbility({ ...newAbility, tier: e.target.value })}
                  className="bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                >
                  <option>Simples (1-2x)</option>
                  <option>Normal (3-5x)</option>
                  <option>Grande (6-15x)</option>
                  <option>Grandiosa (16-30x)</option>
                  <option>Suprema (31-59x)</option>
                  <option>Absoluta (60x+)</option>
                  <option>Passiva (Reserva)</option>
                </select>
                <input
                  type="number"
                  placeholder="Custo de Energia"
                  value={newAbility.cost}
                  onChange={(e) => setNewAbility({ ...newAbility, cost: e.target.value })}
                  className="bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Área / Duração"
                  value={newAbility.area}
                  onChange={(e) => setNewAbility({ ...newAbility, area: e.target.value })}
                  className="bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
                />
              </div>
              <input
                type="text"
                placeholder="Descrição e efeitos da habilidade..."
                value={newAbility.desc}
                onChange={(e) => setNewAbility({ ...newAbility, desc: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-sm text-slate-200 focus:border-amber-500 outline-none"
              />
              <button
                onClick={handleAddAbility}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-2 rounded text-sm transition"
              >
                + Registar Habilidade
              </button>
            </div>

            {/* Lista de Habilidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {abilities.map((ability) => (
                <div key={ability.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-amber-300">{ability.name}</h3>
                      <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                        {ability.tier} | {ability.cost} Energia
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{ability.desc}</p>
                    <p className="text-[10px] text-slate-500 mt-2">
                      <strong>Alcance/Área:</strong> {ability.area} | <strong>Duração:</strong> {ability.dur}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => castAbility(ability)}
                      className="flex-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs py-1.5 rounded font-semibold transition"
                    >
                      Conjurar / Usar
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
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded font-bold text-sm">
                <span>💰 Peças de Ouro (PO):</span>
                <input
                  type="number"
                  value={gold}
                  onChange={(e) => setGold(Number(e.target.value))}
                  className="w-16 bg-slate-900 text-center text-amber-300 border border-slate-800 rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              {inventory.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm">
                  <span className="font-medium text-slate-200">{item.name} (x{item.qty})</span>
                  <span className="text-xs text-slate-500">{item.weight}</span>
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

        {/* HISTÓRICO DE ROLAGENS (SEMPRE VISÍVEL ABAIXO) */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <History className="w-5 h-5" /> Histórico de Rolagens
            </h2>
            {rollHistory.length > 0 && (
              <button
                onClick={() => setRollHistory([])}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 border border-rose-500/20 bg-rose-500/10 px-2 py-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpar Histórico
              </button>
            )}
          </div>

          {rollHistory.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">
              Nenhuma rolagem efetuada. Clique em "Rolar", "Atacar" ou "Dano" em qualquer Atributo, Perícia, Arma ou Habilidade!
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {rollHistory.map((roll) => (
                <div key={roll.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 text-sm">
                  <div className="flex items-center gap-3">
                    <Dices className={`w-5 h-5 ${roll.isCrit ? 'text-emerald-400' : roll.isFail ? 'text-rose-500' : 'text-amber-400'}`} />
                    <div>
                      <span className="font-semibold text-slate-200">{roll.label}</span>
                      <span className="text-xs text-slate-500 ml-2">[{roll.time}]</span>
                      <div className="text-xs text-slate-400">
                        {roll.mod !== 0 ? `Dado (${roll.diceRoll}) ${roll.mod >= 0 ? `+ ${roll.mod}` : `- ${Math.abs(roll.mod)}`}` : `Resultado: ${roll.diceRoll}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-black ${roll.isCrit ? 'text-emerald-400' : roll.isFail ? 'text-rose-500' : 'text-amber-400'}`}>
                      {roll.total}
                    </span>
                    {roll.isCrit && <span className="block text-[10px] text-emerald-400 font-bold uppercase">Acerto Crítico!</span>}
                    {roll.isFail && <span className="block text-[10px] text-rose-500 font-bold uppercase">Falha Crítica!</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}