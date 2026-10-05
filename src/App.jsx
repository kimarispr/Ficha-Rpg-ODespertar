import React, { useEffect, useState } from 'react';
import {
  Dices,
  History,
  Trash2,
  Heart,
  Zap,
  Shield,
  User,
  Sparkles,
  Backpack,
  Scroll,
  Plus,
  Minus,
  Swords,
  X,
  PackagePlus,
  Pencil,
} from 'lucide-react';

const STORAGE_KEY = 'ficha-rpg-local-v1';

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
  { name: 'Sobrevivência', attr: 'Sabedoria' },
];

const abilityAttributes = [
  'Força',
  'Agilidade',
  'Vitalidade',
  'Inteligência',
  'Sabedoria',
  'Carisma',
];

const loadState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;

    const data = JSON.parse(saved);
    return Object.prototype.hasOwnProperty.call(data, key)
      ? data[key]
      : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('geral');

  const [charInfo, setCharInfo] = useState(() =>
    loadState('charInfo', {
      name: '',
      level: 1,
      mutation: '',
      baseClass: '',
      advClass: 'Nenhuma',
    })
  );

  const [hp, setHp] = useState(() =>
    loadState('hp', { current: 10, max: 10 })
  );

  const [energy, setEnergy] = useState(() =>
    loadState('energy', { current: 15, max: 15 })
  );

  const [armorClass, setArmorClass] = useState(() =>
    loadState('armorClass', 10)
  );

  const [profBonus, setProfBonus] = useState(() =>
    loadState('profBonus', 2)
  );

  const [resistancePhysical, setResistancePhysical] = useState(() =>
    loadState('resistancePhysical', { current: 0, max: 0 })
  );

  const [resistanceSpiritual, setResistanceSpiritual] = useState(() =>
    loadState('resistanceSpiritual', { current: 0, max: 0 })
  );

  const [resistanceBonus, setResistanceBonus] = useState(() =>
    loadState('resistanceBonus', 0)
  );

  const [attributes, setAttributes] = useState(() =>
    loadState('attributes', {
      Força: 10,
      Agilidade: 10,
      Vitalidade: 10,
      Inteligência: 10,
      Sabedoria: 10,
      Carisma: 10,
      Poder: 5,
    })
  );

  const [proficientSkills, setProficientSkills] = useState(() =>
    loadState('proficientSkills', [])
  );

  const [skillManualValues, setSkillManualValues] = useState(() =>
    loadState('skillManualValues', {})
  );

  const [weapons, setWeapons] = useState(() =>
    loadState('weapons', [])
  );

  const [abilities, setAbilities] = useState(() =>
    loadState('abilities', [])
  );

  const [passives, setPassives] = useState(() =>
    loadState('passives', [])
  );

  const [gold, setGold] = useState(() =>
    loadState('gold', 10)
  );

  const [inventory, setInventory] = useState(() =>
    loadState('inventory', [])
  );

  const [notes, setNotes] = useState(() =>
    loadState('notes', '')
  );

  const [history, setHistory] = useState(() =>
    loadState('history', '')
  );

  const [deathSaves, setDeathSaves] = useState(() =>
    loadState('deathSaves', {
      successes: 0,
      failures: 0,
    })
  );

  const [characterImage, setCharacterImage] = useState(() =>
    loadState('characterImage', '')
  );

  const [rollHistory, setRollHistory] = useState([]);
  const [activeRollResult, setActiveRollResult] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [isWeaponModalOpen, setIsWeaponModalOpen] = useState(false);
  const [isAbilityModalOpen, setIsAbilityModalOpen] = useState(false);
  const [isPassiveModalOpen, setIsPassiveModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const [editingWeaponId, setEditingWeaponId] = useState(null);
  const [editingAbilityId, setEditingAbilityId] = useState(null);
  const [editingPassiveId, setEditingPassiveId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  const [newWeapon, setNewWeapon] = useState({
    name: '',
    dmg: '1d8',
    attr: 'Força',
    prop: '',
  });

  const [newAbility, setNewAbility] = useState({
    name: '',
    attr: 'Força',
    damage: '1d6',
    area: '3m',
    dur: 'Instantânea',
    desc: '',
  });

  const [newPassive, setNewPassive] = useState({
    name: '',
    type: 'Passiva',
    active: false,
    effect: '',
    area: 'Pessoal',
    dur: 'Permanente',
    desc: '',
  });

  const [newItem, setNewItem] = useState({
    name: '',
    qty: 1,
    weight: '0.5 kg',
    desc: '',
  });

  /*
   * MODAL DE UTILIZAÇÃO DA HABILIDADE
   *
   * Esses valores são preenchidos novamente a cada utilização.
   */
  const [abilityRollModal, setAbilityRollModal] = useState(null);
  const [abilityRollTier, setAbilityRollTier] = useState('Simples');
  const [abilityRollDamage, setAbilityRollDamage] = useState('1d6');
  const [abilityRollBonus, setAbilityRollBonus] = useState(0);
  const [abilityRollCost, setAbilityRollCost] = useState(2);

  /*
   * Poder:
   * nível 1 = 5
   * cada nível acrescenta +5
   */
  useEffect(() => {
    const level = Math.max(1, Number(charInfo.level) || 1);
    const newPower = level * 5;

    setAttributes((prev) => ({
      ...prev,
      Poder: newPower,
    }));
  }, [charInfo.level]);

  /*
   * SALVAMENTO AUTOMÁTICO
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          charInfo,
          hp,
          energy,
          armorClass,
          profBonus,
          resistancePhysical,
          resistanceSpiritual,
          resistanceBonus,
          attributes,
          proficientSkills,
          skillManualValues,
          weapons,
          abilities,
          passives,
          gold,
          inventory,
          notes,
          history,
          deathSaves,
          characterImage,
        })
      );
    } catch (error) {
      console.warn('Erro ao salvar ficha:', error);
    }
  }, [
    charInfo,
    hp,
    energy,
    armorClass,
    profBonus,
    resistancePhysical,
    resistanceSpiritual,
    resistanceBonus,
    attributes,
    proficientSkills,
    skillManualValues,
    weapons,
    abilities,
    passives,
    gold,
    inventory,
    notes,
    history,
    deathSaves,
    characterImage,
  ]);

  const getMod = (value) => Math.floor((Number(value) - 10) / 2);

  /*
   * ROLAGEM
   */
  const triggerRoll = ({
    label,
    diceRoll,
    mod = 0,
    isDamage = false,
    notation = '',
    rolls = null,
  }) => {
    const total = diceRoll + mod;

    const data = {
      id: Date.now() + Math.random(),
      label,
      diceRoll,
      mod,
      total,
      isDamage,
      notation,
      rolls,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      isCrit: !isDamage && diceRoll === 20,
      isFail: !isDamage && diceRoll === 1,
    };

    setRollHistory((prev) => [data, ...prev]);
    setActiveRollResult(data);
  };

  const rollD20 = (mod, label) => {
    const result = Math.floor(Math.random() * 20) + 1;

    triggerRoll({
      label,
      diceRoll: result,
      mod,
    });
  };

  const rollDamage = (notation, label) => {
    const match = String(notation)
      .trim()
      .match(/^(\d+)\s*d\s*(\d+)(?:\s*([+-])\s*(\d+))?$/i);

    if (!match) {
      alert('Use uma notação como 1d8, 2d6 ou 4d10 + 5.');
      return;
    }

    const count = Math.max(1, Math.min(100, Number(match[1])));
    const sides = Math.max(2, Math.min(1000, Number(match[2])));

    let bonus = Number(match[4]) || 0;

    if (match[3] === '-') {
      bonus *= -1;
    }

    const rolls = Array.from(
      { length: count },
      () => Math.floor(Math.random() * sides) + 1
    );

    const diceTotal = rolls.reduce(
      (total, value) => total + value,
      0
    );

    triggerRoll({
      label: `Dano: ${label}`,
      diceRoll: diceTotal,
      mod: bonus,
      isDamage: true,
      notation: `${count}d${sides}${
        bonus >= 0 ? ` + ${bonus}` : ` - ${Math.abs(bonus)}`
      }`,
      rolls,
    });
  };

  /*
   * RECUPERAÇÃO DE ENERGIA
   *
   * Fórmula:
   *
   * 1d6 por cada 20 de Energia Máxima
   * +
   * metade do Poder, arredondada para baixo.
   *
   * Exemplo:
   * Energia máxima 80 = 4d6
   * Poder 25 = +12
   * Resultado = 4d6 + 12
   */
  const energyRecoveryDice = Math.floor(
    Math.max(0, Number(energy.max) || 0) / 20
  );

  const energyRecoveryBonus = Math.floor(
    (Number(attributes.Poder) || 0) / 2
  );

  const recoverEnergy = () => {
    const diceCount = energyRecoveryDice;

    const rolls = Array.from(
      { length: diceCount },
      () => Math.floor(Math.random() * 6) + 1
    );

    const diceTotal = rolls.reduce(
      (total, value) => total + value,
      0
    );

    const recovery = diceTotal + energyRecoveryBonus;

    setEnergy((prev) => ({
      ...prev,
      current: Math.min(
        Number(prev.max) || 0,
        Math.max(0, Number(prev.current) || 0) + recovery
      ),
    }));

    triggerRoll({
      label: 'Recuperação de Energia',
      diceRoll: diceTotal,
      mod: energyRecoveryBonus,
      notation: `${diceCount}d6 + ${energyRecoveryBonus}`,
      rolls,
    });
  };

  /*
   * PERÍCIAS
   */
  const toggleSkillProf = (skillName) => {
    setProficientSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((skill) => skill !== skillName)
        : [...prev, skillName]
    );
  };

  const rollSkill = (skill) => {
    const manual = skillManualValues[skill.name];

    if (
      manual !== undefined &&
      manual !== '' &&
      !Number.isNaN(Number(manual))
    ) {
      rollD20(
        Number(manual),
        `Perícia: ${skill.name}`
      );
      return;
    }

    const attributeMod = getMod(attributes[skill.attr] || 10);

    const proficiency = proficientSkills.includes(skill.name)
      ? Number(profBonus)
      : 0;

    rollD20(
      attributeMod + proficiency,
      `Perícia: ${skill.name}`
    );
  };

  /*
   * ARMAS
   */
  const saveWeapon = () => {
    if (!newWeapon.name.trim()) return;

    if (editingWeaponId !== null) {
      setWeapons((prev) =>
        prev.map((weapon) =>
          weapon.id === editingWeaponId
            ? { ...weapon, ...newWeapon }
            : weapon
        )
      );
    } else {
      setWeapons((prev) => [
        ...prev,
        {
          ...newWeapon,
          id: Date.now(),
        },
      ]);
    }

    closeWeaponModal();
  };

  const editWeapon = (weapon) => {
    setNewWeapon({
      name: weapon.name || '',
      dmg: weapon.dmg || '1d8',
      attr: weapon.attr || 'Força',
      prop: weapon.prop || '',
    });

    setEditingWeaponId(weapon.id);
    setIsWeaponModalOpen(true);
  };

  const rollWeaponAttack = (weapon) => {
    const mod = getMod(attributes[weapon.attr] || 10);
    rollD20(
      mod + Number(profBonus),
      `Ataque: ${weapon.name}`
    );
  };

  const rollWeaponDamage = (weapon) => {
    rollDamage(
      weapon.dmg || '1d8',
      weapon.name
    );
  };

  const closeWeaponModal = () => {
    setIsWeaponModalOpen(false);
    setEditingWeaponId(null);
    setNewWeapon({
      name: '',
      dmg: '1d8',
      attr: 'Força',
      prop: '',
    });
  };

  /*
   * HABILIDADES
   */
  const saveAbility = () => {
    if (!newAbility.name.trim()) return;

    if (editingAbilityId !== null) {
      setAbilities((prev) =>
        prev.map((ability) =>
          ability.id === editingAbilityId
            ? { ...ability, ...newAbility }
            : ability
        )
      );
    } else {
      setAbilities((prev) => [
        ...prev,
        {
          ...newAbility,
          id: Date.now(),
        },
      ]);
    }

    closeAbilityModal();
  };

  const editAbility = (ability) => {
    setNewAbility({
      name: ability.name || '',
      attr: ability.attr || 'Força',
      damage: ability.damage || '',
      area: ability.area || '3m',
      dur: ability.dur || 'Instantânea',
      desc: ability.desc || '',
    });

    setEditingAbilityId(ability.id);
    setIsAbilityModalOpen(true);
  };

  /*
   * Abre o modal TODA VEZ que a habilidade é usada.
   *
   * Portanto o jogador pode mudar:
   * - dados
   * - bônus
   * - energia
   *
   * em cada utilização.
   */
  const castAbility = (ability) => {
    setAbilityRollModal(ability);
    setAbilityRollTier('Simples');

    const savedDamage = String(
      ability.damage || '1d6'
    ).trim();

    const match = savedDamage.match(
      /^(\d+\s*d\s*\d+)(?:\s*([+-])\s*(\d+))?$/i
    );

    if (match) {
      setAbilityRollDamage(
        match[1].replace(/\s+/g, '')
      );

      let bonus = Number(match[3]) || 0;

      if (match[2] === '-') {
        bonus *= -1;
      }

      setAbilityRollBonus(bonus);
    } else {
      setAbilityRollDamage('1d6');
      setAbilityRollBonus(0);
    }

    setAbilityRollCost(2);
  };

  /*
   * Ataque da habilidade:
   *
   * 1d20 + modificador do atributo + proficiência
   */
  const rollAbilityAttack = (ability) => {
    const attr = ability.attr || 'Força';

    const attributeMod = getMod(
      attributes[attr] || 10
    );

    const modifier =
      attributeMod + Number(profBonus);

    rollD20(
      modifier,
      `Acerto da habilidade: ${ability.name}`
    );
  };

  /*
   * Confirma o uso da habilidade.
   */
  const confirmAbilityUse = () => {
    if (!abilityRollModal) return;

    const ability = abilityRollModal;

    const cost = Math.max(
      0,
      Number(abilityRollCost) || 0
    );

    if (energy.current < cost) {
      alert(
        `Energia insuficiente. Você precisa de ${cost} de Energia.`
      );
      return;
    }

    /*
     * HABILIDADE COM DANO
     *
     * O modificador do atributo NÃO é adicionado
     * automaticamente ao dano.
     *
     * O jogador informa:
     *
     * 4d8
     * +5
     *
     * e o resultado será 4d8 + 5.
     */
    if (ability.damage) {
      const match = String(
        abilityRollDamage
      )
        .trim()
        .match(/^(\d+)\s*d\s*(\d+)$/i);

      if (!match) {
        alert(
          'Informe os dados no formato NdN. Exemplo: 4d8.'
        );
        return;
      }

      const count = Math.max(
        1,
        Math.min(100, Number(match[1]))
      );

      const sides = Math.max(
        2,
        Math.min(1000, Number(match[2]))
      );

      const bonus =
        Number(abilityRollBonus) || 0;

      const rolls = Array.from(
        { length: count },
        () =>
          Math.floor(Math.random() * sides) + 1
      );

      const diceTotal = rolls.reduce(
        (sum, value) => sum + value,
        0
      );

      setEnergy((prev) => ({
        ...prev,
        current: Math.max(
          0,
          prev.current - cost
        ),
      }));

      triggerRoll({
        label: `Dano da habilidade: ${ability.name} — ${abilityRollTier}`,
        diceRoll: diceTotal,
        mod: bonus,
        isDamage: true,
        notation: `${count}d${sides}${
          bonus >= 0
            ? ` + ${bonus}`
            : ` - ${Math.abs(bonus)}`
        }`,
        rolls,
      });

      setAbilityRollModal(null);
      return;
    }

    /*
     * Habilidade sem dano:
     * apenas gasta a Energia e realiza o teste.
     */
    const attr = ability.attr || 'Força';

    const attributeMod = getMod(
      attributes[attr] || 10
    );

    const modifier =
      attributeMod + Number(profBonus);

    setEnergy((prev) => ({
      ...prev,
      current: Math.max(
        0,
        prev.current - cost
      ),
    }));

    rollD20(
      modifier,
      `Habilidade: ${ability.name} — ${abilityRollTier}`
    );

    setAbilityRollModal(null);
  };

  const closeAbilityModal = () => {
    setIsAbilityModalOpen(false);
    setEditingAbilityId(null);

    setNewAbility({
      name: '',
      attr: 'Força',
      damage: '1d6',
      area: '3m',
      dur: 'Instantânea',
      desc: '',
    });
  };

  /*
   * PASSIVAS
   */
  const savePassive = () => {
    if (!newPassive.name.trim()) return;

    if (editingPassiveId !== null) {
      setPassives((prev) =>
        prev.map((passive) =>
          passive.id === editingPassiveId
            ? {
                ...passive,
                ...newPassive,
              }
            : passive
        )
      );
    } else {
      setPassives((prev) => [
        ...prev,
        {
          ...newPassive,
          id: Date.now(),
        },
      ]);
    }

    closePassiveModal();
  };

  const editPassive = (passive) => {
    setNewPassive({
      name: passive.name || '',
      type: passive.type || 'Passiva',
      active: !!passive.active,
      effect: passive.effect || '',
      area: passive.area || 'Pessoal',
      dur: passive.dur || 'Permanente',
      desc: passive.desc || '',
    });

    setEditingPassiveId(passive.id);
    setIsPassiveModalOpen(true);
  };

  const closePassiveModal = () => {
    setIsPassiveModalOpen(false);
    setEditingPassiveId(null);

    setNewPassive({
      name: '',
      type: 'Passiva',
      active: false,
      effect: '',
      area: 'Pessoal',
      dur: 'Permanente',
      desc: '',
    });
  };

  /*
   * INVENTÁRIO
   */
  const saveItem = () => {
    if (!newItem.name.trim()) return;

    const item = {
      ...newItem,
      qty: Number(newItem.qty) || 0,
    };

    if (editingItemId !== null) {
      setInventory((prev) =>
        prev.map((oldItem) =>
          oldItem.id === editingItemId
            ? {
                ...oldItem,
                ...item,
              }
            : oldItem
        )
      );
    } else {
      setInventory((prev) => [
        ...prev,
        {
          ...item,
          id: Date.now(),
        },
      ]);
    }

    closeItemModal();
  };

  const editItem = (item) => {
    setNewItem({
      name: item.name || '',
      qty: item.qty || 1,
      weight: item.weight || '',
      desc: item.desc || '',
    });

    setEditingItemId(item.id);
    setIsItemModalOpen(true);
  };

  const closeItemModal = () => {
    setIsItemModalOpen(false);
    setEditingItemId(null);

    setNewItem({
      name: '',
      qty: 1,
      weight: '0.5 kg',
      desc: '',
    });
  };

  /*
   * IMAGEM
   */
  const handleCharacterImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Escolha um arquivo de imagem.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement(
          'canvas'
        );

        const maxSize = 700;

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxSize) {
            height =
              (height / width) * maxSize;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width =
              (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        ctx.drawImage(
          image,
          0,
          0,
          width,
          height
        );

        setCharacterImage(
          canvas.toDataURL(
            'image/jpeg',
            0.75
          )
        );
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  };

  /*
   * RESET
   */
  const resetSheet = () => {
    if (
      !window.confirm(
        'Tem certeza que deseja apagar toda a ficha?'
      )
    ) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  /*
   * NAVEGAÇÃO
   *
   * Combate + Habilidades agora são UMA aba.
   */
  const tabs = [
    {
      id: 'geral',
      label: 'Geral & Atributos',
      icon: User,
    },
    {
      id: 'combate',
      label: 'Combate & Habilidades',
      icon: Swords,
    },
    {
      id: 'inventario',
      label: 'Inventário & Itens',
      icon: Backpack,
    },
    {
      id: 'anotacoes',
      label: 'História & Notas',
      icon: Scroll,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* CABEÇALHO */}
        <header className="bg-slate-900 border border-amber-500/30 p-6 rounded-xl shadow-lg space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div className="space-y-2">
              <input
                value={charInfo.name}
                onChange={(e) =>
                  setCharInfo({
                    ...charInfo,
                    name: e.target.value,
                  })
                }
                className="text-2xl font-bold text-amber-400 bg-transparent border-b border-slate-700 outline-none w-full"
                placeholder="Nome do Personagem"
              />

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Nível:</span>

                <input
                  type="number"
                  min="1"
                  value={charInfo.level}
                  onChange={(e) =>
                    setCharInfo({
                      ...charInfo,
                      level: Math.max(
                        1,
                        Number(e.target.value) || 1
                      ),
                    })
                  }
                  className="w-14 bg-slate-950 border border-slate-700 rounded text-center text-amber-400 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">

              <div>
                <label className="text-slate-400 block mb-1">
                  Mutação
                </label>

                <select
                  value={charInfo.mutation}
                  onChange={(e) =>
                    setCharInfo({
                      ...charInfo,
                      mutation: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
                >
                  <option value="">
                    Selecione
                  </option>
                  <option value="U">
                    Tipo U (Único)
                  </option>
                  <option value="N">
                    Tipo N (Natural)
                  </option>
                  <option value="T">
                    Tipo T (Terreno)
                  </option>
                  <option value="E">
                    Tipo E (Elemental)
                  </option>
                  <option value="M">
                    Tipo M (Mental)
                  </option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  Classe de Poder
                </label>

                <input
                  value={charInfo.baseClass}
                  onChange={(e) =>
                    setCharInfo({
                      ...charInfo,
                      baseClass: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
                />
              </div>

            </div>

            <div className="space-y-2">

              <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-xs text-slate-400">
                  Proficiência
                </span>

                <input
                  type="number"
                  value={profBonus}
                  onChange={(e) =>
                    setProfBonus(
                      Number(e.target.value) || 0
                    )
                  }
                  className="w-14 bg-slate-900 border border-amber-500/40 rounded text-center text-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Classe Avançada
                </label>

                <input
                  value={charInfo.advClass}
                  onChange={(e) =>
                    setCharInfo({
                      ...charInfo,
                      advClass: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
                />
              </div>

            </div>

          </div>

          {/* BARRAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-4">

            {/* HP */}
            <div className="bg-slate-950 border border-rose-900/50 rounded-lg p-4 space-y-2">

              <div className="flex justify-between items-center text-rose-400 font-bold">
                <span className="flex gap-1 items-center">
                  <Heart className="w-4 h-4" />
                  HP
                </span>

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={hp.current}
                    onChange={(e) =>
                      setHp({
                        ...hp,
                        current: Number(e.target.value),
                      })
                    }
                    className="w-14 bg-slate-900 rounded text-right"
                  />

                  <span>/</span>

                  <input
                    type="number"
                    value={hp.max}
                    onChange={(e) =>
                      setHp({
                        ...hp,
                        max: Number(e.target.value),
                      })
                    }
                    className="w-14 bg-slate-900 rounded"
                  />
                </div>
              </div>

              <div className="h-2 bg-slate-800 rounded overflow-hidden">
                <div
                  className="h-full bg-rose-600"
                  style={{
                    width: `${
                      hp.max > 0
                        ? Math.min(
                            100,
                            Math.max(
                              0,
                              (hp.current / hp.max) * 100
                            )
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() =>
                    setHp((prev) => ({
                      ...prev,
                      current:
                        prev.current - 10,
                    }))
                  }
                  className="bg-rose-950 p-1 rounded text-xs"
                >
                  -10
                </button>

                <button
                  onClick={() =>
                    setHp((prev) => ({
                      ...prev,
                      current:
                        prev.current - 1,
                    }))
                  }
                  className="bg-rose-950 p-1 rounded text-xs"
                >
                  -1
                </button>

                <button
                  onClick={() =>
                    setHp((prev) => ({
                      ...prev,
                      current: Math.min(
                        prev.max,
                        prev.current + 1
                      ),
                    }))
                  }
                  className="bg-emerald-950 p-1 rounded text-xs"
                >
                  +1
                </button>

                <button
                  onClick={() =>
                    setHp((prev) => ({
                      ...prev,
                      current: Math.min(
                        prev.max,
                        prev.current + 10
                      ),
                    }))
                  }
                  className="bg-emerald-950 p-1 rounded text-xs"
                >
                  +10
                </button>
              </div>

            </div>

            {/* ENERGIA */}
            <div className="bg-slate-950 border border-cyan-900/50 rounded-lg p-4 space-y-2">

              <div className="flex justify-between items-center text-cyan-400 font-bold">
                <span className="flex gap-1 items-center">
                  <Zap className="w-4 h-4" />
                  Energia
                </span>

                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={energy.current}
                    onChange={(e) =>
                      setEnergy({
                        ...energy,
                        current: Number(
                          e.target.value
                        ),
                      })
                    }
                    className="w-14 bg-slate-900 rounded text-right"
                  />

                  <span>/</span>

                  <input
                    type="number"
                    value={energy.max}
                    onChange={(e) =>
                      setEnergy({
                        ...energy,
                        max: Number(
                          e.target.value
                        ),
                      })
                    }
                    className="w-14 bg-slate-900 rounded"
                  />
                </div>
              </div>

              <div className="h-2 bg-slate-800 rounded overflow-hidden">
                <div
                  className="h-full bg-cyan-500"
                  style={{
                    width: `${
                      energy.max > 0
                        ? Math.min(
                            100,
                            Math.max(
                              0,
                              (energy.current /
                                energy.max) *
                                100
                            )
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() =>
                    setEnergy((prev) => ({
                      ...prev,
                      current: Math.max(
                        0,
                        prev.current - 10
                      ),
                    }))
                  }
                  className="bg-cyan-950 p-1 rounded text-xs"
                >
                  -10
                </button>

                <button
                  onClick={() =>
                    setEnergy((prev) => ({
                      ...prev,
                      current: Math.max(
                        0,
                        prev.current - 1
                      ),
                    }))
                  }
                  className="bg-cyan-950 p-1 rounded text-xs"
                >
                  -1
                </button>

                <button
                  onClick={() =>
                    setEnergy((prev) => ({
                      ...prev,
                      current: Math.min(
                        prev.max,
                        prev.current + 1
                      ),
                    }))
                  }
                  className="bg-emerald-950 p-1 rounded text-xs"
                >
                  +1
                </button>

                <button
                  onClick={() =>
                    setEnergy((prev) => ({
                      ...prev,
                      current: Math.min(
                        prev.max,
                        prev.current + 10
                      ),
                    }))
                  }
                  className="bg-emerald-950 p-1 rounded text-xs"
                >
                  +10
                </button>
              </div>

            </div>

            {/* CA */}
            <div className="bg-slate-950 border border-amber-900/50 rounded-lg p-4 flex justify-between items-center">

              <div className="flex items-center gap-2 text-amber-400">
                <Shield className="w-7 h-7" />

                <div>
                  <p className="text-xs text-slate-400">
                    Classe de Armadura
                  </p>

                  <p className="text-3xl font-black">
                    {armorClass}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <button
                  onClick={() =>
                    setArmorClass((v) => v + 1)
                  }
                  className="bg-slate-900 p-1 rounded"
                >
                  <Plus className="w-3 h-3" />
                </button>

                <button
                  onClick={() =>
                    setArmorClass((v) =>
                      Math.max(0, v - 1)
                    )
                  }
                  className="bg-slate-900 p-1 rounded"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>

            </div>

          </div>

          {/* RESISTÊNCIAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-slate-800 pt-4">

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <p className="text-xs text-slate-400 mb-2">
                Resistência Física
              </p>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={resistancePhysical.current}
                  onChange={(e) =>
                    setResistancePhysical({
                      ...resistancePhysical,
                      current:
                        Number(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-900 rounded p-1"
                />

                <input
                  type="number"
                  value={resistancePhysical.max}
                  onChange={(e) =>
                    setResistancePhysical({
                      ...resistancePhysical,
                      max:
                        Number(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-900 rounded p-1"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <p className="text-xs text-slate-400 mb-2">
                Resistência Espiritual
              </p>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={resistanceSpiritual.current}
                  onChange={(e) =>
                    setResistanceSpiritual({
                      ...resistanceSpiritual,
                      current:
                        Number(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-900 rounded p-1"
                />

                <input
                  type="number"
                  value={resistanceSpiritual.max}
                  onChange={(e) =>
                    setResistanceSpiritual({
                      ...resistanceSpiritual,
                      max:
                        Number(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-900 rounded p-1"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800">
              <p className="text-xs text-slate-400 mb-2">
                Bônus de Resistência
              </p>

              <input
                type="number"
                value={resistanceBonus}
                onChange={(e) =>
                  setResistanceBonus(
                    Number(e.target.value) || 0
                  )
                }
                className="w-full bg-slate-900 rounded p-1"
              />
            </div>

          </div>

        </header>

        {/* ABAS */}
        <nav className="flex gap-2 overflow-x-auto border-b border-slate-800 pb-1">

          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(tab.id)
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}

        </nav>

        {/* =======================================================
            GERAL
        ======================================================= */}
        {activeTab === 'geral' && (
          <div className="space-y-6">

            {/* ATRIBUTOS */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <h2 className="text-xl font-bold text-amber-400 mb-4">
                Atributos Base
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                {Object.entries(attributes).map(
                  ([attr, value]) => {
                    const isPower =
                      attr === 'Poder';

                    const modifier =
                      isPower
                        ? value
                        : getMod(value);

                    return (
                      <div
                        key={attr}
                        className={`p-4 rounded-lg border text-center ${
                          isPower
                            ? 'bg-cyan-950/40 border-cyan-500/50'
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >

                        <p className="text-xs uppercase text-slate-400 font-bold">
                          {attr}
                        </p>

                        <p className="text-2xl font-black text-amber-400">
                          {isPower
                            ? value
                            : modifier >= 0
                            ? `+${modifier}`
                            : modifier}
                        </p>

                        <input
                          type="number"
                          value={value}
                          disabled={isPower}
                          onChange={(e) =>
                            setAttributes({
                              ...attributes,
                              [attr]: Math.max(
                                0,
                                Number(
                                  e.target.value
                                ) || 0
                              ),
                            })
                          }
                          className="w-16 bg-slate-900 rounded text-center text-sm"
                        />

                        {isPower && (
                          <p className="text-[10px] text-cyan-400 mt-2">
                            Calculado pelo nível
                          </p>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

            </section>

            {/* PERÍCIAS */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-amber-400">
                  Perícias
                </h2>

                <span className="text-xs text-slate-500">
                  Clique no dado para rolar
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

                {initialSkills.map((skill) => {
                  const modifier =
                    getMod(attributes[skill.attr] || 10);

                  const proficient =
                    proficientSkills.includes(
                      skill.name
                    );

                  const manual =
                    skillManualValues[
                      skill.name
                    ];

                  return (
                    <div
                      key={skill.name}
                      className="bg-slate-950 border border-slate-800 rounded p-3 flex items-center justify-between"
                    >

                      <div>
                        <p className="font-semibold text-sm">
                          {skill.name}
                        </p>

                        <p className="text-[10px] text-slate-500">
                          {skill.attr}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">

                        <input
                          type="number"
                          placeholder={
                            modifier >= 0
                              ? `+${modifier}`
                              : String(modifier)
                          }
                          value={
                            manual ?? ''
                          }
                          onChange={(e) =>
                            setSkillManualValues(
                              (prev) => ({
                                ...prev,
                                [skill.name]:
                                  e.target.value,
                              })
                            )
                          }
                          className="w-14 bg-slate-900 rounded text-center text-xs"
                        />

                        <button
                          onClick={() =>
                            toggleSkillProf(
                              skill.name
                            )
                          }
                          className={`text-[10px] px-2 py-1 rounded ${
                            proficient
                              ? 'bg-emerald-900 text-emerald-300'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {proficient
                            ? 'Prof.'
                            : '—'}
                        </button>

                        <button
                          onClick={() =>
                            rollSkill(skill)
                          }
                          className="bg-amber-500 text-slate-950 p-2 rounded"
                        >
                          <Dices className="w-4 h-4" />
                        </button>

                      </div>

                    </div>
                  );
                })}

              </div>

            </section>

            {/* SALVAMENTOS */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <h2 className="text-xl font-bold text-amber-400 mb-4">
                Testes de Morte
              </h2>

              <div className="flex flex-wrap items-center gap-3">

                <span className="text-sm text-slate-400">
                  Sucessos:
                </span>

                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={`s${n}`}
                    onClick={() =>
                      setDeathSaves({
                        ...deathSaves,
                        successes: n,
                      })
                    }
                    className={`px-3 py-2 rounded ${
                      deathSaves.successes === n
                        ? 'bg-emerald-600'
                        : 'bg-slate-800'
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <span className="text-sm text-slate-400 ml-4">
                  Falhas:
                </span>

                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={`f${n}`}
                    onClick={() =>
                      setDeathSaves({
                        ...deathSaves,
                        failures: n,
                      })
                    }
                    className={`px-3 py-2 rounded ${
                      deathSaves.failures === n
                        ? 'bg-rose-600'
                        : 'bg-slate-800'
                    }`}
                  >
                    {n}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setDeathSaves({
                      successes: 0,
                      failures: 0,
                    })
                  }
                  className="ml-3 bg-slate-800 px-3 py-2 rounded text-xs"
                >
                  Resetar
                </button>

              </div>

            </section>

            {/* FOTO */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <h2 className="text-xl font-bold text-amber-400 mb-4">
                Imagem do Personagem
              </h2>

              <div className="flex flex-wrap gap-4 items-center">

                {characterImage ? (
                  <img
                    src={characterImage}
                    alt="Personagem"
                    className="w-32 h-32 object-cover rounded-lg border border-amber-500/40"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-500">
                    Sem imagem
                  </div>
                )}

                <div className="space-y-2">

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCharacterImage}
                    className="text-xs"
                  />

                  {characterImage && (
                    <button
                      onClick={() =>
                        setCharacterImage('')
                      }
                      className="block text-xs text-rose-400"
                    >
                      Remover imagem
                    </button>
                  )}

                </div>

              </div>

            </section>

          </div>
        )}

        {/* =======================================================
            COMBATE + HABILIDADES
        ======================================================= */}
        {activeTab === 'combate' && (
          <div className="space-y-6">

            {/* ARMAS */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                  <Swords className="w-5 h-5" />
                  Armas
                </h2>

                <button
                  onClick={() => {
                    setEditingWeaponId(null);
                    setIsWeaponModalOpen(true);
                  }}
                  className="bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Arma
                </button>

              </div>

              {weapons.length === 0 ? (
                <div className="text-center text-sm text-slate-500 border border-dashed border-slate-700 rounded-lg p-6">
                  Nenhuma arma cadastrada.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {weapons.map((weapon) => (
                    <div
                      key={weapon.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3"
                    >

                      <div className="flex justify-between">

                        <div>
                          <h3 className="font-bold text-amber-300">
                            {weapon.name}
                          </h3>

                          <p className="text-xs text-slate-500">
                            {weapon.attr} · {weapon.dmg}
                          </p>

                          {weapon.prop && (
                            <p className="text-xs text-slate-500">
                              {weapon.prop}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1">

                          <button
                            onClick={() =>
                              editWeapon(weapon)
                            }
                            className="text-slate-500 hover:text-amber-400"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setWeapons(
                                weapons.filter(
                                  (w) =>
                                    w.id !==
                                    weapon.id
                                )
                              )
                            }
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                      <div className="grid grid-cols-2 gap-2">

                        <button
                          onClick={() =>
                            rollWeaponAttack(
                              weapon
                            )
                          }
                          className="bg-amber-500 text-slate-950 font-bold py-2 rounded text-xs"
                        >
                          Rolar Ataque
                        </button>

                        <button
                          onClick={() =>
                            rollWeaponDamage(
                              weapon
                            )
                          }
                          className="bg-rose-900 text-rose-200 font-bold py-2 rounded text-xs"
                        >
                          Rolar Dano
                        </button>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </section>

            {/* RECUPERAÇÃO DE ENERGIA */}
            <section className="bg-slate-900 border border-cyan-800/50 rounded-xl p-6">

              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <div>

                  <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Recuperação de Energia
                  </h2>

                  <p className="text-sm text-slate-400 mt-1">
                    Ao terminar o turno, use o botão para
                    recuperar Energia.
                  </p>

                  <p className="text-xs text-slate-500 mt-2">
                    Fórmula:
                    {' '}
                    <strong className="text-cyan-300">
                      {energyRecoveryDice}d6 + {energyRecoveryBonus}
                    </strong>
                  </p>

                  <p className="text-xs text-slate-500">
                    {energy.max} Energia máxima →{' '}
                    {energyRecoveryDice}d6
                    {' · '}
                    Poder {attributes.Poder} → +
                    {energyRecoveryBonus}
                  </p>

                </div>

                <button
                  onClick={recoverEnergy}
                  disabled={
                    energy.current >= energy.max
                  }
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold px-5 py-3 rounded-lg"
                >
                  Recuperar Energia
                </button>

              </div>

            </section>

            {/* HABILIDADES */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Habilidades
                </h2>

                <button
                  onClick={() => {
                    setEditingAbilityId(null);
                    setIsAbilityModalOpen(true);
                  }}
                  className="bg-cyan-500 text-slate-950 font-bold px-3 py-2 rounded text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Habilidade
                </button>

              </div>

              {abilities.length === 0 ? (
                <div className="text-center text-sm text-slate-500 border border-dashed border-slate-700 rounded-lg p-6">
                  Nenhuma habilidade cadastrada.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {abilities.map((ability) => (
                    <div
                      key={ability.id}
                      className="bg-slate-950 border border-cyan-900/50 rounded-lg p-4 space-y-3"
                    >

                      <div className="flex justify-between gap-2">

                        <div>
                          <h3 className="font-bold text-cyan-300">
                            {ability.name}
                          </h3>

                          <p className="text-xs text-slate-500">
                            Atributo: {ability.attr}
                          </p>

                          <p className="text-xs text-slate-500">
                            Dano cadastrado:{' '}
                            {ability.damage || 'Sem dano'}
                          </p>

                          <p className="text-xs text-slate-500">
                            Área: {ability.area}
                            {' · '}
                            Duração: {ability.dur}
                          </p>
                        </div>

                        <div className="flex gap-1">

                          <button
                            onClick={() =>
                              editAbility(
                                ability
                              )
                            }
                            className="text-slate-500 hover:text-cyan-300"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setAbilities(
                                abilities.filter(
                                  (a) =>
                                    a.id !==
                                    ability.id
                                )
                              )
                            }
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                      {ability.desc && (
                        <p className="text-xs text-slate-400">
                          {ability.desc}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2">

                        <button
                          onClick={() =>
                            rollAbilityAttack(
                              ability
                            )
                          }
                          className="bg-amber-500 text-slate-950 font-bold py-2 rounded text-xs"
                        >
                          Rolar Acerto
                        </button>

                        <button
                          onClick={() =>
                            castAbility(
                              ability
                            )
                          }
                          className="bg-cyan-600 text-slate-950 font-bold py-2 rounded text-xs"
                        >
                          Usar Habilidade
                        </button>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </section>

            {/* PASSIVAS */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-bold text-cyan-300">
                  Passivas e Habilidades sem Dano
                </h2>

                <button
                  onClick={() => {
                    setEditingPassiveId(null);
                    setIsPassiveModalOpen(true);
                  }}
                  className="bg-cyan-600 text-slate-950 font-bold px-3 py-2 rounded text-sm"
                >
                  <Plus className="w-4 h-4 inline" />
                  {' '}
                  Adicionar
                </button>

              </div>

              {passives.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nenhuma passiva cadastrada.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {passives.map((passive) => (
                    <div
                      key={passive.id}
                      className={`p-4 rounded-lg border ${
                        passive.active
                          ? 'bg-emerald-950/50 border-emerald-500'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >

                      <div className="flex justify-between">

                        <div>
                          <h3 className="font-bold text-cyan-300">
                            {passive.name}
                          </h3>

                          <p className="text-[10px] uppercase text-slate-500">
                            {passive.type}
                          </p>
                        </div>

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              editPassive(
                                passive
                              )
                            }
                            className="text-slate-500 hover:text-cyan-300"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setPassives(
                                passives.filter(
                                  (p) =>
                                    p.id !==
                                    passive.id
                                )
                              )
                            }
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                      {passive.desc && (
                        <p className="text-xs text-slate-400 mt-2">
                          {passive.desc}
                        </p>
                      )}

                      {passive.effect && (
                        <p className="text-xs text-slate-300 mt-2">
                          <strong>Efeito:</strong>{' '}
                          {passive.effect}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">

                        <span className="text-[10px] text-slate-500">
                          {passive.area}
                          {' · '}
                          {passive.dur}
                        </span>

                        <label className="text-xs flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={
                              !!passive.active
                            }
                            onChange={() =>
                              setPassives(
                                (prev) =>
                                  prev.map(
                                    (item) =>
                                      item.id ===
                                      passive.id
                                        ? {
                                            ...item,
                                            active:
                                              !item.active,
                                          }
                                        : item
                                  )
                              )
                            }
                          />

                          {passive.active
                            ? 'Ativa'
                            : 'Inativa'}
                        </label>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </section>

          </div>
        )}

        {/* =======================================================
            INVENTÁRIO
        ======================================================= */}
        {activeTab === 'inventario' && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Backpack className="w-5 h-5" />
                Inventário
              </h2>

              <div className="flex gap-3 items-center">

                <div className="bg-slate-950 border border-amber-500/30 px-3 py-2 rounded">
                  <span className="text-amber-400 text-sm">
                    💰 PO:
                  </span>

                  <input
                    type="number"
                    value={gold}
                    onChange={(e) =>
                      setGold(
                        Number(e.target.value) || 0
                      )
                    }
                    className="w-16 ml-2 bg-transparent text-amber-300 text-center"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingItemId(null);
                    setIsItemModalOpen(true);
                  }}
                  className="bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded text-sm"
                >
                  <PackagePlus className="w-4 h-4 inline" />
                  {' '}
                  Adicionar
                </button>

              </div>

            </div>

            {inventory.length === 0 ? (
              <div className="text-center text-sm text-slate-500 border border-dashed border-slate-700 rounded-lg p-8">
                Inventário vazio.
              </div>
            ) : (
              <div className="space-y-2">

                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 rounded p-3 flex justify-between items-center"
                  >

                    <div>
                      <p className="font-semibold">
                        {item.name}{' '}
                        <span className="text-slate-500">
                          x{item.qty}
                        </span>
                      </p>

                      {item.desc && (
                        <p className="text-xs text-slate-500">
                          {item.desc}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">

                      <span className="text-xs text-slate-500">
                        {item.weight}
                      </span>

                      <button
                        onClick={() =>
                          editItem(item)
                        }
                        className="text-slate-500 hover:text-amber-400"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          setInventory(
                            inventory.filter(
                              (i) =>
                                i.id !== item.id
                            )
                          )
                        }
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        )}

        {/* =======================================================
            HISTÓRIA / NOTAS
        ======================================================= */}
        {activeTab === 'anotacoes' && (
          <div className="space-y-6">

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2 mb-4">
                <Scroll className="w-5 h-5" />
                História do Personagem
              </h2>

              <textarea
                value={history}
                onChange={(e) =>
                  setHistory(e.target.value)
                }
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 outline-none"
                placeholder="Escreva a história do personagem..."
              />

            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">

              <h2 className="text-xl font-bold text-amber-400 mb-4">
                Anotações da Campanha
              </h2>

              <textarea
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 outline-none"
                placeholder="Notas, NPCs, missões, informações da campanha..."
              />

            </section>

            <button
              onClick={resetSheet}
              className="bg-rose-950 border border-rose-800 text-rose-300 px-4 py-2 rounded text-sm"
            >
              Resetar ficha inteira
            </button>

          </div>
        )}

      </div>

      {/* =========================================================
          POPUP DE RESULTADO
      ========================================================= */}
      {activeRollResult && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">

            <div className="flex justify-between">

              <p className="text-xs uppercase tracking-widest text-slate-400">
                Resultado
              </p>

              <button
                onClick={() =>
                  setActiveRollResult(null)
                }
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <p className="text-sm text-slate-300">
              {activeRollResult.label}
            </p>

            <p
              className={`text-6xl font-black ${
                activeRollResult.isCrit
                  ? 'text-emerald-400'
                  : activeRollResult.isFail
                  ? 'text-rose-500'
                  : 'text-amber-400'
              }`}
            >
              {activeRollResult.total}
            </p>

            {activeRollResult.rolls && (
              <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-400">
                Dados:{' '}
                <strong className="text-slate-200">
                  {activeRollResult.rolls.join(
                    ' + '
                  )}
                </strong>
              </div>
            )}

            <div className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-slate-400">

              {activeRollResult.isDamage ? (
                <>
                  Dano:{' '}
                  <strong className="text-slate-200">
                    {activeRollResult.notation}
                  </strong>
                </>
              ) : (
                <>
                  Dado:{' '}
                  <strong className="text-slate-200">
                    {activeRollResult.diceRoll}
                  </strong>

                  {' + '}

                  <strong className="text-slate-200">
                    {activeRollResult.mod}
                  </strong>
                </>
              )}

            </div>

            {activeRollResult.isCrit && (
              <p className="text-emerald-400 font-bold">
                🎉 Acerto Crítico!
              </p>
            )}

            {activeRollResult.isFail && (
              <p className="text-rose-400 font-bold">
                ⚠️ Falha Crítica!
              </p>
            )}

            <button
              onClick={() =>
                setActiveRollResult(null)
              }
              className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded"
            >
              Confirmar
            </button>

          </div>

        </div>
      )}

      {/* =========================================================
          HISTÓRICO
      ========================================================= */}
      <div className="fixed bottom-4 right-4 z-40">

        {isHistoryOpen && (
          <div className="absolute bottom-14 right-0 bg-slate-900 border border-slate-800 rounded-xl p-4 w-80 max-h-80 overflow-y-auto">

            <div className="flex justify-between border-b border-slate-800 pb-2 mb-2">

              <h3 className="text-xs font-bold text-amber-400">
                Histórico
              </h3>

              <button
                onClick={() =>
                  setRollHistory([])
                }
                className="text-xs text-rose-400"
              >
                Limpar
              </button>

            </div>

            {rollHistory.length === 0 ? (
              <p className="text-xs text-slate-500">
                Nenhuma rolagem.
              </p>
            ) : (
              rollHistory.map((roll) => (
                <div
                  key={roll.id}
                  className="bg-slate-950 border border-slate-800 rounded p-2 mb-2 flex justify-between"
                >

                  <div>
                    <p className="text-xs font-semibold">
                      {roll.label}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {roll.time}
                    </p>
                  </div>

                  <span className="text-amber-400 font-bold">
                    {roll.total}
                  </span>

                </div>
              ))
            )}

          </div>
        )}

        <button
          onClick={() =>
            setIsHistoryOpen(
              !isHistoryOpen
            )
          }
          className="bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <History className="w-4 h-4" />
          Histórico ({rollHistory.length})
        </button>

      </div>

      {/* =========================================================
          MODAL DE ARMA
      ========================================================= */}
      {isWeaponModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">

            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-amber-400">
                {editingWeaponId !== null
                  ? 'Editar Arma'
                  : 'Cadastrar Arma'}
              </h3>

              <button
                onClick={closeWeaponModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              value={newWeapon.name}
              onChange={(e) =>
                setNewWeapon({
                  ...newWeapon,
                  name: e.target.value,
                })
              }
              placeholder="Nome da arma"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <input
              value={newWeapon.dmg}
              onChange={(e) =>
                setNewWeapon({
                  ...newWeapon,
                  dmg: e.target.value,
                })
              }
              placeholder="Dano: 1d8"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <select
              value={newWeapon.attr}
              onChange={(e) =>
                setNewWeapon({
                  ...newWeapon,
                  attr: e.target.value,
                })
              }
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            >
              {abilityAttributes.map(
                (attr) => (
                  <option
                    key={attr}
                    value={attr}
                  >
                    {attr}
                  </option>
                )
              )}
            </select>

            <input
              value={newWeapon.prop}
              onChange={(e) =>
                setNewWeapon({
                  ...newWeapon,
                  prop: e.target.value,
                })
              }
              placeholder="Propriedades"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <button
              onClick={saveWeapon}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded"
            >
              Salvar
            </button>

          </div>

        </div>
      )}

      {/* =========================================================
          MODAL DE USO DA HABILIDADE
      ========================================================= */}
      {abilityRollModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-xl p-6 max-w-md w-full space-y-5 shadow-2xl">

            <div className="flex justify-between">

              <div>
                <h3 className="text-xl font-bold text-cyan-300">
                  Usar Habilidade
                </h3>

                <p className="text-sm text-slate-400">
                  {abilityRollModal.name}
                </p>
              </div>

              <button
                onClick={() =>
                  setAbilityRollModal(null)
                }
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <div className="bg-cyan-950/30 border border-cyan-800/50 rounded-lg p-3 text-xs text-cyan-200">
              Os valores abaixo são definidos
              <strong> a cada utilização</strong>.
            </div>

            <div>

              <label className="text-xs text-slate-400 block mb-1">
                Categoria / Grandiosidade
              </label>

              <select
                value={abilityRollTier}
                onChange={(e) =>
                  setAbilityRollTier(
                    e.target.value
                  )
                }
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
              >
                <option>Simples</option>
                <option>Normal</option>
                <option>Grande</option>
                <option>Grandiosa</option>
                <option>Suprema</option>
                <option>Absoluta</option>
              </select>

            </div>

            {abilityRollModal.damage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                <div>

                  <label className="text-xs text-slate-400 block mb-1">
                    Dados de dano
                  </label>

                  <input
                    type="text"
                    value={
                      abilityRollDamage
                    }
                    onChange={(e) =>
                      setAbilityRollDamage(
                        e.target.value
                      )
                    }
                    placeholder="Ex.: 4d8"
                    className="w-full bg-slate-950 border border-cyan-800 p-2 rounded text-cyan-200 font-bold"
                  />

                  <p className="text-[10px] text-slate-500 mt-1">
                    Exemplo: 1d6, 2d8, 4d10.
                  </p>

                </div>

                <div>

                  <label className="text-xs text-slate-400 block mb-1">
                    Soma dos bônus
                  </label>

                  <input
                    type="number"
                    value={
                      abilityRollBonus
                    }
                    onChange={(e) =>
                      setAbilityRollBonus(
                        e.target.value
                      )
                    }
                    className="w-full bg-slate-950 border border-cyan-800 p-2 rounded text-cyan-200 font-bold"
                  />

                  <p className="text-[10px] text-slate-500 mt-1">
                    Coloque todos os bônus aplicáveis.
                  </p>

                </div>

              </div>
            )}

            <div>

              <label className="text-xs text-slate-400 block mb-1">
                Energia gasta nesta utilização
              </label>

              <input
                type="number"
                min="0"
                value={abilityRollCost}
                onChange={(e) =>
                  setAbilityRollCost(
                    e.target.value
                  )
                }
                className="w-full bg-slate-950 border border-cyan-800 p-2 rounded text-cyan-200 font-bold"
              />

              <p className="text-xs text-slate-500 mt-1">
                Energia atual: {energy.current} /{' '}
                {energy.max}
              </p>

            </div>

            {abilityRollModal.damage && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-400">

                Dano desta utilização:{' '}

                <strong className="text-cyan-300">
                  {abilityRollDamage}
                </strong>

                {' '}

                {Number(
                  abilityRollBonus
                ) >= 0
                  ? '+'
                  : '−'}

                {' '}

                <strong className="text-cyan-300">
                  {Math.abs(
                    Number(
                      abilityRollBonus
                    ) || 0
                  )}
                </strong>

                <p className="text-[10px] text-slate-600 mt-1">
                  O modificador do atributo NÃO é
                  adicionado automaticamente ao dano.
                </p>

              </div>
            )}

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-400">

              Atributo da habilidade:{' '}

              <strong className="text-amber-300">
                {abilityRollModal.attr ||
                  'Força'}
              </strong>

              <br />

              Modificador do atributo:{' '}

              <strong className="text-amber-300">
                {(() => {
                  const mod = getMod(
                    attributes[
                      abilityRollModal.attr ||
                        'Força'
                    ] || 10
                  );

                  return mod >= 0
                    ? `+${mod}`
                    : mod;
                })()}
              </strong>

              <br />

              Proficiência:{' '}

              <strong className="text-amber-300">
                +{profBonus}
              </strong>

            </div>

            <button
              onClick={
                confirmAbilityUse
              }
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-lg"
            >
              {abilityRollModal.damage
                ? 'Rolar Dano e Gastar Energia'
                : 'Usar Habilidade e Gastar Energia'}
            </button>

          </div>

        </div>
      )}

      {/* =========================================================
          MODAL DE HABILIDADE
      ========================================================= */}
      {isAbilityModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">

            <div className="flex justify-between">

              <h3 className="text-lg font-bold text-cyan-300">
                {editingAbilityId !== null
                  ? 'Editar Habilidade'
                  : 'Registrar Habilidade'}
              </h3>

              <button
                onClick={closeAbilityModal}
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <input
              value={newAbility.name}
              onChange={(e) =>
                setNewAbility({
                  ...newAbility,
                  name: e.target.value,
                })
              }
              placeholder="Nome da habilidade"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <select
              value={newAbility.attr}
              onChange={(e) =>
                setNewAbility({
                  ...newAbility,
                  attr: e.target.value,
                })
              }
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            >
              {abilityAttributes.map(
                (attr) => (
                  <option
                    key={attr}
                    value={attr}
                  >
                    Atributo: {attr}
                  </option>
                )
              )}
            </select>

            <input
              value={newAbility.damage}
              onChange={(e) =>
                setNewAbility({
                  ...newAbility,
                  damage: e.target.value,
                })
              }
              placeholder="Dano padrão: 1d6"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <div className="grid grid-cols-2 gap-2">

              <input
                value={newAbility.area}
                onChange={(e) =>
                  setNewAbility({
                    ...newAbility,
                    area: e.target.value,
                  })
                }
                placeholder="Área"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
              />

              <input
                value={newAbility.dur}
                onChange={(e) =>
                  setNewAbility({
                    ...newAbility,
                    dur: e.target.value,
                  })
                }
                placeholder="Duração"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
              />

            </div>

            <textarea
              value={newAbility.desc}
              onChange={(e) =>
                setNewAbility({
                  ...newAbility,
                  desc: e.target.value,
                })
              }
              rows={3}
              placeholder="Descrição"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <button
              onClick={saveAbility}
              className="w-full bg-cyan-500 text-slate-950 font-bold py-2 rounded"
            >
              Salvar
            </button>

          </div>

        </div>
      )}

      {/* =========================================================
          MODAL DE PASSIVA
      ========================================================= */}
      {isPassiveModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">

            <div className="flex justify-between">

              <h3 className="text-lg font-bold text-cyan-300">
                {editingPassiveId !== null
                  ? 'Editar Passiva'
                  : 'Registrar Passiva'}
              </h3>

              <button
                onClick={closePassiveModal}
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <input
              value={newPassive.name}
              onChange={(e) =>
                setNewPassive({
                  ...newPassive,
                  name: e.target.value,
                })
              }
              placeholder="Nome"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <label className="flex items-center gap-2 text-sm text-emerald-300">
              <input
                type="checkbox"
                checked={
                  newPassive.active
                }
                onChange={(e) =>
                  setNewPassive({
                    ...newPassive,
                    active:
                      e.target.checked,
                  })
                }
              />
              Deixar ativa
            </label>

            <select
              value={newPassive.type}
              onChange={(e) =>
                setNewPassive({
                  ...newPassive,
                  type: e.target.value,
                })
              }
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            >
              <option>Passiva</option>
              <option>
                Habilidade sem dano
              </option>
              <option>Utilidade</option>
            </select>

            <textarea
              value={newPassive.effect}
              onChange={(e) =>
                setNewPassive({
                  ...newPassive,
                  effect: e.target.value,
                })
              }
              rows={3}
              placeholder="Efeito"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <div className="grid grid-cols-2 gap-2">

              <input
                value={newPassive.area}
                onChange={(e) =>
                  setNewPassive({
                    ...newPassive,
                    area: e.target.value,
                  })
                }
                placeholder="Área"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
              />

              <input
                value={newPassive.dur}
                onChange={(e) =>
                  setNewPassive({
                    ...newPassive,
                    dur: e.target.value,
                  })
                }
                placeholder="Duração"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
              />

            </div>

            <textarea
              value={newPassive.desc}
              onChange={(e) =>
                setNewPassive({
                  ...newPassive,
                  desc: e.target.value,
                })
              }
              rows={2}
              placeholder="Descrição"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <button
              onClick={savePassive}
              className="w-full bg-cyan-500 text-slate-950 font-bold py-2 rounded"
            >
              Salvar
            </button>

          </div>

        </div>
      )}

      {/* =========================================================
          MODAL DE ITEM
      ========================================================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">

            <div className="flex justify-between">

              <h3 className="text-lg font-bold text-amber-400">
                {editingItemId !== null
                  ? 'Editar Item'
                  : 'Adicionar Item'}
              </h3>

              <button
                onClick={closeItemModal}
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            <input
              value={newItem.name}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  name: e.target.value,
                })
              }
              placeholder="Nome do item"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <div className="grid grid-cols-2 gap-2">

              <input
                type="number"
                value={newItem.qty}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    qty: e.target.value,
                  })
                }
                placeholder="Quantidade"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
              />

              <input
                value={newItem.weight}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    weight: e.target.value,
                  })
                }
                placeholder="Peso"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
              />

            </div>

            <textarea
              value={newItem.desc}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  desc: e.target.value,
                })
              }
              rows={3}
              placeholder="Descrição"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />

            <button
              onClick={saveItem}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded"
            >
              Salvar
            </button>

          </div>

        </div>
      )}

    </div>
  );
}