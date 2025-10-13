import React, { useState } from "react";
import "./index.css";

// Visi 10 raundų + Mix / Vyrų / Moterų žaidimai
const initialRounds = [
  // Round 1
  { round: 1, team1: "A", team2: "B", winner: null },
  { round: 1, team1: "A1", team2: "B1", winner: null },
  { round: 1, team1: "C", team2: "D", winner: null },
  { round: 1, team1: "C1", team2: "D1", winner: null },
  { round: 1, team1: "E", team2: "F", winner: null },
  { round: 1, team1: "E1", team2: "F1", winner: null },

  // Round 2
  { round: 2, team1: "A", team2: "C", winner: null },
  { round: 2, team1: "A1", team2: "C1", winner: null },
  { round: 2, team1: "B", team2: "E", winner: null },
  { round: 2, team1: "B1", team2: "E1", winner: null },
  { round: 2, team1: "D", team2: "F", winner: null },
  { round: 2, team1: "D1", team2: "F1", winner: null },

  // Round 3
  { round: 3, team1: "A", team2: "D", winner: null },
  { round: 3, team1: "A1", team2: "D1", winner: null },
  { round: 3, team1: "B", team2: "F", winner: null },
  { round: 3, team1: "B1", team2: "F1", winner: null },
  { round: 3, team1: "C", team2: "E", winner: null },
  { round: 3, team1: "C1", team2: "E1", winner: null },

  // Round 4
  { round: 4, team1: "A", team2: "E", winner: null },
  { round: 4, team1: "A1", team2: "E1", winner: null },
  { round: 4, team1: "B", team2: "D", winner: null },
  { round: 4, team1: "B1", team2: "D1", winner: null },
  { round: 4, team1: "C",
