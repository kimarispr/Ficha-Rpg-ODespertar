import React, { useState } from 'react';
import { Dices, History, Trash2, Heart, Zap, Shield, User, BookOpen, Sparkles, Backpack, Scroll, Plus, Minus } from 'lucide-react';

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
  
  // Status Vitais
  const [hp, setHp] = useState({ current: 28, max: 32 });
  const [energy, setEnergy] = useState({ current: 12, max: 15 });
  const [armorClass, setArmorClass] = useState(16);
  const [profBonus, setProfBonus] = useState(2);

  // Atributos
  const [attributes, setAttributes] = useState({
    Força: 14,
    Agilidade: 12,
    Constituição: 15,
    Inteligência: 10,
    Sabedoria: 13,
    Carisma: 8
  });

  // Perícias Proficientes
  const [proficientSkills, setProficientSkills] = useState(['Percepção', 'Atletismo']);

  // Histórico de Rolagens
  const [rollHistory, setRollHistory] = useState([]);

  // Inventário e Magias
  const [gold, setGold] = useState(45);
  const [inventory] = useState([
    { id: 1, name: 'Espada Longa', qty: 1, weight: '1.5 kg' },
    { id: 2, name: 'Escudo de Aço', qty: 1, weight: '3.0 kg' },
    { id: 3, name: 'Poção de Cura', qty: 3, weight: '0.5 kg' }
  ]);

  const [spells] = useState([
    { id: 1, name: 'Golpe Divino', cost: 3, desc: 'Causa 2d8 de dano radiante extra.' },
    { id: 2, name: 'Escudo Mágico', cost: 2, desc: '+5 de CA até o próximo turno.' }
  ]);

  const [notes, setNotes] = useState('Nascido nas terras do norte, busca vingança pela destruição de seu feudo...');

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

  const toggleSkillProf = (skillName) => {
    setProficientSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* CABEÇALHO DO PERSONAGEM */}
        <header className="bg-slate-900 border border-amber-500/30 p-6 rounded-xl shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-amber-400">Valeros, o Guerreiro</h1>
              <p className="text-slate-400 text-sm">Humano • Guerreiro Nível 3</p>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 uppercase">Proficiência:</span>
              <input
                type="number"
                value={profBonus}
                onChange={(e) => setProfBonus(Number(e.target.value))}
                className="w-12 bg-slate-900 border border-amber-500/50 rounded text-center text-amber-400 font-bold p-1 text-sm"
              />
            </div>
          </div>

          {/* BARRAS DE STATUS VITAIS (HP, ENERGIA, CA) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
            {/* VIDA / HP */}
            <div className="bg-slate-950 p-3 rounded-lg border border-rose-900/50 flex flex-col justify-between">
              <div className="flex justify-between items-center text-rose-400 font-bold text-sm">
                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> Pontos de Vida (HP)</span>
                <span>{hp.current} / {hp.max}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                <div 
                  className="bg-rose-600 h-full transition-all" 
                  style={{ width: `${Math.min(100, Math.max(0, (hp.current / hp.max) * 100))}%` }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setHp(prev => ({ ...prev, current: Math.max(0, prev.current - 1) }))}
                  className="p-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs flex items-center"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setHp(prev => ({ ...prev, current: Math.min(prev.max, prev.current + 1) }))}
                  className="p-1 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 rounded text-xs flex items-center"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* ENERGIA / MANA */}
            <div className="bg-slate-950 p-3 rounded-lg border border-cyan-900/50 flex flex-col justify-between">
              <div className="flex justify-between items-center text-cyan-400 font-bold text-sm">
                <span className="flex items-center gap-1"><Zap className="w-4 h-4" /> Energia / Mana</span>
                <span>{energy.current} / {energy.max}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden my-2">
                <div 
                  className="bg-cyan-500 h-full transition-all" 
                  style={{ width: `${Math.min(100, Math.max(0, (energy.current / energy.max) * 100))}%` }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setEnergy(prev => ({ ...prev, current: Math.max(0, prev.current - 1) }))}
                  className="p-1 bg-slate-900 hover:bg-cyan-950 border border-cyan-800 text-cyan-300 rounded text-xs flex items-center"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setEnergy(prev => ({ ...prev, current: Math.min(prev.max, prev.current + 1) }))}
                  className="p-1 bg-slate-900 hover:bg-cyan-950 border border-cyan-800 text-cyan-300 rounded text-xs flex items-center"
                >
                  <Plus className="w-3 h-3" />
                </button>
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
            { id: 'geral', label: 'Geral & Status', icon: User },
            { id: 'magias', label: 'Magias & Poderes', icon: Sparkles },
            { id: 'inventario', label: 'Inventário & Itens', icon: Backpack },
            { id: 'anotacoes', label: 'História & Notas', icon: Scroll }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold text-sm transition ${
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

        {/* CONTEÚDO DAS ABAS */}
        {activeTab === 'geral' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ATRIBUTOS */}
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <User className="w-5 h-5" /> Atributos
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(attributes).map(([attr, val]) => {
                  const mod = getMod(val);
                  const modText = mod >= 0 ? `+${mod}` : mod;
                  return (
                    <div key={attr} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center flex flex-col justify-between">
                      <span className="text-xs text-slate-400 uppercase font-bold">{attr}</span>
                      <div className="my-1">
                        <span className="text-2xl font-black text-amber-400">{modText}</span>
                        <span className="text-xs text-slate-500 block">({val})</span>
                      </div>
                      <button
                        onClick={() => rollD20(mod, `Atributo: ${attr}`)}
                        className="mt-2 flex items-center justify-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs py-1 px-2 rounded transition"
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
                  const attrMod = getMod(attributes[skill.attr]);
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

        {activeTab === 'magias' && (
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Magias e Habilidades Ativas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spells.map((spell) => (
                <div key={spell.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-amber-300">{spell.name}</h3>
                    <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                      Custo: {spell.cost} Energia
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{spell.desc}</p>
                  <button
                    onClick={() => {
                      if (energy.current >= spell.cost) {
                        setEnergy(prev => ({ ...prev, current: prev.current - spell.cost }));
                        rollD20(getMod(attributes.Carisma), `Magia: ${spell.name}`);
                      } else {
                        alert('Energia/Mana insuficiente!');
                      }
                    }}
                    className="w-full mt-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs py-1.5 rounded font-semibold transition"
                  >
                    Conjurar / Usar Poder
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'inventario' && (
          <section className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Backpack className="w-5 h-5" /> Inventário & Equipamentos
              </h2>
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded font-bold text-sm">
                💰 {gold} Peças de Ouro (PO)
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
              Nenhuma rolagem efetuada. Clique em "Rolar" em qualquer Atributo, Perícia ou Magia!
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
                        Dado ({roll.diceRoll}) {roll.mod >= 0 ? `+ ${roll.mod}` : `- ${Math.abs(roll.mod)}`}
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