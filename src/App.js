import React, { useState, useEffect } from "react";

const strongTeams = ["A", "B", "C", "D", "E", "F"];
const weakTeams = ["A1", "B1", "C1", "D1", "E1", "F1"];

// 10 raundų fiksuotas tvarkaraštis (Mix + Vyrai/Moterys)
const allRounds = [
  // Mix 1-5
  [
    {team1: "A", team2: "B"}, {team1: "A1", team2: "B1"},
    {team1: "C", team2: "D"}, {team1: "C1", team2: "D1"},
    {team1: "E", team2: "F"}, {team1: "E1", team2: "F1"}
  ],
  [
    {team1: "A", team2: "C"}, {team1: "A1", team2: "C1"},
    {team1: "B", team2: "E"}, {team1: "B1", team2: "E1"},
    {team1: "D", team2: "F"}, {team1: "D1", team2: "F1"}
  ],
  [
    {team1: "A", team2: "D"}, {team1: "A1", team2: "D1"},
    {team1: "B", team2: "F"}, {team1: "B1", team2: "F1"},
    {team1: "C", team2: "E"}, {team1: "C1", team2: "E1"}
  ],
  [
    {team1: "A", team2: "E"}, {team1: "A1", team2: "E1"},
    {team1: "B", team2: "D"}, {team1: "B1", team2: "D1"},
    {team1: "C", team2: "F"}, {team1: "C1", team2: "F1"}
  ],
  [
    {team1: "A", team2: "F"}, {team1: "A1", team2: "F1"},
    {team1: "B", team2: "C"}, {team1: "B1", team2: "C1"},
    {team1: "D", team2: "E"}, {team1: "D1", team2: "E1"}
  ],
  // Vyrai / Moterys 6-10
  [
    {team1: "A", team2: "B"}, {team1: "A1", team2: "B1"},
    {team1: "C", team2: "D"}, {team1: "C1", team2: "D1"},
    {team1: "E", team2: "F"}, {team1: "E1", team2: "F1"}
  ],
  [
    {team1: "A", team2: "C"}, {team1: "A1", team2: "C1"},
    {team1: "B", team2: "E"}, {team1: "B1", team2: "E1"},
    {team1: "D", team2: "F"}, {team1: "D1", team2: "F1"}
  ],
  [
    {team1: "A", team2: "D"}, {team1: "A1", team2: "D1"},
    {team1: "B", team2: "F"}, {team1: "B1", team2: "F1"},
    {team1: "C", team2: "E"}, {team1: "C1", team2: "E1"}
  ],
  [
    {team1: "A", team2: "E"}, {team1: "A1", team2: "E1"},
    {team1: "B", team2: "D"}, {team1: "B1", team2: "D1"},
    {team1: "C", team2: "F"}, {team1: "C1", team2: "F1"}
  ],
  [
    {team1: "A", team2: "F"}, {team1: "A1", team2: "F1"},
    {team1: "B", team2: "C"}, {team1: "B1", team2: "C1"},
    {team1: "D", team2: "E"}, {team1: "D1", team2: "E1"}
  ]
];

export default function App() {
  const [matches, setMatches] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const storedMatches = localStorage.getItem('smarunaMatches');
    if(storedMatches){
      setMatches(JSON.parse(storedMatches));
    } else {
      setMatches(JSON.parse(JSON.stringify(allRounds)));
    }
  }, []);

  useEffect(()=>{
    localStorage.setItem('smarunaMatches', JSON.stringify(matches));
  },[matches]);

  const handleWinner = (roundIndex, matchIndex, winner) => {
    const newMatches = JSON.parse(JSON.stringify(matches));
    newMatches[roundIndex][matchIndex].winner = winner;
    setMatches(newMatches);
  };

  const calculateResults = () => {
    const points = {};
    [...strongTeams,...weakTeams].forEach(t => points[t]=0);
    matches.forEach(round => round.forEach(m => { if(m.winner) points[m.winner]+=1 }));
    const table = strongTeams.map(t => ({team: t, points: points[t]+(points[t+'1']||0)}));
    table.sort((a,b)=>b.points - a.points);
    setResults(table);
  };

  const newTournament = () => {
    localStorage.removeItem('smarunaMatches');
    setMatches(JSON.parse(JSON.stringify(allRounds)));
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 font-sans">
      <h1 className="text-4xl font-bold text-center text-green-700 mb-6 border-b pb-2">Smarūna Padelis 🟢</h1>

      {matches.map((round, roundIndex)=>(
        <div key={roundIndex} className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Raundas {roundIndex+1} {roundIndex<5?'(Mix)':'(Vyrai / Moterys)'}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {round.map((m,i)=>(
              <div key={i} className="bg-white p-3 rounded-lg shadow flex justify-between items-center">
                <span>{m.team1} vs {m.team2}</span>
                <div>
                  <button className={`px-2 py-1 rounded mr-1 ${m.winner===m.team1?'bg-green-200':'bg-green-100'} hover:bg-green-300`} onClick={()=>handleWinner(roundIndex,i,m.team1)}>{m.team1}</button>
                  <button className={`px-2 py-1 rounded ${m.winner===m.team2?'bg-yellow-200':'bg-yellow-100'} hover:bg-yellow-300`} onClick={()=>handleWinner(roundIndex,i,m.team2)}>{m.team2}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-center gap-4 mt-6">
        <button onClick={calculateResults} className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">Skaičiuoti rezultatus</button>
        <button onClick={newTournament} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Naujas turnyras</button>
      </div>

      {results.length>0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-center mb-4">Rezultatų lentelė</h2>
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-1">Komanda</th>
                <th className="border px-3 py-1">Taškai</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r,i)=>(
                <tr key={i} className={i===0?'bg-green-50':''}>
                  <td className="border px-3 py-1">{r.team}</td>
                  <td className="border px-3 py-1">{r.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center mt-4 text-lg font-semibold">🏆 Laimėjo: {results[0].team} su {results[0].points} taškais</p>
        </div>
      )}

    </div>
  );
}