import React, { useState } from 'react';
import { Dices, History, Trash2, User, BookOpen } from 'lucide-react';

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
  const [profBonus, setProfBonus] = useState(2);
  const [attributes, setAttributes] = useState({
    Força: 14,
    Agilidade: 12,
    Constituição: 15,
    Inteligência: 10,
    Sabedoria: 13,
    Carisma: 8
  });

  const [proficientSkills, setProficientSkills] = useState(['Percepção', 'Atletismo']);
  const [rollHistory, setRollHistory] = useState([]);

  // Modificador de atributo = Math.floor((valor - 10) / 2)
  const getMod = (val) => Math.floor((val - 10) / 2);

  // Função para Rolar Dados d20
  const rollD20 = (mod, label) => {
    const diceRoll = Math.floor(Math.random() * 20) + 1;
    const total = diceRoll + mod;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newRoll = {
      id: Date.now(),
      label,
      diceRoll,
      mod,
      total,
      time,
      isCrit: diceRoll === 20,
      isFail: diceRoll === 1
    };

    setRollHistory((prev) => [newRoll, ...prev]);
  };

  const toggleSkillProf = (skillName) => {
    setProficientSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((s) => s !== skillName)
        : [...prev, skillName]
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* CABEÇALHO */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-amber-500/30 p-6 rounded-xl shadow-lg gap-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-400">Valeros, o Guerreiro</h1>
            <p className="text-slate-400 text-sm">Humano • Guerreiro Nível 3</p>
          </div>
          <div className="flex items-center gap-4 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
            <span className="text-sm font-semibold text-slate-300">Bônus de Proficiência:</span>
            <input
              type="number"
              value={profBonus}
              onChange={(e) => setProfBonus(Number(e.target.value))}
              className="w-12 bg-slate-900 border border-amber-500/50 rounded text-center text-amber-400 font-bold p-1"
            />
          </div>
        </header>

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
                  <div key={skill.name} className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800/80 hover:border-slate-700 transition">
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

        {/* HISTÓRICO DE ROLAGENS */}
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
            <p className="text-slate-500 text-sm text-center py-4">Nenhuma rolagem efetuada ainda. Clique no botão de dado de um atributo ou perícia!</p>
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