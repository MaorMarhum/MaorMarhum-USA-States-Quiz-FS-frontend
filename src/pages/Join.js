import React, { useState } from "react";
import { Grid, Button, Typography, Paper, TextField } from "@mui/material";
import { useHistory } from "react-router-dom";

const Join = ({name, socket}) => {
  const [roomCode, setRoomCode] = useState("");
  const history = useHistory();
  const isFormValid = roomCode.trim().length === 6;

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCode = roomCode.toUpperCase();
    socket.emit("join", {name: name, roomCode: newCode})
    console.log(name, roomCode);
    history.push(`/room/${newCode}`);
    window.location.reload();
  };

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
            הצטרף לחדר
          </Typography>
          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <TextField
                label="קוד חדר"
                margin="normal"
                value={roomCode}
                onChange={(event) => setRoomCode(event.target.value)}
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={!isFormValid}
              >
                הצטרף
              </Button>
              <Button
                variant="contained"
                color="secondary"
                style={{ marginTop: "1rem" }}
                onClick={() => {
                  history.push("/");
                  window.location.reload();
                }}
              >
                חזרה
              </Button>
            </div>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Join;
