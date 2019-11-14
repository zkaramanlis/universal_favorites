import React from "react";
import PropTypes from "prop-types";
import Back from "./images/back.png";

function AboutMenu(props) {
    return(
        <div className="menu">
            <button id="onlyBack" className="menuButton" onClick={props.goBack}>
                <img src={Back} alt="back" className="icon" />
            </button>

            <p className="warningBlock">
                Universal Favorites is a Browser extension that provides a favorites system similar to a normal browsers, 
                but independent of any particular browser implementation! Easily sync favorites between any browser 
                that accepts chrome or firefox extensions in real time through google drive.
                <br /><br />
                All icons by <a href="https://icons8.com" className="aboutLink" target="_blank" rel="noopener noreferrer">Icons8.com</a>.
                <br /><br />
                Developed By Zachary Karamanlis. Source code available at <a href="https://github.com/zkaramanlis/universal_favorites" 
                    className="aboutLink" target="_blank" rel="noopener noreferrer">the project github page</a>.
            </p>
        </div>
    );
}

AboutMenu.propTypes = {
    goBack:PropTypes.func
};

export default AboutMenu;