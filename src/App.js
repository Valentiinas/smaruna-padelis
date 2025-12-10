import React, { useState } from "react";
import "./index.css";

export default function App() {
  const [mode, setMode] = useState(null); // null, "4", "6"

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

  const teamsList =
    mode === "6"
      ? [
          "A",
          "A1",
          "B",
          "B1",
          "C",
          "C1",
          "D",
          "D1",
          "E",
          "E1",
          "F",
          "F1",
        ]
      : ["A", "A1", "B", "B1", "C", "C1", "D", "D1"]; // 4 courts → 8 teams → 16 players

  const [players, setPlayers] = useState(() => {
    const obj = {};
    teamsList.forEach((t) => (obj[t] = { vyras: "", moteris: "" }));
    return obj;
  });

  const [results, setResults] = useState({});
  const [finalResults, setFinalResults] = useState(null);

  // FULL MIXED ROUNDS
  const baseMixedRounds = [
    [
      ["A", "B"],
      ["A1", "B1"],
      ["C", "D"],
      ["C1", "D1"],
      ["E", "F"],
      ["E1", "F1"],
    ],
    [
      ["A", "C"],
      ["A1", "C1"],
      ["B", "E"],
      ["B1", "E1"],
      ["D", "F"],
      ["D1", "F1"],
    ],
    [
      ["A", "D"],
      ["A1", "D1"],
      ["B", "F"],
      ["B1", "F1"],
      ["C", "E"],
      ["C1", "E1"],
    ],
    [
      ["A", "E"],
      ["A1", "E1"],
      ["B", "D"],
      ["B1", "D1"],
      ["C", "F"],
      ["C1", "F1"],
    ],
    [
      ["A", "F"],
      ["A1", "F1"],
      ["B", "C"],
      ["B1", "C1"],
      ["D", "E"],
      ["D1", "E1"],
    ],
  ];

  // Trim to 4 courts
  const mixedRounds = mode === "6" ? baseMixedRounds : baseMixedRounds.map((r) => r.slice(0, 4));
  const genderRounds = mixedRounds;

  const handlePlayerChange = (team, gender, value) => {
    setPlayers((prev) => ({ ...prev, [team]: { ...prev[team], [gender]: value } }));
  };

  const handleResult = (roundIndex, matchIndex, winnerTeam) => {
    setResults((prev) => {
      return {
        ...prev,
        [roundIndex]: { ...(prev[roundIndex] || {}), [matchIndex]: winnerTeam },
      };
    });
  };

  const calculateResults = () => {
    const scoreMap = {};

    Object.values(results).forEach((round) => {
      Object.values(round).forEach((w) => {
        if (w) scoreMap[w] = (scoreMap[w] || 0) + 1;
      });
    });

    const combined = {};
    teamsList.forEach((team) => {
      const base = team.replace("1", "");
      combined[base] = (combined[base] || 0) + (scoreMap[team] || 0);
    });

    const sorted = Object.entries(combined).sort((a, b) => b[1] - a[1]);
    setFinalResults(sorted);
  };

  const renderMixedLabel = (t1, t2) => {
    const L = [players[t1].vyras, players[t1].moteris].filter(Boolean).join(" + ") || t1;
    const R = [players[t2].vyras, players[t2].moteris].filter(Boolean).join(" + ") || t2;
    return `${L} — ${R}`;
  };

  const renderGenderLabel = (t1, t2) => {
    const female = t1.includes("1");
    const base = (x) => x.replace("1", "");
    const gp = (b) => {
      const p = players[b];
      const p1 = players[b + "1"];
      return female
        ? [p.moteris, p1.moteris].filter(Boolean).join(" + ") || b
        : [p.vyras, p1.vyras].filter(Boolean).join(" + ") || b;
    };
    return `${gp(base(t1))} — ${gp(base(t2))}`;
  };

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

  return (
    <div className="container">
      <header>
        <h1>Smarūna Padelis — {mode === "4" ? "4 kortų" : "6 kortų"} turnyras</h1>
      </header>

      <section className="teams-section">
        <h2>Komandų žaidėjai</h2>
        <div className="teams-grid">
          {teamsList.map((t) => (
            <div className="team-card" key={t}>
              <div className="team-title">Komanda {t}</div>
              <input
                placeholder="Vyras"
                value={players[t].vyras}
                onChange={(e) => handlePlayerChange(t, "vyras", e.target.value)}
              />
              <input
                placeholder="Moteris"
                value={players[t].moteris}
                onChange={(e) => handlePlayerChange(t, "moteris", e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounds-section">
        <h2>Round'ai</h2>

        {mixedRounds.map((rp, rIdx) => (
          <div className="round-card" key={`m-${rIdx}`}>
            <h3>{rIdx + 1} roundas (Mišrūs)</h3>
            {rp.map((p, mIdx) => renderMatchCard(rIdx, p, mIdx, false))}
          </div>
        ))}

        {genderRounds.map((rp, idx) => (
          <div className="round-card" key={`g-${idx}`}>
            <h3>{idx + mixedRounds.length + 1} roundas (Vyrai / Moterys)</h3>
            {rp.map((p, mIdx) => renderMatchCard(idx + mixedRounds.length, p, mIdx, true))}
          </div>
        ))}
      </section>

      <div className="controls">
        <button className="btn primary" onClick={calculateResults}>
          Skaičiuoti rezultatus
        </button>
      </div>

      {finalResults && (
        <section className="results-card">
          <h2>Galutinė lentelė</h2>
          <table>
            <tbody>
              {finalResults.map(([t, pts], i) => (
                <tr key={t}>
                  <td>{i + 1}</td>
                  <td>{t}</td>
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