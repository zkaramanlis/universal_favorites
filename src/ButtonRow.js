import React from "react";
import { useDrop } from "react-dnd";
import PropTypes from "prop-types";

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
                {props.backDisabled ?
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        width="50" height="50" className="icon"
                        viewBox="0 0 172 172"
                        style={{"fill":"#000000"}}><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{"mixBlendMode":"normal"}}><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#cccccc"><path d="M120.26563,10.25281c-1.78719,0.05375 -3.48031,0.80625 -4.73,2.08281l-68.8,68.8c-2.6875,2.6875 -2.6875,7.04125 0,9.72875l68.8,68.8c1.72,1.80062 4.28656,2.52625 6.70531,1.89469c2.40531,-0.63156 4.28656,-2.51281 4.91813,-4.91813c0.63156,-2.41875 -0.09406,-4.98531 -1.89469,-6.70531l-63.93563,-63.93563l63.93563,-63.93562c2.02906,-1.97531 2.64719,-4.99875 1.54531,-7.61906c-1.11531,-2.60688 -3.70875,-4.27313 -6.54406,-4.1925z"></path></g></g></svg>
                    : <img src="https://img.icons8.com/ios-filled/50/000000/back.png" alt="back" className="icon" />}
            </button>
            <button onClick={props.add} disabled={props.addDisabled} className="menuButton">
                {props.addDisabled ?
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        width="50" height="50" className="icon"
                        viewBox="0 0 172 172"
                        style={{"fill":"#000000"}}><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{"mixBlendMode":"normal"}}><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#cccccc"><path d="M86,6.88c-43.65603,0 -79.12,35.46397 -79.12,79.12c0,43.65603 35.46397,79.12 79.12,79.12c43.65603,0 79.12,-35.46397 79.12,-79.12c0,-43.65603 -35.46397,-79.12 -79.12,-79.12zM86,13.76c39.93779,0 72.24,32.30221 72.24,72.24c0,39.93779 -32.30221,72.24 -72.24,72.24c-39.93779,0 -72.24,-32.30221 -72.24,-72.24c0,-39.93779 32.30221,-72.24 72.24,-72.24zM85.94625,58.43297c-1.89722,0.02966 -3.41223,1.58976 -3.38625,3.48703v20.64h-20.64c-1.24059,-0.01754 -2.39452,0.63425 -3.01993,1.7058c-0.62541,1.07155 -0.62541,2.39684 0,3.46839c0.62541,1.07155 1.77935,1.72335 3.01993,1.7058h20.64v20.64c-0.01754,1.24059 0.63425,2.39452 1.7058,3.01993c1.07155,0.62541 2.39684,0.62541 3.46839,0c1.07155,-0.62541 1.72335,-1.77935 1.7058,-3.01993v-20.64h20.64c1.24059,0.01754 2.39452,-0.63425 3.01993,-1.7058c0.62541,-1.07155 0.62541,-2.39684 0,-3.46839c-0.62541,-1.07155 -1.77935,-1.72335 -3.01993,-1.7058h-20.64v-20.64c0.01273,-0.92983 -0.35149,-1.82522 -1.00967,-2.48214c-0.65819,-0.65692 -1.55427,-1.01942 -2.48408,-1.00489z"></path></g></g></svg>
                    : <img src="https://img.icons8.com/ios/50/000000/add.png" alt="add" className="icon" />}
            </button>
            <button onClick={props.settings} className="menuButton">
                <img src="https://img.icons8.com/material-outlined/24/000000/settings.png" alt="settings" className="icon" />
            </button>
        </div>
    );
}

ButtonRow.propTypes = {
    goBack:PropTypes.func,
    add:PropTypes.func,
    settings:PropTypes.func,
    backDisabled:PropTypes.bool,
    addDisabled:PropTypes.bool,
    moveUp:PropTypes.func
};

export default ButtonRow;