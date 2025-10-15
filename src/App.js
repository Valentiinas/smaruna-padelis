import React, { useState } from "react";
import "./index.css";

function App() {
  const teamsList = ["A", "A1", "B", "B1", "C", "C1", "D", "D1", "E", "E1", "F", "F1"];
  const [players, setPlayers] = useState(
    teamsList.reduce((acc, team) => {
      acc[team] = { vyras: "", moteris: "" };
      return acc;
    }, {})
  );
  const [results, setResults] = useState({});
  const [showNextRounds, setShowNextRounds] = useState(false);
  const [finalResults, setFinalResults] = useState(null);

  // ✅ 5 roundai mišrūs + 5 roundai vyrai/moterys atskirai
  const mixedRounds = [
    [["A", "B"], ["A1", "B1"], ["C", "D"], ["C1", "D1"], ["E", "F"], ["E1", "F1"]],
    [["A", "C"], ["A1", "C1"], ["B", "E"], ["B1", "E1"], ["D", "F"], ["D1", "F1"]],
    [["A", "D"], ["A1", "D1"], ["B", "F"], ["B1", "F1"], ["C", "E"], ["C1", "E1"]],
    [["A", "E"], ["A1", "E1"], ["B", "D"], ["B1", "D1"], ["C", "F"], ["C1", "F1"]],
    [["A", "F"], ["A1", "F1"], ["B", "C"], ["B1", "C1"], ["D", "E"], ["D1", "E1"]],
  ];

  // nuo 6 roundo — vyrai prieš vyrus, moterys prieš moteris
  const genderRounds = mixedRounds;

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

    Object.values(results).forEach((round) => {
      Object.values(round).forEach((winner) => {
        if (winner) {
          scoreMap[winner] = (scoreMap[winner] || 0) + 5;
        }
      });
    });

    // sujungti vyru/moteru taskus
    const combined = {};
    for (let team of teamsList) {
      const base = team.replace("1", "");
      combined[base] = (combined[base] || 0) + (scoreMap[team] || 0);
    }

    const sorted = Object.entries(combined).sort((a, b) => b[1] - a[1]);
    setFinalResults(sorted);
  };

  const renderMatch = (roundIndex, team1, team2, matchIndex, isGenderRound) => {
    let label = "";

    if (isGenderRound) {
      // 6-10 roundas – atskirai vyrai/moterys
      label = (
        <>
          <div className="match-label">
            👨 {players[team1]?.vyras || team1} vs {players[team2]?.vyras || team2}
          </div>
          <div className="match-label">
            👩 {players[team1 + "1"]?.moteris || team1 + "1"} vs{" "}
            {players[team2 + "1"]?.moteris || team2 + "1"}
          </div>
        </>
      );
    } else {
      label = (
        <div className="match-label">
          {players[team1]?.vyras || team1} {players[team1]?.moteris ? "ir " + players[team1]?.moteris : ""} –{" "}
          {players[team2]?.vyras || team2} {players[team2]?.moteris ? "ir " + players[team2]?.moteris : ""}
        </div>
      );
    }

    return (
      <div key={matchIndex} className="match-card">
        {label}
        <div className="buttons">
          <button
            className={`btn ${results[roundIndex]?.[matchIndex] === team1 ? "win" : ""}`}
            onClick={() => handleResult(roundIndex, matchIndex, team1)}
          >
            Laimėjo {team1}
          </button>
          <button
            className={`btn ${results[roundIndex]?.[matchIndex] === team2 ? "win" : ""}`}
            onClick={() => handleResult(roundIndex, matchIndex, team2)}
          >
            Laimėjo {team2}
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
              onChange={(e) => handlePlayerChange(team, "moteris", e.target.value)}
            />
          </div>
        ))}
      </div>

      <h2>Round'ai</h2>

      {/* 1–5 */}
      {mixedRounds.map((round, i) => (
        <div key={i} className="round-card">
          <h3>{i + 1} Roundas</h3>
          {round.map(([team1, team2], idx) => renderMatch(i, team1, team2, idx, false))}
        </div>
      ))}

      {/* 6–10 */}
      {showNextRounds &&
        genderRounds.map((round, i) => (
          <div key={i + 5} className="round-card">
            <h3>{i + 6} Roundas (Vyrai / Moterys)</h3>
            {round.map(([team1, team2], idx) => renderMatch(i + 5, team1, team2, idx, true))}
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
                <tr key={team} className={index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : ""}>
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
