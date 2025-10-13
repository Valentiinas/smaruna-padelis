import React, { useState } from "react";
import "./index.css";

const roundsData = [
  { round: 1, team1: "A", team2: "B", winner: null },
  { round: 1, team1: "A1", team2: "B1", winner: null },
  { round: 1, team1: "C", team2: "D", winner: null },
  { round: 1, team1: "C1", team2: "D1", winner: null },
  { round: 1, team1: "E", team2: "F", winner: null },
  { round: 1, team1: "E1", team2: "F1", winner: null },

  { round: 2, team1: "A", team2: "C", winner: null },
  { round: 2, team1: "A1", team2: "C1", winner: null },
  { round: 2, team1: "B", team2: "E", winner: null },
  { round: 2, team1: "B1", team2: "E1", winner: null },
  { round: 2, team1: "D", team2: "F", winner: null },
  { round: 2, team1: "D1", team2: "F1", winner: null },

  { round: 3, team1: "A", team2: "D", winner: null },
  { round: 3, team1: "A1", team2: "D1", winner: null },
  { round: 3, team1: "B", team2: "F", winner: null },
  { round: 3, team1: "B1", team2: "F1", winner: null },
  { round: 3, team1: "C", team2: "E", winner: null },
  { round: 3, team1: "C1", team2: "E1", winner: null },

  { round: 4, team1: "A", team2: "E", winner: null },
  { round: 4, team1: "A1", team2: "E1", winner: null },
  { round: 4, team1: "B", team2: "D", winner: null },
  { round: 4, team1: "B1", team2: "D1", winner: null },
  { round: 4, team1: "C", team2: "F", winner: null },
  { round: 4, team1: "C1", team2: "F1", winner: null },

  { round: 5, team1: "A", team2: "F", winner: null },
  { round: 5, team1: "A1", team2: "F1", winner: null },
  { round: 5, team1: "B", team2: "C", winner: null },
  { round: 5, team1: "B1", team2: "C1", winner: null },
  { round: 5, team1: "D", team2: "E", winner: null },
  { round: 5, team1: "D1", team2: "E1", winner: null },
];

export default function App() {
  const [rounds, setRounds] = useState(roundsData);
  const [champion, setChampion] = useState(null);

  const handleWinner = (index, winner) => {
    const newRounds = [...rounds];
    newRounds[index].winner = winner;
    setRounds(newRounds);
  };

  const calculateChampion = () => {
    const points = {};
    rounds.forEach((r) => {
      if (r.winner) {
        points[r.winner] = (points[r.winner] || 0) + 1;
      }
    });

    let maxPoints = 0;
    let champ = null;
    for (let team in points) {
      if (points[team] > maxPoints) {
        maxPoints = points[team];
        champ = team;
      }
    }
    setChampion(champ);
  };

  const getTeamColor = (team) => (team.includes("1") ? "#34d399" : "#3b82f6");

  return (
    <div>
      <header>Smarūna Padelis</header>
      <main style={{ textAlign: "center" }}>
        <button className="button" onClick={calculateChampion} style={{ margin: "1rem" }}>
          Skaičiuoti nugalėtoją
        </button>
        {champion && <h2>Nugalėtojas: {champion}</h2>}

        <table className="table">
          <thead>
            <tr>
              <th>Round</th>
              <th>Komanda 1</th>
              <th>Komanda 2</th>
              <th>Winner</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((r, i) => (
              <tr key={i}>
                <td>{r.round}</td>
                <td style={{ color: getTeamColor(r.team1), fontWeight: "600" }}>{r.team1}</td>
                <td style={{ color: getTeamColor(r.team2), fontWeight: "600" }}>{r.team2}</td>
                <td>{r.winner || "-"}</td>
                <td>
                  <button className="button" onClick={() => handleWinner(i, r.team1)}>
                    {r.team1} Laimėjo
                  </button>{" "}
                  <button className="button" onClick={() => handleWinner(i, r.team2)}>
                    {r.team2} Laimėjo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
