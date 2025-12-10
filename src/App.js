import React, { useState } from "react";

// ---- 4 COURT ROUNDS ----
const baseMixedRounds4 = [
  [["A", "D"], ["B", "C"]],
  [["A", "C"], ["B", "D"]],
  [["A", "B"], ["C", "D"]],
  [["A", "B"], ["C", "D"]],
  [["A", "C"], ["B", "D"]],
  [["A", "D"], ["B", "C"]],
  [["A", "B"], ["C", "D"]],
  [["A", "C"], ["B", "D"]]
];

// ---- 6 COURT ROUNDS ----
const baseMixedRounds6 = [
  [["A", "F"], ["B", "E"], ["C", "D"]],
  [["A", "E"], ["B", "D"], ["C", "F"]],
  [["A", "D"], ["B", "C"], ["E", "F"]],
  [["A", "C"], ["B", "F"], ["D", "E"]],
  [["A", "B"], ["C", "E"], ["D", "F"]],
  [["A", "B"], ["C", "D"], ["E", "F"]],
  [["A", "C"], ["B", "D"], ["E", "F"]],
  [["A", "D"], ["B", "E"], ["C", "F"]]
];

function App() {
  const [mode, setMode] = useState(null);

  if (!mode) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Pasirink kortų skaičių</h2>
        <button onClick={() => setMode(4)} style={{ marginRight: 10 }}>4 kortos</button>
        <button onClick={() => setMode(6)}>6 kortos</button>
      </div>
    );
  }

  // Now that mode is selected, teamsList can be used safely
  const teamsList = mode === 4 ? ["A", "B", "C", "D"] : ["A", "B", "C", "D", "E", "F"];

  const [players, setPlayers] = useState(() => {
    const initial = {};
    teamsList.forEach(t => (initial[t] = ""));
    return initial;
  });

  const [results, setResults] = useState({});

  const mixedRounds = mode === 4 ? baseMixedRounds4 : baseMixedRounds6;
  const genderRounds = mixedRounds;
  const fullRounds = [...mixedRounds, ...genderRounds];

  const updateResult = (roundIdx, pairIdx, winner) => {
    setResults(prev => ({ ...prev, [`r${roundIdx}p${pairIdx}`]: winner }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{mode} kortų turnyras</h2>

      <h3>Žaidėjai</h3>
      {teamsList.map(t => (
        <div key={t}>
          {t}: <input value={players[t]} onChange={e => setPlayers({ ...players, [t]: e.target.value })} />
        </div>
      ))}

      <h3>Tvarkaraštis</h3>
      {fullRounds.map((round, r) => (
        <div key={r} style={{ marginBottom: 20 }}>
          <h4>{r < mixedRounds.length ? `Mixed Round ${r + 1}` : `Gender Round ${r - mixedRounds.length + 1}`}</h4>
          {round.map((pair, p) => (
            <div key={p} style={{ marginBottom: 10 }}>
              {pair[0]} ({players[pair[0]]}) - {pair[1]} ({players[pair[1]]})
              <select
                value={results[`r${r}p${p}`] || ""}
                onChange={e => updateResult(r, p, e.target.value)}
                style={{ marginLeft: 10 }}
              >
                <option value="">—</option>
                <option value={pair[0]}>{pair[0]}</option>
                <option value={pair[1]}>{pair[1]}</option>
              </select>
            </div>
          ))}
        </div>
      ))}

      <h3>Rezultatai</h3>
      <ul>
        {Object.keys(results).map(k => (
          <li key={k}>{k}: {results[k]}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;import React, { useState } from "react";

// ---- 4 COURT ROUNDS ----
const baseMixedRounds4 = [
  [["A", "D"], ["B", "C"]],
  [["A", "C"], ["B", "D"]],
  [["A", "B"], ["C", "D"]],
  [["A", "B"], ["C", "D"]],
  [["A", "C"], ["B", "D"]],
  [["A", "D"], ["B", "C"]],
  [["A", "B"], ["C", "D"]],
  [["A", "C"], ["B", "D"]]
];

// ---- 6 COURT ROUNDS ----
const baseMixedRounds6 = [
  [["A", "F"], ["B", "E"], ["C", "D"]],
  [["A", "E"], ["B", "D"], ["C", "F"]],
  [["A", "D"], ["B", "C"], ["E", "F"]],
  [["A", "C"], ["B", "F"], ["D", "E"]],
  [["A", "B"], ["C", "E"], ["D", "F"]],
  [["A", "B"], ["C", "D"], ["E", "F"]],
  [["A", "C"], ["B", "D"], ["E", "F"]],
  [["A", "D"], ["B", "E"], ["C", "F"]]
];

function App() {
  const [mode, setMode] = useState(null);

  if (!mode) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Pasirink kortų skaičių</h2>
        <button onClick={() => setMode(4)} style={{ marginRight: 10 }}>4 kortos</button>
        <button onClick={() => setMode(6)}>6 kortos</button>
      </div>
    );
  }

  // Now that mode is selected, teamsList can be used safely
  const teamsList = mode === 4 ? ["A", "B", "C", "D"] : ["A", "B", "C", "D", "E", "F"];

  const [players, setPlayers] = useState(() => {
    const initial = {};
    teamsList.forEach(t => (initial[t] = ""));
    return initial;
  });

  const [results, setResults] = useState({});

  const mixedRounds = mode === 4 ? baseMixedRounds4 : baseMixedRounds6;
  const genderRounds = mixedRounds;
  const fullRounds = [...mixedRounds, ...genderRounds];

  const updateResult = (roundIdx, pairIdx, winner) => {
    setResults(prev => ({ ...prev, [`r${roundIdx}p${pairIdx}`]: winner }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{mode} kortų turnyras</h2>

      <h3>Žaidėjai</h3>
      {teamsList.map(t => (
        <div key={t}>
          {t}: <input value={players[t]} onChange={e => setPlayers({ ...players, [t]: e.target.value })} />
        </div>
      ))}

      <h3>Tvarkaraštis</h3>
      {fullRounds.map((round, r) => (
        <div key={r} style={{ marginBottom: 20 }}>
          <h4>{r < mixedRounds.length ? `Mixed Round ${r + 1}` : `Gender Round ${r - mixedRounds.length + 1}`}</h4>
          {round.map((pair, p) => (
            <div key={p} style={{ marginBottom: 10 }}>
              {pair[0]} ({players[pair[0]]}) - {pair[1]} ({players[pair[1]]})
              <select
                value={results[`r${r}p${p}`] || ""}
                onChange={e => updateResult(r, p, e.target.value)}
                style={{ marginLeft: 10 }}
              >
                <option value="">—</option>
                <option value={pair[0]}>{pair[0]}</option>
                <option value={pair[1]}>{pair[1]}</option>
              </select>
            </div>
          ))}
        </div>
      ))}

      <h3>Rezultatai</h3>
      <ul>
        {Object.keys(results).map(k => (
          <li key={k}>{k}: {results[k]}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;