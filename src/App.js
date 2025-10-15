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

  // results structure: { roundIndex: { matchIndex: winnerTeamString } }
  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem("results");
    return saved ? JSON.parse(saved) : {};
  });

  const [showNextRounds, setShowNextRounds] = useState(() => {
    return localStorage.getItem("showNextRounds") === "true";
  });

  const [finalResults, setFinalResults] = useState(null);

  // 1–5 mixed rounds (as you specified)
  const mixedRounds = [
    // Round 1
    [["A","B"],["A1","B1"],["C","D"],["C1","D1"],["E","F"],["E1","F1"]],
    // Round 2
    [["A","C"],["A1","C1"],["B","E"],["B1","E1"],["D","F"],["D1","F1"]],
    // Round 3
    [["A","D"],["A1","D1"],["B","F"],["B1","F1"],["C","E"],["C1","E1"]],
    // Round 4
    [["A","E"],["A1","E1"],["B","D"],["B1","D1"],["C","F"],["C1","F1"]],
    // Round 5
    [["A","F"],["A1","F1"],["B","C"],["B1","C1"],["D","E"],["D1","E1"]],
  ];

  // rounds 6-10 repeat same matchups but are gender-specific:
  // for each pair [X,Y] we render either male (if X has no '1') or female (if X has '1')
  const genderRounds = mixedRounds; // reuse structure

  // persist changes automatically
  useEffect(() => {
    localStorage.setItem("players", JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem("results", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    localStorage.setItem("showNextRounds", showNextRounds);
  }, [showNextRounds]);

  // helpers to update players / results
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

  // calculate final points: 1 point per win; then combine base teams (A + A1 -> A)
  const calculateResults = () => {
    const scoreMap = {}; // per team string (A, A1, etc.)
    Object.keys(results).forEach(roundKey => {
      const roundObj = results[roundKey] || {};
      Object.values(roundObj).forEach(winner => {
        if (winner) {
          scoreMap[winner] = (scoreMap[winner] || 0) + 1; // 1 point per win
        }
      });
    });

    // combine A + A1 under base A, etc.
    const combined = {};
    teamsList.forEach(team => {
      const base = team.replace("1","");
      combined[base] = (combined[base] || 0) + (scoreMap[team] || 0);
    });

    // sort desc
    const sorted = Object.entries(combined).sort((a,b) => b[1] - a[1]);
    setFinalResults(sorted);
  };

  // render label for mixed match: show "Vyras + Moteris" for each team if present
  const renderMixedLabel = (team1, team2) => {
    const t1 = players[team1] || { vyras: "", moteris: "" };
    const t2 = players[team2] || { vyras: "", moteris: "" };
    const left = [t1.vyras, t1.moteris].filter(Boolean).join(" + ") || team1;
    const right = [t2.vyras, t2.moteris].filter(Boolean).join(" + ") || team2;
    return `${left}  —  ${right}`;
  };

 // render label for gender match: shows both males and both females in one match
const renderGenderLabel = (team1, team2) => {
  // Vyrai: team + team1
  const male1 = [players[team1]?.vyras, players[team1+"1"]?.vyras].filter(Boolean).join(" + ") || team1;
  const male2 = [players[team2]?.vyras, players[team2+"1"]?.vyras].filter(Boolean).join(" + ") || team2;

  // Moterys: team + team1
  const female1 = [players[team1]?.moteris, players[team1+"1"]?.moteris].filter(Boolean).join(" + ") || team1+"1";
  const female2 = [players[team2]?.moteris, players[team2+"1"]?.moteris].filter(Boolean).join(" + ") || team2+"1";

  return [
    `Vyrai: ${male1}  vs  ${male2}`,
    `Moterys: ${female1}  vs  ${female2}`
  ];
};

  // generic match renderer (works for mixed and gender rounds)
  const renderMatchCard = (roundIndex, pair, matchIndex, isGenderRound) => {
    const [t1, t2] = pair;
    const label = isGenderRound ? renderGenderLabel(t1, t2) : renderMixedLabel(t1, t2);

    const winnerRecorded = results[roundIndex] && results[roundIndex][matchIndex];

    return (
      <div className="match-card" key={`${roundIndex}-${matchIndex}-${t1}-${t2}`}>
        <div className="match-label">{label}</div>
        <div className="buttons">
          <button
            className={`btn ${winnerRecorded === t1 ? "win" : ""}`}
            onClick={() => handleResult(roundIndex, matchIndex, t1)}
            aria-pressed={winnerRecorded === t1}
            title={`Pažymėti, kad laimėjo ${t1}`}
          >
            Laimėjo {t1}
          </button>
          <button
            className={`btn ${winnerRecorded === t2 ? "win" : ""}`}
            onClick={() => handleResult(roundIndex, matchIndex, t2)}
            aria-pressed={winnerRecorded === t2}
            title={`Pažymėti, kad laimėjo ${t2}`}
          >
            Laimėjo {t2}
          </button>
        </div>
      </div>
    );
  };

  const resetTournament = () => {
    localStorage.removeItem("players");
    localStorage.removeItem("results");
    localStorage.removeItem("showNextRounds");
    window.location.reload();
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
          {teamsList.map(team => (
            <div className="team-card" key={team}>
              <div className="team-title">Komanda {team}</div>
              <input
                placeholder="Vyras"
                value={players[team]?.vyras || ""}
                onChange={e => handlePlayerChange(team, "vyras", e.target.value)}
              />
              <input
                placeholder="Moteris"
                value={players[team]?.moteris || ""}
                onChange={e => handlePlayerChange(team, "moteris", e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounds-section">
        <h2>Tvarkaraštis — visi round'ai</h2>

        {/* Round 1–5: mixed */}
        {mixedRounds.map((roundPairs, rIdx) => {
          const roundNumber = rIdx + 1;
          return (
            <div className="round-card" key={`mixed-${rIdx}`}>
              <h3>{roundNumber} roundas (Mišrūs)</h3>
              {roundPairs.map((pair, mIdx) => renderMatchCard(rIdx, pair, mIdx, false))}
            </div>
          );
        })}

        {/* Round 6–10: gender rounds (6 maps to mixedRounds[0] etc.) */}
        {genderRounds.map((roundPairs, idx) => {
          const roundNumber = idx + 6;
          return (
            <div className="round-card" key={`gender-${idx}`}>
              <h3>{roundNumber} roundas (Vyrai / Moteris)</h3>
              {roundPairs.map((pair, mIdx) =>
                // roundIndex should be 5..9 for rounds 6..10
                renderMatchCard(idx + 5, pair, mIdx, true)
              )}
            </div>
          );
        })}
      </section>

      <div className="controls">
        <button className="btn primary" onClick={calculateResults}>🏆 Skaičiuoti rezultatus</button>
        <button className="btn" onClick={() => setShowNextRounds(!showNextRounds)}>
          {showNextRounds ? "Slėpti vėlesnius round'us" : "Rodyti visus round'us"}
        </button>
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
              {finalResults.map(([team, pts], i) => (
                <tr key={team} className={i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : ""}>
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
