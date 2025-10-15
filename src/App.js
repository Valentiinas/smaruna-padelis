import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const teamsList = ["A","A1","B","B1","C","C1","D","D1","E","E1","F","F1"];

  // load from localStorage or default
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("players");
    if (saved) return JSON.parse(saved);
    return teamsList.reduce((acc, t) => {
      acc[t] = { vyras: "", moteris: "" };
      return acc;
    }, {});
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("results");
    return saved ? JSON.parse(saved) : {};
  });

  const [finalResults, setFinalResults] = useState(null);

  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  const handlePlayerChange = (team, gender, value) => {
    setPlayers(prev => ({ ...prev, [team]: { ...prev[team], [gender]: value } }));
  };

  const handleResult = (roundIndex, matchIndex, winnerTeam) => {
    setResults(prev => {
      const next = { ...prev };
      next[roundIndex] = { ...(next[roundIndex] || {}) , [matchIndex]: winnerTeam };
      return next;
    });
  };

  const resetTournament = () => {
    localStorage.removeItem("players");
    localStorage.removeItem("results");
    window.location.reload();
  };

  // Tvarkaraštis 1–5 roundai (mišri pora)
  const mixedRounds = [
    [["A","B"],["A1","B1"],["C","D"],["C1","D1"],["E","F"],["E1","F1"]],
    [["A","C"],["A1","C1"],["B","E"],["B1","E1"],["D","F"],["D1","F1"]],
    [["A","D"],["A1","D1"],["B","F"],["B1","F1"],["C","E"],["C1","E1"]],
    [["A","E"],["A1","E1"],["B","D"],["B1","D1"],["C","F"],["C1","F1"]],
    [["A","F"],["A1","F1"],["B","C"],["B1","C1"],["D","E"],["D1","E1"]],
  ];

  // 6–10 roundai: vyrai ir moterys atskirai, bet tvarkaraštis tas pats
  const genderRounds = mixedRounds;

  // render mixed match label (vyras + moteris)
  const renderMixedLabel = (team1, team2) => {
    const t1 = players[team1] || { vyras: "", moteris: "" };
    const t2 = players[team2] || { vyras: "", moteris: "" };
    const left = [t1.vyras, t1.moteris].filter(Boolean).join(" + ") || team1;
    const right = [t2.vyras, t2.moteris].filter(Boolean).join(" + ") || team2;
    return `${left}  —  ${right}`;
  };

  // render gender match label (vyrai kartu, moterys kartu)
  const renderGenderLabel = (team1, team2) => {
    // pirma pora vyrai
    const t1vyras = players[team1.replace("1","")]?.vyras || team1.replace("1","");
    const t2vyras = players[team2.replace("1","")]?.vyras || team2.replace("1","");
    // antra pora moterys
    const t1moteris = players[team1.replace("1","1")]?.moteris || team1.replace("1","1");
    const t2moteris = players[team2.replace("1","1")]?.moteris || team2.replace("1","1");

    return [
      `${t1vyras} + ${players[team1]?.vyras ? t1vyras : ""} vs ${t2vyras} + ${players[team2]?.vyras ? t2vyras : ""}`,
      `${players[team1]?.moteris ? t1moteris : ""} vs ${players[team2]?.moteris ? t2moteris : ""}`
    ];
  };

  const renderMatchCard = (roundIndex, pair, matchIndex, isGenderRound) => {
    const [t1, t2] = pair;
    if (!isGenderRound) {
      const label = renderMixedLabel(t1,t2);
      const winnerRecorded = results[roundIndex] && results[roundIndex][matchIndex];
      return (
        <div className="match-card" key={`${roundIndex}-${matchIndex}-${t1}-${t2}`}>
          <div className="match-label">{label}</div>
          <div className="buttons">
            <button className={`btn ${winnerRecorded===t1?"win":""}`} onClick={()=>handleResult(roundIndex, matchIndex, t1)}>Laimėjo {t1}</button>
            <button className={`btn ${winnerRecorded===t2?"win":""}`} onClick={()=>handleResult(roundIndex, matchIndex, t2)}>Laimėjo {t2}</button>
          </div>
        </div>
      );
    } else {
      // round 6–10
      const maleTeam1 = t1.replace("1","");
      const maleTeam2 = t2.replace("1","");
      const femaleTeam1 = t1.includes("1") ? t1 : t1+"1";
      const femaleTeam2 = t2.includes("1") ? t2 : t2+"1";

      const maleLabel = [players[maleTeam1]?.vyras, players[maleTeam1==="A"? "A1":""]?.vyras].filter(Boolean).join(" + ") +
                        "  —  " +
                        [players[maleTeam2]?.vyras, players[maleTeam2==="B"? "B1":""]?.vyras].filter(Boolean).join(" + ");

      const femaleLabel = [players[femaleTeam1]?.moteris, players[femaleTeam1==="A1"? "A":""].moteris].filter(Boolean).join(" + ") +
                        "  —  " +
                        [players[femaleTeam2]?.moteris, players[femaleTeam2==="B1"? "B":""].moteris].filter(Boolean).join(" + ");

      return (
        <div key={`${roundIndex}-${matchIndex}-${t1}-${t2}`}>
          <div className="match-card">
            <div className="match-label">Vyrai: {maleLabel}</div>
            <div className="buttons">
              <button className="btn" onClick={()=>handleResult(roundIndex, matchIndex, maleTeam1)}>Laimėjo {maleTeam1}</button>
              <button className="btn" onClick={()=>handleResult(roundIndex, matchIndex, maleTeam2)}>Laimėjo {maleTeam2}</button>
            </div>
          </div>
          <div className="match-card">
            <div className="match-label">Moterys: {femaleLabel}</div>
            <div className="buttons">
              <button className="btn" onClick={()=>handleResult(roundIndex, matchIndex, femaleTeam1)}>Laimėjo {femaleTeam1}</button>
              <button className="btn" onClick={()=>handleResult(roundIndex, matchIndex, femaleTeam2)}>Laimėjo {femaleTeam2}</button>
            </div>
          </div>
        </div>
      );
    }
  };

  const calculateResults = () => {
    const scoreMap = {};
    Object.keys(results).forEach(r=>{
      const round = results[r];
      Object.values(round).forEach(w=>{
        if(w) scoreMap[w]=(scoreMap[w]||0)+1;
      });
    });
    // sujungiam A + A1
    const combined = {};
    teamsList.forEach(team=>{
      const base = team.replace("1","");
      combined[base] = (combined[base]||0) + (scoreMap[team]||0);
    });
    const sorted = Object.entries(combined).sort((a,b)=>b[1]-a[1]);
    setFinalResults(sorted);
  };

  return (
    <div className="container">
      <header>
        <h1>Smarūna Padelis</h1>
        <p className="subtitle">Įveskite žaidėjus, pažymėkite laimėjimus, skaičiuokite rezultatus</p>
      </header>

      <section className="teams-section">
        <h2>Komandų žaidėjai (vyras / moteris)</h2>
        <div className="teams-grid">
          {teamsList.map(team=>(
            <div className="team-card" key={team}>
              <div className="team-title">Komanda {team}</div>
              <input placeholder="Vyras" value={players[team]?.vyras||""} onChange={e=>handlePlayerChange(team,"vyras",e.target.value)}/>
              <input placeholder="Moteris" value={players[team]?.moteris||""} onChange={e=>handlePlayerChange(team,"moteris",e.target.value)}/>
            </div>
          ))}
        </div>
      </section>

      <section className="rounds-section">
        <h2>Tvarkaraštis — visi round'ai</h2>

        {mixedRounds.map((pairs,rIdx)=>(
          <div className="round-card" key={`mixed-${rIdx}`}>
            <h3>{rIdx+1} roundas (Mišrūs)</h3>
            {pairs.map((pair,mIdx)=>renderMatchCard(rIdx,pair,mIdx,false))}
          </div>
        ))}

        {genderRounds.map((pairs,idx)=>(
          <div className="round-card" key={`gender-${idx}`}>
            <h3>{idx+6} roundas (Vyrai / Moteris)</h3>
            {pairs.map((pair,mIdx)=>renderMatchCard(idx+5,pair,mIdx,true))}
          </div>
        ))}
      </section>

      <div className="controls">
        <button className="btn primary" onClick={calculateResults}>🏆 Skaičiuoti rezultatus</button>
        <button className="btn danger" onClick={resetTournament}>🔄 Pradėti naują turnyrą</button>
      </div>

      {finalResults && (
        <section className="results-card">
          <h2>Galutinė taškų lentelė</h2>
          <table>
            <thead>
              <tr>
                <th>Vieta</th>
                <th>Komanda</th>
                <th>Taškai</th>
              </tr>
            </thead>
            <tbody>
              {finalResults.map(([team, pts], i)=>(
                <tr key={team} className={i===0?"gold":i===1?"silver":i===2?"bronze":""}>
                  <td>{i+1}</td>
                  <td>{team}</td>
                  <td>{pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default App;
