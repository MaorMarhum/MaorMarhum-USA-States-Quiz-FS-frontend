import React, { useState, useEffect, useRef } from "react";
import { Grid, Button, Typography, Paper, TextField } from "@mui/material";
import Data from "../Data";
import Countdown from "../components/Countdown";
import Success from "../assets/success.mp3";
import CountdownSound from "../assets/countdown.mp3";
import Error from "../assets/error.mp3";

const Game = ({ cookies, socket }) => {
  const [states, setStates] = useState(Data);
  const [stateToRemove, setStateToRemove] = useState("");
  const currentPlayerRef = useRef(cookies.playerIndex);
  const [changePlayer, setChangePlayer] = useState(currentPlayerRef.current);
  const [seconds, setSeconds] = useState(45);
  const [countOver, setCountOver] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [noStates, setNoStates] = useState([]);
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [winMessage, setWinMessage] = useState("");
  const audioSuccess = useRef(new Audio(Success));
  const audioError = useRef(new Audio(Error));
  const audioCountdownSound = useRef(new Audio(CountdownSound));

  const resetSeconds = () => {
    setSeconds(45);
    setCountOver(false);
    setCountOver(true);
  };

  const handleRemove = () => {
    if (states.includes(stateToRemove)) {
      setStates(states.filter((state) => state !== stateToRemove));
      setNoStates([...noStates, stateToRemove]);
      audioSuccess.current.play();
      audioCountdownSound.current.pause();
      socket.emit("success", stateToRemove);
      setTimeout(() => {
        setChangePlayer(null);
      }, 2000);
      setStateToRemove("");
      setTimeout(() => {
        resetSeconds();
      }, 1000);
      setSuccess("כל הכבוד!");
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } else if (noStates.includes(stateToRemove)) {
      audioError.current.play();
      setError("מדינה זו כבר שומשה");
      setTimeout(() => {
        setError("");
      }, 2000);
    } else {
      audioError.current.play();
      setError("שם זה אינו מדינה בארצות הברית, אנא בדוק איות");
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  useEffect(() => {
    socket.on("firstTurn", (turnNumber) => {
      setChangePlayer(turnNumber);
    });
    socket.on("yourTurn", ({ turnNumber, stateToRemove }) => {
      if (states.includes(stateToRemove)) {
        setStates(states.filter((state) => state !== stateToRemove));
        setNoStates([...noStates, stateToRemove]);
      }
      setChangePlayer(turnNumber);
      resetSeconds();
    });
    socket.on("gameOver", () => {
      setWinMessage("אתה ניצחת!");
      setShowWinMessage(true);
    });
    if (seconds === 0) {
      socket.emit("gameOver");
      setWinMessage("אתה הפסדת!");
      setShowWinMessage(true);
    }
  }, [socket, states, noStates, seconds]);

  if (showWinMessage) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper elevation={3} style={{ padding: "2rem" }}>
            <Typography align="center" variant="h4" gutterBottom>
              {winMessage}
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={() => (window.location.href = "/")}
              >
                בחזרה לדף הבית
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  }

  if (Number(changePlayer) === 1) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper elevation={3} style={{ padding: "2rem" }}>
            <Typography align="center" variant="h4" gutterBottom>
              עכשיו תורך
            </Typography>
            <Countdown
              countOver={countOver}
              seconds={seconds}
              setSeconds={setSeconds}
              audioCountdownSound={audioCountdownSound}
              firstRender={true}
              changePlayer={changePlayer}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TextField
                label="אנא הכנס שם מדינה..."
                margin="normal"
                value={stateToRemove}
                onChange={(event) => setStateToRemove(event.target.value)}
                sx={{
                  "& label": {
                    left: "unset",
                    right: "1.75rem",
                    transformOrigin: "right",
                    fontSize: "1rem",
                  },
                  "& legend": {
                    textAlign: "right",
                    fontSize: "1rem",
                  },
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Button
                type="submit"
                color="primary"
                variant="contained"
                onClick={handleRemove}
              >
                נסה את מזלך
              </Button>
            </div>
            <div
              style={{
                fontSize: "20px",
                lineHeight: "15px",
                color: "red",
                marginTop: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
            <div
              style={{
                fontSize: "20px",
                lineHeight: "15px",
                color: "green",
                marginTop: "1rem",
                textAlign: "center",
              }}
            >
              {success}
            </div>
            <div style={{ textAlign: "center", fontSize: "30px" }}>
              <p style={{ marginBottom: "1rem", marginTop: "2rem" }}>
                מדינות ששומשו
              </p>
              <ol
                style={{
                  fontSize: "20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridGap: "0.5rem",
                  listStyleType: "none",
                }}
              >
                {noStates.map((state, index) => {
                  return <li key={index}>{state}</li>;
                })}
              </ol>
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={10} sm={8} md={6} lg={4}>
          <Paper elevation={3} style={{ padding: "2rem" }}>
            <Typography align="center" variant="h4" gutterBottom>
              אנא המתן לתורך...
            </Typography>
            <Countdown
              countOver={countOver}
              seconds={seconds}
              setSeconds={setSeconds}
              firstRender={false}
              audioCountdownSound={audioCountdownSound}
              changePlayer={changePlayer}
            />
            <div style={{ textAlign: "center", fontSize: "30px" }}>
              <p style={{ marginBottom: "1rem", marginTop: "2rem" }}>
                מדינות ששומשו
              </p>
              <ol
                style={{
                  fontSize: "20px",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gridGap: "0.5rem",
                  listStyleType: "none",
                }}
              >
                {noStates.map((state, index) => {
                  return <li key={index}>{state}</li>;
                })}
              </ol>
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  }
};

export default Game;
