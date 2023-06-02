import React, { useState, useEffect } from "react";
import "./Cube.css";

const Cube = ({changePlayer}) => {
    const [translateX, setTranslateX] = useState(300);

    useEffect(() => {
        if (Number(changePlayer) === 1) {
            setTranslateX(300);
        } else {
            setTranslateX(-300);
        }
    }, [changePlayer]);

    return (
        <div className="container">
            <div
                className="cube"
                style={{ transform: `translateX(${translateX}%)` }}
            >
                <div className="side front"></div>
            </div>
        </div>
    );
};

export default Cube;
