// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
  apiKey: "AIzaSyBIQwVxZhUnb_bH5DiTIEADSxGzTc6Iljg",
  authDomain: "wat-in-de-ranking-rankings.firebaseapp.com",
  projectId: "wat-in-de-ranking-rankings",
  storageBucket: "wat-in-de-ranking-rankings.firebasestorage.app",
  messagingSenderId: "138866882601",
  appId: "1:138866882601:web:eee27036c5d95bdbc2c438"
};

let db = null;
let isFirebaseLoaded = false;

if (typeof firebase !== 'undefined') {
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    isFirebaseLoaded = true;
  } catch (e) {
    console.error("Firebase initialization failed:", e);
  }
} else {
  console.warn("Firebase SDK is not loaded. Running in offline-only mode.");
}

class FirebaseSync {
  constructor() {
    this.roomCode = '';
    this.playerId = '';
    this.playerNickname = '';
    this.isHost = false;
    this.localPlayerCharId = 'josh';
    this.isReady = false;
    
    // Listeners handles
    this.roomUnsubscribe = null;
    this.playersUnsubscribe = null;

    // Realtime synced datasets
    this.roomData = null;
    this.playersData = {};
    
    // Throttle uploader interval
    this.uploadInterval = null;
    this.lastUploadTime = 0;
  }

  init() {
    // Generate persistent/session player ID
    this.playerId = localStorage.getItem('widr_kart_player_id');
    if (!this.playerId) {
      this.playerId = 'player-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('widr_kart_player_id', this.playerId);
    }
  }

  // Generate 4-letter uppercase code
  generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // ===== CREATE ROOM =====
  async createRoom(nickname) {
    if (!isFirebaseLoaded || !db) {
      alert("Multiplayer is momenteel niet beschikbaar omdat de Firebase SDK niet is geladen.");
      gameManager.showScreen('screen-menu');
      return;
    }
    this.init();
    this.playerNickname = nickname;
    this.isHost = true;
    this.isReady = false;
    this.roomCode = this.generateRoomCode();
    
    try {
      // 1. Create room document
      await db.collection('mario_kart_rooms').doc(this.roomCode).set({
        status: 'lobby',
        trackId: 'chatroom',
        hostId: this.playerId,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        bots: []
      });

      // 2. Add host as first player in players subcollection
      await db.collection('mario_kart_rooms').doc(this.roomCode).collection('players').doc(this.playerId).set({
        nickname: nickname,
        characterId: this.localPlayerCharId,
        ready: false,
        isHost: true,
        x: 250, y: 120, angle: 0, speed: 0,
        isDrifting: false,
        lap: 1, checkpoint: 0,
        finished: false, finishTime: 0
      });

      // Show lobby screens
      document.getElementById('display-room-code').textContent = this.roomCode;
      
      // Open character selector modal
      document.getElementById('modal-char-select').classList.add('active');
      gameManager.selectCharacterPreview(this.localPlayerCharId);
      
      // Start Firestore syncing listeners
      this.subscribeToRoom();

    } catch (e) {
      console.error("Room creation error", e);
      alert("Fout bij het aanmaken van de kamer. Controleer je internetverbinding!");
      gameManager.showScreen('screen-menu');
    }
  }

  // ===== JOIN ROOM =====
  async joinRoom(code, nickname) {
    if (!isFirebaseLoaded || !db) {
      alert("Multiplayer is momenteel niet beschikbaar omdat de Firebase SDK niet is geladen.");
      gameManager.showScreen('screen-menu');
      return;
    }
    this.init();
    this.playerNickname = nickname;
    this.isHost = false;
    this.isReady = false;
    this.roomCode = code.toUpperCase();

    try {
      let roomDocRef = db.collection('mario_kart_rooms').doc(this.roomCode);
      let doc = await roomDocRef.get();

      if (!doc.exists) {
        alert(`Kamer met code ${this.roomCode} bestaat niet!`);
        gameManager.showScreen('screen-menu');
        return;
      }

      let data = doc.data();
      if (data.status !== 'lobby') {
        alert("Deze race is al begonnen!");
        gameManager.showScreen('screen-menu');
        return;
      }

      // Add ourselves as player
      await roomDocRef.collection('players').doc(this.playerId).set({
        nickname: nickname,
        characterId: this.localPlayerCharId,
        ready: false,
        isHost: false,
        x: 250, y: 120, angle: 0, speed: 0,
        isDrifting: false,
        lap: 1, checkpoint: 0,
        finished: false, finishTime: 0
      });

      document.getElementById('display-room-code').textContent = this.roomCode;
      
      // Open character select
      document.getElementById('modal-char-select').classList.add('active');
      gameManager.selectCharacterPreview(this.localPlayerCharId);

      this.subscribeToRoom();

    } catch (e) {
      console.error("Room join error", e);
      alert("Kan geen verbinding maken met de kamer.");
      gameManager.showScreen('screen-menu');
    }
  }

  // ===== FIREBASE LISTENERS SUBSCRIBE =====
  subscribeToRoom() {
    if (!isFirebaseLoaded || !db) return;
    let roomDocRef = db.collection('mario_kart_rooms').doc(this.roomCode);

    // 1. Room document settings listener
    this.roomUnsubscribe = roomDocRef.onSnapshot(doc => {
      if (!doc.exists) {
        // Room was deleted by host
        if (!this.isHost) {
          alert("De host heeft de lobby gesloten.");
          this.leaveRoom();
        }
        return;
      }

      let data = doc.data();
      this.roomData = data;

      // Sync track selector
      if (data.trackId) {
        gameManager.setTrack(data.trackId);
      }

      // Start gameplay if status is racing
      if (data.status === 'racing' && gameManager.raceState === 'lobby') {
        gameManager.startRaceGameplay(0); // bots synced inside starting function from roomData
        this.startRealtimeUpload();
      }

      // Reset to lobby if host returns
      if (data.status === 'lobby' && gameManager.raceState !== 'lobby') {
        this.stopRealtimeUpload();
        gameManager.raceState = 'lobby';
        gameManager.showScreen('screen-lobby');
        // Reset player ready state in Firestore
        this.isReady = false;
        this.updatePlayerReadyStatus(false);
      }
    });

    // 2. Players list collection listener
    this.playersUnsubscribe = roomDocRef.collection('players').onSnapshot(snapshot => {
      this.playersData = {};
      let readyCount = 0;
      let totalPlayers = 0;

      let listHTML = '';

      snapshot.forEach(doc => {
        let p = doc.data();
        this.playersData[doc.id] = p;
        totalPlayers++;

        if (p.ready) readyCount++;

        let char = DEFAULT_MEMBERS.find(m => m.id === p.characterId) || DEFAULT_MEMBERS[0];
        let isSelf = (doc.id === this.playerId);
        let readyText = p.ready ? 'KLAAR' : 'WACHTEN';
        let readyClass = p.ready ? 'ready' : 'waiting';

        listHTML += `
          <div class="player-card ${isSelf ? 'is-self' : ''}">
            <span class="player-emoji-avatar">${char.emoji}</span>
            <div class="player-info-text">
              <h4>${p.nickname} ${p.isHost ? '<span class="host-tag">HOST</span>' : ''}</h4>
              <p>${char.name} - ${char.title}</p>
            </div>
            <span class="player-status ${readyClass}">${readyText}</span>
          </div>
        `;
      });

      document.getElementById('lobby-players-list').innerHTML = listHTML;
      
      // Host Start Button state controller
      if (this.isHost) {
        let startBtn = document.getElementById('btn-start-game');
        startBtn.textContent = `START RACE (${readyCount}/${totalPlayers} KLAAR)`;
        
        // Allow start if everyone is ready (including host)
        startBtn.disabled = (readyCount < totalPlayers);
      }

      document.getElementById('lobby-player-count').textContent = `${totalPlayers} racer${totalPlayers > 1 ? 's' : ''} in lobby`;
    });
  }

  // ===== UPDATE PLAYER CHARACTER =====
  updatePlayerCharacter(charId) {
    if (!isFirebaseLoaded || !db) return;
    this.localPlayerCharId = charId;
    db.collection('mario_kart_rooms').doc(this.roomCode)
      .collection('players').doc(this.playerId).update({
        characterId: charId
      }).catch(e => console.error(e));
  }

  // ===== TOGGLE READY STATUS =====
  toggleReady() {
    this.isReady = !this.isReady;
    this.updatePlayerReadyStatus(this.isReady);
    
    // Toggle button look
    let readyBtn = document.getElementById('btn-toggle-ready');
    if (this.isReady) {
      readyBtn.textContent = "IK BEN KLAAR (KLIK OM TE ANNULEREN)";
      readyBtn.style.background = "linear-gradient(135deg, #e94560 0%, #b82c44 100%)";
    } else {
      readyBtn.textContent = "IK BEN ER KLAAR VOOR";
      readyBtn.style.background = "linear-gradient(135deg, #16c79a 0%, #0fa07b 100%)";
    }
  }

  updatePlayerReadyStatus(ready) {
    if (!isFirebaseLoaded || !db) return;
    db.collection('mario_kart_rooms').doc(this.roomCode)
      .collection('players').doc(this.playerId).update({
        ready: ready
      }).catch(e => console.error(e));
  }

  // ===== UPDATE ROOM SETTINGS (HOST ONLY) =====
  updateRoomSettings(settings) {
    if (!isFirebaseLoaded || !db) return;
    if (!this.isHost) return;
    db.collection('mario_kart_rooms').doc(this.roomCode).update(settings).catch(e => console.error(e));
  }

  // ===== HOST TRIGGER START RACE =====
  async startRace(botCount) {
    if (!isFirebaseLoaded || !db) return;
    if (!this.isHost) return;

    // Generate bot list to save to room, so all clients download and spawn exact same bots
    let bots = [];
    let availableChars = DEFAULT_MEMBERS.filter(m => m.id !== this.localPlayerCharId);
    for (let i = 0; i < botCount; i++) {
      let char = availableChars[i % availableChars.length];
      bots.push({
        id: 'bot-' + i,
        name: char.name.split(' ')[0] + " Bot",
        characterId: char.id
      });
    }

    try {
      await db.collection('mario_kart_rooms').doc(this.roomCode).update({
        status: 'racing',
        bots: bots
      });
    } catch (e) {
      alert("Kan de race niet starten.");
    }
  }

  // ===== THROTTLED GAME POSITION COORDINATES UPLOAD =====
  startRealtimeUpload() {
    this.lastUploadTime = performance.now();
    
    // Periodically sync kart coordinates to Firebase (every 120ms is optimal)
    this.uploadInterval = setInterval(() => {
      if (gameManager.localPlayer) {
        this.uploadPlayerState({
          x: gameManager.localPlayer.x,
          y: gameManager.localPlayer.y,
          angle: gameManager.localPlayer.angle,
          speed: gameManager.localPlayer.speed,
          isDrifting: gameManager.localPlayer.isDrifting,
          lap: gameManager.localPlayer.lap,
          checkpoint: gameManager.localPlayer.checkpoint,
          finished: gameManager.localPlayer.finished,
          finishTime: gameManager.localPlayer.finishTime
        });
      }
    }, 120);
  }

  stopRealtimeUpload() {
    if (this.uploadInterval) {
      clearInterval(this.uploadInterval);
      this.uploadInterval = null;
    }
  }

  uploadPlayerState(state) {
    if (!isFirebaseLoaded || !db) return;
    // Avoid double writes in exact same frame
    let now = performance.now();
    if (now - this.lastUploadTime < 60) return; 
    this.lastUploadTime = now;

    db.collection('mario_kart_rooms').doc(this.roomCode)
      .collection('players').doc(this.playerId).update(state).catch(e => {});
  }

  // ===== RESET HOST GAME LOBBY =====
  resetRoomToLobby() {
    if (!isFirebaseLoaded || !db) return;
    if (!this.isHost) return;
    db.collection('mario_kart_rooms').doc(this.roomCode).update({
      status: 'lobby'
    }).catch(e => console.error(e));
  }

  // ===== LEAVE / CLEANUP =====
  leaveRoom() {
    if (!isFirebaseLoaded || !db) return;
    this.stopRealtimeUpload();
    
    if (this.roomCode) {
      // Remove self from player list in Firestore
      db.collection('mario_kart_rooms').doc(this.roomCode)
        .collection('players').doc(this.playerId).delete().catch(e => {});

      // If we are host, delete the entire room document
      if (this.isHost) {
        db.collection('mario_kart_rooms').doc(this.roomCode).delete().catch(e => {});
      }
    }

    if (this.roomUnsubscribe) this.roomUnsubscribe();
    if (this.playersUnsubscribe) this.playersUnsubscribe();

    this.roomCode = '';
    this.isHost = false;
    this.isReady = false;
    gameManager.isMultiplayer = false;
  }
}

// Global reference
window.firebaseSync = new FirebaseSync();
