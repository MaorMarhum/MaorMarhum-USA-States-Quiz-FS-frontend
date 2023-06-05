import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const Scores = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch(`https://usa-states-quiz-fs.onrender.com/scores`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error retrieving scores");
        }
      })
      .then((data) => {
        setScores(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <TableContainer>
      <Table style={{ minWidth: "650" }} aria-label="my table">
        <TableHead>
          <TableRow>
            <TableCell align="center">שחקנים</TableCell>
            <TableCell align="center">תוצאה</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {scores.map((score, index) => (
            <TableRow key={index}>
              <TableCell align="center">
                {score.player1_name} + {score.player2_name}
              </TableCell>
              <TableCell align="center">{score.score} מדינות</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Scores;
