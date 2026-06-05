import React, { useState } from 'react';
import { COUNTRIES, PLAYERS } from './data.js';

const SQUAD_SLOTS = ['GK', 'DEF 1', 'DEF 2', 'MID 1', 'MID 2', 'FWD 1', 'FWD 2'];

const getBasePosition = (slotName) => {
  if (slotName.includes('DEF')) return 'Defender';
  if (slotName.includes('MID')) return 'Midfielder';
  if (slotName.includes('FWD')) return 'Forward';
  return 'Goalkeeper';
};

const generateHiddenTrait = (player) => {
  if (player.traitType === 'PRIMA_DONNA') return { type: 'PRIMA_DONNA', label: 'Prima Donna 👑' };
  if (player.traitType === 'VETERAN') return { type: 'VETERAN', label: 'Veteran 🧠' };
  if (player.traitType === 'CATALYST') return { type: 'CATALYST', label: 'Catalyst ⚡' };
  if (player.traitType === 'WONDERKID') return { type: 'WONDERKID', label: 'Wonderkid 🌱' };
  if (player.traitType === 'WILDCARD') return { type: 'WILDCARD', label: 'Wildcard 🃏' };
  return { type: 'TEAM_PLAYER', label: 'Team Player 🛡️' };
};

const getChingooDraftCommentary = (name) => {
  const customLines = {
    "Gringonator": "🧤 Gringonator (10 OVR): showed up to camp unfit, visibly hungover, and actively trying to dribble out of his own box",
    "OllieTheDoodle": "🐕 OllieTheDoodle (85 OVR): Spent more time chasing his own tail in the defensive third than tracking runners. Traded defensive shape for absolute chaotic energy.",
    "DougDimadome322": "🎩 DougDimadome322 (85 OVR): Fullback who thinks he is an elite playmaker. Kept launching cross-field lobs directly into the stands to nobody.",
    "Boston_Ramos26": "🛡️ Boston_Ramos26 (85 OVR): Supposedly the 'Veteran baseline anchor' but spent the match screaming at the backline while tracking the wrong striker.",
    "lilYoun9": "⚡ lilYoun9 (85 OVR): Pure CDM chaos. Left a massive hole in midfield and tripped on his own feet while sprinting full speed upfront trying to pad his highlight reel.",
    "joezhai12": "🧠 joezhai12 (85 OVR): The 'maestro' who completely ghosted under a light press and blamed the wet pitch for his heavy touches.",
    "gengho": "🌱 gengho (85 OVR): High energy, zero direction. Ran 14 kilometers entirely in the wrong areas of the pitch, effectively doing cardio.",
    "sailordooooom": "⚓ sailordooooom (85 OVR): Caught offside a record-breaking 11 times in a single tournament run. Completely blind to the backline.",
    "SongEC": "🃏 SongEC (85 OVR): Unpredictable maverick who refused to pass the ball once in the final third. Kept trying flair trick maneuvers and losing possession.",
    "calamari1": "🐙 calamari1 (90 OVR): High-rated superstar stat-padder. Demanded every through ball, every set piece, and every goal kick be played directly to his feet. Giving peak CR7 energy."
  };
  return customLines[name] || "🔥 A Chingoo legend somehow made the tournament sheet and disrupted the whole system.";
};

const getDynamicChingooCommentary = (outcome, chingooPlayers) => {
  if (chingooPlayers.length === 0) {
    switch (outcome) {
      case "Cinderella 🏆": return "CINDERELLA STORY! Against all odds, against all logic, with a 65-rated keeper who had no business being anywhere near this tournament — the boys pulled off the greatest upset in World Cup history. Gringonator made exactly one save the entire tournament.";
      case "Champion 🏆": return "ABSOLUTE CINEMA! You dominated every match from whistle to whistle and conquered the World Cup!";
      case "2nd Place 🥈": return "Losing on penalties in the final. Brilliant tactical setup, but falling just short.";
      default: return "Group stage exit. Squad chemistry fell apart before the third group match.";
    }
  }

  const luckyPlayer = chingooPlayers[Math.floor(Math.random() * chingooPlayers.length)].name;

  switch (outcome) {
     case "Cinderella 🏆":
      return `CINDERELLA STORY! Against all odds, against all logic, against a 65-rated keeper who had no business being anywhere near this tournament — the boys pulled off the greatest upset in World Cup history. Gringonator made exactly one save the entire tournament. It happened to be a point-blank header in the 94th minute of the final. ${luckyPlayer} is somehow claiming the assist.`;
    case "Champion 🏆":
      return `WE WON THE WORLD CUP! But let's be real—we won entirely IN SPITE of ${luckyPlayer}, who spent the final jogging around the center circle waving for the ball while the rest of the squad did all the dirty work.`;
    case "2nd Place 🥈":
      return `Losing on penalties in the final! An incredible run completely thrown in the trash because ${luckyPlayer} decided to go for a rainbow flick inside our own box instead of just clearing the ball.`;
    case "3rd Place 🥉":
      return `Third place podium finish! A decent run, but we missed out on gold because ${luckyPlayer} ghosted completely the absolute split-second a press stepped to them.`;
    case "4th Place":
      return `4th place finish. No medals, just terrible positioning. ${luckyPlayer} single-handedly destroyed our tactical lines trying to chase personal glory instead of playing for the team.`;
    case "Quarter-Finals":
      return `Knockout exit in the Quarters! The tournament campaign dissolved because ${luckyPlayer} spent the entire knockout game calling for the pass while dead out of stamina.`;
    case "Round of 16":
      return `Absolute reality check in the Round of 16. The exact moment our tactics collapsed can be traced back to ${luckyPlayer} completely misplacing a 5-yard pass straight to their striker.`;
    case "Round of 32":
      return `Booted out in the Round of 32. Total structural gridlock. The locker room chemistry turned toxic because ${luckyPlayer} refused to track back and blamed 'heavy legs from the travel schedule'.`;
    default:
      return `GROUP STAGE FLIGHT HOME! Complete and utter disaster. ${luckyPlayer} showed up with massive lag, dropped a 4.1 match rating, and dragged our entire active team rating directly into the garbage. 💩`;
  }
};

export default function WorldCupTacticalDraft() {
  const [squad, setSquad] = useState({});
  const [currentRoll, setCurrentRoll] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [slotMachineDisplay, setSlotMachineDisplay] = useState({ flag: '🎰', name: 'SPIN FOR SELECTION' });
  const [result, setResult] = useState(null);
  const [reRollsLeft, setReRollsLeft] = useState(1);
  const [liveLog, setLiveLog] = useState("Pull the lever to generate your first tactical choice...");

  const startSlotMachine = () => {
    const availableSlots = SQUAD_SLOTS.filter(slot => !squad[slot]);
    if (availableSlots.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    const finalSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
    const finalCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
    const basePos = getBasePosition(finalSlot);

    const draftedNames = Object.values(squad).map(p => p.name);
    const relevantPlayers = PLAYERS.filter(
      p => p.country === finalCountry.name && p.pos === basePos && !draftedNames.includes(p.name)
    );

    const shuffled = relevantPlayers.sort(() => 0.5 - Math.random());
    const optionsToDisplay = shuffled.slice(0, 3);

    if (optionsToDisplay.length === 0) {
      optionsToDisplay.push({
        id: Math.random().toString(),
        name: `Local Legend`,
        country: finalCountry.name,
        pos: basePos,
        ovr: 74
      });
    }

    const optionsWithTraits = optionsToDisplay.map(player => ({
      ...player,
      trait: generateHiddenTrait(player)
    }));

    let counter = 0;
    const interval = setInterval(() => {
      const randomTickerCountry = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      setSlotMachineDisplay({
        flag: randomTickerCountry.flag,
        name: `${randomTickerCountry.name} - ${finalSlot}`
      });

      counter++;
      if (counter > 12) {
        clearInterval(interval);
        setSlotMachineDisplay({ 
          flag: finalCountry.flag, 
          name: `${finalCountry.name} (${finalSlot})` 
        });
        setCurrentRoll({
          country: finalCountry,
          slot: finalSlot,
          options: optionsWithTraits
        });
        setIsSpinning(false);
      }
    }, 80);
  };

  const executeReRoll = () => {
    if (reRollsLeft <= 0 || !currentRoll || isSpinning) return;
    setReRollsLeft(prev => prev - 1);
    setCurrentRoll(null);
    startSlotMachine();
  };

  const selectPlayer = (player) => {
    if (!currentRoll) return;

    if (player.country === "Chingoo United") {
      setLiveLog(getChingooDraftCommentary(player.name));
    } else {
      setLiveLog(`Signed ${player.name} (${player.ovr} OVR) into the ${currentRoll.slot} slot line.`);
    }

    setSquad(prev => ({
      ...prev,
      [currentRoll.slot]: { ...player, flag: currentRoll.country.flag }
    }));
    
    setCurrentRoll(null);
    setSlotMachineDisplay({ flag: '🎰', name: 'START DRAFT PULL' });
  };

  // HIGH RISK MATH CHEMISTRY CALCULATION MATRIX LOOP
  const processSquadChemistry = () => {
    const updatedSquad = {};
    const playersArray = Object.values(squad);
    const countDrafted = playersArray.length;

    Object.keys(squad).forEach(slot => {
      if (!squad[slot]) return;
      updatedSquad[slot] = { ...squad[slot], displayOvr: squad[slot].ovr, linkStatus: 'neutral' };
    });

    if (countDrafted === 0) return updatedSquad;

    const totalPrimaDonnas = playersArray.filter(p => p.trait.type === 'PRIMA_DONNA').length;
    const totalWonderkids = playersArray.filter(p => p.trait.type === 'WONDERKID').length;
    const totalVeterans = playersArray.filter(p => p.trait.type === 'VETERAN').length;
    const totalWildcards = playersArray.filter(p => p.trait.type === 'WILDCARD').length;
    
    const totalChingooUnited = playersArray.filter(p => p.country === 'Chingoo United').length;
    const isChingooClubsNightActive = totalChingooUnited >= 2;

    const isEgoWarActive = totalPrimaDonnas >= 3 && !isChingooClubsNightActive;
    const isInexperiencePanicActive = totalWonderkids >= 2 && totalVeterans === 0 && !isChingooClubsNightActive;
    const isWildcardChaosActive = (totalWildcards >= 2 || (totalWildcards >= 1 && totalPrimaDonnas >= 1)) && !isChingooClubsNightActive;

    const countryCounts = {};
    playersArray.forEach(p => {
      countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
    });

    Object.keys(updatedSquad).forEach(slot => {
      const player = updatedSquad[slot];
      let penaltyApplied = false;

      // 1. CHINGOO UNITED IMMUNITY OVERRIDES
      if (player.country === 'Chingoo United') {
        if (totalChingooUnited === 2) {
          player.displayOvr += 3; 
          player.linkStatus = 'buff';
        } else if (totalChingooUnited >= 3) {
          player.displayOvr += 6; 
          player.linkStatus = 'buff';
        }
        return; 
      }

      // 2. CRITICAL NEGATIVE REACTION MODIFIERS (THE greed TAX)
      if (isEgoWarActive) {
        player.displayOvr -= 5;
        player.linkStatus = 'clash';
        penaltyApplied = true;
      }
      if (player.trait.type === 'WONDERKID' && isInexperiencePanicActive) {
        player.displayOvr -= 3;
        player.linkStatus = 'clash';
        penaltyApplied = true;
      }
      if (player.trait.type === 'WILDCARD' && isWildcardChaosActive) {
        player.displayOvr -= 5; // Amplified volatility penalty
        player.linkStatus = 'clash';
        penaltyApplied = true;
      }

      // 3. DYNAMIC SYNERGY CHANNELS (LOW OVR SCALING UPSIDES)
      const nativeCount = countryCounts[player.country] || 0;
      
      // Prima Donnas are completely locked from receiving standard country bonuses
      if (player.trait.type !== 'PRIMA_DONNA') {
      if (nativeCount === 2) {
          player.displayOvr += 3;
          if (!penaltyApplied) player.linkStatus = 'buff';
        } else if (nativeCount >= 3) {
          player.displayOvr += 5;
          if (!penaltyApplied) player.linkStatus = 'buff';
        }
      }

      if (player.trait.type === 'VETERAN' && totalWonderkids >= 1) {
        player.displayOvr += 3;
        if (!penaltyApplied) player.linkStatus = 'buff';
      }

     if (player.trait.type === 'WONDERKID' && totalVeterans >= 1) {
       player.displayOvr += 3;
       if (!penaltyApplied) player.linkStatus = 'buff';
      }

      if (player.trait.type === 'WILDCARD' && !isWildcardChaosActive && totalWildcards === 1) {
        player.displayOvr += 6; 
        if (!penaltyApplied) player.linkStatus = 'buff';
      }

       if (player.trait.type === 'CATALYST' && nativeCount >= 2) {
        player.displayOvr += 3;
        if (!penaltyApplied) player.linkStatus = 'buff';
      }
    });
      
          return updatedSquad;
  };

  const activeSquad = processSquadChemistry();
  const countDrafted = Object.keys(squad).length;
  
  const rawAvgOvr = countDrafted > 0 
    ? (Object.values(squad).reduce((sum, p) => sum + p.ovr, 0) / countDrafted).toFixed(1) 
    : "0.0";
    
  const activeAvgOvr = countDrafted > 0 
    ? (Object.values(activeSquad).reduce((sum, p) => sum + p.displayOvr, 0) / countDrafted).toFixed(1) 
    : "0.0";

  const chemDelta = (parseFloat(activeAvgOvr) - parseFloat(rawAvgOvr)).toFixed(1);

 const calculateOutcome = () => {
    const players = Object.values(activeSquad);
    const avgOvr = players.reduce((sum, p) => sum + p.displayOvr, 0) / 7;

    const hasGringonator = players.some(p => p.name === "Gringonator");
    if (hasGringonator && Math.random() < 0.50) {
      setResult("Cinderella 🏆");
      return;
    }
        
    if (avgOvr >= 88.8) setResult("Champion 🏆");
    else if (avgOvr >= 87.8) setResult("2nd Place 🥈");
    else if (avgOvr >= 86.8) setResult("3rd Place 🥉");
    else if (avgOvr >= 85.8) setResult("4th Place");
    else if (avgOvr >= 84.5) setResult("Quarter-Finals");
    else if (avgOvr >= 83) setResult("Round of 16");
    else if (avgOvr >= 82) setResult("Round of 32");
    else setResult("Group Stage Flight Home 💩");
  };

  const resetGame = () => {
    setSquad({});
    setCurrentRoll(null);
    setResult(null);
    setReRollsLeft(1);
    setLiveLog("Lineup cleared. Pull the lever to start a new campaign.");
    setSlotMachineDisplay({ flag: '🎰', name: 'START THE DRAFT' });
  };

  const isDraftComplete = countDrafted === SQUAD_SLOTS.length;
  const isDraftInProgress = countDrafted > 0;
  const draftedChingooPlayers = Object.values(squad).filter(p => p.country === "Chingoo United");
  const isChingooClubsNightActive = draftedChingooPlayers.length >= 2;

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-slate-950 text-white p-3 md:p-4 font-sans select-none antialiased md:overflow-hidden gap-4">
      
      {/* PANEL 1 */}
      <div className="w-full md:w-5/12 flex flex-col justify-start space-y-3">
        
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl">
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Re-rolls:</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded ${reRollsLeft > 0 ? 'bg-indigo-900 text-indigo-300' : 'bg-rose-950 text-rose-400'}`}>
              {reRollsLeft} / 1
            </span>
          </div>

          {isDraftInProgress && (
            <button 
              onClick={resetGame}
              className="text-xs uppercase font-bold tracking-wider text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-900/50 px-3 py-1 rounded-xl transition-all"
            >
              🔄 Restart
            </button>
          )}
        </div>

        <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-3 shadow-xl text-center relative overflow-hidden">
          <h2 className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-2">2026 World Cup Team Builder</h2>
          
          <div className="flex items-center justify-center gap-3 bg-black py-2.5 rounded-xl border border-slate-800 shadow-inner">
            <div className={`text-3xl ${isSpinning ? 'blur-[2px] scale-110' : ''} transition-all duration-700`}>
              {slotMachineDisplay.flag}
            </div>
            <div className="w-[1px] h-6 bg-slate-800" />
            <div className={`text-md md:text-base font-black tracking-tight text-yellow-400 p-0.5 ${isSpinning ? 'blur-[1px]' : ''}`}>
              {slotMachineDisplay.name}
            </div>
          </div>

          {!currentRoll && !isDraftComplete && (
            <button 
              onClick={startSlotMachine}
              disabled={isSpinning}
              className="mt-2.5 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 font-black tracking-tight text-sm py-2 rounded-lg shadow-md transition-all uppercase"
            >
              {isSpinning ? '🎰 Rolling...' : 'Pull Lever'}
            </button>
          )}

          {currentRoll && !isDraftComplete && (
            <button
              onClick={executeReRoll}
              disabled={reRollsLeft <= 0}
              className={`mt-2.5 w-full font-bold text-xs py-2 rounded-md border transition-all ${
                reRollsLeft > 0 
                  ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700' 
                  : 'bg-slate-950 border-transparent text-slate-600 cursor-not-allowed'
              }`}
            >
              🎲 Re-Roll Selection ({reRollsLeft} Left)
            </button>
          )}
        </div>

        <div className="bg-black/40 border border-slate-800 rounded-xl p-2.5 text-center min-h-[54px] flex items-center justify-center px-4">
          <p className="text-xs font-semibold leading-relaxed tracking-tight text-slate-300 italic">
            {liveLog}
          </p>
        </div>

        {currentRoll && (
          <div className="w-full space-y-2 animate-fade-in">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Signings:</h3>
              <span className="text-[10px] bg-indigo-950 text-indigo-400 px-1.5 py-0.5 rounded font-black border border-indigo-900">
                🔬 ANALYSIS WINDOW
              </span>
            </div>
            <div className="space-y-1.5">
              {currentRoll.options.map(player => (
                <button
                  key={player.id}
                  onClick={() => selectPlayer(player)}
                  className="w-full text-left p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:border-indigo-500 hover:bg-slate-850 transition-all flex justify-between items-center shadow-sm"
                >
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      {player.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{player.country}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-700" />
                      <span className={`text-[10px] font-black tracking-wide uppercase ${
                        player.trait.type === 'PRIMA_DONNA' ? 'text-rose-400' :
                        player.trait.type === 'VETERAN' ? 'text-amber-400' :
                        player.trait.type === 'CATALYST' ? 'text-cyan-400' :
                        player.trait.type === 'WONDERKID' ? 'text-emerald-400' :
                        player.trait.type === 'WILDCARD' ? 'text-fuchsia-400' : 'text-slate-400'
                      }`}>
                        {player.trait.label}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-slate-950 text-indigo-400 border border-slate-800 text-xs">
                      {player.ovr} OVR
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {isDraftComplete && !result && (
          <button 
            onClick={calculateOutcome}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-lg py-3.5 rounded-xl shadow-lg hover:from-emerald-400 hover:to-teal-400 animate-pulse transition-all"
          >
            SIMULATE WORLD CUP 🌎
          </button>
        )}

        {result && (
          <div className={`rounded-2xl p-4 text-center shadow-xl relative overflow-hidden border transition-all ${
          (result.includes("Champion") || result.includes("Cinderella")) ? 'bg-gradient-to-b from-amber-500 to-yellow-600 text-slate-950 border-yellow-400' :
            result.includes("Flight") ? 'bg-gradient-to-b from-stone-900 to-orange-950 text-orange-200 border-orange-900' : 'bg-slate-900 text-white border-slate-700'
          }`}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Campaign Ending</h3>
            <p className="text-2xl font-black tracking-tight uppercase">{result === "Cinderella 🏆" ? "Champion 🏆" : result}</p>
            
            <div className="p-2.5 rounded-lg mt-1.5 text-xs font-semibold leading-relaxed bg-black/30">
              "{getDynamicChingooCommentary(result, draftedChingooPlayers)}"
            </div>

            {draftedChingooPlayers.length > 0 && (
              <div className="mt-3 text-left bg-black/40 border border-white/10 p-2.5 rounded-xl space-y-1.5 max-h-[160px] overflow-y-auto custom-scrollbar">
                <h4 className="text-[10px] uppercase tracking-wider font-black text-yellow-400">👑 Locker Room Performance Reviews:</h4>
                {draftedChingooPlayers.map(p => (
                  <div key={p.id} className="text-[11px] leading-tight text-slate-300 border-b border-white/5 pb-1 last:border-0 last:pb-0">
                    {getChingooDraftCommentary(p.name)}
                  </div>
                ))}
              </div>
            )}

            <button 
              onClick={resetGame} 
              className="mt-4 w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* PANEL 2 */}
      <div className="w-full md:w-7/12 flex flex-col justify-start items-center space-y-2">
        
        <div className={`w-full max-w-[440px] border rounded-xl p-2.5 flex justify-between items-center text-center shadow-inner gap-2 transition-all duration-500 ${
          isChingooClubsNightActive
            ? 'bg-slate-900 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex-1">
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Raw Roster Average</div>
            <div className="text-base font-black font-mono text-slate-300">{rawAvgOvr}</div>
          </div>
          
          <div className="w-[1px] h-6 bg-slate-800" />
          
          <div className="flex-1">
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
              {isChingooClubsNightActive ? '🍻 Clubs Night Active' : 'Active Team Rating'}
            </div>
            <div className={`text-base font-black font-mono tracking-tight transition-colors duration-300 ${
              isChingooClubsNightActive ? 'text-yellow-400 animate-pulse' : 'text-indigo-400'
            }`}>{activeAvgOvr}</div>
          </div>
          
          <div className="w-[1px] h-6 bg-slate-800" />
          
          <div className="flex-1">
            <div className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Chemistry Delta</div>
            <div className={`text-base font-black font-mono ${
              parseFloat(chemDelta) > 0 ? 'text-emerald-400' : parseFloat(chemDelta) < 0 ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {parseFloat(chemDelta) > 0 ? `+${chemDelta}` : chemDelta}
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-[440px] aspect-[4/5] bg-gradient-to-b from-emerald-800 to-green-900 rounded-2xl p-4 relative border-4 border-white/20 shadow-2xl overflow-hidden grid grid-rows-4 items-center max-h-[46vh] md:max-h-[76vh]">
          
          <div className="absolute inset-x-0 top-0 h-1/2 border-b-2 border-white/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/10 rounded-full pointer-events-none" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-12 border-b-2 border-x-2 border-white/10 pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-12 border-t-2 border-x-2 border-white/10 pointer-events-none" />

          {/* ROW 1: FORWARDS */}
          <div className="flex justify-around w-full z-10">
            {['FWD 1', 'FWD 2'].map(slot => (
              <PitchCard key={slot} slot={slot} squad={activeSquad} currentRoll={currentRoll} />
            ))}
          </div>

          {/* ROW 2: MIDFIELDERS */}
          <div className="flex justify-around w-full z-10">
            {['MID 1', 'MID 2'].map(slot => (
              <PitchCard key={slot} slot={slot} squad={activeSquad} currentRoll={currentRoll} />
            ))}
          </div>

          {/* ROW 3: DEFENDERS */}
          <div className="flex justify-around w-full z-10">
            {['DEF 1', 'DEF 2'].map(slot => (
              <PitchCard key={slot} slot={slot} squad={activeSquad} currentRoll={currentRoll} />
            ))}
          </div>

          {/* ROW 4: GOALKEEPER */}
          <div className="flex justify-center w-full z-10">
            <PitchCard slot="GK" squad={activeSquad} currentRoll={currentRoll} />
          </div>

        </div>
      </div>
    </div>
  );
}

function PitchCard({ slot, squad, currentRoll }) {
  const player = squad[slot];
  const isTargeted = currentRoll?.slot === slot;

  let borderStyle = 'border-white/15 bg-black/40';
  if (isTargeted) borderStyle = 'bg-yellow-500/20 border-yellow-400 border-2 animate-pulse scale-105';
  if (player) {
    if (player.linkStatus === 'buff') borderStyle = 'bg-slate-900/95 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]';
    else if (player.linkStatus === 'clash') borderStyle = 'bg-slate-900/95 border-rose-600 shadow-[0_0_12px_rgba(225,29,72,0.4)] animate-pulse';
    else borderStyle = 'bg-slate-900/95 border-blue-500';
  }

  return (
    <div className={`w-[42%] max-w-[155px] rounded-xl border px-2 py-1.5 shadow-xl transition-all flex items-center justify-between gap-1 ${borderStyle}`}>
      
      <div className="flex items-center gap-1 min-w-0">
        <div className="text-xl shrink-0">
          {player ? player.flag : '⚪'}
        </div>
        <div className="flex flex-col min-w-0 leading-tight">
          <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
            {slot.replace(' 1','').replace(' 2','')}
          </span>
          <span className="text-xs font-black text-white truncate">
            {player ? player.name.split(' ').pop() : 'Empty'}
          </span>
          {player && (
            <span className={`text-[8px] truncate font-extrabold ${
              player.trait.type === 'PRIMA_DONNA' ? 'text-rose-400' :
              player.trait.type === 'VETERAN' ? 'text-amber-400' :
              player.trait.type === 'CATALYST' ? 'text-cyan-400' :
              player.trait.type === 'WONDERKID' ? 'text-emerald-400' :
              player.trait.type === 'WILDCARD' ? 'text-fuchsia-400' : 'text-slate-400'
            }`}>
              {player.trait.label.split(' ')[0]}
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end justify-center">
        {player ? (
          <>
            <span className={`text-xs font-black font-mono px-1 rounded border ${
              player.linkStatus === 'buff' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
              player.linkStatus === 'clash' ? 'bg-rose-950 text-rose-400 border-rose-800' :
              'bg-slate-950 text-indigo-400 border-slate-800'
            }`}>
              {player.displayOvr}
            </span>
            {player.displayOvr !== player.ovr && (
              <span className={`text-[8px] font-bold font-mono ${player.displayOvr > player.ovr ? 'text-emerald-400' : 'text-rose-400'}`}>
                {player.displayOvr > player.ovr ? `+${player.displayOvr - player.ovr}` : `${player.displayOvr - player.ovr}`}
              </span>
            )}
          </>
        ) : (
          <span className={`text-[8px] font-black px-1 rounded ${isTargeted ? 'bg-yellow-400 text-slate-950 animate-pulse' : 'text-white/10 bg-white/5'}`}>
            {isTargeted ? 'DRAFT' : ''}
          </span>
        )}
      </div>

    </div>
  );
}

