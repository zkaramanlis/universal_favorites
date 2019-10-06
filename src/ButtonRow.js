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
            <button onClick={props.settings} disabled={props.settingsDisabled} className="menuButton">
                {props.settingsDisabled ?
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        width="24" height="24" className="icon"
                        viewBox="0 0 172 172"
                        style={{"fill":"#000000"}}><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{"mixBlendMode":"normal"}}><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#cccccc"><path d="M69.27311,14.33333l-3.51335,18.08464c-5.90653,2.22752 -11.33046,5.34987 -16.08301,9.25228l-17.37077,-5.99089l-16.74089,28.97461l13.91341,12.09375c-0.53487,3.28395 -0.81185,6.32717 -0.81185,9.25228c0,2.9295 0.28528,5.96715 0.81185,9.25228v0.014l-13.91341,12.09375l16.74089,28.96061l17.35677,-5.97689c4.75299,3.90454 10.18919,7.00948 16.097,9.23828l3.51335,18.08464h33.45377l3.51335,-18.08464c5.91039,-2.22897 11.32824,-5.34628 16.083,-9.25227l17.37077,5.99088l16.72689,-28.96061l-13.89941,-12.10775c0.53486,-3.28395 0.81185,-6.32717 0.81185,-9.25228c0,-2.92072 -0.27857,-5.95999 -0.81185,-9.23828v-0.014l13.91341,-12.10775l-16.74088,-28.96061l-17.35678,5.97689c-4.75298,-3.90453 -10.18919,-7.00948 -16.097,-9.23828l-3.51335,-18.08464zM81.08691,28.66667h9.82617l2.78548,14.33333l7.47461,2.82747c4.50543,1.69806 8.5533,4.02927 12.06575,6.91471l6.18685,5.06706l13.77344,-4.73112l4.91308,8.49642l-11.00195,9.57422l1.25976,7.88054v0.014c0.43823,2.68706 0.62989,4.94121 0.62989,6.9567c0,2.0155 -0.19164,4.26931 -0.62989,6.9567l-1.27376,7.88053l11.00195,9.57422l-4.91309,8.51042l-13.75944,-4.74511l-6.20084,5.08105c-3.51245,2.88544 -7.54633,5.21665 -12.05175,6.91472h-0.014l-7.4746,2.82747l-2.78548,14.33333h-9.81218l-2.78548,-14.33333l-7.47461,-2.82747c-4.50544,-1.69806 -8.5533,-4.02927 -12.06575,-6.91472l-6.18685,-5.06706l-13.77344,4.73112l-4.91309,-8.49642l11.01595,-9.58822l-1.27376,-7.85254v-0.014c-0.43195,-2.69874 -0.62988,-4.95921 -0.62988,-6.9707c0,-2.0155 0.19165,-4.26931 0.62988,-6.9567l1.27376,-7.88053l-11.01595,-9.57422l4.91309,-8.51042l13.77344,4.74512l6.18685,-5.08105c3.51245,-2.88545 7.56032,-5.21665 12.06575,-6.91471l7.47461,-2.82747zM86,57.33333c-15.74175,0 -28.66667,12.92492 -28.66667,28.66667c0,15.74175 12.92492,28.66667 28.66667,28.66667c15.74175,0 28.66667,-12.92492 28.66667,-28.66667c0,-15.74175 -12.92492,-28.66667 -28.66667,-28.66667zM86,71.66667c7.96559,0 14.33333,6.36775 14.33333,14.33333c0,7.96559 -6.36775,14.33333 -14.33333,14.33333c-7.96559,0 -14.33333,-6.36775 -14.33333,-14.33333c0,-7.96559 6.36775,-14.33333 14.33333,-14.33333z"></path></g></g></svg>
                    : <img src="https://img.icons8.com/material-outlined/24/000000/settings.png" alt="settings" className="icon" />}
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
    settingsDisabled:PropTypes.bool,
    moveUp:PropTypes.func
};

export default ButtonRow;