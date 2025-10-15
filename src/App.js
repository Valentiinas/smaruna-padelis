import React, { useState, useEffect } from "react";
import "./index.css";

const baseTeams = ["A","B","C","D","E","F"];

const mixedRounds = [
  [["A","B"],["A1","B1"],["C","D"],["C1","D1"],["E","F"],["E1","F1"]],
  [["A","C"],["A1","C1"],["B","E"],["B1","E1"],["D","F"],["D1","F1"]],
  [["A","D"],["A1","D1"],["B","F"],["B1","F1"],["C","E"],["C1","E1"]],
  [["A","E"],["A1","E1"],["B","D"],["B1","D1"],["C","F"],["C1","F1"]],
  [["A","F"],["A1","F1"],["B","C"],["B1","C1"],["D","E"],["D1","E1"]],
];

export default function App() {
  const [players,setPlayers] = useState(()=>{
    const saved = localStorage.getItem("players");
    if(saved) return JSON.parse(saved);
    const p = {};
    baseTeams.forEach(t=>{
      p[t]={vyras:"",moteris:""};
      p[t+"1"]={vyras:"",moteris:""};
    });
    return p;
  });

  const [results,setResults] = useState(()=>{
    const saved = localStorage.getItem("results");
    return saved ? JSON.parse(saved) : {};
  });

  const [finalResults,setFinalResults] = useState(null);

  useEffect(()=>{ localStorage.setItem("players",JSON.stringify(players)) },[players]);
  useEffect(()=>{ localStorage.setItem("results",JSON.stringify(results)) },[results]);

  const handlePlayerChange = (team,gender,value)=>{
    setPlayers(prev=>({...prev,[team]:{...prev[team],[gender]:value}}));
  }

  const handleResult = (round,match,winner)=>{
    setResults(prev=>{
      const next = {...prev};
      if(!next[round]) next[round]={};
      next[round][match]=winner;
      return next;
    });
  }

  const resetTournament = ()=>{
    localStorage.removeItem("players");
    localStorage.removeItem("results");
    window.location.reload();
  }

  const renderMixedLabel = (t1,t2)=>{
    const p1 = [players[t1].vyras, players[t1].moteris].filter(Boolean).join(" + ");
    const p2 = [players[t2].vyras, players[t2].moteris].filter(Boolean).join(" + ");
    return `${p1 || t1} — ${p2 || t2}`;
  }

  const renderGenderLabel = (t1,t2)=>{
    const male1 = [players[t1].vyras, players[t1+"1"].vyras].filter(Boolean).join(" + ") || t1;
    const male2 = [players[t2].vyras, players[t2+"1"].vyras].filter(Boolean).join(" + ") || t2;
    const female1 = [players[t1].moteris, players[t1+"1"].moteris].filter(Boolean).join(" + ") || t1;
    const female2 = [players[t2].moteris, players[t2+"1"].moteris].filter(Boolean).join(" + ") || t2;
    return [
      `Vyrai: ${male1} vs ${male2}`,
      `Moterys: ${female1} vs ${female2}`
    ];
  }

  const renderMatchCard = (roundIndex,pair,matchIndex,isGender)=>{
    if(!isGender){
      const label = renderMixedLabel(pair[0],pair[1]);
      const winnerRecorded = results[roundIndex]?.[matchIndex];
      return (
        <div key={`${roundIndex}-${matchIndex}`} className="match-card">
          <div>{label}</div>
          <div className="buttons">
            <button className={winnerRecorded===pair[0]?"win":""} onClick={()=>handleResult(roundIndex,matchIndex,pair[0])}>{pair[0]}</button>
            <button className={winnerRecorded===pair[1]?"win":""} onClick={()=>handleResult(roundIndex,matchIndex,pair[1])}>{pair[1]}</button>
          </div>
        </div>
      )
    } else {
      const [maleLabel,femaleLabel] = renderGenderLabel(pair[0],pair[1]);
      const mWinner = results[roundIndex]?.[matchIndex+"m"];
      const fWinner = results[roundIndex]?.[matchIndex+"f"];
      return (
        <div key={`${roundIndex}-${matchIndex}`} className="gender-round">
          <div className="match-card">
            <div>{maleLabel}</div>
            <div className="buttons">
              <button className={mWinner===pair[0]?"win":""} onClick={()=>handleResult(roundIndex,matchIndex+"m",pair[0])}>{pair[0]}</button>
              <button className={mWinner===pair[1]?"win":""} onClick={()=>handleResult(roundIndex,matchIndex+"m",pair[1])}>{pair[1]}</button>
            </div>
          </div>
          <div className="match-card">
            <div>{femaleLabel}</div>
            <div className="buttons">
              <button className={fWinner===pair[0]?"win":""} onClick={()=>handleResult(roundIndex,matchIndex+"f",pair[0])}>{pair[0]}</button>
              <button className={fWinner===pair[1]?"win":""} onClick={()=>handleResult(roundIndex,matchIndex+"f",pair[1])}>{pair[1]}</button>
            </div>
          </div>
        </div>
      )
    }
  }

  const calculateResults = ()=>{
    const scoreMap = {};
    Object.values(results).forEach(round=>{
      Object.values(round).forEach(w=>{
        if(!w) return;
        scoreMap[w]=(scoreMap[w]||0)+1;
      })
    });
    const combined = {};
    Object.keys(players).forEach(team=>{
      const base = team.replace("1","");
      combined[base] = (combined[base]||0) + (scoreMap[team]||0);
    });
    const sorted = Object.entries(combined).sort((a,b)=>b[1]-a[1]);
    setFinalResults(sorted);
  }

  return (
    <div className="container">
      <h1>Smarūna Padelis</h1>
      <section className="teams">
        <h2>Žaidėjai</h2>
        <div className="teams-grid">
          {Object.keys(players).map(t=>(
            <div key={t} className="team-card">
              <div>Komanda {t}</div>
              <input placeholder="Vyras" value={players[t].vyras} onChange={e=>handlePlayerChange(t,"vyras",e.target.value)}/>
              <input placeholder="Moteris" value={players[t].moteris} onChange={e=>handlePlayerChange(t,"moteris",e.target.value)}/>
            </div>
          ))}
        </div>
      </section>

      <section className="rounds">
        <h2>Tvarkaraštis</h2>
        {mixedRounds.map((r,i)=>(
          <div key={i} className="round-card">
            <h3>{i+1} roundas (Mišrūs)</h3>
            {r.map((pair,mIdx)=>renderMatchCard(i,pair,mIdx,false))}
          </div>
        ))}
        {mixedRounds.map((r,i)=>(
          <div key={i+5} className="round-card">
            <h3>{i+6} roundas (Vyrai / Moteris)</h3>
            {r.map((pair,mIdx)=>renderMatchCard(i+5,pair,mIdx,true))}
          </div>
        ))}
      </section>

      <div className="controls">
        <button className="primary" onClick={calculateResults}>Skaičiuoti rezultatus</button>
        <button className="danger" onClick={resetTournament}>Pradėti naują turnyrą</button>
      </div>

      {finalResults && (
        <section className="results">
          <h2>Galutinė lentelė</h2>
          <table>
            <thead>
              <tr><th>Vieta</th><th>Komanda</th><th>Taškai</th></tr>
            </thead>
            <tbody>
              {finalResults.map(([team,pts],i)=>(
                <tr key={team}>
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
  )
}
