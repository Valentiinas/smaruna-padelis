import React, { useState } from "react";
import "./index.css";

function App() {
  const teamsList = ["A", "A1", "B", "B1", "C", "C1", "D", "D1"];
  const [players, setPlayers] = useState(
    teamsList.reduce((acc, team) => {
      acc[team] = { vyras: "", moteris: "" };
      return acc;
    }, {})
  );
  const [results, setResults] = useState({});
  const [showNextRounds, setShowNextRounds] = useState(false);
  const [finalResults, setFinalResults] = useState(null);

  const rounds = [
    ["A", "A1", "B", "B1"],
    ["C", "C1", "D", "D1"],
    ["A", "B", "C", "D"],
    ["A1", "B1", "C1", "D1"],
    ["A", "C1", "B", "D1"],
    ["A", "B", "A1", "B1"],
    ["C", "D", "C1", "D1"],
    ["A", "C", "A1", "C1"],
    ["B", "D", "B1", "D1"],
    ["A", "D1", "B", "C1"],
  ];

  const handlePlayerChange = (team, gender, value) => {
    setPlayers((prev) => ({
      ...prev,
      [team]: { ...prev[team], [gender]: value },
    }));
  };

  const handleResult = (roundIndex, matchIndex, winner) => {
    setResults((prev) => ({
      ...prev,
      [roundIndex]: {
        ...prev[roundIndex],
        [matchIndex]: winner,
      },
    }));
  };

  const calculateResults = () => {
    let scoreMap = {};

    // sujungiam visus taskus
    Object.values(results).forEach((round) => {
      Object.values(round).forEach((winner) => {
        if (winner) {
          scoreMap[winner] = (scoreMap[winner] || 0) + 5;
        }
      });
    });

    // sujungiam vyrų/moterų taškus, jei reikia
    const combined = {};
    for (let team of teamsList) {
      const base = team.replace("1", "");
      combined[base] = (combined[base] || 0) + (scoreMap[team] || 0);
    }

    const sorted = Object.entries(combined).sort((a, b) => b[1] - a[1]);
    setFinalResults(sorted);
  };

  const renderMatch = (roundIndex, t1, t2, matchIndex) => {
    // nuo 6 roundo — vyrai atskirai (A/A1 → A), moterys (A/A1 → A1)
    const maleRound = roundIndex >= 5;

    const team1 =
      maleRound && t1.endsWith("1") ? t1.slice(0, -1) : maleRound ? t1 : t1;
    const team2 =
      maleRound && t2.endsWith("1") ? t2.slice(0, -1) : maleRound ? t2 : t2;

    const p1v = players[t1]?.vyras || "";
    const p1m = players[t1]?.moteris || "";
    const p2v = players[t2]?.vyras || "";
    const p2m = players[t2]?.moteris || "";

    let matchLabel;
    if (maleRound) {
      matchLabel = `${p1v || team1} vs ${p2v || team2}`;
    } else {
      matchLabel = `${p1v || team1} ${p1m ? "ir " + p1m : ""} – ${
        p2v || team2
      } ${p2m ? "ir " + p2m : ""}`;
    }

    return (
      <div key={matchIndex} className="match-card">
        <div className="match-label">{matchLabel}</div>
        <div className="buttons">
          <button
            className={`btn ${results[roundIndex]?.[matchIndex] === t1 ? "win" : ""}`}
            onClick={() => handleResult(roundIndex, matchIndex, t1)}
          >
            Laimėjo {t1}
          </button>
          <button
            className={`btn ${results[roundIndex]?.[matchIndex] === t2 ? "win" : ""}`}
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
      <h1>🎾 Smaruna Padelis</h1>

      <div className="teams-section">
        <h2>Komandos</h2>
        {teamsList.map((team) => (
          <div key={team} className="team-card">
            <h3>Komanda {team}</h3>
            <input
              type="text"
              placeholder="Vyras"
              value={players[team].vyras}
              onChange={(e) => handlePlayerChange(team, "vyras", e.target.value)}
            />
            <input
              type="text"
              placeholder="Moteris"
              value={players[team].moteris}
              onChange={(e) =>
                handlePlayerChange(team, "moteris", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <h2>Round'ai</h2>
      {rounds.slice(0, showNextRounds ? 10 : 5).map((round, i) => (
        <div key={i} className="round-card">
          <h3>{i + 1} Roundas</h3>
          {renderMatch(i, round[0], round[1], 0)}
          {renderMatch(i, round[2], round[3], 1)}
        </div>
      ))}

      {!showNextRounds && (
        <button className="btn next" onClick={() => setShowNextRounds(true)}>
          ➡️ Pereiti į kitus roundus
        </button>
      )}

      <button className="btn calc" onClick={calculateResults}>
        🏆 Skaičiuoti taškus
      </button>

      {finalResults && (
        <div className="results-card">
          <h3>🏅 Galutiniai rezultatai</h3>
          <table>
            <thead>
              <tr>
                <th>Vieta</th>
                <th>Komanda</th>
                <th>Taškai</th>
              </tr>
            </thead>
            <tbody>
              {finalResults.map(([team, points], index) => (
                <tr key={team}>
                  <td>{index + 1}</td>
                  <td>{team}</td>
                  <td>{points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
