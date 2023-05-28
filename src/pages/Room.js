import React, { useEffect, useState } from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { useParams, Link, useHistory } from "react-router-dom";

const Room = ({ setCookie, socket }) => {
  const [users, setUsers] = useState(1);
  const { roomCode } = useParams();
  const history = useHistory();
  let url = window.location.href;

  useEffect(() => {
    socket.on("userCount", (count) => {
      setUsers(count);
    });

    return () => {
      socket.off("userCount");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("userLeft", (count) => {
      setUsers(count);
    });

    return () => {
      socket.off("userLeft");
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("joinRoom", url);
  }, [socket, url]);

  const handleButtonClick = () => {
    socket.emit("startGame", { url: url, roomCode: roomCode });
  };

  useEffect(() => {
    socket.on("navigateToURL", (url) => {
      history.push(url);
    });

    return () => {
      socket.off("navigateToURL");
    };
  }, [history, socket]);

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
            קוד החדר שלך: {roomCode}
          </Typography>
          <Typography align="center" variant="h6" gutterBottom>
            מספר המשתתפים: {users}
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              disabled={users === 2 ? false : true}
              color="success"
              to={`/game/${roomCode}`}
              component={Link}
              onClick={handleButtonClick}
            >
              התחל במשחק
            </Button>
            <Typography align="center" color="red" variant="p" gutterBottom>
              {users === 2
                ? null
                : users === 1
                ? "אין מספיק משתתפים"
                : "יש יותר מידי משתתפים"}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                history.push("/");
                window.location.reload();
              }}
            >
              צא מהחדר
            </Button>
          </div>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Room;
