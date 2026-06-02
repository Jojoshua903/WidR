// ===== CHARACTER DATA AND CONSTANTS =====

// ===== GAME SETTINGS (KEYBINDS & SENSITIVITY) =====
const DEFAULT_BINDS = {
  forward:  'KeyW',
  backward: 'KeyS',
  left:     'KeyA',
  right:    'KeyD',
  drift:    'Space',
  useItem:  'KeyE'
};

const BIND_LABELS = {
  forward:  'VOORUIT',
  backward: 'ACHTERUIT',
  left:     'LINKS',
  right:    'RECHTS',
  drift:    'DRIFT',
  useItem:  'ITEM GEBRUIKEN'
};

const gameSettings = {
  binds: { ...DEFAULT_BINDS },
  steerSensitivity: 1.0,
  cameraZoom: 1.0,

  load() {
    try {
      let saved = localStorage.getItem('widr_kart_settings');
      if (saved) {
        let data = JSON.parse(saved);
        if (data.binds) Object.assign(this.binds, data.binds);
        if (data.steerSensitivity != null) this.steerSensitivity = data.steerSensitivity;
        if (data.cameraZoom != null) this.cameraZoom = data.cameraZoom;
      }
    } catch(e) {}
  },

  save() {
    try {
      localStorage.setItem('widr_kart_settings', JSON.stringify({
        binds: this.binds,
        steerSensitivity: this.steerSensitivity,
        cameraZoom: this.cameraZoom
      }));
    } catch(e) {}
  },

  reset() {
    this.binds = { ...DEFAULT_BINDS };
    this.steerSensitivity = 1.0;
    this.cameraZoom = 1.0;
    this.save();
  }
};
gameSettings.load();

function keyCodeToLabel(code) {
  if (!code) return '---';
  if (code === 'Space') return 'SPATIE';
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  if (code.startsWith('Arrow')) return code.slice(5).toUpperCase();
  if (code === 'ShiftLeft' || code === 'ShiftRight') return 'SHIFT';
  if (code === 'ControlLeft' || code === 'ControlRight') return 'CTRL';
  if (code === 'AltLeft' || code === 'AltRight') return 'ALT';
  if (code === 'Tab') return 'TAB';
  if (code === 'Enter') return 'ENTER';
  return code.toUpperCase();
}

const DEFAULT_MEMBERS = [
  { id:'josh', name:'Josh Ibrahim', emoji:'👑', title:'Admin & Oprichter', desc:'Houdt van rankings, polls en orde proberen te houden, maar raakt uiteindelijk altijd betrokken bij de chaos.', group:'admin', color:'#F5C518', stats: { speed: 6, accel: 8, weight: 8, handling: 8 } },
  { id:'lors', name:'Lors Jocohobo', emoji:'🃏', title:'Professionele Ragebaiter', desc:'Sticker-spammer en professionele troller. Houdt ervan om gesprekken expres chaotischer te maken en overal een grap van te maken.', group:'kern', color:'#E94560', stats: { speed: 8, accel: 10, weight: 4, handling: 6 } },
  { id:'fionn', name:'Fionn', emoji:'😑', title:'Sarcasme Expert', desc:'Droge humor en sarcastische opmerkingen. Reageert alsof hij klaar is met de groep, maar doet altijd mee aan de onzin.', group:'kern', color:'#16C79A', stats: { speed: 10, accel: 6, weight: 8, handling: 4 } },
  { id:'nath', name:'Nathananiel', emoji:'😤', title:'Frustratie Master', desc:'Master van overdreven frustratie. Reageert alsof alles hem irriteert, wat juist voor veel humor zorgt.', group:'kern', color:'#FF6B6B', stats: { speed: 8, accel: 10, weight: 6, handling: 4 } },
  { id:'reshman', name:'Reshman', emoji:'🌀', title:'Agent of Chaos', desc:'Onvoorspelbaar en chaotisch. Stuurt random Engelse reacties, stickers en opmerkingen die uit het niets komen.', group:'kern', color:'#845EC2', stats: { speed: 9, accel: 5, weight: 6, handling: 10 } },
  { id:'daniel', name:'Daniël', emoji:'💀', title:'Absurdist', desc:'Specialist in ongemakkelijke en absurde grappen. Staat bekend om zijn interacties met Meta AI en bizarre scenario\'s.', group:'kern', color:'#FF9A3C', stats: { speed: 6, accel: 8, weight: 10, handling: 8 } },
  { id:'milo', name:'Milo Van Der Meijs', emoji:'🧊', title:'Storyteller', desc:'Relaxte deelnemer die regelmatig droge humor toevoegt. Kan van de kleinste gebeurtenis een groot verhaal maken.', group:'kern', color:'#0F3460', stats: { speed: 8, accel: 6, weight: 8, handling: 8 } },
  { id:'adam', name:'Adam', emoji:'🎯', title:'Sticker Spammer', desc:'Sticker-spammer en professionele troller. Houdt ervan om gesprekken expres chaotischer te maken en overal een grap van te maken.', group:'kern', color:'#E94560', stats: { speed: 8, accel: 8, weight: 6, handling: 6 } },
  { id:'metaai', name:'Meta AI', emoji:'🤖', title:'GC Legende', desc:'Ere-lid van de groep. Werd voortdurend getrolld, misleid en gebruikt voor fanfictions, waardoor het een belangrijk onderdeel van de gc-lore werd.', group:'ere', color:'#16C79A', stats: { speed: 10, accel: 10, weight: 2, handling: 2 } },
  { id:'maciek', name:'Maciek', emoji:'⚡', title:'Surprise Element', desc:'Minder actief dan de kernleden, maar verschijnt regelmatig met onverwachte opmerkingen en reacties.', group:'stil', color:'#888899', stats: { speed: 9, accel: 8, weight: 6, handling: 6 } },
  { id:'denize', name:'Denize', emoji:'🌙', title:'Stille Waarnemer', desc:'Rustige deelnemer die af en toe opduikt in gesprekken en groepsactiviteiten. Bekend van zijn "tot morgen" uitspraak.', group:'stil', color:'#555566', stats: { speed: 6, accel: 6, weight: 6, handling: 10 } },
  { id:'sichen', name:'Sichen Ping', emoji:'🔮', title:'Mythisch Lid', desc:'Zelden actief, maar wel onderdeel van de groep en de lore.', group:'stil', color:'#444455', stats: { speed: 8, accel: 8, weight: 8, handling: 8 } }
];

const ITEMS = {
  BOOST: { name: 'Meta AI Boost', emoji: '🤖', desc: 'Instant speed boost' },
  BOMB: { name: 'Ragebait Bom', emoji: '💣', desc: 'Bounces off walls, spins out targets' },
  STICKER: { name: 'Sticker Trap', emoji: '🃏', desc: 'banana trap' },
  SHIELD: { name: 'Sarcasm Shield', emoji: '🛡️', desc: 'Blocks one attack' },
  LIGHTNING: { name: 'Lightning GC', emoji: '⚡', desc: 'Slows down all opponents' }
};

const STICKER_MEME_TEXTS = [
  "Niemand vroeg hierom 😂",
  "RAGEBAIT!",
  "Wat in de ranking is dit?",
  "CHOOPPEDDD 💀",
  "Meta AI is typing...",
  "Tot morgen! 🌙",
  "Is dit een poll?",
  "0 consensus.",
  "Sticker Spam! 🃏"
];

// ===== SOUND SYNTHESIZER (WEB AUDIO API) =====
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.engineOsc = null;
    this.engineGain = null;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.startEngineSound();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.ctx) {
      if (this.enabled) {
        this.ctx.resume();
      } else {
        this.ctx.suspend();
      }
    }
    return this.enabled;
  }

  playTone(freq, type, duration, volume = 0.1) {
    if (!this.enabled || !this.ctx) return;
    try {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e){}
  }

  playExplosion() {
    if (!this.enabled || !this.ctx) return;
    try {
      let bufferSize = this.ctx.sampleRate * 0.4;
      let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      let data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      let noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      let filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.4);

      let gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch(e){}
  }

  playChime() {
    this.playTone(523.25, 'sine', 0.15, 0.15); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.15, 0.15), 80); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.3, 0.15), 160); // G5
  }

  playCountdownBeep(high = false) {
    this.playTone(high ? 880 : 440, 'triangle', 0.12, 0.2);
  }

  playDriftSqueal() {
    // Short chirping sound for starting/maintaining drifts
    this.playTone(600 + Math.random() * 200, 'square', 0.05, 0.03);
  }

  playBoost() {
    if (!this.enabled || !this.ctx) return;
    try {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch(e){}
  }

  startEngineSound() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // Low engine growl
      
      this.engineGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      
      // Filter for low pass
      let filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);

      this.engineOsc.connect(filter);
      filter.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      
      this.engineOsc.start();
    } catch(e){}
  }

  setEngineSpeed(speedRatio) {
    if (!this.enabled || !this.ctx || !this.engineOsc) return;
    try {
      let targetFreq = 45 + (speedRatio * 150);
      this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
      
      let targetVol = 0.02 + (speedRatio * 0.05);
      this.engineGain.gain.setTargetAtTime(targetVol, this.ctx.currentTime, 0.1);
    } catch(e){}
  }
}

const soundSynth = new SoundSynthesizer();

// ===== TRACK DEFINITIONS (Scaled 2x, detailed backgrounds) =====
const TRACKS = {
  chatroom: {
    name: 'Chatroom Circuit',
    emoji: '💬',
    bgColor: '#128C7E',
    offroadColor: '#075E54',
    roadColor: '#ECE5DD',
    lineWidth: 320,
    startGrid: [
      { x: 2600, y: 720, angle: 0 },
      { x: 2600, y: 880, angle: 0 },
      { x: 2440, y: 720, angle: 0 },
      { x: 2440, y: 880, angle: 0 },
      { x: 2280, y: 720, angle: 0 },
      { x: 2280, y: 880, angle: 0 },
      { x: 2120, y: 720, angle: 0 },
      { x: 2120, y: 880, angle: 0 }
    ],
    checkpoints: [
      { x: 2000, y: 800 },
      { x: 4400, y: 800 },
      { x: 4400, y: 3200 },
      { x: 2000, y: 3200 }
    ],
    boxLocations: [
      { x: 3200, y: 800 },
      { x: 4400, y: 2000 },
      { x: 3200, y: 3200 },
      { x: 2000, y: 2000 },
      { x: 3800, y: 1200 },
      { x: 2600, y: 2800 }
    ],
    drawCustomBackground: (ctx) => {
      // Chat bubble decorations
      function drawBubble(x, y, w, h, color, text, isRight) {
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 20);
        ctx.fill();
        if (isRight) {
          ctx.beginPath();
          ctx.moveTo(x + w - 30, y + h);
          ctx.lineTo(x + w - 10, y + h + 20);
          ctx.lineTo(x + w - 50, y + h);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(x + 30, y + h);
          ctx.lineTo(x + 10, y + h + 20);
          ctx.lineTo(x + 50, y + h);
          ctx.fill();
        }
        ctx.fillStyle = isRight ? '#fff' : '#111';
        ctx.font = "bold 36px sans-serif";
        ctx.fillText(text, x + 20, y + h/2 + 12);
        ctx.restore();
      }
      drawBubble(300, 1200, 900, 80, 'rgba(37,211,102,0.25)', "Lors: RAGEBAIT! 🔥🔥🔥", true);
      drawBubble(2600, 900, 1000, 80, 'rgba(255,255,255,0.12)', "Josh: Kappen met stickers! 👑", false);
      drawBubble(4200, 2400, 850, 80, 'rgba(37,211,102,0.25)', "Daniël: Meta AI zegt... 🤖", true);
      drawBubble(400, 2600, 800, 80, 'rgba(255,255,255,0.12)', "Fionn: Boeiend. 😑", false);
      drawBubble(1800, 1800, 950, 80, 'rgba(37,211,102,0.2)', "Reshman: hahaha random 🌀", true);
      drawBubble(3600, 1600, 700, 80, 'rgba(255,255,255,0.1)', "Nath: DIT IS ZO IRR 😤", false);
      drawBubble(800, 3200, 750, 80, 'rgba(37,211,102,0.2)', "Adam: *sticker* 🃏", true);
      drawBubble(5000, 1200, 800, 80, 'rgba(255,255,255,0.1)', "Milo: Toen was het zo... 🧊", false);

      // Scattered emojis across the field
      ctx.globalAlpha = 0.08;
      ctx.font = "120px sans-serif";
      let emojis = ['💬','📱','🔔','✅','👑','🃏','😑','😤','🌀','💀'];
      let positions = [[500,600],[1600,500],[3000,1500],[4800,800],[5200,3000],[700,2800],[3400,3400],[4600,2200],[1200,2200],[3800,600]];
      positions.forEach((pos,i) => { ctx.fillText(emojis[i % emojis.length], pos[0], pos[1]); });
      ctx.globalAlpha = 1;

      // "Online" status dots
      ctx.fillStyle = 'rgba(37, 211, 102, 0.15)';
      [[600,1000],[2800,700],[4000,2800],[1400,3000]].forEach(p => {
        ctx.beginPath(); ctx.arc(p[0], p[1], 15, 0, Math.PI*2); ctx.fill();
      });
    },
    getPath: () => {
      let p = new Path2D();
      p.moveTo(2000, 800);
      p.lineTo(4400, 800);
      p.arc(4400, 2000, 1200, -Math.PI/2, Math.PI/2);
      p.lineTo(2000, 3200);
      p.arc(2000, 2000, 1200, Math.PI/2, -Math.PI/2);
      p.closePath();
      return p;
    }
  },
  ragebait: {
    name: 'Ragebait Runway',
    emoji: '🔥',
    bgColor: '#0f0f18',
    offroadColor: '#2d0912',
    roadColor: '#1e1b24',
    lineWidth: 300,
    startGrid: [
      { x: 1800, y: 840, angle: -0.15 },
      { x: 1800, y: 980, angle: -0.15 },
      { x: 1640, y: 860, angle: -0.15 },
      { x: 1640, y: 1000, angle: -0.15 },
      { x: 1480, y: 880, angle: -0.15 },
      { x: 1480, y: 1020, angle: -0.15 },
      { x: 1320, y: 900, angle: -0.15 },
      { x: 1320, y: 1040, angle: -0.15 }
    ],
    checkpoints: [
      { x: 1000, y: 1000 },
      { x: 5400, y: 1000 },
      { x: 5400, y: 3000 },
      { x: 1000, y: 3000 }
    ],
    boxLocations: [
      { x: 3200, y: 840 },
      { x: 5400, y: 2000 },
      { x: 3200, y: 3100 },
      { x: 1000, y: 2000 },
      { x: 4200, y: 1400 },
      { x: 2200, y: 2600 }
    ],
    drawCustomBackground: (ctx) => {
      // Hazard grid lines
      ctx.strokeStyle = "rgba(233, 69, 96, 0.12)";
      ctx.lineWidth = 4;
      for (let i = 0; i < 6400; i += 250) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 4000); ctx.stroke();
      }
      for (let i = 0; i < 4000; i += 250) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(6400, i); ctx.stroke();
      }
      // Hazard stripe diagonals
      ctx.strokeStyle = "rgba(233, 69, 96, 0.06)";
      ctx.lineWidth = 40;
      for (let i = -4000; i < 10400; i += 500) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 4000, 4000); ctx.stroke();
      }
      // Glowing warning text
      ctx.save();
      ctx.fillStyle = "#E94560";
      ctx.font = "bold 180px sans-serif";
      ctx.shadowColor = "#E94560";
      ctx.shadowBlur = 40;
      ctx.fillText("⚠️ CRITICAL RAGE ⚠️", 800, 1900);
      ctx.font = "bold 100px sans-serif";
      ctx.shadowBlur = 20;
      ctx.fillText("TRIGGER WARNING ZONE", 1400, 2150);
      ctx.restore();
      // Fire emojis scattered
      ctx.globalAlpha = 0.1;
      ctx.font = "140px sans-serif";
      [[400,600],[2000,500],[4000,800],[5600,1600],[5200,3200],[1000,3400],[3000,3600],[4400,2600],[800,2200],[3600,1200]].forEach(p => {
        ctx.fillText('🔥', p[0], p[1]);
      });
      ctx.globalAlpha = 1;
      // Skull warning signs
      ctx.globalAlpha = 0.07;
      ctx.font = "200px sans-serif";
      ctx.fillText('💀', 2800, 2000);
      ctx.fillText('☠️', 4600, 1400);
      ctx.globalAlpha = 1;
    },
    getPath: () => {
      let p = new Path2D();
      p.moveTo(1000, 1000);
      p.bezierCurveTo(2800, 200, 3600, 1800, 5400, 1000);
      p.lineTo(5400, 3000);
      p.bezierCurveTo(3600, 3800, 2800, 2200, 1000, 3000);
      p.closePath();
      return p;
    }
  },
  matrix: {
    name: 'Meta AI Matrix',
    emoji: '🤖',
    bgColor: '#02060c',
    offroadColor: '#01151e',
    roadColor: '#0b1f2d',
    lineWidth: 280,
    startGrid: [
      { x: 1700, y: 640, angle: -0.083 },
      { x: 1700, y: 800, angle: -0.083 },
      { x: 1540, y: 650, angle: -0.083 },
      { x: 1540, y: 810, angle: -0.083 },
      { x: 1380, y: 660, angle: -0.083 },
      { x: 1380, y: 820, angle: -0.083 },
      { x: 1220, y: 670, angle: -0.083 },
      { x: 1220, y: 830, angle: -0.083 }
    ],
    checkpoints: [
      { x: 800, y: 800 },
      { x: 3200, y: 600 },
      { x: 5600, y: 1200 },
      { x: 4800, y: 2400 },
      { x: 1600, y: 3400 }
    ],
    boxLocations: [
      { x: 2000, y: 700 },
      { x: 4400, y: 900 },
      { x: 5200, y: 1800 },
      { x: 2800, y: 3300 },
      { x: 1100, y: 2700 },
      { x: 3600, y: 2000 }
    ],
    drawCustomBackground: (ctx) => {
      // Dense digital grid
      ctx.strokeStyle = "rgba(22, 199, 154, 0.07)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 6400; i += 80) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 4000); ctx.stroke();
      }
      for (let i = 0; i < 4000; i += 80) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(6400, i); ctx.stroke();
      }
      // Circuit board traces
      ctx.strokeStyle = "rgba(22, 199, 154, 0.12)";
      ctx.lineWidth = 6;
      [[800,400,2400,400],[2400,400,2400,1200],[4000,600,4000,2000],[4000,2000,5600,2000],[1200,2800,3200,2800],[3200,2800,3200,3600]].forEach(l => {
        ctx.beginPath(); ctx.moveTo(l[0],l[1]); ctx.lineTo(l[2],l[3]); ctx.stroke();
      });
      // Glowing circuit nodes
      ctx.fillStyle = "rgba(22, 199, 154, 0.2)";
      [[2400,400],[2400,1200],[4000,600],[4000,2000],[5600,2000],[1200,2800],[3200,2800],[3200,3600]].forEach(n => {
        ctx.beginPath(); ctx.arc(n[0], n[1], 10, 0, Math.PI*2); ctx.fill();
      });
      // Binary text columns
      ctx.fillStyle = "#16C79A";
      ctx.globalAlpha = 0.06;
      ctx.font = "bold 30px Courier New";
      for (let col = 0; col < 6400; col += 400) {
        let binary = '';
        for (let r = 0; r < 30; r++) binary += Math.random() > 0.5 ? '1' : '0';
        for (let ch = 0; ch < binary.length; ch++) {
          ctx.fillText(binary[ch], col, 100 + ch * 130);
        }
      }
      ctx.globalAlpha = 1;
      // Main text
      ctx.fillStyle = "#16C79A";
      ctx.font = "bold 100px Courier New";
      ctx.globalAlpha = 0.15;
      ctx.fillText("01001101 01000101 01010100 01000001", 800, 1600);
      ctx.fillText("SYSTEM STATUS: ABSURDITY DETECTED", 1000, 1800);
      ctx.font = "bold 60px Courier New";
      ctx.fillText(">> ERROR: TOO MUCH CHAOS IN GC <<", 1600, 2200);
      ctx.globalAlpha = 1;
      // Robot emoji decorations
      ctx.globalAlpha = 0.08;
      ctx.font = "160px sans-serif";
      [[600,1200],[3400,800],[5000,2600],[1800,3200],[4200,3400]].forEach(p => {
        ctx.fillText('🤖', p[0], p[1]);
      });
      ctx.globalAlpha = 1;
    },
    getPath: () => {
      let p = new Path2D();
      p.moveTo(800, 800);
      p.lineTo(3200, 600);
      p.lineTo(5600, 1200);
      p.lineTo(4800, 2400);
      p.lineTo(4000, 3200);
      p.lineTo(1600, 3400);
      p.lineTo(600, 2000);
      p.closePath();
      return p;
    }
  },
  sticker: {
    name: 'Sticker Speedway',
    emoji: '🃏',
    bgColor: '#1a0a2e',
    offroadColor: '#2a1040',
    roadColor: '#3d2060',
    lineWidth: 300,
    startGrid: [
      { x: 1800, y: 700, angle: 0.2 },
      { x: 1800, y: 860, angle: 0.2 },
      { x: 1640, y: 720, angle: 0.2 },
      { x: 1640, y: 880, angle: 0.2 },
      { x: 1480, y: 740, angle: 0.2 },
      { x: 1480, y: 900, angle: 0.2 },
      { x: 1320, y: 760, angle: 0.2 },
      { x: 1320, y: 920, angle: 0.2 }
    ],
    checkpoints: [
      { x: 1200, y: 800 },
      { x: 3200, y: 600 },
      { x: 5200, y: 1400 },
      { x: 5000, y: 3000 },
      { x: 3200, y: 3400 },
      { x: 1000, y: 2400 }
    ],
    boxLocations: [
      { x: 2200, y: 680 },
      { x: 4200, y: 1000 },
      { x: 5200, y: 2200 },
      { x: 4000, y: 3200 },
      { x: 2000, y: 3000 },
      { x: 1000, y: 1600 }
    ],
    drawCustomBackground: (ctx) => {
      // Sticker-covered chaos background
      ctx.globalAlpha = 0.06;
      ctx.font = "200px sans-serif";
      let stickers = ['🃏','😂','💀','🗿','🤡','👀','🎭','🤣','😈','🐸'];
      let stickerPos = [[400,800],[2000,500],[3600,900],[5000,600],[5400,2000],[4400,3200],[2800,3600],[800,3000],[1600,2000],[3200,1600],[4800,2800],[600,1400],[3800,2400],[2400,1200],[1200,2600]];
      stickerPos.forEach((p,i) => { ctx.fillText(stickers[i % stickers.length], p[0], p[1]); });
      ctx.globalAlpha = 1;
      // Neon glow circles
      ctx.save();
      [[2000,1200,'#845EC2'],[4000,2000,'#E94560'],[3000,3000,'#F5C518'],[5000,1000,'#16C79A'],[1400,2800,'#FF9A3C']].forEach(c => {
        let grad = ctx.createRadialGradient(c[0], c[1], 0, c[0], c[1], 400);
        grad.addColorStop(0, c[2] + '18');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(c[0]-400, c[1]-400, 800, 800);
      });
      ctx.restore();
      // Floating text
      ctx.save();
      ctx.fillStyle = 'rgba(132, 94, 194, 0.12)';
      ctx.font = 'bold 80px sans-serif';
      ctx.fillText('STICKER SPAM ZONE 🃏🃏🃏', 1000, 1800);
      ctx.fillText('ADAM WAS HERE', 3400, 2600);
      ctx.fillText('LORS APPROVED ✅', 800, 2400);
      ctx.restore();
    },
    getPath: () => {
      let p = new Path2D();
      p.moveTo(1200, 800);
      p.bezierCurveTo(2200, 400, 3000, 500, 3800, 600);
      p.bezierCurveTo(4600, 700, 5200, 1000, 5400, 1600);
      p.bezierCurveTo(5600, 2200, 5200, 2800, 5000, 3200);
      p.bezierCurveTo(4600, 3600, 3800, 3500, 3200, 3400);
      p.bezierCurveTo(2400, 3300, 1600, 3200, 1000, 2800);
      p.bezierCurveTo(600, 2400, 500, 1800, 600, 1400);
      p.bezierCurveTo(700, 1000, 900, 900, 1200, 800);
      p.closePath();
      return p;
    }
  },
  poll: {
    name: 'Poll Pitstop',
    emoji: '📊',
    bgColor: '#0a1628',
    offroadColor: '#0d2040',
    roadColor: '#1a3050',
    lineWidth: 310,
    startGrid: [
      { x: 1600, y: 900, angle: 0 },
      { x: 1600, y: 1060, angle: 0 },
      { x: 1440, y: 900, angle: 0 },
      { x: 1440, y: 1060, angle: 0 },
      { x: 1280, y: 900, angle: 0 },
      { x: 1280, y: 1060, angle: 0 },
      { x: 1120, y: 900, angle: 0 },
      { x: 1120, y: 1060, angle: 0 }
    ],
    checkpoints: [
      { x: 1000, y: 1000 },
      { x: 3200, y: 600 },
      { x: 5400, y: 1000 },
      { x: 5400, y: 2600 },
      { x: 3200, y: 3400 },
      { x: 1000, y: 2800 }
    ],
    boxLocations: [
      { x: 2100, y: 750 },
      { x: 4300, y: 780 },
      { x: 5400, y: 1800 },
      { x: 4300, y: 3100 },
      { x: 2100, y: 3200 },
      { x: 1000, y: 1900 }
    ],
    drawCustomBackground: (ctx) => {
      // Bar chart decorations
      ctx.globalAlpha = 0.08;
      let barColors = ['#E94560','#F5C518','#16C79A','#845EC2','#FF9A3C','#0F3460'];
      for (let g = 0; g < 4; g++) {
        let baseX = 800 + g * 1500;
        let baseY = 1400 + g * 400;
        for (let b = 0; b < 6; b++) {
          let h = 200 + Math.random() * 600;
          ctx.fillStyle = barColors[b % barColors.length];
          ctx.fillRect(baseX + b * 80, baseY - h, 60, h);
        }
      }
      ctx.globalAlpha = 1;
      // Poll question labels
      ctx.save();
      ctx.fillStyle = 'rgba(245, 197, 24, 0.1)';
      ctx.font = 'bold 70px sans-serif';
      ctx.fillText('📊 WIE IS DE BESTE RACER?', 800, 1200);
      ctx.fillText('🏆 RANKING UPDATE: CHAOS', 2800, 2600);
      ctx.font = 'bold 50px sans-serif';
      ctx.fillStyle = 'rgba(22, 199, 154, 0.1)';
      ctx.fillText('OPTIE A: JOSH  OPTIE B: LORS  OPTIE C: NIEMAND', 1000, 2000);
      ctx.fillText('0 CONSENSUS BEREIKT', 3000, 1600);
      ctx.restore();
      // Voting checkmarks scattered
      ctx.globalAlpha = 0.06;
      ctx.font = '160px sans-serif';
      [[600,700],[3000,500],[5000,1400],[4600,3200],[1400,3200],[2400,2200]].forEach(p => {
        ctx.fillText(Math.random() > 0.5 ? '✅' : '❌', p[0], p[1]);
      });
      ctx.globalAlpha = 1;
      // Percentage indicators
      ctx.save();
      ctx.globalAlpha = 0.07;
      ctx.font = 'bold 240px sans-serif';
      ctx.fillStyle = '#F5C518';
      ctx.fillText('69%', 1800, 1800);
      ctx.fillStyle = '#E94560';
      ctx.fillText('31%', 3800, 2800);
      ctx.restore();
    },
    getPath: () => {
      let p = new Path2D();
      p.moveTo(1000, 1000);
      p.lineTo(2200, 600);
      p.lineTo(3800, 600);
      p.lineTo(5400, 1000);
      p.lineTo(5400, 2600);
      p.lineTo(3800, 3400);
      p.lineTo(2200, 3400);
      p.lineTo(1000, 2800);
      p.closePath();
      return p;
    }
  },
  nacht: {
    name: 'Tot Morgen Nachtrace',
    emoji: '🌙',
    bgColor: '#050510',
    offroadColor: '#0a0a20',
    roadColor: '#151530',
    lineWidth: 290,
    startGrid: [
      { x: 2200, y: 700, angle: 0.4 },
      { x: 2200, y: 860, angle: 0.4 },
      { x: 2040, y: 730, angle: 0.4 },
      { x: 2040, y: 890, angle: 0.4 },
      { x: 1880, y: 760, angle: 0.4 },
      { x: 1880, y: 920, angle: 0.4 },
      { x: 1720, y: 790, angle: 0.4 },
      { x: 1720, y: 950, angle: 0.4 }
    ],
    checkpoints: [
      { x: 1800, y: 800 },
      { x: 4200, y: 800 },
      { x: 5600, y: 2000 },
      { x: 4400, y: 3400 },
      { x: 2000, y: 3400 },
      { x: 800, y: 2000 }
    ],
    boxLocations: [
      { x: 3000, y: 780 },
      { x: 5000, y: 1400 },
      { x: 5200, y: 2800 },
      { x: 3200, y: 3500 },
      { x: 1200, y: 2800 },
      { x: 1000, y: 1400 }
    ],
    drawCustomBackground: (ctx) => {
      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 200; i++) {
        let sx = Math.random() * 6400;
        let sy = Math.random() * 4000;
        let sr = 1 + Math.random() * 2;
        ctx.globalAlpha = 0.1 + Math.random() * 0.2;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // Moon
      ctx.save();
      let moonGrad = ctx.createRadialGradient(5200, 600, 0, 5200, 600, 250);
      moonGrad.addColorStop(0, 'rgba(245, 237, 200, 0.15)');
      moonGrad.addColorStop(0.5, 'rgba(245, 237, 200, 0.06)');
      moonGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGrad;
      ctx.fillRect(4950, 350, 500, 500);
      ctx.fillStyle = 'rgba(245, 237, 200, 0.12)';
      ctx.beginPath();
      ctx.arc(5200, 600, 100, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // Streetlamp glow pools along road
      ctx.save();
      [[2000,800],[3400,700],[4800,1200],[5400,2400],[4600,3200],[3000,3500],[1600,3200],[800,2200],[900,1200]].forEach(l => {
        let glow = ctx.createRadialGradient(l[0], l[1], 0, l[0], l[1], 300);
        glow.addColorStop(0, 'rgba(255, 200, 80, 0.06)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.fillRect(l[0]-300, l[1]-300, 600, 600);
      });
      ctx.restore();
      // "Tot morgen" text messages floating
      ctx.save();
      ctx.fillStyle = 'rgba(85, 85, 102, 0.12)';
      ctx.font = 'bold 60px sans-serif';
      ctx.fillText('tot morgen 🌙', 1200, 1600);
      ctx.fillText('tot morgen 🌙', 3600, 2400);
      ctx.fillText('tot morgen 🌙', 2400, 3000);
      ctx.fillStyle = 'rgba(85, 85, 102, 0.08)';
      ctx.font = 'bold 100px sans-serif';
      ctx.fillText('💤 SLAAPMODE GEACTIVEERD 💤', 1400, 2200);
      ctx.fillText('ZZZ...', 4800, 1800);
      ctx.restore();
      // Sleep emojis
      ctx.globalAlpha = 0.06;
      ctx.font = '180px sans-serif';
      [[800,600],[3200,400],[5400,1000],[4000,2800],[1600,3400],[2600,1400]].forEach(p => {
        ctx.fillText(['🌙','⭐','💤','🌠','🌑','✨'][Math.floor(Math.random()*6)], p[0], p[1]);
      });
      ctx.globalAlpha = 1;
    },
    getPath: () => {
      let p = new Path2D();
      p.moveTo(1800, 800);
      p.bezierCurveTo(2600, 500, 3600, 500, 4200, 800);
      p.bezierCurveTo(5000, 1200, 5800, 1600, 5600, 2200);
      p.bezierCurveTo(5400, 2800, 5000, 3200, 4400, 3400);
      p.bezierCurveTo(3600, 3600, 2600, 3600, 2000, 3400);
      p.bezierCurveTo(1400, 3200, 800, 2800, 700, 2200);
      p.bezierCurveTo(600, 1600, 800, 1200, 1200, 900);
      p.bezierCurveTo(1400, 800, 1600, 780, 1800, 800);
      p.closePath();
      return p;
    }
  }
};

// ===== DENSE WAYPOINTS GENERATOR FOR BOTS (2x scaled) =====
Object.keys(TRACKS).forEach(trackId => {
  let track = TRACKS[trackId];
  let wps = [];

  if (trackId === 'chatroom') {
    for (let x = 2000; x <= 4400; x += 80) {
      wps.push({ x, y: 800 });
    }
    for (let a = -Math.PI/2; a <= Math.PI/2; a += Math.PI/30) {
      wps.push({
        x: 4400 + 1200 * Math.cos(a),
        y: 2000 + 1200 * Math.sin(a)
      });
    }
    for (let x = 4400; x >= 2000; x -= 80) {
      wps.push({ x, y: 3200 });
    }
    for (let a = Math.PI/2; a <= 3*Math.PI/2; a += Math.PI/30) {
      wps.push({
        x: 2000 + 1200 * Math.cos(a),
        y: 2000 + 1200 * Math.sin(a)
      });
    }
  }
  else if (trackId === 'ragebait') {
    function getBezierPoint(t, p0, p1, p2, p3) {
      let u = 1 - t;
      let tt = t * t;
      let uu = u * u;
      let uuu = uu * u;
      let ttt = tt * t;
      return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
      };
    }
    let p0 = {x: 1000, y: 1000}, p1 = {x: 2800, y: 200}, p2 = {x: 3600, y: 1800}, p3 = {x: 5400, y: 1000};
    for (let t = 0; t <= 1.0; t += 0.015) {
      wps.push(getBezierPoint(t, p0, p1, p2, p3));
    }
    for (let y = 1000; y <= 3000; y += 80) {
      wps.push({ x: 5400, y });
    }
    let b0 = {x: 5400, y: 3000}, b1 = {x: 3600, y: 3800}, b2 = {x: 2800, y: 2200}, b3 = {x: 1000, y: 3000};
    for (let t = 0; t <= 1.0; t += 0.015) {
      wps.push(getBezierPoint(t, b0, b1, b2, b3));
    }
    for (let y = 3000; y >= 1000; y -= 80) {
      wps.push({ x: 1000, y });
    }
  }
  else if (trackId === 'matrix') {
    let pts = [
      { x: 800, y: 800 },
      { x: 3200, y: 600 },
      { x: 5600, y: 1200 },
      { x: 4800, y: 2400 },
      { x: 4000, y: 3200 },
      { x: 1600, y: 3400 },
      { x: 600, y: 2000 },
      { x: 800, y: 800 }
    ];
    for (let i = 0; i < pts.length - 1; i++) {
      let a = pts[i];
      let b = pts[i+1];
      let dist = Math.hypot(b.x - a.x, b.y - a.y);
      let steps = Math.floor(dist / 80);
      for (let s = 0; s < steps; s++) {
        let t = s / steps;
        wps.push({
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t
        });
      }
    }
  }
  else if (trackId === 'sticker') {
    function getBezierPtS(t, p0, p1, p2, p3) {
      let u = 1 - t, tt = t*t, uu = u*u, uuu = uu*u, ttt = tt*t;
      return { x: uuu*p0.x+3*uu*t*p1.x+3*u*tt*p2.x+ttt*p3.x, y: uuu*p0.y+3*uu*t*p1.y+3*u*tt*p2.y+ttt*p3.y };
    }
    let segs = [
      [{x:1200,y:800},{x:2200,y:400},{x:3000,y:500},{x:3800,y:600}],
      [{x:3800,y:600},{x:4600,y:700},{x:5200,y:1000},{x:5400,y:1600}],
      [{x:5400,y:1600},{x:5600,y:2200},{x:5200,y:2800},{x:5000,y:3200}],
      [{x:5000,y:3200},{x:4600,y:3600},{x:3800,y:3500},{x:3200,y:3400}],
      [{x:3200,y:3400},{x:2400,y:3300},{x:1600,y:3200},{x:1000,y:2800}],
      [{x:1000,y:2800},{x:600,y:2400},{x:500,y:1800},{x:600,y:1400}],
      [{x:600,y:1400},{x:700,y:1000},{x:900,y:900},{x:1200,y:800}]
    ];
    segs.forEach(s => {
      for (let t = 0; t <= 1.0; t += 0.015) {
        wps.push(getBezierPtS(t, s[0], s[1], s[2], s[3]));
      }
    });
  }
  else if (trackId === 'poll') {
    let pts = [
      {x:1000,y:1000},{x:2200,y:600},{x:3800,y:600},{x:5400,y:1000},
      {x:5400,y:2600},{x:3800,y:3400},{x:2200,y:3400},{x:1000,y:2800},
      {x:1000,y:1000}
    ];
    for (let i = 0; i < pts.length - 1; i++) {
      let a = pts[i], b = pts[i+1];
      let dist = Math.hypot(b.x-a.x, b.y-a.y);
      let steps = Math.floor(dist / 80);
      for (let s = 0; s < steps; s++) {
        let t = s / steps;
        wps.push({ x: a.x+(b.x-a.x)*t, y: a.y+(b.y-a.y)*t });
      }
    }
  }
  else if (trackId === 'nacht') {
    function getBezierPtN(t, p0, p1, p2, p3) {
      let u = 1 - t, tt = t*t, uu = u*u, uuu = uu*u, ttt = tt*t;
      return { x: uuu*p0.x+3*uu*t*p1.x+3*u*tt*p2.x+ttt*p3.x, y: uuu*p0.y+3*uu*t*p1.y+3*u*tt*p2.y+ttt*p3.y };
    }
    let segs = [
      [{x:1800,y:800},{x:2600,y:500},{x:3600,y:500},{x:4200,y:800}],
      [{x:4200,y:800},{x:5000,y:1200},{x:5800,y:1600},{x:5600,y:2200}],
      [{x:5600,y:2200},{x:5400,y:2800},{x:5000,y:3200},{x:4400,y:3400}],
      [{x:4400,y:3400},{x:3600,y:3600},{x:2600,y:3600},{x:2000,y:3400}],
      [{x:2000,y:3400},{x:1400,y:3200},{x:800,y:2800},{x:700,y:2200}],
      [{x:700,y:2200},{x:600,y:1600},{x:800,y:1200},{x:1200,y:900}],
      [{x:1200,y:900},{x:1400,y:800},{x:1600,y:780},{x:1800,y:800}]
    ];
    segs.forEach(s => {
      for (let t = 0; t <= 1.0; t += 0.015) {
        wps.push(getBezierPtN(t, s[0], s[1], s[2], s[3]));
      }
    });
  }

  track.waypoints = wps.filter((wp, idx) => {
    if (idx === 0) return true;
    let prev = wps[idx-1];
    return Math.hypot(wp.x - prev.x, wp.y - prev.y) > 1;
  });
});

// ===== PARTICLE SYSTEM =====
class Particle {
  constructor(x, y, vx, vy, color, size, maxLife, type = 'spark') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.life = maxLife;
    this.maxLife = maxLife;
    this.type = type; // spark, smoke, boost
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.type === 'smoke') {
      this.size += 0.2;
      this.vx *= 0.95;
      this.vy *= 0.95;
    }
  }

  draw(ctx) {
    ctx.save();
    let alpha = this.life / this.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    if (this.type === 'smoke') {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
    ctx.restore();
  }
}

// ===== LOCAL GAME MANAGER =====
class GameManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.offscreenCanvas = null;
    this.offscreenCtx = null;
    
    // UI elements
    this.screens = {};
    this.activeScreen = 'screen-menu';
    
    // State
    this.isMultiplayer = false;
    this.roomCode = '';
    this.isHost = false;
    this.selectedCharacter = null;
    this.selectedTrackId = 'chatroom';
    
    // Game execution state
    this.localPlayer = null;
    this.players = []; // Contains local, remote, and bots karts
    this.itemBoxes = [];
    this.projectiles = [];
    this.traps = [];
    this.particles = [];
    this.countdown = 3;
    this.raceState = 'lobby'; // lobby, counting, racing, finished
    this.startTime = 0;
    this.gameLoopId = null;
    
    // Touch control state
    this.touchActive = false;
    this.joystickPos = { x: 0, y: 0 };
    this.touchSteer = 0; // -1 to 1
    
    // Keys pressed
    this.keys = {};

    // Pause state
    this.isPaused = false;
    this.listeningForKeybind = null;
  }

  init() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Setup offscreen canvas for track boundary/terrain testing
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = 6400;
    this.offscreenCanvas.height = 4000;
    this.offscreenCtx = this.offscreenCanvas.getContext('2d');

    // Register screen DOM IDs
    ['screen-menu', 'screen-lobby', 'screen-game'].forEach(id => {
      this.screens[id] = document.getElementById(id);
    });

    // Keyboard handlers
    window.addEventListener('keydown', (e) => {
      // Audio synth init must happen on a user interaction
      soundSynth.init();

      // Keybind listening mode
      if (this.listeningForKeybind) {
        e.preventDefault();
        if (e.code !== 'Escape') {
          gameSettings.binds[this.listeningForKeybind] = e.code;
          gameSettings.save();
        }
        this.listeningForKeybind = null;
        this.renderKeybindList();
        return;
      }

      // ESC pause toggle
      if (e.code === 'Escape') {
        if (document.getElementById('modal-options').classList.contains('active')) {
          this.closeOptions();
          return;
        }
        if (this.activeScreen === 'screen-game' && (this.raceState === 'racing' || this.raceState === 'counting')) {
          if (this.isPaused) {
            this.resumeGame();
          } else {
            this.pauseGame();
          }
          return;
        }
      }

      if (this.isPaused) return;

      this.keys[e.code] = true;

      // Item action
      if (e.code === gameSettings.binds.useItem || e.code === 'Space') {
        if (this.raceState === 'racing' && this.localPlayer) {
          this.localPlayer.useItem();
        }
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mobile control triggers
    this.setupTouchControls();
    
    // Lobby UI Actions
    document.getElementById('btn-create-room').addEventListener('click', () => this.handleCreateRoom());
    document.getElementById('btn-join-room').addEventListener('click', () => this.handleJoinRoom());
    document.getElementById('btn-leave-lobby').addEventListener('click', () => this.handleLeaveLobby());
    document.getElementById('btn-solo-race').addEventListener('click', () => this.handleStartSolo());
    document.getElementById('btn-toggle-ready').addEventListener('click', () => this.handleToggleReady());
    document.getElementById('btn-start-game').addEventListener('click', () => this.handleHostStartRace());
    document.getElementById('btn-lobby-return').addEventListener('click', () => this.handleReturnToLobby());
    document.getElementById('btn-main-menu').addEventListener('click', () => this.handleReturnToMenu());

    // Sound toggle
    document.getElementById('btn-toggle-sound').addEventListener('click', (e) => {
      soundSynth.init();
      let active = soundSynth.toggle();
      e.target.textContent = active ? '🔊' : '🔇';
    });

    // Setup Track clicks
    document.querySelectorAll('.track-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (this.isMultiplayer && !this.isHost) return; // Only host select
        let trackId = card.getAttribute('data-track');
        this.setTrack(trackId);
        
        // Sync track choice to multiplayer room
        if (this.isMultiplayer && window.firebaseSync) {
          window.firebaseSync.updateRoomSettings({ trackId });
        }
      });
    });

    this.renderCharacterGrid();

    // Pause & Options menu listeners
    document.getElementById('btn-resume').addEventListener('click', () => this.resumeGame());
    document.getElementById('btn-open-options').addEventListener('click', () => this.openOptions());
    document.getElementById('btn-pause-quit').addEventListener('click', () => {
      this.resumeGame();
      this.handleReturnToMenu();
    });
    document.getElementById('btn-close-options').addEventListener('click', () => this.closeOptions());
    document.getElementById('btn-reset-defaults').addEventListener('click', () => {
      gameSettings.reset();
      this.syncOptionsUI();
      this.renderKeybindList();
    });
    document.getElementById('btn-menu-options').addEventListener('click', () => {
      document.getElementById('modal-options').classList.add('active');
      this.syncOptionsUI();
      this.renderKeybindList();
    });

    document.getElementById('slider-steer').addEventListener('input', (e) => {
      gameSettings.steerSensitivity = parseInt(e.target.value) / 100;
      document.getElementById('val-steer').textContent = gameSettings.steerSensitivity.toFixed(2) + 'x';
    });
    document.getElementById('slider-zoom').addEventListener('input', (e) => {
      gameSettings.cameraZoom = parseInt(e.target.value) / 100;
      document.getElementById('val-zoom').textContent = gameSettings.cameraZoom.toFixed(2) + 'x';
    });

    this.renderKeybindList();
    this.syncOptionsUI();

    // Fit canvas dynamically
    window.addEventListener('resize', () => this.resizeCanvas());
    this.resizeCanvas();
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  showScreen(screenId) {
    Object.keys(this.screens).forEach(id => {
      if (id === screenId) {
        this.screens[id].classList.add('active');
      } else {
        this.screens[id].classList.remove('active');
      }
    });
    this.activeScreen = screenId;
    
    // Close modals
    document.getElementById('modal-char-select').classList.remove('active');
    document.getElementById('modal-finish').classList.remove('active');
  }

  // Character selection render
  renderCharacterGrid() {
    let listPanel = document.getElementById('char-list');
    listPanel.innerHTML = DEFAULT_MEMBERS.map(m => `
      <div class="char-grid-card" id="char-card-${m.id}" onclick="gameManager.selectCharacterPreview('${m.id}')">
        <span class="char-card-emoji">${m.emoji}</span>
        <span class="char-card-name">${m.name.split(' ')[0]}</span>
      </div>
    `).join('');
    
    // Confirm character click
    document.getElementById('btn-confirm-character').addEventListener('click', () => {
      if (this.selectedCharacter) {
        document.getElementById('modal-char-select').classList.remove('active');
        
        if (this.isMultiplayer && window.firebaseSync) {
          window.firebaseSync.updatePlayerCharacter(this.selectedCharacter.id);
        } else {
          // In offline, we immediately show ready
          this.localPlayerCharacterId = this.selectedCharacter.id;
          this.renderOfflineLobbyList();
        }
      }
    });
  }

  selectCharacterPreview(charId) {
    let char = DEFAULT_MEMBERS.find(m => m.id === charId);
    if (!char) return;
    
    this.selectedCharacter = char;
    
    // Highlight active card
    document.querySelectorAll('.char-grid-card').forEach(card => card.classList.remove('selected'));
    document.getElementById(`char-card-${charId}`).classList.add('selected');
    
    // Fill preview panel
    let previewPanel = document.getElementById('char-detail-preview');
    previewPanel.innerHTML = `
      <div class="preview-header">
        <div class="preview-emoji">${char.emoji}</div>
        <div class="preview-title-area">
          <h3>${char.name}</h3>
          <p style="color: ${char.color}">${char.title}</p>
        </div>
      </div>
      <p class="preview-desc">${char.desc}</p>
      <div class="preview-special">
        <strong>SPECIAAL ITEM</strong>
        ${char.id === 'josh' ? 'Orde Handhaving: Verwijder direct alle modder-slowdowns en activeer een speed-schild.' : ''}
        ${char.id === 'lors' ? 'Ragebait Sticker: Plak een reusachtige meme-sticker over de schermen van je tegenstanders.' : ''}
        ${char.id === 'fionn' ? 'Sarcastic Sigh: Een aura dat omliggende karts permanent vertraagt zolang ze dichtbij zijn.' : ''}
        ${char.id === 'nath' ? 'Frustratie Explosie: Creëer een schokgolf die tegenstanders ver achteruit schopt.' : ''}
        ${char.id === 'reshman' ? 'Chaos Teleport: Teleporteer direct een stuk naar voren of swap je positie.' : ''}
        ${char.id === 'daniel' ? 'Absurd Schild: Roep een magisch schedelschild op die alle wapens weert.' : ''}
        ${char.id === 'milo' ? 'Verhaallijn Spoor: Laat tekstballonnen achter op de weg die achtervolgers afremmen.' : ''}
        ${char.id === 'adam' ? 'Sticker Salvo: Schiet 3 stickers recht vooruit die karts laten tollen.' : ''}
        ${char.id === 'metaai' ? 'Bizarre Fanfic: Keer de besturing van de dichtstbijzijnde racer 3 seconden lang om.' : ''}
        ${char.id === 'maciek' ? 'Surprise Speed: Krijg direct een gigantische turbo boost.' : ''}
        ${char.id === 'denize' ? 'Tot Morgen: Word 3 seconden onzichtbaar en onkwetsbaar.' : ''}
        ${char.id === 'sichen' ? 'Mythische Magneet: Zuigt alle items in de buurt op en geeft een turbo.' : ''}
      </div>
      <div class="stats-container">
        ${this.renderStatRow('SPEED', char.stats.speed, '#FF6B6B')}
        ${this.renderStatRow('ACCEL', char.stats.accel, '#16C79A')}
        ${this.renderStatRow('WEIGHT', char.stats.weight, '#845EC2')}
        ${this.renderStatRow('HANDLING', char.stats.handling, '#F5C518')}
      </div>
    `;

    document.getElementById('btn-confirm-character').disabled = false;
  }

  renderStatRow(label, val, barColor) {
    return `
      <div class="stat-row">
        <span class="stat-label-short">${label}</span>
        <div class="stat-bar-outer">
          <div class="stat-bar-inner" style="width: ${val * 10}%; background-color: ${barColor}"></div>
        </div>
        <span class="stat-val">${val}</span>
      </div>
    `;
  }

  // Set selected track visuals
  setTrack(trackId) {
    this.selectedTrackId = trackId;
    document.querySelectorAll('.track-card').forEach(card => {
      if (card.getAttribute('data-track') === trackId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // Touch control logic
  setupTouchControls() {
    let joystickBase = document.getElementById('joystick-base');
    let joystickKnob = document.getElementById('joystick-knob');
    let touchControls = document.getElementById('touch-controls');
    
    // Enable mobile inputs if touch starts
    window.addEventListener('touchstart', () => {
      this.touchActive = true;
      touchControls.style.display = 'flex';
    }, { once: true });

    joystickBase.addEventListener('touchstart', (e) => {
      this.handleJoystickMove(e);
    });

    joystickBase.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.handleJoystickMove(e);
    });

    joystickBase.addEventListener('touchend', () => {
      joystickKnob.style.left = '35px';
      joystickKnob.style.top = '35px';
      this.touchSteer = 0;
      this.keys[gameSettings.binds.forward] = false;
    });

    document.getElementById('btn-mobile-drift').addEventListener('touchstart', () => {
      this.keys[gameSettings.binds.drift] = true;
    });
    document.getElementById('btn-mobile-drift').addEventListener('touchend', () => {
      this.keys[gameSettings.binds.drift] = false;
    });

    document.getElementById('btn-mobile-use').addEventListener('touchstart', () => {
      if (this.raceState === 'racing' && this.localPlayer) {
        this.localPlayer.useItem();
      }
    });
  }

  handleJoystickMove(e) {
    let rect = document.getElementById('joystick-base').getBoundingClientRect();
    let touch = e.touches[0];
    let cx = rect.left + rect.width / 2;
    let cy = rect.top + rect.height / 2;
    let dx = touch.clientX - cx;
    let dy = touch.clientY - cy;
    let dist = Math.sqrt(dx*dx + dy*dy);
    let maxDist = rect.width / 2;

    if (dist > maxDist) {
      dx = (dx / dist) * maxDist;
      dy = (dy / dist) * maxDist;
      dist = maxDist;
    }

    // Move knob visually
    let knob = document.getElementById('joystick-knob');
    knob.style.left = (35 + dx) + 'px';
    knob.style.top = (35 + dy) + 'px';

    // Steer mapping
    this.touchSteer = dx / maxDist; // -1 to 1
    
    // Throttle mapping: if pushing up
    if (dy < -20) {
      this.keys[gameSettings.binds.forward] = true;
      this.keys[gameSettings.binds.backward] = false;
    } else if (dy > 20) {
      this.keys[gameSettings.binds.backward] = true;
      this.keys[gameSettings.binds.forward] = false;
    } else {
      this.keys[gameSettings.binds.forward] = false;
      this.keys[gameSettings.binds.backward] = false;
    }
  }

  // ===== SINGLEPLAYER RACE SETUP =====
  handleStartSolo() {
    let nickname = document.getElementById('input-nickname').value.trim() || 'Racer';
    this.localPlayerName = nickname;
    this.isMultiplayer = false;
    this.isHost = true;
    
    // Default character Josh
    this.localPlayerCharacterId = 'josh';
    
    this.showScreen('screen-lobby');
    
    // Disable multi-only options
    document.getElementById('btn-toggle-ready').style.display = 'none';
    document.getElementById('btn-start-game').disabled = false;
    document.getElementById('btn-start-game').textContent = 'START SOLO RACE';
    document.getElementById('display-room-code').textContent = 'SOLO';
    document.getElementById('lobby-player-count').textContent = 'Offline Oefenronde';
    
    // Show character select
    document.getElementById('modal-char-select').classList.add('active');
    this.selectCharacterPreview('josh');
    
    this.renderOfflineLobbyList();
  }

  renderOfflineLobbyList() {
    let list = document.getElementById('lobby-players-list');
    let char = DEFAULT_MEMBERS.find(m => m.id === this.localPlayerCharacterId);
    list.innerHTML = `
      <div class="player-card is-self">
        <span class="player-emoji-avatar">${char.emoji}</span>
        <div class="player-info-text">
          <h4>${this.localPlayerName} <span class="host-tag">HOST</span></h4>
          <p>${char.name} - ${char.title}</p>
        </div>
        <span class="player-status ready">KLAAR</span>
      </div>
    `;
  }

  // ===== MULTIPLAYER ROOM TRIGGERS =====
  handleCreateRoom() {
    let nickname = document.getElementById('input-nickname').value.trim();
    if (!nickname) {
      alert("Vul eerst je naam in!");
      return;
    }
    
    this.isMultiplayer = true;
    this.isHost = true;
    this.localPlayerName = nickname;
    
    this.showScreen('screen-lobby');
    document.getElementById('btn-toggle-ready').style.display = 'block';
    document.getElementById('btn-start-game').disabled = true;
    
    // Trigger Firebase sync setup
    if (window.firebaseSync) {
      window.firebaseSync.createRoom(nickname);
    }
  }

  handleJoinRoom() {
    let nickname = document.getElementById('input-nickname').value.trim();
    let code = document.getElementById('input-room-code').value.trim().toUpperCase();
    
    if (!nickname) {
      alert("Vul eerst je naam in!");
      return;
    }
    if (code.length !== 4) {
      alert("Voer een geldige 4-cijferige room code in!");
      return;
    }
    
    this.isMultiplayer = true;
    this.isHost = false;
    this.localPlayerName = nickname;
    
    this.showScreen('screen-lobby');
    document.getElementById('btn-toggle-ready').style.display = 'block';
    
    // Disable track/bot changes for non-host
    document.getElementById('select-bots').disabled = true;
    document.getElementById('btn-start-game').style.display = 'none';
    
    // Trigger Firebase sync connect
    if (window.firebaseSync) {
      window.firebaseSync.joinRoom(code, nickname);
    }
  }

  handleLeaveLobby() {
    if (this.isMultiplayer && window.firebaseSync) {
      window.firebaseSync.leaveRoom();
    }
    this.showScreen('screen-menu');
    // Reset options
    document.getElementById('select-bots').disabled = false;
    document.getElementById('btn-start-game').style.display = 'block';
    document.getElementById('btn-start-game').disabled = true;
  }

  handleToggleReady() {
    if (this.isMultiplayer && window.firebaseSync) {
      window.firebaseSync.toggleReady();
    }
  }

  handleHostStartRace() {
    // Generate AI Bot racers count
    let botCount = parseInt(document.getElementById('select-bots').value);
    
    if (this.isMultiplayer) {
      if (window.firebaseSync) {
        window.firebaseSync.startRace(botCount);
      }
    } else {
      // Start offline race
      this.startRaceGameplay(botCount);
    }
  }

  handleReturnToLobby() {
    document.getElementById('modal-finish').classList.remove('active');
    
    if (this.isMultiplayer) {
      if (window.firebaseSync) {
        window.firebaseSync.resetRoomToLobby();
      }
    } else {
      this.showScreen('screen-lobby');
    }
  }

  handleReturnToMenu() {
    this.handleLeaveLobby();
  }

  // ===== CORE RACE ENGINE INITIALIZATION =====
  startRaceGameplay(botCount) {
    this.showScreen('screen-game');
    this.raceState = 'counting';
    this.countdown = 3;
    
    this.projectiles = [];
    this.traps = [];
    this.particles = [];
    this.players = [];

    // Pre-draw the collision path onto the offscreen collision canvas
    this.renderCollisionMask();

    // 1. Setup local player
    let localChar = DEFAULT_MEMBERS.find(m => m.id === (this.isMultiplayer ? window.firebaseSync.localPlayerCharId : this.localPlayerCharacterId)) || DEFAULT_MEMBERS[0];
    
    this.localPlayer = new Kart(
      350, 150, // Starting coordinate on road
      localChar,
      false, // Not bot
      this.localPlayerName,
      this.isMultiplayer ? window.firebaseSync.playerId : 'player'
    );
    this.players.push(this.localPlayer);

    // 2. Setup other players (Multiplayer or bots)
    if (this.isMultiplayer) {
      // Sync remote human racers
      Object.keys(window.firebaseSync.playersData).forEach(pId => {
        if (pId !== window.firebaseSync.playerId) {
          let p = window.firebaseSync.playersData[pId];
          let char = DEFAULT_MEMBERS.find(m => m.id === p.characterId) || DEFAULT_MEMBERS[0];
          let remoteKart = new Kart(350, 150, char, false, p.nickname, pId);
          this.players.push(remoteKart);
        }
      });
      
      // Sync host-generated bots in multiplayer
      if (window.firebaseSync.roomData.bots) {
        window.firebaseSync.roomData.bots.forEach(bot => {
          let char = DEFAULT_MEMBERS.find(m => m.id === bot.characterId) || DEFAULT_MEMBERS[0];
          let botKart = new Kart(350, 150, char, true, bot.name, bot.id);
          this.players.push(botKart);
        });
      }
    } else {
      // Add local bots
      let availableChars = DEFAULT_MEMBERS.filter(m => m.id !== this.localPlayerCharacterId);
      for (let i = 0; i < botCount; i++) {
        let char = availableChars[i % availableChars.length];
        let botKart = new Kart(350, 150, char, true, char.name.split(' ')[0] + " Bot", 'bot-' + i);
        this.players.push(botKart);
      }
    }

    // Grid positions setup using track starting definitions
    let trackDef = TRACKS[this.selectedTrackId];
    this.players.forEach((p, idx) => {
      let gridPos = trackDef.startGrid[idx % trackDef.startGrid.length];
      p.x = gridPos.x;
      p.y = gridPos.y;
      p.angle = gridPos.angle;
    });

    // Initialize bot waypoint indices to nearest waypoint
    this.players.forEach(p => {
      if (p.isBot && trackDef.waypoints) {
        let minDist = Infinity;
        let minIdx = 0;
        trackDef.waypoints.forEach((wp, idx) => {
          let d = Math.hypot(wp.x - p.x, wp.y - p.y);
          if (d < minDist) { minDist = d; minIdx = idx; }
        });
        p.wpIndex = minIdx;
      }
    });

    // 3. Setup track items
    this.itemBoxes = trackDef.boxLocations.map((loc, idx) => ({
      id: 'box-' + idx,
      x: loc.x,
      y: loc.y,
      radius: 20,
      active: true,
      respawnTimer: 0
    }));

    // Start countdown beeps
    this.triggerCountdownSequence();

    // Start loop
    if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
    this.lastTime = performance.now();
    this.gameLoop();
  }

  renderCollisionMask() {
    let trackDef = TRACKS[this.selectedTrackId];
    this.offscreenCtx.fillStyle = '#000000'; // Grass default
    this.offscreenCtx.fillRect(0, 0, 6400, 4000);

    // Wall bounds drawn in Red
    this.offscreenCtx.strokeStyle = '#FF0000';
    this.offscreenCtx.lineWidth = trackDef.lineWidth + 20; // 10px borders
    this.offscreenCtx.lineJoin = 'round';
    this.offscreenCtx.lineCap = 'round';
    this.offscreenCtx.stroke(trackDef.getPath());

    // Drivable road drawn in White
    this.offscreenCtx.strokeStyle = '#FFFFFF';
    this.offscreenCtx.lineWidth = trackDef.lineWidth;
    this.offscreenCtx.stroke(trackDef.getPath());
  }

  triggerCountdownSequence() {
    let cdText = document.getElementById('countdown-text');
    let cdOverlay = document.getElementById('game-countdown');
    cdOverlay.classList.add('active');
    cdText.textContent = "3";
    soundSynth.playCountdownBeep(false);

    setTimeout(() => {
      cdText.textContent = "2";
      soundSynth.playCountdownBeep(false);
    }, 1000);

    setTimeout(() => {
      cdText.textContent = "1";
      soundSynth.playCountdownBeep(false);
    }, 2000);

    setTimeout(() => {
      cdText.textContent = "GO!";
      soundSynth.playCountdownBeep(true);
      this.raceState = 'racing';
      this.startTime = performance.now();
    }, 3000);

    setTimeout(() => {
      cdOverlay.classList.remove('active');
    }, 4500);
  }

  // ===== PROJECTILE & TRAP ACTIONS =====
  spawnProjectile(x, y, angle, ownerId) {
    this.projectiles.push({
      x, y,
      vx: Math.cos(angle) * 14,
      vy: Math.sin(angle) * 14,
      radius: 12,
      ownerId,
      bounces: 4
    });
  }

  spawnTrap(x, y, ownerId) {
    this.traps.push({
      x, y,
      radius: 15,
      ownerId
    });
  }

  // Zap all front players with lightning
  zapOpponents(ownerId) {
    let owner = this.players.find(p => p.id === ownerId);
    if (!owner) return;
    
    // Sort players by track progress
    let ownerProgress = this.getPlayerProgress(owner);
    
    this.players.forEach(p => {
      if (p.id !== ownerId) {
        let pProg = this.getPlayerProgress(p);
        // If they are ahead of us
        if (pProg > ownerProgress) {
          p.stunTimer = 180; // longer slow/shrink stun
          p.isShrunk = true;
          // Spawn lighting sparkles locally
          for (let k = 0; k < 12; k++) {
            this.particles.push(new Particle(p.x, p.y, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, '#845EC2', 6, 25));
          }
        }
      }
    });
    soundSynth.playExplosion();
  }

  getPlayerProgress(player) {
    return player.lap * 10 + player.checkpoint;
  }

  // ===== PAUSE & OPTIONS MENUS =====
  pauseGame() {
    this.isPaused = true;
    this.keys = {};
    document.getElementById('modal-pause').classList.add('active');
  }

  resumeGame() {
    this.isPaused = false;
    this.keys = {};
    document.getElementById('modal-pause').classList.remove('active');
    document.getElementById('modal-options').classList.remove('active');
    this.listeningForKeybind = null;
    this.lastTime = performance.now();
  }

  openOptions() {
    document.getElementById('modal-pause').classList.remove('active');
    document.getElementById('modal-options').classList.add('active');
    this.syncOptionsUI();
    this.renderKeybindList();
  }

  closeOptions() {
    gameSettings.save();
    document.getElementById('modal-options').classList.remove('active');
    this.listeningForKeybind = null;
    if (this.activeScreen === 'screen-game' && this.isPaused) {
      document.getElementById('modal-pause').classList.add('active');
    }
  }

  syncOptionsUI() {
    document.getElementById('slider-steer').value = Math.round(gameSettings.steerSensitivity * 100);
    document.getElementById('val-steer').textContent = gameSettings.steerSensitivity.toFixed(2) + 'x';
    document.getElementById('slider-zoom').value = Math.round(gameSettings.cameraZoom * 100);
    document.getElementById('val-zoom').textContent = gameSettings.cameraZoom.toFixed(2) + 'x';
  }

  renderKeybindList() {
    let container = document.getElementById('keybind-list');
    container.innerHTML = Object.keys(gameSettings.binds).map(action => {
      let isListening = this.listeningForKeybind === action;
      return `
        <div class="keybind-row">
          <span class="keybind-action">${BIND_LABELS[action]}</span>
          <span class="keybind-key ${isListening ? 'listening' : ''}"
                id="kb-${action}"
                onclick="gameManager.startKeybindListen('${action}')">
            ${isListening ? 'DRUK OP TOETS...' : keyCodeToLabel(gameSettings.binds[action])}
          </span>
        </div>
      `;
    }).join('');
  }

  startKeybindListen(action) {
    this.listeningForKeybind = action;
    this.renderKeybindList();
  }

  // ===== MAIN RENDER & PHYSICS LOOP =====
  gameLoop() {
    if (this.activeScreen !== 'screen-game') return;

    let now = performance.now();
    let dt = (now - this.lastTime) / 16.666;
    this.lastTime = now;

    if (!this.isPaused) {
      this.updatePhysics(dt);
    }
    this.renderGame();

    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  updatePhysics(dt) {
    let trackDef = TRACKS[this.selectedTrackId];

    // 1. Update racers
    this.players.forEach(p => {
      if (p.isBot) {
        p.updateBot(dt, this.offscreenCtx, trackDef);
      } else {
        // If local human player
        if (p.id === this.localPlayer.id) {
          // If in multiplayer, localPlayer physics are calculated locally,
          // then uploaded to Firebase
          p.updateLocal(dt, this.keys, this.touchSteer, this.offscreenCtx);
          
          if (this.isMultiplayer && window.firebaseSync) {
            window.firebaseSync.uploadPlayerState({
              x: p.x,
              y: p.y,
              angle: p.angle,
              speed: p.speed,
              isDrifting: p.isDrifting,
              lap: p.lap,
              checkpoint: p.checkpoint,
              finished: p.finished,
              finishTime: p.finishTime
            });
          }
        } else {
          // Remote players: position is synced via Firebase, interpolate their coordinates
          if (this.isMultiplayer && window.firebaseSync) {
            let syncData = window.firebaseSync.playersData[p.id];
            if (syncData) {
              // Interpolate smoothly
              p.x += (syncData.x - p.x) * 0.25 * dt;
              p.y += (syncData.y - p.y) * 0.25 * dt;
              p.angle = syncData.angle;
              p.speed = syncData.speed;
              p.isDrifting = syncData.isDrifting;
              p.lap = syncData.lap;
              p.checkpoint = syncData.checkpoint;
              p.finished = syncData.finished;
              p.finishTime = syncData.finishTime;
            }
          }
        }
      }

      // Check checkpoints for lap counting
      this.checkPlayerCheckpoints(p, trackDef);
    });

    // 2. Sort leaderboard standings
    this.updateRaceStandings();

    // 3. Update item boxes
    this.itemBoxes.forEach(box => {
      if (!box.active) {
        box.respawnTimer -= dt;
        if (box.respawnTimer <= 0) {
          box.active = true;
        }
      } else {
        // Collide with active players
        this.players.forEach(p => {
          if (!p.finished && p.item === null && !p.itemSpinning) {
            let dx = p.x - box.x;
            let dy = p.y - box.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < box.radius + 15) {
              box.active = false;
              box.respawnTimer = 300; // 5 seconds respawn
              p.triggerItemSpin();
              
              if (p.id === this.localPlayer.id) {
                soundSynth.playChime();
              }
            }
          }
        });
      }
    });

    // 4. Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      let proj = this.projectiles[i];
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // Sample collision canvas to bounce off walls
      let projSX = Math.max(0, Math.min(6399, Math.round(proj.x)));
      let projSY = Math.max(0, Math.min(3999, Math.round(proj.y)));
      let pix = this.offscreenCtx.getImageData(projSX, projSY, 1, 1).data;
      if (pix[0] === 255 && pix[1] === 0 && pix[2] === 0) { // hits RED wall
        // Reverse direction on bounce
        proj.vx = -proj.vx;
        proj.vy = -proj.vy;
        proj.bounces--;
        soundSynth.playTone(180, 'triangle', 0.08, 0.05);
        if (proj.bounces <= 0) {
          this.projectiles.splice(i, 1);
          continue;
        }
      }

      // Check hits on players
      let hitAny = false;
      this.players.forEach(p => {
        if (!p.finished && p.id !== proj.ownerId && p.stunTimer <= 0) {
          let dx = p.x - proj.x;
          let dy = p.y - proj.y;
          if (Math.sqrt(dx*dx + dy*dy) < p.radius + proj.radius) {
            hitAny = true;
            p.spinOut();
          }
        }
      });

      if (hitAny) {
        this.projectiles.splice(i, 1);
      }
    }

    // 5. Update traps
    for (let i = this.traps.length - 1; i >= 0; i--) {
      let trap = this.traps[i];
      let hitAny = false;
      this.players.forEach(p => {
        if (!p.finished && p.stunTimer <= 0) {
          let dx = p.x - trap.x;
          let dy = p.y - trap.y;
          if (Math.sqrt(dx*dx + dy*dy) < p.radius + trap.radius) {
            hitAny = true;
            p.spinOut();
            
            // If hit local player, trigger sticker screen-cover meme spam
            if (p.id === this.localPlayer.id) {
              this.triggerStickerSpamOverlay();
            }
          }
        }
      });

      if (hitAny) {
        this.traps.splice(i, 1);
      }
    }

    // 6. Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let part = this.particles[i];
      part.update();
      if (part.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // End condition
    if (this.localPlayer && this.localPlayer.finished && this.raceState === 'racing') {
      this.raceState = 'finished';
      this.showFinishLeaderboard();
    }
  }

  checkPlayerCheckpoints(p, trackDef) {
    let nextCpIdx = (p.checkpoint + 1) % trackDef.checkpoints.length;
    let nextCp = trackDef.checkpoints[nextCpIdx];
    
    let dx = p.x - nextCp.x;
    let dy = p.y - nextCp.y;
    let dist = Math.sqrt(dx*dx + dy*dy);
    
    // If player is within 180px of their next checkpoint
    if (dist < 350) {
      p.checkpoint = nextCpIdx;
      
      // Completed full circuit lap
      if (nextCpIdx === 0) {
        p.lap++;
        if (p.lap > 3) {
          p.finished = true;
          p.finishTime = Date.now() - this.startTime;
          p.speed = 0;
        }
        
        if (p.id === this.localPlayer.id) {
          document.getElementById('hud-lap').textContent = p.finished ? '3/3' : `${p.lap}/3`;
        }
      }
    }
  }

  updateRaceStandings() {
    // Sort players by Lap -> Checkpoint -> Distance to next Checkpoint
    let trackDef = TRACKS[this.selectedTrackId];
    
    let standings = [...this.players].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      
      let progressA = this.getPlayerProgress(a);
      let progressB = this.getPlayerProgress(b);
      
      if (progressA !== progressB) return progressB - progressA;
      
      // Distance to next checkpoint (smaller is better)
      let nextCpA = trackDef.checkpoints[(a.checkpoint + 1) % trackDef.checkpoints.length];
      let nextCpB = trackDef.checkpoints[(b.checkpoint + 1) % trackDef.checkpoints.length];
      
      let distA = Math.hypot(a.x - nextCpA.x, a.y - nextCpA.y);
      let distB = Math.hypot(b.x - nextCpB.x, b.y - nextCpB.y);
      
      return distA - distB;
    });

    // Update positions
    standings.forEach((p, idx) => {
      p.placement = idx + 1;
    });

    if (this.localPlayer) {
      let rankText = ["st", "nd", "rd", "th"][Math.min(this.localPlayer.placement - 1, 3)];
      document.getElementById('hud-position').textContent = `${this.localPlayer.placement}${rankText}`;
    }
  }

  showFinishLeaderboard() {
    let boardList = document.getElementById('finish-board-list');
    
    // Sort final players list
    let sorted = [...this.players].sort((a, b) => {
      if (a.finished && b.finished) return a.finishTime - b.finishTime;
      if (a.finished) return -1;
      if (b.finished) return 1;
      return this.getPlayerProgress(b) - this.getPlayerProgress(a);
    });

    boardList.innerHTML = sorted.map((p, idx) => {
      let timeStr = "--:--";
      if (p.finished) {
        let ms = Math.floor(p.finishTime % 1000).toString().padStart(3, '0');
        let sec = Math.floor((p.finishTime / 1000) % 60).toString().padStart(2, '0');
        let min = Math.floor(p.finishTime / 60000);
        timeStr = `${min}:${sec}.${ms}`;
      }
      return `
        <div class="board-row rank-${idx + 1}">
          <span class="board-rank">#${idx + 1}</span>
          <span class="board-emoji">${p.character.emoji}</span>
          <span class="board-name">${p.nickname}</span>
          <span class="board-time">${timeStr}</span>
        </div>
      `;
    }).join('');

    document.getElementById('finish-title').textContent = this.localPlayer.placement === 1 ? "GEWONNEN! 🏆" : "GEFINISHT! 🏁";
    document.getElementById('modal-finish').classList.add('active');
  }

  triggerStickerSpamOverlay() {
    let container = document.getElementById('sticker-spam-overlay');
    container.innerHTML = '';
    
    // Show 4 random stickers appearing on screen
    for (let i = 0; i < 4; i++) {
      let sticker = document.createElement('div');
      sticker.className = 'spam-sticker';
      sticker.textContent = STICKER_MEME_TEXTS[Math.floor(Math.random() * STICKER_MEME_TEXTS.length)];
      
      let x = 10 + Math.random() * 60;
      let y = 10 + Math.random() * 60;
      let rot = -20 + Math.random() * 40;
      
      sticker.style.left = x + '%';
      sticker.style.top = y + '%';
      sticker.style.setProperty('--rot', rot + 'deg');
      
      container.appendChild(sticker);
    }

    // Clear after 3 seconds
    setTimeout(() => {
      container.innerHTML = '';
    }, 3000);
  }

  renderGame() {
    let trackDef = TRACKS[this.selectedTrackId];
    
    // Background clear
    this.ctx.fillStyle = trackDef.bgColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.localPlayer) return;

    // Viewport camera matrix centering on player
    this.ctx.save();
    
    // Center camera
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    
    // Camera rotation matching player kart angle (facing up relative to screen)
    this.ctx.rotate(-this.localPlayer.angle - Math.PI/2);
    
    // Scale camera out slightly as speed increases
    let scaleRatio = (1 - (this.localPlayer.speed / 15) * 0.2) * gameSettings.cameraZoom;
    this.ctx.scale(scaleRatio, scaleRatio);
    
    // Center of player kart translated to origin
    this.ctx.translate(-this.localPlayer.x, -this.localPlayer.y);

    // 1. Draw track ground borders
    this.ctx.strokeStyle = trackDef.offroadColor;
    this.ctx.lineWidth = trackDef.lineWidth + 40;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.stroke(trackDef.getPath());

    // 2. Draw curbs/borders
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = trackDef.lineWidth + 10;
    this.ctx.setLineDash([20, 20]);
    this.ctx.stroke(trackDef.getPath());
    this.ctx.setLineDash([]); // reset

    // 3. Draw racetrack main road
    this.ctx.strokeStyle = trackDef.roadColor;
    this.ctx.lineWidth = trackDef.lineWidth;
    this.ctx.stroke(trackDef.getPath());

    // 4. Draw track markings (center dashed lines)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([30, 30]);
    this.ctx.stroke(trackDef.getPath());
    this.ctx.setLineDash([]);

    // 5. Draw finish line at the start/finish position
    this.ctx.save();
    let finishCp = trackDef.checkpoints[0];
    let finishAngle = trackDef.startGrid[0].angle;
    this.ctx.translate(finishCp.x, finishCp.y);
    this.ctx.rotate(finishAngle + Math.PI/2);
    this.ctx.fillStyle = '#FFFFFF';
    let halfWidth = Math.floor(trackDef.lineWidth / 2);
    for (let k = -halfWidth; k < halfWidth; k += 20) {
      this.ctx.fillStyle = ((k/20) % 2 === 0) ? '#000000' : '#FFFFFF';
      this.ctx.fillRect(-12, k, 24, 20);
    }
    this.ctx.restore();

    // Custom track background decorations
    trackDef.drawCustomBackground(this.ctx);

    // 6. Draw item boxes (spinning shapes)
    let boxAngle = (Date.now() / 600) % (Math.PI * 2);
    this.itemBoxes.forEach(box => {
      if (box.active) {
        this.ctx.save();
        this.ctx.translate(box.x, box.y);
        this.ctx.rotate(boxAngle);
        
        // Glassy cyan box
        this.ctx.fillStyle = 'rgba(22, 199, 154, 0.6)';
        this.ctx.strokeStyle = '#16C79A';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.rect(-15, -15, 30, 30);
        this.ctx.fill();
        this.ctx.stroke();

        // Inner question mark
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 20px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('?', 0, 0);
        this.ctx.restore();
      }
    });

    // 7. Draw traps
    this.traps.forEach(trap => {
      this.ctx.save();
      this.ctx.translate(trap.x, trap.y);
      this.ctx.font = '24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(ITEMS.STICKER.emoji, 0, 0);
      this.ctx.restore();
    });

    // 8. Draw projectiles
    this.projectiles.forEach(proj => {
      this.ctx.save();
      this.ctx.translate(proj.x, proj.y);
      this.ctx.font = '24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(ITEMS.BOMB.emoji, 0, 0);
      this.ctx.restore();
    });

    // 9. Draw particles
    this.particles.forEach(part => part.draw(this.ctx));

    // 10. Draw players/karts
    this.players.forEach(p => p.drawKart(this.ctx));

    this.ctx.restore(); // camera matrix

    // 11. Render Mini-Map Overlay in HUD
    this.drawMinimap(trackDef);
  }

  drawMinimap(trackDef) {
    let mapSize = 140;
    let margin = 30;
    let mapX = margin;
    let mapY = this.canvas.height - mapSize - margin;

    // Mini map backdrop
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(11, 11, 22, 0.7)';
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(mapX, mapY, mapSize, mapSize, 12);
    this.ctx.fill();
    this.ctx.stroke();

    // Draw down-scaled circuit path
    // Track bounds are 3200x2000, scale down to fit mapSize
    let scaleX = (mapSize - 20) / 6400;
    let scaleY = (mapSize - 20) / 4000;
    let scale = Math.min(scaleX, scaleY);

    this.ctx.translate(mapX + 10, mapY + 10);
    this.ctx.scale(scale, scale);

    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = trackDef.lineWidth;
    this.ctx.lineJoin = 'round';
    this.ctx.stroke(trackDef.getPath());

    // Draw dots for players
    this.players.forEach(p => {
      this.ctx.fillStyle = p.character.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.id === this.localPlayer.id ? 40 : 30, 0, Math.PI * 2);
      this.ctx.fill();
      
      // White highlight ring on local player
      if (p.id === this.localPlayer.id) {
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 15;
        this.ctx.stroke();
      }
    });

    this.ctx.restore();
  }
}

// ===== INDIVIDUAL RACER PHYSIC KART OBJECT =====
class Kart {
  constructor(x, y, character, isBot = false, nickname = 'Racer', id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.speed = 0;
    
    // Character reference
    this.character = character;
    this.isBot = isBot;
    this.nickname = nickname;
    
    this.radius = 16;
    this.finished = false;
    this.finishTime = 0;
    this.placement = 1;
    
    // Game loops checkpoints tracking
    this.lap = 1;
    this.checkpoint = 0;

    // Drifting metrics
    this.isDrifting = false;
    this.driftDirection = 0; // -1 Left, 1 Right
    this.driftPower = 0;
    
    // Timers
    this.boostTimer = 0;
    this.stunTimer = 0;
    this.isShrunk = false;

    // Bot waypoint tracking
    this.wpIndex = 0;

    // Item holding
    this.item = null;
    this.itemSpinning = false;
    this.itemSpinTimer = 0;

    // Character stats mapping (range: 1 - 10)
    let stats = character.stats;
    this.maxSpeed = 4.5 + (stats.speed * 0.35);
    this.accelPower = 0.06 + (stats.accel * 0.009);
    this.turnSpeed = 0.028 + (stats.handling * 0.003);
    this.dragFactor = 0.94 + (stats.weight * 0.003); // heavier karts have more momentum (less drag deceleration)
    this.steerVisual = 0;
  }

  updateLocal(dt, keys, touchSteer, offscreenCtx) {
    // 1. Process timers
    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      this.speed = 0;
      if (this.stunTimer <= 0) {
        this.isShrunk = false;
      }
      return;
    }

    if (this.boostTimer > 0) {
      this.boostTimer -= dt;
    }

    if (this.itemSpinning) {
      this.itemSpinTimer -= dt;
      let spinner = document.getElementById('hud-item-slot');
      let itemsList = Object.values(ITEMS);
      let randItem = itemsList[Math.floor(Math.random() * itemsList.length)];
      spinner.textContent = randItem.emoji;

      if (this.itemSpinTimer <= 0) {
        this.itemSpinning = false;
        // Assign final random item
        let randKeys = Object.keys(ITEMS);
        let finalItemKey = randKeys[Math.floor(Math.random() * randKeys.length)];
        this.item = finalItemKey;
        
        spinner.classList.add('has-item');
        spinner.textContent = ITEMS[finalItemKey].emoji;
      }
    }

    // 2. Sample offscreen track collision canvas
    let sampleX = Math.max(0, Math.min(6399, Math.round(this.x)));
    let sampleY = Math.max(0, Math.min(3999, Math.round(this.y)));
    let terrain = offscreenCtx.getImageData(sampleX, sampleY, 1, 1).data;
    let isOnRoad = (terrain[0] === 255 && terrain[1] === 255 && terrain[2] === 255); // White color
    let isWall = (terrain[0] === 255 && terrain[1] === 0 && terrain[2] === 0); // Red color

    if (isWall) {
      // Wall collision: bounce player back
      this.x -= Math.cos(this.angle) * (this.speed + 4);
      this.y -= Math.sin(this.angle) * (this.speed + 4);
      this.speed = -this.speed * 0.4; // reduce and reverse velocity
      soundSynth.playTone(220, 'triangle', 0.15, 0.1);
      return;
    }

    // Ground speed limits
    let effectiveMaxSpeed = this.maxSpeed;
    if (!isOnRoad) {
      effectiveMaxSpeed = 1.5; // grass drag reduction
      
      // Spawn mud splash green particles
      if (Math.abs(this.speed) > 0.5 && Math.random() < 0.25) {
        gameManager.particles.push(new Particle(this.x, this.y, -Math.cos(this.angle) * 3, -Math.sin(this.angle) * 3, '#075E54', 4, 15, 'smoke'));
      }
    }

    if (this.boostTimer > 0) {
      effectiveMaxSpeed = this.maxSpeed * 1.5;
    }

    // 3. Acceleration controls
    let throttle = 0;
    if (keys[gameSettings.binds.forward] || keys['ArrowUp']) throttle = 1;
    if (keys[gameSettings.binds.backward] || keys['ArrowDown']) throttle = -0.5;

    if (throttle > 0) {
      this.speed += this.accelPower * throttle * dt;
      if (this.speed > effectiveMaxSpeed) this.speed = effectiveMaxSpeed;
    } else if (throttle < 0) {
      this.speed += this.accelPower * throttle * dt;
      if (this.speed < -effectiveMaxSpeed/2) this.speed = -effectiveMaxSpeed/2;
    } else {
      // Natural deceleration drag friction
      this.speed *= Math.pow(isOnRoad ? this.dragFactor : 0.8, dt);
    }

    // Update sound engine frequency pitch
    if (this.id === gameManager.localPlayer.id) {
      soundSynth.setEngineSpeed(Math.abs(this.speed) / this.maxSpeed);
    }

    // 4. Handling / Steering mechanics
    let steering = 0;
    if (keys[gameSettings.binds.left] || keys['ArrowLeft']) steering = -1;
    if (keys[gameSettings.binds.right] || keys['ArrowRight']) steering = 1;

    // Override with touch input if active
    if (gameManager.touchActive) {
      steering = touchSteer;
    }

    // Apply sensitivity multiplier
    steering *= gameSettings.steerSensitivity;
    steering = Math.max(-1, Math.min(1, steering));

    // Steer scales with speed so you turn slower at zero or high speeds
    let steerScale = Math.min(Math.abs(this.speed) / 2.0, 1.2);
    if (this.speed < 0) steerScale = -steerScale; // invert turning when in reverse

    // Drift physics
    let isHoldingDrift = keys[gameSettings.binds.drift];
    if (isHoldingDrift && Math.abs(steering) > 0.1 && !this.isDrifting && this.speed > 3) {
      // Enter drift lock state
      this.isDrifting = true;
      this.driftDirection = steering > 0 ? 1 : -1;
      this.driftPower = 0;
      soundSynth.playDriftSqueal();
    }

    if (this.isDrifting) {
      // While drifting: angle changes, but kart slides sideways
      let driftFactor = 1.35;
      this.angle += this.turnSpeed * steering * steerScale * driftFactor * dt;

      // Charge drift power if steering into the turn
      if ((steering > 0 && this.driftDirection > 0) || (steering < 0 && this.driftDirection < 0)) {
        this.driftPower += dt;
        
        // Spawn sparks
        if (Math.random() < 0.35) {
          let sparkColor = '#0F3460'; // Blue default sparks
          if (this.driftPower > 80) sparkColor = '#F5C518'; // Orange/Gold sparks
          if (this.driftPower > 160) sparkColor = '#845EC2'; // Purple sparks
          
          let spawnAngle = this.angle + Math.PI + (Math.random() - 0.5) * 0.5;
          gameManager.particles.push(new Particle(
            this.x - Math.cos(this.angle) * 10,
            this.y - Math.sin(this.angle) * 10,
            Math.cos(spawnAngle) * 3, Math.sin(spawnAngle) * 3,
            sparkColor, 4, 15
          ));
        }

        // Play occasional tire screech tone
        if (Math.random() < 0.08) soundSynth.playDriftSqueal();
      }

      // Releasing drift triggers Mini-Turbo boost
      if (!isHoldingDrift || this.speed < 2.0) {
        this.isDrifting = false;
        if (this.driftPower > 80) {
          // Trigger Drift Speed Turbo
          let turboLength = this.driftPower > 160 ? 70 : 35; // long/short boost frames
          this.boostTimer = turboLength;
          soundSynth.playBoost();
          
          // Flame sparks particles
          for (let p = 0; p < 12; p++) {
            gameManager.particles.push(new Particle(this.x, this.y, -Math.cos(this.angle) * 5 + (Math.random() - 0.5)*3, -Math.sin(this.angle)*5 + (Math.random() - 0.5)*3, '#FF9A3C', 5, 25, 'boost'));
          }
        }
        this.driftPower = 0;
      }
    } else {
      // Normal turning mechanics
      this.angle += this.turnSpeed * steering * steerScale * dt;
    }

    // Update visual steering wheel/wheel angle smoothly
    let targetSteer = 0;
    if (this.isDrifting) {
      targetSteer = this.driftDirection * 0.45;
    } else if (Math.abs(steering) > 0.05) {
      targetSteer = steering * 0.35;
    }
    this.steerVisual += (targetSteer - this.steerVisual) * 0.25 * dt;

    // 5. Update coordinates
    // Direction vector of travel (differs if sliding in drift)
    let travelAngle = this.angle;
    if (this.isDrifting) {
      travelAngle = this.angle + (this.driftDirection * 0.35); // slip slide angle offset
    }

    this.x += Math.cos(travelAngle) * this.speed * dt;
    this.y += Math.sin(travelAngle) * this.speed * dt;

    // Exhaust smoke particles
    if (Math.abs(this.speed) > 0.1 && Math.random() < 0.12) {
      gameManager.particles.push(new Particle(
        this.x - Math.cos(this.angle) * 10,
        this.y - Math.sin(this.angle) * 10,
        -Math.cos(this.angle) * 1.5, -Math.sin(this.angle) * 1.5,
        'rgba(255,255,255,0.2)', 3, 20, 'smoke'
      ));
    }

    // Update speedometer text
    document.getElementById('hud-speed').textContent = Math.round(Math.abs(this.speed) * 18);
    
    // Spark drift fill bar
    let fill = document.getElementById('spark-fill');
    fill.style.width = Math.min((this.driftPower / 160) * 100, 100) + '%';
    if (this.driftPower > 160) fill.style.backgroundColor = '#845EC2';
    else if (this.driftPower > 80) fill.style.backgroundColor = '#F5C518';
    else fill.style.backgroundColor = '#0F3460';
  }

  // AI bot movement solver (uses waypoint pathfinding)
  updateBot(dt, offscreenCtx, trackDef) {
    if (this.stunTimer > 0) {
      this.stunTimer -= dt;
      this.speed = 0;
      return;
    }

    if (this.boostTimer > 0) {
      this.boostTimer -= dt;
    }

    if (this.itemSpinning) {
      this.itemSpinTimer -= dt;
      if (this.itemSpinTimer <= 0) {
        this.itemSpinning = false;
        let randKeys = Object.keys(ITEMS);
        this.item = randKeys[Math.floor(Math.random() * randKeys.length)];
      }
    }

    // 1. Pathfinding using dense waypoints for smooth navigation
    let wps = trackDef.waypoints;
    let targetWp = wps[this.wpIndex % wps.length];
    let dxWp = targetWp.x - this.x;
    let dyWp = targetWp.y - this.y;
    let distWp = Math.sqrt(dxWp * dxWp + dyWp * dyWp);

    if (distWp < 140) {
      this.wpIndex = (this.wpIndex + 1) % wps.length;
    }

    let lookahead = Math.min(3, wps.length - 1);
    let targetIdx = (this.wpIndex + lookahead) % wps.length;
    let target = wps[targetIdx];
    
    let dx = target.x - this.x;
    let dy = target.y - this.y;
    let targetAngle = Math.atan2(dy, dx);

    // Delta turning angle
    let angleDiff = targetAngle - this.angle;
    // Normalize to -PI to PI
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

    // Steering toward target
    let steerDir = 0;
    if (angleDiff > 0.05) steerDir = 1;
    if (angleDiff < -0.05) steerDir = -1;

    let steerScale = Math.min(Math.abs(this.speed) / 2.0, 1.0);
    this.angle += this.turnSpeed * steerDir * steerScale * dt;

    let targetSteer = steerDir * 0.35;
    this.steerVisual += (targetSteer - this.steerVisual) * 0.25 * dt;

    // 2. Terrain check and speeds
    let botSampleX = Math.max(0, Math.min(6399, Math.round(this.x)));
    let botSampleY = Math.max(0, Math.min(3999, Math.round(this.y)));
    let terrain = offscreenCtx.getImageData(botSampleX, botSampleY, 1, 1).data;
    let isOnRoad = (terrain[0] === 255 && terrain[1] === 255 && terrain[2] === 255);
    let isWall = (terrain[0] === 255 && terrain[1] === 0 && terrain[2] === 0);

    if (isWall) {
      this.x -= Math.cos(this.angle) * 8;
      this.y -= Math.sin(this.angle) * 8;
      this.speed = -this.speed * 0.3;
      this.angle += (Math.random() - 0.5) * 2; // randomize path out of wall
      return;
    }

    let targetMaxSpeed = this.maxSpeed * 0.95; // bots travel slightly slower for fairness
    if (!isOnRoad) targetMaxSpeed = 1.3;
    if (this.boostTimer > 0) targetMaxSpeed = this.maxSpeed * 1.4;

    if (this.speed < targetMaxSpeed) {
      this.speed += this.accelPower * 0.85 * dt;
    } else {
      this.speed *= Math.pow(this.dragFactor, dt);
    }

    // 3. Move coordinates
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;

    // 4. Randomly use items for challenge
    if (this.item && Math.random() < 0.01) {
      this.useItem();
    }
  }

  triggerItemSpin() {
    this.itemSpinning = true;
    this.itemSpinTimer = 60; // 1 second
  }

  useItem() {
    if (!this.item) return;

    let itemKey = this.item;
    this.item = null;
    
    // Clear display in local HUD if local player
    if (this.id === gameManager.localPlayer.id) {
      let slot = document.getElementById('hud-item-slot');
      slot.classList.remove('has-item');
      slot.textContent = '?';
    }

    // Execute character specials or basic items
    if (itemKey === 'BOOST') {
      this.boostTimer = 90;
      soundSynth.playBoost();
      // Particles
      for (let p = 0; p < 8; p++) {
        gameManager.particles.push(new Particle(this.x, this.y, -Math.cos(this.angle) * 4, -Math.sin(this.angle) * 4, '#16C79A', 5, 20, 'boost'));
      }
    } 
    else if (itemKey === 'BOMB') {
      let bombAngle = this.angle;
      gameManager.spawnProjectile(this.x + Math.cos(this.angle) * 25, this.y + Math.sin(this.angle) * 25, bombAngle, this.id);
      soundSynth.playTone(330, 'square', 0.15, 0.1);
    } 
    else if (itemKey === 'STICKER') {
      // Spawn sticker trap behind player
      let trapX = this.x - Math.cos(this.angle) * 28;
      let trapY = this.y - Math.sin(this.angle) * 28;
      gameManager.spawnTrap(trapX, trapY, this.id);
      soundSynth.playTone(280, 'sine', 0.1, 0.1);
    } 
    else if (itemKey === 'SHIELD') {
      this.boostTimer = 40; // minor boost
      // Draw temporary shield particles
      for (let k = 0; k < 6; k++) {
        gameManager.particles.push(new Particle(this.x, this.y, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, '#D4A316', 4, 30));
      }
    } 
    else if (itemKey === 'LIGHTNING') {
      gameManager.zapOpponents(this.id);
    }
  }

  spinOut() {
    this.stunTimer = 60; // Spin out stun
    this.speed = 0;
    this.isDrifting = false;
    this.driftPower = 0;
    soundSynth.playExplosion();
    
    // Spawn spin spin sparks
    for (let i = 0; i < 15; i++) {
      gameManager.particles.push(new Particle(
        this.x, this.y,
        (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6,
        '#FF6B6B', 4, 30
      ));
    }
  }

  drawKart(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Apply scale shrinking if hit by lightning
    if (this.stunTimer > 100 && this.isShrunk) {
      ctx.scale(0.65, 0.65);
    }

    // 1. NEON UNDERGLOW (glow effect matching character theme color)
    ctx.save();
    ctx.shadowColor = this.character.color;
    ctx.shadowBlur = 12;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(-10, -8, 20, 16, 4);
    ctx.fill();
    ctx.restore();

    // 2. Chassis Shadow (semi-transparent blur)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(-2, 2, 16, 0, Math.PI * 2);
    ctx.fill();

    // 3. Drift tracks
    if (this.isDrifting) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(-14, -10, 4, 3);
      ctx.fillRect(-14, 8, 4, 3);
    }

    // 4. TIRES WITH DETAIL
    ctx.fillStyle = '#1c1c24'; // Dark tire grey
    // Rear tires (treads & hubcap)
    ctx.fillRect(-15, -12, 8, 5); // left tire
    ctx.fillRect(-15, 7, 8, 5);  // right tire
    // Rear hubcaps (colored center line)
    ctx.fillStyle = '#6e707d';
    ctx.fillRect(-12, -12, 2, 5);
    ctx.fillRect(-12, 7, 2, 5);

    // Front tires with dynamic steering angles
    ctx.save();
    ctx.translate(8, -8);
    ctx.rotate(this.steerVisual);
    ctx.fillStyle = '#1c1c24';
    ctx.fillRect(-3, -2, 6, 4); // left front tire
    ctx.fillStyle = '#6e707d';
    ctx.fillRect(-1, -2, 2, 4); // hubcap
    ctx.restore();

    ctx.save();
    ctx.translate(8, 8);
    ctx.rotate(this.steerVisual);
    ctx.fillStyle = '#1c1c24';
    ctx.fillRect(-3, -2, 6, 4); // right front tire
    ctx.fillStyle = '#6e707d';
    ctx.fillRect(-1, -2, 2, 4); // hubcap
    ctx.restore();

    // 5. MAIN KART CHASSIS WITH METALLIC GRADIENT
    // Draw side pods
    ctx.save();
    let podGrad = ctx.createLinearGradient(-10, -8, -10, 8);
    podGrad.addColorStop(0, this.character.color);
    podGrad.addColorStop(0.5, '#ffffff'); // shine
    podGrad.addColorStop(1, this.character.color);
    ctx.fillStyle = podGrad;
    ctx.beginPath();
    ctx.roundRect(-8, -9, 14, 18, 5);
    ctx.fill();

    // Draw main chassis nose cone (pointing forward)
    let bodyGrad = ctx.createLinearGradient(-12, 0, 12, 0);
    bodyGrad.addColorStop(0, '#111');
    bodyGrad.addColorStop(0.3, this.character.color);
    bodyGrad.addColorStop(0.7, '#fff'); // shiny centerline specular highlight
    bodyGrad.addColorStop(0.9, this.character.color);
    bodyGrad.addColorStop(1, '#222');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.moveTo(-12, -5);
    ctx.lineTo(12, -2);
    ctx.lineTo(12, 2);
    ctx.lineTo(-12, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Spoiler wings (two end plates and main horizontal foil)
    ctx.fillStyle = '#111';
    ctx.fillRect(-16, -11, 3, 22); // main bar
    ctx.fillStyle = this.character.color;
    ctx.fillRect(-17, -11, 4, 3);  // left endplate
    ctx.fillRect(-17, 8, 4, 3);   // right endplate

    // Detailed Engine Block at the back
    ctx.fillStyle = '#555660'; // iron
    ctx.fillRect(-12, -4, 4, 8);
    ctx.fillStyle = '#8e909a'; // chrome engine cylinder heads
    ctx.fillRect(-11, -3, 3, 2);
    ctx.fillRect(-11, 1, 3, 2);
    
    // Steering Wheel
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(3, 0, 3, 0, Math.PI * 2);
    ctx.stroke();

    // Exquisite dual exhaust glowing tailpipes
    ctx.fillStyle = '#777';
    ctx.fillRect(-14, -3, 3, 2);
    ctx.fillRect(-14, 1, 3, 2);
    // Glowing exhaust tips
    ctx.fillStyle = this.boostTimer > 0 ? '#ff3c00' : '#ff9a3c';
    ctx.fillRect(-15, -2.5, 1, 1);
    ctx.fillRect(-15, 1.5, 1, 1);

    // Boost flames (flickering gradients)
    if (this.boostTimer > 0) {
      let flick = Math.sin(Date.now() / 40) * 4;
      let flameGrad = ctx.createLinearGradient(-30 - flick, 0, -14, 0);
      flameGrad.addColorStop(0, 'rgba(255, 60, 0, 0)');
      flameGrad.addColorStop(0.5, '#FF9A3C');
      flameGrad.addColorStop(1, '#FFEAA7');
      
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-14, -3);
      ctx.lineTo(-32 - flick, -6);
      ctx.lineTo(-24, 0);
      ctx.lineTo(-32 - flick, 6);
      ctx.lineTo(-14, 3);
      ctx.closePath();
      ctx.fill();
    }

    // Headlights
    ctx.fillStyle = '#FFEAA7';
    ctx.fillRect(11, -4, 2, 2.5);
    ctx.fillRect(11, 1.5, 2, 2.5);

    // 6. Draw driver emoji floating on center with tilt leaning and breathing bobs
    ctx.save();
    ctx.rotate(Math.PI/2); // make upright
    
    // Lean driver emoji based on steerVisual angle
    ctx.rotate(this.steerVisual * 0.45);
    
    // Tiny vertical bobbing to simulate vibrations
    let bob = Math.sin(Date.now() / 60 + this.x * 0.05) * 0.6;
    
    // Driver Seat back support
    ctx.fillStyle = '#1e1c24';
    ctx.beginPath();
    ctx.roundRect(-6, 2, 12, 3, 2);
    ctx.fill();

    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.character.emoji, 0, bob - 2);
    ctx.restore();

    ctx.restore();

    // Draw nickname label above player kart (non-rotating camera-space label)
    ctx.save();
    ctx.translate(this.x, this.y - 25);
    
    // Fill text label container
    ctx.fillStyle = 'rgba(11, 11, 22, 0.65)';
    ctx.strokeStyle = this.character.color;
    ctx.lineWidth = 1;
    ctx.font = 'bold 11px sans-serif';
    let textWidth = ctx.measureText(this.nickname).width;
    
    ctx.beginPath();
    ctx.roundRect(-textWidth/2 - 6, -10, textWidth + 12, 16, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.nickname, 0, -2);
    ctx.restore();
  }
}

// Global initialization
const gameManager = new GameManager();
window.addEventListener('load', () => {
  gameManager.init();
});
