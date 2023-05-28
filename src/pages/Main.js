import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Room from "./Room";
import Game from "./Game";
import Join from "./Join";
import io from "socket.io-client";
import { useCookies } from "react-cookie";

const socket = io("https://usa-states-quiz.adaptable.app/", {
  query: { url: window.location.href },
});

const generateRoomCode = (length) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
};

const Main = () => {
  const [roomCode, setRoomCode] = useState();
  const [cookies] = useCookies(["playerIndex"]);

  useEffect(() => {
    setRoomCode(generateRoomCode(6));
  }, []);

  const setCookieWithExpiration = (cookieName, cookieValue) => {
    const expirationDate = new Date();
    expirationDate.setTime(
      expirationDate.getTime() + 1 * 60 * 60 * 1000
    );

    document.cookie = `${cookieName}=${cookieValue};expires=${expirationDate.toUTCString()};path=/`;;
  };

  const renderHomePage = () => {
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
              ברוכים הבאים למשחק מדינות ארצות הברית
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
                to={`/room/${roomCode}`}
                component={Link}
                style={{
                  borderTopLeftRadius: "0",
                  borderTopRightRadius: "50",
                  borderBottomRightRadius: "50",
                  borderBottomLeftRadius: "0",
                }}
              >
                צור חדר
              </Button>
              <Button
                color="secondary"
                variant="contained"
                to="/join"
                component={Link}
                style={{
                  borderTopLeftRadius: "50",
                  borderTopRightRadius: "0",
                  borderBottomRightRadius: "0",
                  borderBottomLeftRadius: "50",
                }}
              >
                הצטרף לחדר
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={renderHomePage} />
        <Route
          path="/room/:roomCode"
          render={(props) => (
            <Room {...props} socket={socket} setCookie={setCookieWithExpiration} />
          )}
        />
        <Route
          path="/game/:roomCode"
          render={(props) => (
            <Game socket={socket} setCookie={setCookieWithExpiration} {...props} cookies={cookies} />
          )}
        />
      </Switch>
      <Route path="/join" component={Join} />
    </Router>
  );
};

export default Main;
