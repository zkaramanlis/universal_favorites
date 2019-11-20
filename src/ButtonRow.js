import React from "react";
import { useDrop } from "react-dnd";
import PropTypes from "prop-types";
import Back from "./images/back.png";
import BackDarkMode from "./images/back_dark_mode.png";
import BackDisabled from "./images/back_disabled.png";
import Add from "./images/add.png";
import AddDarkMode from "./images/add_dark_mode.png";
import AddDisabled from "./images/add_disabled.png";
import Settings from "./images/settings.png";
import SettingsDarkMode from "./images/settings_dark_mode.png";
import SettingsDisabled from "./images/settings_disabled.png";

function ButtonRow(props) {
    const [, drop] = useDrop({
        accept:"LINK",
        drop({ id: draggingId }){
            props.moveUp(draggingId);
        },
    });

    return(
        <div id="buttonRow">
            <button
                ref={drop}
                onClick={props.goBack} 
                disabled={props.backDisabled} 
                id="backButton" 
                className="menuButton"
            >
                {props.backDisabled ? <img src={BackDisabled} alt="back" className="icon" />
                    : props.darkMode ? <img src={BackDarkMode} alt="back" className="icon" /> :
                        <img src={Back} alt="back" className="icon" />}
            </button>
            <button onClick={props.add} disabled={props.addDisabled} className="menuButton">
                {props.addDisabled ? <img src={AddDisabled} alt="add" className="icon" />
                    : props.darkMode ? <img src={AddDarkMode} alt="add" className="icon" /> :
                        <img src={Add} alt="add" className="icon" />}
            </button>
            <button onClick={props.settings} disabled={props.settingsDisabled} className="menuButton">
                {props.settingsDisabled ? <img src={SettingsDisabled} alt="settings" className="icon" />
                    : props.darkMode ? <img src={SettingsDarkMode} alt="settings" className="icon" /> :
                        <img src={Settings} alt="settings" className="icon" />}
            </button>
        </div>
    );
}

ButtonRow.propTypes = {
    goBack:PropTypes.func,
    add:PropTypes.func,
    settings:PropTypes.func,
    settingsDisabled:PropTypes.bool,
    backDisabled:PropTypes.bool,
    addDisabled:PropTypes.bool,
    moveUp:PropTypes.func,
    darkMode:PropTypes.bool
};

export default ButtonRow;