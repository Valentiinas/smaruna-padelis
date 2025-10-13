import React, { useState } from "react";
import "./index.css";

const initialRoundsData = [
  { round: 1, team1: "A", team2: "B", winner: null },
  { round: 1, team1: "A1", team2: "B1", winner: null },
  { round: 1, team1: "C", team2: "D", winner: null },
  { round: 1, team1: "C1", team2: "D1", winner: null },
  { round: 1, team1: "E", team2: "F", winner: null },
  { round: 1, team1: "E1", team2: "F1", winner: null },
  // ... pridėkite likusius rounds 2-10 kaip ankstesniame kode
];

export default function App() {
  const [rounds, setRounds] = useState(initialRoundsData);
  const [currentRound, setCurrentRound] = useState(1);
  const [pointsTable, setPointsTable] = useState({});
  const [champion, setChampion] = useState(null);

  // Žaidėjų sąrašai komandoms
  const [teamsPlayers, setTeamsPlayers] = useState({
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    F: "",
  });

  const handlePlayersChange = (team, value) => {
    setTeamsPlayers({ ...teamsPlayers, [team]: value });
  };

  const roundsToShow = rounds.filter((r) => r.round === currentRound);

  const handleWinner = (index, winner) => {
    const newRounds = [...rounds];
    const globalIndex = rounds.indexOf(roundsToShow[index]);
    newRounds[globalIndex].winner = winner;
    setRounds(newRounds);
  };

  const nextRound = () => {
    if (currentRound < 10) setCurrentRound(currentRound + 1);
    else alert("Tai paskutinis roundas!");
  };

  const calculateChampion = () => {
    const points = {};
    rounds.forEach((r) => {
      if (r.winner) {
        const team = r.winner.replace("1", "");
        points[team] = (points[team] || 0) + 1;
      }
    });

    setPointsTable(points);

    // Rikiavimas pagal taškus
    const sortedPoints = Object.fromEntries(
      Object.entries(points).sort(([, a], [, b]) => b - a)
    );
    setPointsTable(sortedPoints);

    // Nugalėtojas
    const [first] = Object.keys(sortedPoints);
    setChampion(first);
  };

  const getTeamColor = (team) => (team.includes("1") ? "#34d399" : "#3b82f6");

  // Funkcija, kad parodytų tikrus vardus
  const getPlayerNames = (team) => {
    const mainTeam = team.replace("1", "");
    return teamsPlayers[mainTeam] || team;
  };

  return (
    <div>
      <header style={{ padding: "1rem", fontSize: "2rem", background: "#f3f4f6" }}>
        Smarūna Padelis
      </header>

      <main style={{ textAlign: "center", padding: "1rem" }}>
        <h3>Įveskite žaidėjų vardus komandoms</h3>
        {["A", "B", "C", "D", "E", "F"].map((team) => (
          <div key={team} style={{ margin: "0.5rem" }}>
            <label>
              Komanda {team}:{" "}
              <input
                type="text"
                placeholder="Tomas, Marius"
                value={teamsPlayers[team]}
                onChange={(e) => handlePlayersChange(team, e.target.value)}
              />
            </label>
          </div>
        ))}

        <button
          className="button"
          onClick={calculateChampion}
          style={{ margin: "1rem", padding: "0.5rem 1rem" }}
        >
          Skaičiuoti nugalėtoją
        </button>

        {champion && <h2>Nugalėtojas: {champion}</h2>}

        {Object.keys(pointsTable).length > 0 && (
          <>
            <h3>Taškų lentelė (rikiuota pagal taškus)</h3>
            <table className="table" style={{ margin: "0 auto", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Komanda</th>
                  <th>Taškai</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(pointsTable).map(([team, points], index) => (
                  <tr key={team} style={{ fontWeight: index === 0 ? 700 : 500 }}>
                    <td>{team}</td>
                    <td>{points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <h2>Round {currentRound}</h2>
        <table className="table" style={{ margin: "0 auto", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Komanda 1</th>
              <th>Komanda 2</th>
              <th>Winner</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {roundsToShow.map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ color: getTeamColor(r.team1), fontWeight: 600 }}>
                  {getPlayerNames(r.team1)}
                </td>
                <td style={{ color: getTeamColor(r.team2), fontWeight: 600 }}>
                  {getPlayerNames(r.team2)}
                </td>
                <td>{r.winner ? getPlayerNames(r.winner) : "-"}</td>
                <td>
                  <button className="button" onClick={() => handleWinner(i, r.team1)}>
                    Laimėjo
                  </button>{" "}
                  <button className="button" onClick={() => handleWinner(i, r.team2)}>
                    Laimėjo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="button"
          onClick={nextRound}
          style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
        >
          Pereiti į kitą round
        </button>
      </main>
    </div>
  );
}
