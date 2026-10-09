import React, { useEffect, useState, useRef } from 'react';
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
  ShieldAlert,
  Move,
  LayoutGrid,
  Footprints,
  Sliders,
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

const CATEGORIES = [
  'Simples',
  'Normal',
  'Grande',
  'Grandiosa',
  'Suprema',
  'Absoluta',
];

// Cálculo de limites de gasto de energia com base na Categoria e Nível de Controle
const getAbilityCategoryLimits = (category, controlLevel = 0) => {
  const ctrl = Math.max(0, Number(controlLevel) || 0);
  const base = Math.max(1, 15 - ctrl);
  let minMult = 1;
  let maxMult = 2;

  switch (category) {
    case 'Simples':
      minMult = 1;
      maxMult = 2;
      break;
    case 'Normal':
      minMult = 3;
      maxMult = 5;
      break;
    case 'Grande':
      minMult = 6;
      maxMult = 15;
      break;
    case 'Grandiosa':
      minMult = 16;
      maxMult = 30;
      break;
    case 'Suprema':
      minMult = 31;
      maxMult = 59;
      break;
    case 'Absoluta':
      minMult = 60;
      maxMult = 999;
      break;
    default:
      minMult = 1;
      maxMult = 2;
  }

  return {
    base,
    minMult,
    maxMult,
    minCost: minMult * base,
    maxCost: maxMult === 999 ? '∞' : maxMult * base,
    maxCostNum: maxMult * base,
  };
};

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
      movement: '9m',
      controlLevel: 0,
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
    loadState('resistancePhysical', { current: 10, max: 10 })
  );

  const [resistanceSpiritual, setResistanceSpiritual] = useState(() =>
    loadState('resistanceSpiritual', { current: 10, max: 10 })
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

  // Dados Soltos
  const [quickRollPools, setQuickRollPools] = useState(() =>
    loadState('quickRollPools', [
      { id: 1, qty: 1, sides: 6 },
      { id: 2, qty: 1, sides: 12 },
    ])
  );
  const [quickRollBonus, setQuickRollBonus] = useState(0);

  // Recuperação de Energia
  const [energyRecQty, setEnergyRecQty] = useState(1);
  const [energyRecSides, setEnergyRecSides] = useState(6);
  const [energyRecBonus, setEnergyRecBonus] = useState(0);

  // Canvas de Habilidades
  const canvasRef = useRef(null);
  const [draggingAbilityId, setDraggingAbilityId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [resizingAbilityId, setResizingAbilityId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ w: 0, h: 0, x: 0, y: 0 });

  const [newWeapon, setNewWeapon] = useState({
    name: '',
    dmg: '1d8',
    attr: 'Força',
    prop: '',
    desc: '',
  });

  // Habilidade com suporte a rolagem e bônus customizados
  const [newAbility, setNewAbility] = useState({
    name: '',
    category: 'Simples',
    attr: 'Força',
    dmgDiceQty: 1,
    dmgDiceSides: 6,
    dmgBonus: 0,
    damage: '1d6',
    area: '3m',
    dur: 'Instantânea',
    desc: '',
    x: 20,
    y: 20,
    w: 270,
    h: 180,
  });

  const [newPassive, setNewPassive] = useState({
    name: '',
    category: 'Simples',
    reservedEnergy: 15,
    active: false,
    effect: '',
    desc: '',
  });

  const [newItem, setNewItem] = useState({
    name: '',
    qty: 1,
    weight: '0.5 kg',
    desc: '',
  });

  // Rolagem de Habilidade
  const [abilityRollModal, setAbilityRollModal] = useState(null);
  const [abilityRollQty, setAbilityRollQty] = useState(1);
  const [abilityRollSides, setAbilityRollSides] = useState(6);
  const [abilityRollBonus, setAbilityRollBonus] = useState(0);
  const [abilityRollCost, setAbilityRollCost] = useState(15);

  useEffect(() => {
    const level = Math.max(1, Number(charInfo.level) || 1);
    const newPower = level * 5;

    setAttributes((prev) => ({
      ...prev,
      Poder: newPower,
    }));
  }, [charInfo.level]);

  useEffect(() => {
    const defaultDiceCount = Math.max(
      1,
      Math.floor(Math.max(0, Number(energy.max) || 0) / 20)
    );
    const defaultBonus = Math.floor((Number(attributes.Poder) || 0) / 2);

    setEnergyRecQty(defaultDiceCount);
    setEnergyRecBonus(defaultBonus);
  }, [energy.max, attributes.Poder]);

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
          quickRollPools,
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
    quickRollPools,
  ]);

  const getMod = (value) => Math.floor((Number(value) - 10) / 2);

  const getSkillTotal = (skill) => {
    const attrMod = getMod(attributes[skill.attr] || 10);
    const isProf = proficientSkills.includes(skill.name);
    const profVal = isProf ? Number(profBonus) || 0 : 0;
    const manualVal =
      skillManualValues[skill.name] !== undefined &&
      skillManualValues[skill.name] !== ''
        ? Number(skillManualValues[skill.name]) || 0
        : 0;

    return attrMod + profVal + manualVal;
  };

  const executeRoll = ({ label, pools = [], bonus = 0, isDamage = false }) => {
    let allRolls = [];

    pools.forEach((pool) => {
      const q = Math.max(1, Number(pool.qty) || 1);
      const s = Math.max(2, Number(pool.sides) || 6);
      for (let i = 0; i < q; i++) {
        allRolls.push(Math.floor(Math.random() * s) + 1);
      }
    });

    const diceSum = allRolls.reduce((a, b) => a + b, 0);
    const total = diceSum + bonus;

    let breakdown = allRolls.join(', ');
    if (bonus > 0) {
      breakdown += ` + ${bonus}`;
    } else if (bonus < 0) {
      breakdown += ` - ${Math.abs(bonus)}`;
    }
    breakdown += ` = ${total}`;

    const rollData = {
      id: Date.now() + Math.random(),
      label,
      allRolls,
      diceSum,
      bonus,
      total,
      breakdown,
      isDamage,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      isCrit: !isDamage && allRolls.length === 1 && allRolls[0] === 20,
      isFail: !isDamage && allRolls.length === 1 && allRolls[0] === 1,
    };

    setRollHistory((prev) => [rollData, ...prev]);
    setActiveRollResult(rollData);
    return total;
  };

  const parseDiceNotation = (notation) => {
    if (!notation) return { pools: [], bonus: 0 };
    const pools = [];
    let bonus = 0;

    const diceRegex = /(\d+)\s*d\s*(\d+)/gi;
    let match;

    while ((match = diceRegex.exec(notation)) !== null) {
      pools.push({
        qty: Math.max(1, Number(match[1])),
        sides: Math.max(2, Number(match[2])),
      });
    }

    const bonusStr = notation.replace(/(\d+)\s*d\s*(\d+)/gi, '');
    const numbers = bonusStr.match(/([+-]?\s*\d+)/g);
    if (numbers) {
      numbers.forEach((num) => {
        const cleaned = num.replace(/\s+/g, '');
        bonus += Number(cleaned) || 0;
      });
    }

    if (pools.length === 0) {
      pools.push({ qty: 1, sides: 20 });
    }

    return { pools, bonus };
  };

  const rollAttribute = (attrName) => {
    if (attrName === 'Poder') return;
    const mod = getMod(attributes[attrName] || 10);
    executeRoll({
      label: `Atributo: ${attrName}`,
      pools: [{ qty: 1, sides: 20 }],
      bonus: mod,
    });
  };

  const rollSkill = (skill) => {
    const totalBonus = getSkillTotal(skill);
    executeRoll({
      label: `Perícia: ${skill.name}`,
      pools: [{ qty: 1, sides: 20 }],
      bonus: totalBonus,
    });
  };

  const rollWeaponAttack = (weapon) => {
    const mod = getMod(attributes[weapon.attr] || 10);
    executeRoll({
      label: `Ataque: ${weapon.name}`,
      pools: [{ qty: 1, sides: 20 }],
      bonus: mod + Number(profBonus),
    });
  };

  const rollWeaponDamage = (weapon) => {
    const { pools, bonus } = parseDiceNotation(weapon.dmg || '1d8');
    executeRoll({
      label: `Dano: ${weapon.name}`,
      pools,
      bonus,
      isDamage: true,
    });
  };

  const handleQuickRoll = () => {
    executeRoll({
      label: 'Rolagem Solta',
      pools: quickRollPools,
      bonus: Number(quickRollBonus) || 0,
    });
  };

  const addQuickRollPool = () => {
    setQuickRollPools((prev) => [
      ...prev,
      { id: Date.now(), qty: 1, sides: 6 },
    ]);
  };

  const removeQuickRollPool = (id) => {
    if (quickRollPools.length <= 1) return;
    setQuickRollPools((prev) => prev.filter((p) => p.id !== id));
  };

  const recoverEnergy = () => {
    const q = Math.max(1, Number(energyRecQty) || 1);
    const s = Math.max(2, Number(energyRecSides) || 6);
    const b = Number(energyRecBonus) || 0;

    const recoveredTotal = executeRoll({
      label: 'Recuperação de Energia',
      pools: [{ qty: q, sides: s }],
      bonus: b,
    });

    setEnergy((prev) => ({
      ...prev,
      current: Math.min(
        Number(prev.max) || 0,
        Math.max(0, Number(prev.current) || 0) + recoveredTotal
      ),
    }));
  };

  const toggleSkillProf = (skillName) => {
    setProficientSkills((prev) =>
      prev.includes(skillName)
        ? prev.filter((skill) => skill !== skillName)
        : [...prev, skillName]
    );
  };

  // Mover Card Habilidade
  const handlePointerDownAbility = (e, ability) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingAbilityId(ability.id);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMoveAbility = (e, abilityId) => {
    if (draggingAbilityId !== abilityId || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const targetAbility = abilities.find((a) => a.id === abilityId);
    const cardW = targetAbility?.w || 270;

    const newX = Math.max(
      0,
      Math.min(canvasRect.width - cardW, e.clientX - canvasRect.left - dragOffset.x)
    );
    const newY = Math.max(0, e.clientY - canvasRect.top - dragOffset.y);

    setAbilities((prev) =>
      prev.map((a) => (a.id === abilityId ? { ...a, x: newX, y: newY } : a))
    );
  };

  const handlePointerUpAbility = (e) => {
    if (draggingAbilityId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setDraggingAbilityId(null);
    }
  };

  // Redimensionar Card
  const handleResizePointerDown = (e, ability) => {
    e.stopPropagation();
    e.preventDefault();
    setResizingAbilityId(ability.id);
    setResizeStart({
      w: ability.w || 270,
      h: ability.h || 180,
      x: e.clientX,
      y: e.clientY,
    });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e, abilityId) => {
    if (resizingAbilityId !== abilityId) return;
    e.stopPropagation();

    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;

    const newW = Math.max(200, resizeStart.w + deltaX);
    const newH = Math.max(140, resizeStart.h + deltaY);

    setAbilities((prev) =>
      prev.map((a) => (a.id === abilityId ? { ...a, w: newW, h: newH } : a))
    );
  };

  const handleResizePointerUp = (e) => {
    if (resizingAbilityId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setResizingAbilityId(null);
    }
  };

  const getCanvasDynamicHeight = () => {
    if (!abilities || abilities.length === 0) return 500;
    const maxY = Math.max(
      ...abilities.map((a) => (a.y || 20) + (a.h || 180))
    );
    return Math.max(500, maxY + 60);
  };

  const autoArrangeAbilities = () => {
    setAbilities((prev) =>
      prev.map((ability, idx) => ({
        ...ability,
        w: ability.w || 270,
        h: ability.h || 180,
        x: 20 + (idx % 2) * 290,
        y: 20 + Math.floor(idx / 2) * 200,
      }))
    );
  };

  const saveWeapon = () => {
    if (!newWeapon.name.trim()) return;

    if (editingWeaponId !== null) {
      setWeapons((prev) =>
        prev.map((weapon) =>
          weapon.id === editingWeaponId ? { ...weapon, ...newWeapon } : weapon
        )
      );
    } else {
      setWeapons((prev) => [
        ...prev,
        { ...newWeapon, id: Date.now() },
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
      desc: weapon.desc || '',
    });

    setEditingWeaponId(weapon.id);
    setIsWeaponModalOpen(true);
  };

  const closeWeaponModal = () => {
    setIsWeaponModalOpen(false);
    setEditingWeaponId(null);
    setNewWeapon({
      name: '',
      dmg: '1d8',
      attr: 'Força',
      prop: '',
      desc: '',
    });
  };

  // Salvar Habilidade com a Formatação de Dados e Bônus
  const saveAbility = () => {
    if (!newAbility.name.trim()) return;

    const qty = Math.max(1, Number(newAbility.dmgDiceQty) || 1);
    const sides = Number(newAbility.dmgDiceSides) || 6;
    const bonus = Number(newAbility.dmgBonus) || 0;

    let formattedDamage = `${qty}d${sides}`;
    if (bonus > 0) formattedDamage += ` + ${bonus}`;
    else if (bonus < 0) formattedDamage += ` - ${Math.abs(bonus)}`;

    const finalAbility = {
      ...newAbility,
      dmgDiceQty: qty,
      dmgDiceSides: sides,
      dmgBonus: bonus,
      damage: formattedDamage,
    };

    if (editingAbilityId !== null) {
      setAbilities((prev) =>
        prev.map((ability) =>
          ability.id === editingAbilityId
            ? { ...ability, ...finalAbility }
            : ability
        )
      );
    } else {
      setAbilities((prev) => [
        ...prev,
        {
          ...finalAbility,
          id: Date.now(),
          x: 20 + (prev.length % 2) * 290,
          y: 20 + Math.floor(prev.length / 2) * 200,
          w: 270,
          h: 180,
        },
      ]);
    }

    closeAbilityModal();
  };

  const editAbility = (ability) => {
    const { pools, bonus } = parseDiceNotation(ability.damage || '1d6');

    setNewAbility({
      name: ability.name || '',
      category: ability.category || 'Simples',
      attr: ability.attr || 'Força',
      dmgDiceQty: ability.dmgDiceQty ?? (pools[0]?.qty || 1),
      dmgDiceSides: ability.dmgDiceSides ?? (pools[0]?.sides || 6),
      dmgBonus: ability.dmgBonus ?? bonus ?? 0,
      damage: ability.damage || '1d6',
      area: ability.area || '3m',
      dur: ability.dur || 'Instantânea',
      desc: ability.desc || '',
      x: ability.x || 20,
      y: ability.y || 20,
      w: ability.w || 270,
      h: ability.h || 180,
    });

    setEditingAbilityId(ability.id);
    setIsAbilityModalOpen(true);
  };

  const castAbility = (ability) => {
    setAbilityRollModal(ability);

    const savedDamage = String(ability.damage || '1d6').trim();
    const { pools, bonus } = parseDiceNotation(savedDamage);

    setAbilityRollQty(ability.dmgDiceQty ?? (pools[0]?.qty || 1));
    setAbilityRollSides(ability.dmgDiceSides ?? (pools[0]?.sides || 6));
    setAbilityRollBonus(ability.dmgBonus ?? bonus ?? 0);

    const limits = getAbilityCategoryLimits(
      ability.category || 'Simples',
      charInfo.controlLevel
    );
    setAbilityRollCost(limits.minCost);
  };

  const rollAbilityAttack = (ability) => {
    const attr = ability.attr || 'Força';
    const attributeMod = getMod(attributes[attr] || 10);
    executeRoll({
      label: `Acerto da habilidade: ${ability.name}`,
      pools: [{ qty: 1, sides: 20 }],
      bonus: attributeMod + Number(profBonus),
    });
  };

  const confirmAbilityUse = () => {
    if (!abilityRollModal) return;

    const ability = abilityRollModal;
    const limits = getAbilityCategoryLimits(
      ability.category || 'Simples',
      charInfo.controlLevel
    );

    let cost = Number(abilityRollCost) || 0;

    if (cost < limits.minCost) {
      cost = limits.minCost;
    }
    if (limits.maxMult !== 999 && cost > limits.maxCostNum) {
      cost = limits.maxCostNum;
    }

    if (energy.current < cost) {
      alert(`Energia insuficiente. Você precisa de ${cost} de Energia.`);
      return;
    }

    setEnergy((prev) => ({
      ...prev,
      current: Math.max(0, prev.current - cost),
    }));

    executeRoll({
      label: `Dano da habilidade: ${ability.name} (${ability.category || 'Simples'})`,
      pools: [{ qty: Math.max(1, abilityRollQty), sides: abilityRollSides }],
      bonus: Number(abilityRollBonus) || 0,
      isDamage: true,
    });

    setAbilityRollModal(null);
  };

  const closeAbilityModal = () => {
    setIsAbilityModalOpen(false);
    setEditingAbilityId(null);
    setNewAbility({
      name: '',
      category: 'Simples',
      attr: 'Força',
      dmgDiceQty: 1,
      dmgDiceSides: 6,
      dmgBonus: 0,
      damage: '1d6',
      area: '3m',
      dur: 'Instantânea',
      desc: '',
      x: 20,
      y: 20,
      w: 270,
      h: 180,
    });
  };

  // Lógica de Passivas e Buffs
  const savePassive = () => {
    if (!newPassive.name.trim()) return;

    const limits = getAbilityCategoryLimits(
      newPassive.category || 'Simples',
      charInfo.controlLevel
    );

    let cost = Number(newPassive.reservedEnergy) || 0;
    if (cost < limits.minCost) cost = limits.minCost;
    if (limits.maxMult !== 999 && cost > limits.maxCostNum) cost = limits.maxCostNum;

    const passiveData = {
      ...newPassive,
      reservedEnergy: cost,
    };

    if (editingPassiveId !== null) {
      setPassives((prev) =>
        prev.map((passive) =>
          passive.id === editingPassiveId
            ? { ...passive, ...passiveData }
            : passive
        )
      );
    } else {
      setPassives((prev) => [
        ...prev,
        {
          ...passiveData,
          id: Date.now(),
        },
      ]);
    }

    closePassiveModal();
  };

  const togglePassiveActive = (passiveId) => {
    setPassives((prev) =>
      prev.map((p) => {
        if (p.id !== passiveId) return p;

        const reservedCost = Math.max(0, Number(p.reservedEnergy) || 0);

        if (!p.active) {
          if (energy.max < reservedCost) {
            alert(
              `Energia MÁXIMA insuficiente para ativar esta passiva! Você precisa de pelo menos ${reservedCost} de Energia Máxima disponível.`
            );
            return p;
          }
          setEnergy((e) => {
            const newMax = Math.max(0, e.max - reservedCost);
            return {
              ...e,
              max: newMax,
              current: Math.min(e.current, newMax),
            };
          });
          return { ...p, active: true };
        } else {
          setEnergy((e) => ({
            ...e,
            max: e.max + reservedCost,
          }));
          return { ...p, active: false };
        }
      })
    );
  };

  const editPassive = (passive) => {
    const cat = passive.category || 'Simples';
    const limits = getAbilityCategoryLimits(cat, charInfo.controlLevel);

    setNewPassive({
      name: passive.name || '',
      category: cat,
      reservedEnergy: passive.reservedEnergy ?? limits.minCost,
      active: !!passive.active,
      effect: passive.effect || '',
      desc: passive.desc || '',
    });

    setEditingPassiveId(passive.id);
    setIsPassiveModalOpen(true);
  };

  const closePassiveModal = () => {
    setIsPassiveModalOpen(false);
    setEditingPassiveId(null);
    const limits = getAbilityCategoryLimits('Simples', charInfo.controlLevel);
    setNewPassive({
      name: '',
      category: 'Simples',
      reservedEnergy: limits.minCost,
      active: false,
      effect: '',
      desc: '',
    });
  };

  const saveItem = () => {
    if (!newItem.name.trim()) return;

    const item = {
      ...newItem,
      qty: Number(newItem.qty) || 0,
    };

    if (editingItemId !== null) {
      setInventory((prev) =>
        prev.map((oldItem) =>
          oldItem.id === editingItemId ? { ...oldItem, ...item } : oldItem
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
        const canvas = document.createElement('canvas');
        const maxSize = 700;
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxSize) {
            height = (height / width) * maxSize;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);

        setCharacterImage(canvas.toDataURL('image/jpeg', 0.75));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const resetSheet = () => {
    if (!window.confirm('Tem certeza que deseja apagar toda a ficha?')) {
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const getCategoryBadgeColor = (cat) => {
    switch (cat) {
      case 'Simples':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'Normal':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'Grande':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'Grandiosa':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'Suprema':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'Absoluta':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const tabs = [
    { id: 'geral', label: 'Geral & Atributos', icon: User },
    { id: 'combate', label: 'Combate & Habilidades', icon: Swords },
    { id: 'passivas', label: 'Passivas & Buffs', icon: ShieldAlert },
    { id: 'inventario', label: 'Inventário & Itens', icon: Backpack },
    { id: 'anotacoes', label: 'História & Notas', icon: Scroll },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans select-none">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* CABEÇALHO */}
        <header className="bg-slate-900 border border-amber-500/30 p-6 rounded-xl shadow-lg space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            
            <div className="flex flex-col items-center justify-center space-y-2">
              {characterImage ? (
                <img
                  src={characterImage}
                  alt="Personagem"
                  className="w-28 h-28 object-cover rounded-lg border border-amber-500/40 shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex items-center justify-center text-xs text-slate-500 text-center p-2">
                  Sem imagem
                </div>
              )}
              <div className="flex gap-2">
                <label className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2 py-1 rounded cursor-pointer">
                  Alterar Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCharacterImage}
                    className="hidden"
                  />
                </label>
                {characterImage && (
                  <button
                    onClick={() => setCharacterImage('')}
                    className="text-[10px] text-rose-400 hover:underline"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <input
                value={charInfo.name}
                onChange={(e) =>
                  setCharInfo({ ...charInfo, name: e.target.value })
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
                      level: Math.max(1, Number(e.target.value) || 1),
                    })
                  }
                  className="w-14 bg-slate-950 border border-slate-700 rounded text-center text-amber-400 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Mutação</label>
                <select
                  value={charInfo.mutation}
                  onChange={(e) =>
                    setCharInfo({ ...charInfo, mutation: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
                >
                  <option value="">Selecione</option>
                  <option value="U">Tipo U (Único)</option>
                  <option value="N">Tipo N (Natural)</option>
                  <option value="T">Tipo T (Terreno)</option>
                  <option value="E">Tipo E (Elemental)</option>
                  <option value="M">Tipo M (Mental)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Classe de Poder</label>
                <input
                  value={charInfo.baseClass}
                  onChange={(e) =>
                    setCharInfo({ ...charInfo, baseClass: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-xs text-slate-400">Proficiência</span>
                <input
                  type="number"
                  value={profBonus}
                  onChange={(e) => setProfBonus(Number(e.target.value) || 0)}
                  className="w-14 bg-slate-900 border border-amber-500/40 rounded text-center text-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Classe Avançada</label>
                <input
                  value={charInfo.advClass}
                  onChange={(e) =>
                    setCharInfo({ ...charInfo, advClass: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
                />
              </div>
            </div>

            <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>
                <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                  <Footprints className="w-3.5 h-3.5 text-amber-400" /> Movimentação
                </label>
                <input
                  value={charInfo.movement || ''}
                  onChange={(e) =>
                    setCharInfo({ ...charInfo, movement: e.target.value })
                  }
                  placeholder="Ex: 9m / 6 sq"
                  className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-xs text-amber-300 font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Nível de Controle
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={charInfo.controlLevel ?? 0}
                    onChange={(e) =>
                      setCharInfo({
                        ...charInfo,
                        controlLevel: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 p-1.5 rounded text-xs text-cyan-300 font-bold text-center"
                  />
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    Base: {Math.max(1, 15 - (Number(charInfo.controlLevel) || 0))}⚡
                  </span>
                </div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
            <div className="bg-slate-950 border border-rose-900/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-rose-400 font-bold">
                <span className="flex gap-1 items-center">
                  <Heart className="w-4 h-4" /> HP
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={hp.current}
                    onChange={(e) =>
                      setHp({ ...hp, current: Number(e.target.value) })
                    }
                    className="w-14 bg-slate-900 rounded text-right"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={hp.max}
                    onChange={(e) =>
                      setHp({ ...hp, max: Number(e.target.value) })
                    }
                    className="w-14 bg-slate-900 rounded"
                  />
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded overflow-hidden">
                <div
                  className="h-full bg-rose-600 transition-all duration-300"
                  style={{
                    width: `${
                      hp.max > 0
                        ? Math.min(100, Math.max(0, (hp.current / hp.max) * 100))
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() =>
                    setHp((prev) => ({ ...prev, current: prev.current - 10 }))
                  }
                  className="bg-rose-950 p-1 rounded text-xs"
                >
                  -10
                </button>
                <button
                  onClick={() =>
                    setHp((prev) => ({ ...prev, current: prev.current - 1 }))
                  }
                  className="bg-rose-950 p-1 rounded text-xs"
                >
                  -1
                </button>
                <button
                  onClick={() =>
                    setHp((prev) => ({
                      ...prev,
                      current: Math.min(prev.max, prev.current + 1),
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
                      current: Math.min(prev.max, prev.current + 10),
                    }))
                  }
                  className="bg-emerald-950 p-1 rounded text-xs"
                >
                  +10
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-cyan-900/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-cyan-400 font-bold">
                <span className="flex gap-1 items-center">
                  <Zap className="w-4 h-4" /> Energia
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={energy.current}
                    onChange={(e) =>
                      setEnergy({ ...energy, current: Number(e.target.value) })
                    }
                    className="w-14 bg-slate-900 rounded text-right"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={energy.max}
                    onChange={(e) =>
                      setEnergy({ ...energy, max: Number(e.target.value) })
                    }
                    className="w-14 bg-slate-900 rounded"
                  />
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{
                    width: `${
                      energy.max > 0
                        ? Math.min(100, Math.max(0, (energy.current / energy.max) * 100))
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
                      current: Math.max(0, prev.current - 10),
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
                      current: Math.max(0, prev.current - 1),
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
                      current: Math.min(prev.max, prev.current + 1),
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
                      current: Math.min(prev.max, prev.current + 10),
                    }))
                  }
                  className="bg-emerald-950 p-1 rounded text-xs"
                >
                  +10
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-amber-900/50 rounded-lg p-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-amber-400">
                <Shield className="w-7 h-7" />
                <div>
                  <p className="text-xs text-slate-400">Classe de Armadura</p>
                  <p className="text-3xl font-black">{armorClass}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setArmorClass((v) => v + 1)}
                  className="bg-slate-900 p-1 rounded"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setArmorClass((v) => Math.max(0, v - 1))}
                  className="bg-slate-900 p-1 rounded"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-800 pt-4">
            <div className="bg-slate-950 border border-amber-900/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-amber-400 font-bold">
                <span className="flex gap-1 items-center">
                  <Shield className="w-4 h-4" /> Res. Física
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={resistancePhysical.current}
                    onChange={(e) =>
                      setResistancePhysical({
                        ...resistancePhysical,
                        current: Number(e.target.value) || 0,
                      })
                    }
                    className="w-14 bg-slate-900 rounded text-right text-amber-300"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={resistancePhysical.max}
                    onChange={(e) =>
                      setResistancePhysical({
                        ...resistancePhysical,
                        max: Number(e.target.value) || 0,
                      })
                    }
                    className="w-14 bg-slate-900 rounded text-amber-300"
                  />
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded overflow-hidden">
                <div
                  className="h-full bg-amber-400"
                  style={{
                    width: `${
                      resistancePhysical.max > 0
                        ? Math.min(
                            100,
                            Math.max(
                              0,
                              (resistancePhysical.current /
                                resistancePhysical.max) *
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
                    setResistancePhysical((prev) => ({
                      ...prev,
                      current: Math.max(0, prev.current - 5),
                    }))
                  }
                  className="bg-amber-950/60 p-1 rounded text-xs text-amber-200"
                >
                  -5
                </button>
                <button
                  onClick={() =>
                    setResistancePhysical((prev) => ({
                      ...prev,
                      current: Math.max(0, prev.current - 1),
                    }))
                  }
                  className="bg-amber-950/60 p-1 rounded text-xs text-amber-200"
                >
                  -1
                </button>
                <button
                  onClick={() =>
                    setResistancePhysical((prev) => ({
                      ...prev,
                      current: Math.min(prev.max, prev.current + 1),
                    }))
                  }
                  className="bg-amber-900/60 p-1 rounded text-xs text-amber-200"
                >
                  +1
                </button>
                <button
                  onClick={() =>
                    setResistancePhysical((prev) => ({
                      ...prev,
                      current: Math.min(prev.max, prev.current + 5),
                    }))
                  }
                  className="bg-amber-900/60 p-1 rounded text-xs text-amber-200"
                >
                  +5
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-purple-900/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center text-purple-400 font-bold">
                <span className="flex gap-1 items-center">
                  <Sparkles className="w-4 h-4" /> Res. Espiritual
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={resistanceSpiritual.current}
                    onChange={(e) =>
                      setResistanceSpiritual({
                        ...resistanceSpiritual,
                        current: Number(e.target.value) || 0,
                      })
                    }
                    className="w-14 bg-slate-900 rounded text-right text-purple-300"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={resistanceSpiritual.max}
                    onChange={(e) =>
                      setResistanceSpiritual({
                        ...resistanceSpiritual,
                        max: Number(e.target.value) || 0,
                      })
                    }
                    className="w-14 bg-slate-900 rounded text-purple-300"
                  />
                </div>
              </div>
              <div className="h-2 bg-slate-800 rounded overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{
                    width: `${
                      resistanceSpiritual.max > 0
                        ? Math.min(
                            100,
                            Math.max(
                              0,
                              (resistanceSpiritual.current /
                                resistanceSpiritual.max) *
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
                    setResistanceSpiritual((prev) => ({
                      ...prev,
                      current: Math.max(0, prev.current - 5),
                    }))
                  }
                  className="bg-purple-950/60 p-1 rounded text-xs text-purple-200"
                >
                  -5
                </button>
                <button
                  onClick={() =>
                    setResistanceSpiritual((prev) => ({
                      ...prev,
                      current: Math.max(0, prev.current - 1),
                    }))
                  }
                  className="bg-purple-950/60 p-1 rounded text-xs text-purple-200"
                >
                  -1
                </button>
                <button
                  onClick={() =>
                    setResistanceSpiritual((prev) => ({
                      ...prev,
                      current: Math.min(prev.max, prev.current + 1),
                    }))
                  }
                  className="bg-purple-900/60 p-1 rounded text-xs text-purple-200"
                >
                  +1
                </button>
                <button
                  onClick={() =>
                    setResistanceSpiritual((prev) => ({
                      ...prev,
                      current: Math.min(prev.max, prev.current + 5),
                    }))
                  }
                  className="bg-purple-900/60 p-1 rounded text-xs text-purple-200"
                >
                  +5
                </button>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col justify-center space-y-2">
              <p className="text-xs text-slate-400">Bônus de Resistência</p>
              <input
                type="number"
                value={resistanceBonus}
                onChange={(e) =>
                  setResistanceBonus(Number(e.target.value) || 0)
                }
                className="w-full bg-slate-900 rounded p-2 text-center text-amber-400 font-bold"
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
                onClick={() => setActiveTab(tab.id)}
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

        {/* GERAL */}
        {activeTab === 'geral' && (
          <div className="space-y-6">
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-amber-400">
                  Atributos Base
                </h2>
                <span className="text-xs text-slate-500">
                  Clique no card do atributo para rolar o teste
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(attributes).map(([attr, value]) => {
                  const isPower = attr === 'Poder';
                  const modifier = isPower ? value : getMod(value);

                  return (
                    <div
                      key={attr}
                      onClick={() => !isPower && rollAttribute(attr)}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        isPower
                          ? 'bg-cyan-950/40 border-cyan-500/50 cursor-default'
                          : 'bg-slate-950 border-slate-800 cursor-pointer hover:border-amber-500/50 hover:bg-slate-900/50'
                      }`}
                    >
                      <p className="text-xs uppercase text-slate-400 font-bold">
                        {attr}
                      </p>
                      <p className="text-2xl font-black text-amber-400 my-1">
                        {isPower
                          ? value
                          : modifier >= 0
                          ? `+${modifier}`
                          : modifier}
                      </p>

                      <div onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          value={value}
                          disabled={isPower}
                          onChange={(e) =>
                            setAttributes({
                              ...attributes,
                              [attr]: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                          className="w-16 bg-slate-900 rounded text-center text-sm"
                        />
                      </div>

                      {isPower && (
                        <p className="text-[10px] text-cyan-400 mt-2">
                          Calculado pelo nível
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-amber-400">Perícias</h2>
                <span className="text-xs text-slate-500">
                  Bônus total atualizado dinamicamente
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {initialSkills.map((skill) => {
                  const proficient = proficientSkills.includes(skill.name);
                  const manual = skillManualValues[skill.name];
                  const totalVal = getSkillTotal(skill);

                  return (
                    <div
                      key={skill.name}
                      className="bg-slate-950 border border-slate-800 rounded p-3 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{skill.name}</p>
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {totalVal >= 0 ? `+${totalVal}` : totalVal}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">{skill.attr}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Manual"
                          value={manual ?? ''}
                          onChange={(e) =>
                            setSkillManualValues((prev) => ({
                              ...prev,
                              [skill.name]: e.target.value,
                            }))
                          }
                          className="w-14 bg-slate-900 rounded text-center text-xs p-1"
                        />

                        <button
                          onClick={() => toggleSkillProf(skill.name)}
                          className={`text-[10px] px-2 py-1 rounded font-bold transition-colors ${
                            proficient
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {proficient ? `Prof. (+${profBonus})` : '—'}
                        </button>

                        <button
                          onClick={() => rollSkill(skill)}
                          className="bg-amber-500 text-slate-950 p-2 rounded hover:bg-amber-400"
                        >
                          <Dices className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-amber-400 mb-4">
                Testes de Morte
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-slate-400">Sucessos:</span>
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={`s${n}`}
                    onClick={() =>
                      setDeathSaves({ ...deathSaves, successes: n })
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

                <span className="text-sm text-slate-400 ml-4">Falhas:</span>
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={`f${n}`}
                    onClick={() =>
                      setDeathSaves({ ...deathSaves, failures: n })
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
                    setDeathSaves({ successes: 0, failures: 0 })
                  }
                  className="ml-3 bg-slate-800 px-3 py-2 rounded text-xs"
                >
                  Resetar
                </button>
              </div>
            </section>
          </div>
        )}

        {/* COMBATE & HABILIDADES */}
        {activeTab === 'combate' && (
          <div className="space-y-6">

            {/* ROLAGEM DE DADOS SOLTOS */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                  <Dices className="w-5 h-5" /> Rolagem de Dados Soltos
                </h2>
                <button
                  onClick={addQuickRollPool}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-3 py-1.5 rounded flex items-center gap-1 border border-slate-700"
                >
                  <Plus className="w-3.5 h-3.5" /> Adicionar Dado
                </button>
              </div>

              <div className="space-y-3">
                {quickRollPools.map((pool, idx) => (
                  <div key={pool.id} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-6">#{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={pool.qty}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value) || 1);
                          setQuickRollPools((prev) =>
                            prev.map((p) => (p.id === pool.id ? { ...p, qty: val } : p))
                          );
                        }}
                        className="w-16 bg-slate-950 border border-slate-800 text-amber-300 p-2 rounded text-center text-sm"
                      />
                      <span className="text-xs text-slate-400 font-bold">d</span>
                      <select
                        value={pool.sides}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setQuickRollPools((prev) =>
                            prev.map((p) => (p.id === pool.id ? { ...p, sides: val } : p))
                          );
                        }}
                        className="w-24 bg-slate-950 border border-slate-800 text-amber-300 p-2 rounded text-sm"
                      >
                        <option value={4}>d4</option>
                        <option value={6}>d6</option>
                        <option value={8}>d8</option>
                        <option value={10}>d10</option>
                        <option value={12}>d12</option>
                        <option value={20}>d20</option>
                        <option value={100}>d100</option>
                      </select>
                    </div>

                    {quickRollPools.length > 1 && (
                      <button
                        onClick={() => removeQuickRollPool(pool.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex flex-wrap items-end gap-4 border-t border-slate-800 pt-4 mt-2">
                  <div className="flex flex-col">
                    <label className="text-xs text-slate-400 mb-1 uppercase font-semibold">
                      Bônus Geral (+/-)
                    </label>
                    <input
                      type="number"
                      value={quickRollBonus}
                      onChange={(e) => setQuickRollBonus(Number(e.target.value) || 0)}
                      className="w-24 bg-slate-950 border border-slate-800 text-amber-300 p-2 rounded text-center text-sm font-bold"
                    />
                  </div>

                  <button
                    onClick={handleQuickRoll}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded flex items-center gap-2"
                  >
                    Rolar Todos os Dados
                  </button>
                </div>
              </div>
            </section>

            {/* ARMAS */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                  <Swords className="w-5 h-5" /> Armas
                </h2>
                <button
                  onClick={() => {
                    setEditingWeaponId(null);
                    setIsWeaponModalOpen(true);
                  }}
                  className="bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Adicionar Arma
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
                            onClick={() => editWeapon(weapon)}
                            className="text-slate-500 hover:text-amber-400"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setWeapons(
                                weapons.filter((w) => w.id !== weapon.id)
                              )
                            }
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {weapon.desc && (
                        <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                          {weapon.desc}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => rollWeaponAttack(weapon)}
                          className="bg-amber-500 text-slate-950 font-bold py-2 rounded text-xs"
                        >
                          Rolar Ataque
                        </button>
                        <button
                          onClick={() => rollWeaponDamage(weapon)}
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
                    <Zap className="w-5 h-5" /> Recuperação de Energia
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Ajuste os valores para realizar o cálculo automático e preencher a barra.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Qtd:</span>
                      <input
                        type="number"
                        min="1"
                        value={energyRecQty}
                        onChange={(e) => setEnergyRecQty(Number(e.target.value) || 1)}
                        className="w-14 bg-slate-950 border border-slate-800 text-cyan-300 p-1 text-center text-xs rounded"
                      />
                    </div>
                    <span className="text-xs text-slate-400">d</span>
                    <div className="flex items-center gap-1">
                      <select
                        value={energyRecSides}
                        onChange={(e) => setEnergyRecSides(Number(e.target.value))}
                        className="bg-slate-950 border border-slate-800 text-cyan-300 p-1 text-xs rounded"
                      >
                        <option value={4}>4</option>
                        <option value={6}>6</option>
                        <option value={8}>8</option>
                        <option value={10}>10</option>
                        <option value={12}>12</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">+ Bônus:</span>
                      <input
                        type="number"
                        value={energyRecBonus}
                        onChange={(e) => setEnergyRecBonus(Number(e.target.value) || 0)}
                        className="w-14 bg-slate-950 border border-slate-800 text-cyan-300 p-1 text-center text-xs rounded"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={recoverEnergy}
                  disabled={energy.current >= energy.max}
                  className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold px-5 py-3 rounded-lg"
                >
                  Recuperar Energia
                </button>
              </div>
            </section>

            {/* CANVAS DE HABILIDADES */}
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-cyan-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" /> Canvas de Habilidades
                  </h2>
                  <p className="text-xs text-slate-500">
                    Arraste pelo cabeçalho para mover. Arraste a alça no canto inferior direito para redimensionar.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={autoArrangeAbilities}
                    className="bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs px-3 py-2 rounded flex items-center gap-1"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" /> Organizar Grade
                  </button>
                  <button
                    onClick={() => {
                      setEditingAbilityId(null);
                      setIsAbilityModalOpen(true);
                    }}
                    className="bg-cyan-500 text-slate-950 font-bold px-3 py-2 rounded text-sm flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Adicionar
                  </button>
                </div>
              </div>

              {abilities.length === 0 ? (
                <div className="text-center text-sm text-slate-500 border border-dashed border-slate-700 rounded-lg p-8">
                  Nenhuma habilidade cadastrada no canvas.
                </div>
              ) : (
                <div
                  ref={canvasRef}
                  style={{ height: `${getCanvasDynamicHeight()}px` }}
                  className="relative w-full bg-slate-950/80 border-2 border-dashed border-cyan-900/40 rounded-xl shadow-inner p-4 transition-all duration-200"
                >
                  {abilities.map((ability) => {
                    const posX = ability.x ?? 20;
                    const posY = ability.y ?? 20;
                    const cardW = ability.w ?? 270;
                    const cardH = ability.h ?? 180;
                    const badgeColor = getCategoryBadgeColor(ability.category);

                    return (
                      <div
                        key={ability.id}
                        style={{
                          position: 'absolute',
                          left: `${posX}px`,
                          top: `${posY}px`,
                          width: `${cardW}px`,
                          height: `${cardH}px`,
                        }}
                        className={`bg-slate-900 border-2 ${
                          draggingAbilityId === ability.id || resizingAbilityId === ability.id
                            ? 'border-amber-400 z-30 shadow-2xl scale-[1.01]'
                            : 'border-cyan-900/60 z-10 hover:border-cyan-500'
                        } rounded-xl p-3 flex flex-col justify-between select-none transition-shadow`}
                      >
                        {/* CAMEÇALHO DO CARD */}
                        <div
                          onPointerDown={(e) => handlePointerDownAbility(e, ability)}
                          onPointerMove={(e) => handlePointerMoveAbility(e, ability.id)}
                          onPointerUp={handlePointerUpAbility}
                          className="flex justify-between items-start cursor-grab active:cursor-grabbing border-b border-slate-800/80 pb-2 mb-1"
                        >
                          <div className="flex items-center gap-1.5 overflow-hidden">
                            <Move className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <div className="truncate">
                              <h3 className="font-bold text-cyan-300 text-xs truncate">
                                {ability.name}
                              </h3>
                              <span
                                className={`text-[9px] border px-1.5 py-0.2 rounded font-bold uppercase ${badgeColor}`}
                              >
                                {ability.category || 'Simples'}
                              </span>
                            </div>
                          </div>

                          <div
                            className="flex gap-1 shrink-0"
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => editAbility(ability)}
                              className="text-slate-500 hover:text-cyan-300"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setAbilities(abilities.filter((a) => a.id !== ability.id))
                              }
                              className="text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* CORPO DO CARD */}
                        <div className="flex-1 overflow-y-auto space-y-1.5 text-xs text-slate-400 my-1 pr-1">
                          <p className="text-[10px] text-slate-500 font-semibold">
                            {ability.attr} · Dano: <span className="text-amber-300">{ability.damage || '1d6'}</span>
                          </p>

                          {ability.desc && (
                            <p className="text-[11px] leading-snug">
                              {ability.desc}
                            </p>
                          )}
                        </div>

                        {/* BOTÕES DE AÇÃO */}
                        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80">
                          <button
                            onClick={() => rollAbilityAttack(ability)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-1 rounded text-[10px]"
                          >
                            Acerto
                          </button>
                          <button
                            onClick={() => castAbility(ability)}
                            className="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold py-1 rounded text-[10px]"
                          >
                            Usar / Dano
                          </button>
                        </div>

                        {/* ALÇA DE REDIMENSIONAMENTO */}
                        <div
                          onPointerDown={(e) => handleResizePointerDown(e, ability)}
                          onPointerMove={(e) => handleResizePointerMove(e, ability.id)}
                          onPointerUp={handleResizePointerUp}
                          className="absolute bottom-0.5 right-0.5 w-4 h-4 cursor-se-resize flex items-center justify-center text-cyan-500/60 hover:text-amber-400"
                          title="Clique e arraste para redimensionar"
                        >
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 16 16">
                            <path d="M14 14H10V12H12V10H14V14ZM14 8H12V6H14V8ZM8 14H6V12H8V14Z" />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* PASSIVAS & BUFFS */}
        {activeTab === 'passivas' && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Passivas e Buffs
              </h2>
              <button
                onClick={() => {
                  setEditingPassiveId(null);
                  const limits = getAbilityCategoryLimits('Simples', charInfo.controlLevel);
                  setNewPassive({
                    name: '',
                    category: 'Simples',
                    reservedEnergy: limits.minCost,
                    active: false,
                    effect: '',
                    desc: '',
                  });
                  setIsPassiveModalOpen(true);
                }}
                className="bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded text-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar Passiva/Buff
              </button>
            </div>

            {passives.length === 0 ? (
              <div className="text-center text-sm text-slate-500 border border-dashed border-slate-700 rounded-lg p-8">
                Nenhuma passiva ou buff cadastrado.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {passives.map((passive) => {
                  const badgeColor = getCategoryBadgeColor(passive.category);

                  return (
                    <div
                      key={passive.id}
                      className={`bg-slate-950 border-2 ${
                        passive.active
                          ? 'border-amber-400 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                          : 'border-slate-800'
                      } rounded-lg p-4 space-y-3 transition-all`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] border px-2 py-0.5 rounded font-bold uppercase ${badgeColor}`}
                            >
                              {passive.category || 'Simples'}
                            </span>
                            <span className="text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                              ⚡ Reduz da Máx: {passive.reservedEnergy || 0}
                            </span>
                          </div>
                          <h3 className="font-bold text-amber-300 mt-2">
                            {passive.name}
                          </h3>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => editPassive(passive)}
                            className="text-slate-500 hover:text-amber-400"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (passive.active) {
                                setEnergy((e) => ({
                                  ...e,
                                  max: e.max + (Number(passive.reservedEnergy) || 0),
                                }));
                              }
                              setPassives(
                                passives.filter((p) => p.id !== passive.id)
                              );
                            }}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {passive.effect && (
                        <p className="text-xs text-cyan-300">
                          Efeito: {passive.effect}
                        </p>
                      )}

                      {passive.desc && (
                        <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                          {passive.desc}
                        </p>
                      )}

                      <button
                        onClick={() => togglePassiveActive(passive.id)}
                        className={`w-full py-2 rounded text-xs font-bold transition-all ${
                          passive.active
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {passive.active
                          ? `ATIVA (Reduzindo ${passive.reservedEnergy || 0}⚡ do Máx)`
                          : 'INATIVA (Clique para Ativar)'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* INVENTÁRIO */}
        {activeTab === 'inventario' && (
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
                <Backpack className="w-5 h-5" /> Inventário
              </h2>
              <div className="flex gap-3 items-center">
                <div className="bg-slate-950 border border-amber-500/30 px-3 py-2 rounded">
                  <span className="text-amber-400 text-sm">💰 PO:</span>
                  <input
                    type="number"
                    value={gold}
                    onChange={(e) => setGold(Number(e.target.value) || 0)}
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
                  <PackagePlus className="w-4 h-4 inline" /> Adicionar
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
                    className="bg-slate-950 border border-slate-800 rounded p-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          {item.name}{' '}
                          <span className="text-slate-500">x{item.qty}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => editItem(item)}
                          className="text-slate-500 hover:text-amber-400"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setInventory(
                              inventory.filter((i) => i.id !== item.id)
                            )
                          }
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {item.desc && (
                      <p className="text-xs text-slate-400 mt-2 border-t border-slate-800/80 pt-2">
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ANOTAÇÕES */}
        {activeTab === 'anotacoes' && (
          <div className="space-y-6">
            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2 mb-4">
                <Scroll className="w-5 h-5" /> História do Personagem
              </h2>
              <textarea
                value={history}
                onChange={(e) => setHistory(e.target.value)}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 outline-none"
                placeholder="Escreva a história do personagem..."
              />
            </section>

            <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2 mb-4">
                <Scroll className="w-5 h-5" /> Anotações Gerais
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 outline-none"
                placeholder="Anotações de campanha, pistas e lembretes..."
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

      {/* POPUP DE RESULTADO */}
      {activeRollResult && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="flex justify-between">
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Resultado
              </p>
              <button onClick={() => setActiveRollResult(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-300">{activeRollResult.label}</p>

            <p className="text-sm font-mono text-cyan-300 bg-slate-950 p-2 rounded border border-slate-800">
              {activeRollResult.breakdown}
            </p>

            <p className="text-6xl font-black text-amber-400">
              {activeRollResult.total}
            </p>
            <button
              onClick={() => setActiveRollResult(null)}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}

      {/* HISTÓRICO FLUTUANTE */}
      <div className="fixed bottom-4 right-4 z-40">
        {isHistoryOpen && (
          <div className="absolute bottom-14 right-0 bg-slate-900 border border-slate-800 rounded-xl p-4 w-80 max-h-80 overflow-y-auto shadow-2xl">
            <div className="flex justify-between border-b border-slate-800 pb-2 mb-2">
              <h3 className="text-xs font-bold text-amber-400">Histórico</h3>
              <button
                onClick={() => setRollHistory([])}
                className="text-xs text-rose-400"
              >
                Limpar
              </button>
            </div>
            {rollHistory.map((roll) => (
              <div
                key={roll.id}
                className="bg-slate-950 border border-slate-800 rounded p-2 mb-2 flex justify-between items-center"
              >
                <div>
                  <p className="text-xs font-semibold">{roll.label}</p>
                  <p className="text-[10px] text-cyan-400 font-mono">
                    {roll.breakdown}
                  </p>
                </div>
                <span className="text-amber-400 font-bold ml-2">{roll.total}</span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <History className="w-4 h-4" /> Histórico ({rollHistory.length})
        </button>
      </div>

      {/* MODAL DE ARMA */}
      {isWeaponModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-amber-400">Cadastrar Arma</h3>
              <button onClick={closeWeaponModal}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              value={newWeapon.name}
              onChange={(e) =>
                setNewWeapon({ ...newWeapon, name: e.target.value })
              }
              placeholder="Nome da arma"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />
            <input
              value={newWeapon.dmg}
              onChange={(e) =>
                setNewWeapon({ ...newWeapon, dmg: e.target.value })
              }
              placeholder="Dano: 1d8, 2d6 + 3..."
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />
            <textarea
              value={newWeapon.desc}
              onChange={(e) =>
                setNewWeapon({ ...newWeapon, desc: e.target.value })
              }
              placeholder="Descrição da arma..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm"
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

      {/* MODAL DE CADASTRAR/EDITAR HABILIDADE (SELEÇÃO DE DADOS E BÔNUS) */}
      {isAbilityModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-800/50 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-cyan-300">
                Cadastrar Habilidade
              </h3>
              <button onClick={closeAbilityModal}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              value={newAbility.name}
              onChange={(e) =>
                setNewAbility({ ...newAbility, name: e.target.value })
              }
              placeholder="Nome da habilidade"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm"
            />

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                Categoria da Habilidade
              </label>
              <select
                value={newAbility.category}
                onChange={(e) =>
                  setNewAbility({ ...newAbility, category: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-cyan-300 font-bold"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* CONFIGURAÇÃO DE DANO */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <label className="text-xs text-amber-400 font-bold block">
                Personalizar Rolagem de Dano
              </label>
              <div className="grid grid-cols-3 gap-2 items-center">
                <div>
                  <label className="text-[10px] text-slate-400 block">Qtd Dados</label>
                  <input
                    type="number"
                    min="1"
                    value={newAbility.dmgDiceQty}
                    onChange={(e) =>
                      setNewAbility({
                        ...newAbility,
                        dmgDiceQty: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-amber-300 font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block">Tipo Dado</label>
                  <select
                    value={newAbility.dmgDiceSides}
                    onChange={(e) =>
                      setNewAbility({
                        ...newAbility,
                        dmgDiceSides: Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-amber-300 font-bold"
                  >
                    <option value={4}>d4</option>
                    <option value={6}>d6</option>
                    <option value={8}>d8</option>
                    <option value={10}>d10</option>
                    <option value={12}>d12</option>
                    <option value={20}>d20</option>
                    <option value={100}>d100</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block">Bônus (+/-)</label>
                  <input
                    type="number"
                    value={newAbility.dmgBonus}
                    onChange={(e) =>
                      setNewAbility({
                        ...newAbility,
                        dmgBonus: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-amber-300 font-bold text-center"
                  />
                </div>
              </div>
            </div>

            <textarea
              value={newAbility.desc}
              onChange={(e) =>
                setNewAbility({ ...newAbility, desc: e.target.value })
              }
              placeholder="Descrição..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm"
            />

            <button
              onClick={saveAbility}
              className="w-full bg-cyan-500 text-slate-950 font-bold py-2 rounded"
            >
              Salvar Habilidade
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE USO DA HABILIDADE (COM ROLAGEM E BÔNUS PERSONALIZÁVEL) */}
      {abilityRollModal && (() => {
        const limits = getAbilityCategoryLimits(
          abilityRollModal.category || 'Simples',
          charInfo.controlLevel
        );

        return (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-cyan-500/40 rounded-xl p-6 max-w-md w-full space-y-5 shadow-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-cyan-300">
                      {abilityRollModal.name}
                    </h3>
                    <span
                      className={`text-[10px] border px-2 py-0.5 rounded font-bold uppercase ${getCategoryBadgeColor(
                        abilityRollModal.category
                      )}`}
                    >
                      {abilityRollModal.category || 'Simples'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Configure o custo e ajuste a rolagem antes de lançar
                  </p>
                </div>
                <button onClick={() => setAbilityRollModal(null)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                  <p className="text-xs text-slate-400">
                    Custo Base: <strong className="text-cyan-300">{limits.base}⚡</strong> por multiplicador
                  </p>
                  <p className="text-xs text-slate-400">
                    Faixa permitida ({abilityRollModal.category || 'Simples'}):{' '}
                    <strong className="text-amber-400">
                      {limits.minCost}⚡ até {limits.maxCost}⚡
                    </strong>
                  </p>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Custo de Energia Selecionado
                  </label>
                  <input
                    type="number"
                    min={limits.minCost}
                    max={limits.maxMult === 999 ? undefined : limits.maxCostNum}
                    value={abilityRollCost}
                    onChange={(e) =>
                      setAbilityRollCost(Number(e.target.value) || limits.minCost)
                    }
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-cyan-300 font-bold text-lg text-center"
                  />
                </div>

                {/* DADOS E BÔNUS DA HABILIDADE */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                  <label className="text-xs text-amber-400 font-bold block">
                    Ajustar Dano da Rolagem
                  </label>
                  <div className="grid grid-cols-3 gap-2 items-center">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Qtd Dados</label>
                      <input
                        type="number"
                        min="1"
                        value={abilityRollQty}
                        onChange={(e) =>
                          setAbilityRollQty(Math.max(1, Number(e.target.value) || 1))
                        }
                        className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-amber-300 font-bold text-center"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block">Lados</label>
                      <select
                        value={abilityRollSides}
                        onChange={(e) => setAbilityRollSides(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-amber-300 font-bold"
                      >
                        <option value={4}>d4</option>
                        <option value={6}>d6</option>
                        <option value={8}>d8</option>
                        <option value={10}>d10</option>
                        <option value={12}>d12</option>
                        <option value={20}>d20</option>
                        <option value={100}>d100</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block">Bônus (+/-)</label>
                      <input
                        type="number"
                        value={abilityRollBonus}
                        onChange={(e) => setAbilityRollBonus(Number(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 p-2 rounded text-xs text-amber-300 font-bold text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={confirmAbilityUse}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-3 rounded-lg shadow-lg"
              >
                Confirmar, Descontar {abilityRollCost}⚡ e Rolar {abilityRollQty}d{abilityRollSides}
                {abilityRollBonus > 0 ? `+${abilityRollBonus}` : abilityRollBonus < 0 ? abilityRollBonus : ''}
              </button>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE PASSIVA/BUFF */}
      {isPassiveModalOpen && (() => {
        const limits = getAbilityCategoryLimits(
          newPassive.category || 'Simples',
          charInfo.controlLevel
        );

        return (
          <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
              <div className="flex justify-between">
                <h3 className="text-lg font-bold text-amber-400">
                  Cadastrar Passiva / Buff
                </h3>
                <button onClick={closePassiveModal}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                value={newPassive.name}
                onChange={(e) =>
                  setNewPassive({ ...newPassive, name: e.target.value })
                }
                placeholder="Nome da passiva ou buff"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm"
              />

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Categoria
                </label>
                <select
                  value={newPassive.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    const catLimits = getAbilityCategoryLimits(
                      cat,
                      charInfo.controlLevel
                    );
                    setNewPassive({
                      ...newPassive,
                      category: cat,
                      reservedEnergy: catLimits.minCost,
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm text-amber-300 font-bold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <p className="text-xs text-slate-400">
                  Custo Base: <strong className="text-cyan-300">{limits.base}⚡</strong> por multiplicador
                </p>
                <p className="text-xs text-slate-400">
                  Faixa permitida ({newPassive.category || 'Simples'}):{' '}
                  <strong className="text-amber-400">
                    {limits.minCost}⚡ até {limits.maxCost}⚡
                  </strong>
                </p>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Energia a Reservar (Reduzirá da Energia MÁXIMA)
                </label>
                <input
                  type="number"
                  min={limits.minCost}
                  max={limits.maxMult === 999 ? undefined : limits.maxCostNum}
                  value={newPassive.reservedEnergy}
                  onChange={(e) =>
                    setNewPassive({
                      ...newPassive,
                      reservedEnergy: Number(e.target.value) || limits.minCost,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm font-bold text-cyan-300 text-center"
                />
              </div>

              <input
                value={newPassive.effect}
                onChange={(e) =>
                  setNewPassive({ ...newPassive, effect: e.target.value })
                }
                placeholder="Efeito (ex: +2 Defesa, Visão Noturna)"
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm"
              />

              <textarea
                value={newPassive.desc}
                onChange={(e) =>
                  setNewPassive({ ...newPassive, desc: e.target.value })
                }
                placeholder="Descrição detalhada..."
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm"
              />

              <button
                onClick={savePassive}
                className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded"
              >
                Salvar Passiva
              </button>
            </div>
          </div>
        );
      })()}

      {/* MODAL DE ITEM */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex justify-between">
              <h3 className="text-lg font-bold text-amber-400">Cadastrar Item</h3>
              <button onClick={closeItemModal}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
              placeholder="Nome do item"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />
            <input
              type="number"
              min="1"
              value={newItem.qty}
              onChange={(e) =>
                setNewItem({ ...newItem, qty: Number(e.target.value) || 1 })
              }
              placeholder="Quantidade"
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded"
            />
            <textarea
              value={newItem.desc}
              onChange={(e) =>
                setNewItem({ ...newItem, desc: e.target.value })
              }
              placeholder="Descrição do item..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-sm"
            />
            <button
              onClick={saveItem}
              className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded"
            >
              Salvar Item
            </button>
          </div>
        </div>
      )}

    </div>
  );
}