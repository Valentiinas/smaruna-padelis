import React, { useState } from "react";
import "./index.css";

const initialRounds = [
  // 10 roundų pavyzdys, čia galima pridėti visus rezultatus
  { round: 1, team1: "A", team2: "B", score: "0 - 0" },
  { round: 1, team1: "A1", team2: "B1", score: "0 - 0" },
  { round: 1, team1: "C", team2: "D", score: "0 - 0" },
  { round: 1, team1: "C1", team2: "D1", score: "0 - 0" },
  { round: 1, team1: "E", team2: "F", score: "0 - 0" },
  { round: 1, team1: "E1", team2: "F1", score: "0 - 0" },
  // Čia pridėti visus kitus roundus (2–10)
];

export default function App() {
  const [rounds, setRounds] = useState(initialRounds);

  const handleUpdateScore = (index) => {
    // Čia galima pridėti logiką atnaujinti score
    const newRounds = [...rounds];
    newRounds[index].score = prompt(
      `Įveskite rezultatą: ${newRounds[index].team1} vs ${newRounds[index].team2}`,
      newRounds[index].score
    );
    setRounds(newRounds);
  };

  const getTeamColor = (team) => {
    return team.includes("1") ? "#34d399" : "#3b82f6"; // silpni žalia, stipri mėlyna
  };

  return (
    <div>
      <header>Smarūna Padelis</header>
      <main>
        <table className="table">
          <thead>
            <tr>
              <th>Round</th>
              <th>Komanda 1</th>
              <th>Komanda 2</th>
              <th>Rezultatas</th>
              <th>Veiksmai</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((r, i) => (
              <tr key={i}>
                <td>{r.round}</td>
                <td style={{ color: getTeamColor(r.team1), fontWeight: "600" }}>
                  {r.team1}
                </td>
                <td style={{ color: getTeamColor(r.team2), fontWeight: "600" }}>
                  {r.team2}
                </td>
                <td>{r.score}</td>
                <td>
                  <button className="button" onClick={() => handleUpdateScore(i)}>
                    Įvesti
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