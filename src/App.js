import React, { useState } from "react";
import "./index.css";

function App() {
  const [mode, setMode] = useState(null); // null = pasirinkimo ekranas

  // --- TURNYRO PASIRINKIMAS ------------------------------------------
  if (!mode) {
    return (
      <div className="container select-mode">
        <h1>Pasirink turnyro tipą</h1>
        <button className="btn primary" onClick={() => setMode("4")}>
          4 kortų · 16 žmonių
        </button>
        <button className="btn primary" onClick={() => setMode("6")}>
          6 kortų · 24 žmonės
        </button>
      </div>
    );
  }

  // --- KOMANDŲ SĄRAŠAI ------------------------------------------
  const teamsList =
    mode === "6"
      ? ["A","A1","B","B1","C","C1","D","D1","E","E1","F","F1"]
      : ["A","A1","B","B1","C","C1","D","D1"]; // 4 courts

  // Žaidėjų būsena
  const [players, setPlayers] = useState(() => {
    return teamsList.reduce((acc, t) => {
      acc[t] = { vyras: "", moteris: "" };
      return acc;
    }, {});
  });

  const [results, setResults] = useState({});
  const [finalResults, setFinalResults] = useState(null);

  // --- MATCH TVARKARAŠTIS ------------------------------------------
  // 6 KORTŲ (originalus)
  const mixedRounds6 = [
    [["A","B"],["A1","B1"],["C","D"],["C1","D1"],["E","F"],["E1","F1"]],
    [["A","C"],["A1","C1"],["B","E"],["B1","E1"],["D","F"],["D1","F1"]],
    [["A","D"],["A1","D1"],["B","F"],["B1","F1"],["C","E"],["C1","E1"]],
    [["A","E"],["A1","E1"],["B","D"],["B1","D1"],["C","F"],["C1","F1"]],
    [["A","F"],["A1","F1"],["B","C"],["B1","C1"],["D","E"],["D1","E1"]],
  ];

  // 4 KORTŲ (A–D)
  const mixedRounds4 = [
    [["A","B"],["C","D"],["A1","B1"],["C1","D1"]],
    [["A","C"],["B","D"],["A1","C1"],["B1","D1"]],
    [["A","D"],["B","C"],["A1","D1"],["B1","C1"]],
    [["A","B"],["C","D"],["A1","B1"],["C1","D1"]],
    [["A","C"],["B","D"],["A1","C1"],["B1","D1"]],
  ];

  const mixedRounds = mode === "6" ? mixedRounds6 : mixedRounds4;
  const genderRounds = mixedRounds; // tie patys, tik kita rodomo label logika

  // --- HANDLERIAI ------------------------------------------
  const handlePlayerChange = (team, gender, value) => {
    setPlayers(prev => ({
      ...prev,
      [team]: { ...prev[team], [gender]: value }
    }));
  };

  const handleResult = (roundIndex, matchIndex, winnerTeam) => {
    setResults(prev => {
      const next = { ...prev };
      next[roundIndex] = {
        ...(next[roundIndex] || {}),
        [matchIndex]: winnerTeam
      };
      return next;
    });
  };

  // --- REZULTATŲ SKAIČIAVIMAS ------------------------------------------
  const calculateResults = () => {
    const scoreMap = {};

    Object.values(results).forEach(round => {
      Object.values(round).forEach(w => {
        if (w) scoreMap[w] = (scoreMap[w] || 0) + 1;
      });
    });

    const combined = {};

    teamsList.forEach(team => {
      const base = team.replace("1", "");
      combined[base] = (combined[base] || 0) + (scoreMap[team] || 0);
    });

    const sorted = Object.entries(combined).sort((a, b) => b[1] - a[1]);
    setFinalResults(sorted);
  };

  // --- UI LABEL FUNKCIJOS ------------------------------------------
  const renderMixedLabel = (t1, t2) => {
    const a = players[t1];
    const b = players[t2];

    const L = [a.vyras, a.moteris].filter(Boolean).join(" + ") || t1;
    const R = [b.vyras, b.moteris].filter(Boolean).join(" + ") || t2;

    return `${L} — ${R}`;
  };

  const renderGenderLabel = (t1, t2) => {
    const isFemale = t1.includes("1");

    const getPlayers = (base) => {
      const p = players[base] || {};
      const p1 = players[base + "1"] || {};
      return isFemale
        ? [p.moteris, p1.moteris].filter(Boolean).join(" + ") || base
        : [p.vyras, p1.vyras].filter(Boolean).join(" + ") || base;
    };

    return `${getPlayers(t1.replace("1",""))} — ${getPlayers(t2.replace("1",""))}`;
  };

  // --- MATCH CARD ------------------------------------------
  const renderMatchCard = (roundIndex, pair, matchIndex, isGender) => {
    const [t1, t2] = pair;
    const lbl = isGender ? renderGenderLabel(t1, t2) : renderMixedLabel(t1, t2);
    const winner = results[roundIndex]?.[matchIndex];

    return (
      <div className="match-card" key={`${roundIndex}-${matchIndex}`}>
        <div className="match-label">{lbl}</div>

        <div className="buttons">
          <button
            className={`btn ${winner === t1 ? "win" : ""}`}
            onClick={() => handleResult(roundIndex, matchIndex, t1)}
          >
            Laimėjo {t1}
          </button>
          <button
            className={`btn ${winner === t2 ? "win" : ""}`}
            onClick={() => handleResult(roundIndex, matchIndex, t2)}
          >
            Laimėjo {t2}
          </button>
        </div>
      </div>
    );
  };

  // --- RENDER --------------------------------------------------
  return (
    <div className="container">
      <header>
        <h1>Smarūna Padelis — {mode === "4" ? "4 kortų" : "6 kortų"} turnyras</h1>
      </header>

      <section className="teams-section">
        <h2>Komandų žaidėjai</h2>

        <div className="teams-grid">
          {teamsList.map(team => (
            <div className="team-card" key={team}>
              <div className="team-title">Komanda {team}</div>

              <input
                placeholder="Vyras"
                value={players[team].vyras}
                onChange={(e) => handlePlayerChange(team, "vyras", e.target.value)}
              />
              <input
                placeholder="Moteris"
                value={players[team].moteris}
                onChange={(e) => handlePlayerChange(team, "moteris", e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounds-section">
        <h2>Round'ai</h2>

        {mixedRounds.map((roundPairs, rIdx) => (
          <div className="round-card" key={`m-${rIdx}`}>
            <h3>{rIdx + 1} roundas (Mišrūs)</h3>
            {roundPairs.map((p, mIdx) =>
              renderMatchCard(rIdx, p, mIdx, false)
            )}
          </div>
        ))}

        {genderRounds.map((roundPairs, idx) => (
          <div className="round-card" key={`g-${idx}`}>
            <h3>{idx + 6} roundas (Vyrai / Moterys)</h3>
            {roundPairs.map((p, mIdx) =>
              renderMatchCard(idx + 5, p, mIdx, true)
            )}
          </div>
        ))}
      </section>

      <div className="controls">
        <button className="btn primary" onClick={calculateResults}>
          🏆 Skaičiuoti rezultatus
        </button>
      </div>

      {finalResults && (
        <section className="results-card">
          <h2>Galutinė lentelė</h2>
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
                <tr key={team}>
                  <td>{i + 1}</td>
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
