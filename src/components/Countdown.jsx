import React, { useEffect, useState } from "react";
import "./Countdown.css";

const Countdown = ({
  countOver,
  seconds,
  setSeconds,
  audioCountdownSound,
  firstRender,
  changePlayer,
}) => {
  const [isFirstRender, setIsFirstRender] = useState(false);

  useEffect(() => {
    setIsFirstRender(firstRender);
  }, [firstRender]);

  useEffect(() => {
    if (changePlayer === null && !audioCountdownSound.current.paused) {
      try {
        audioCountdownSound.current.pause();
      } catch (error) {
        console.log("Pause error:", error);
      }
    }
  }, [changePlayer, audioCountdownSound]);

  useEffect(() => {
    let intervalId = null;

    if (isFirstRender) {
      if (countOver) {
        setSeconds(45);
        intervalId = setInterval(() => {
          setSeconds((seconds) => {
            if (seconds < 12) {
              try {
                audioCountdownSound.current.currentTime = 0;
                if (audioCountdownSound.current.paused) {
                  audioCountdownSound.current.play();
                }
              } catch (error) {
                console.log("Play error:", error);
              }
            }
            if (seconds === 0) {
              clearInterval(intervalId);
              try {
                if (!audioCountdownSound.current.paused) {
                  audioCountdownSound.current.pause();
                }
              } catch (error) {
                console.log("Pause error:", error);
              }
            }
            return seconds === 0 ? 45 : seconds - 1;
          });
        }, 1000);
      }
      return () => clearInterval(intervalId);
    } else {
      if (countOver) {
        setSeconds(45);
        intervalId = setInterval(() => {
          setSeconds((seconds) => {
            if (seconds === 0) {
              clearInterval(intervalId);
            }
            return seconds === 0 ? 45 : seconds - 1;
          });
        }, 1000);
      }
      return () => clearInterval(intervalId);
    }
  }, [countOver, setSeconds, audioCountdownSound, isFirstRender]);

  return (
    <div className={seconds < 10 ? "less-than-10 count" : "count"}>
      {seconds} שניות נותרו
    </div>
  );
};

export default Countdown;
