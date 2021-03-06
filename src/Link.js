/*global chrome browser*/
import React, { useEffect, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import PropTypes from "prop-types";
import { browserName } from "react-device-detect";
import folder from "./images/folder.png";
import rightArrow from "./images/right_arrow.png";
import rightArrowDarkMode from "./images/right_arrow_dark_mode.png";
import defaultImage from "./images/default.png";
import defaultImageDarkMode from "./images/default_dark_mode.png";

function FolderSubDrop(props) {
    const [, drop] = useDrop({
        accept:"LINK",
        drop({ id: draggingId }){
            props.dropElement(props.id, draggingId, true);
        },
    });

    return(
        <div ref={drop} className="menu-item-content">
            <img src={folder} alt="folder" className="icon" />
            {props.label}
        </div>
    );
}

FolderSubDrop.propTypes = {
    label:PropTypes.string,
    dropElement:PropTypes.func,
    id:PropTypes.number
};

function Link(props) {
    const [, drag, preview] = useDrag({
        item: { type: "LINK" },
        begin(){
            props.saveDraggingId(props.id);
            return {type: "LINK", label:props.item.label, link:props.item.link, draggingType:props.item.type, id:props.id};
        },
    });

    const [{isOver}, drop] = useDrop({
        accept:"LINK",
        drop({ id: draggingId }, monitor){
            if(!monitor.didDrop()) {
                props.dropElement(props.id, draggingId, false);
            }
        },
        collect: monitor => ({
            isOver: monitor.isOver({ shallow: true })
        }),
    });

    const [faviconLoaded, setFaviconLoaded] = useState(false);

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    });

    let style = {};
    if(props.item.clicked) {
        style.backgroundColor = "lightgray";
    }
    if(isOver) {
        if(props.id < props.draggingId) {
            style.borderTop ="2px dashed gray";
        }
        else if(props.id > props.draggingId) {
            style.borderBottom = "2px dashed gray";
        }
    }

    let label = props.item.label;
    if(label.length > 32){
        label = label.substring(0, 31);
        label += "...";
    }

    if(props.item.type === "folder"){
        return (
            <div
                ref={node => drag(drop(node))}
                className="menu-item"
                style={style}
                onClick={(event) => clickHandler(event,
                    () => props.openFolder(props.item, props.id))}
            >
                <FolderSubDrop label={label} dropElement={props.dropElement} id={props.id} />
                {props.darkMode ? <img src={rightArrowDarkMode} alt="arrow" className="icon arrow" /> :
                    <img src={rightArrow} alt="arrow" className="icon arrow" />}
            </div>);
    }

    let url = props.item.link;
    if(!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }

    return(
        <div 
            ref={node => drag(drop(node))}
            className="menu-item" 
            style={style}
            onMouseDown={middleClickHandler}
            onClick={(event) => clickHandler(event, () => {
                if(browserName === "Firefox" || browserName === "Edge") {
                    browser.tabs.update({url:url});
                } else {
                    chrome.tabs.update({url:url});
                }
            })}
        >
            <div className="menu-item-content">
                {props.darkMode ? <img src={defaultImageDarkMode} alt="link" className="icon" hidden={faviconLoaded} /> :
                    <img src={defaultImage} alt="link" className="icon" hidden={faviconLoaded} />}
                <img src={"https://www.google.com/s2/favicons?domain=" + props.item.link} alt="link" 
                    className="icon" onLoad={() => setFaviconLoaded(true)} hidden={!faviconLoaded} />
                {label}
            </div>
        </div>);

    function middleClickHandler(event) {
        if(event.button === 1){
            event.preventDefault();
            if(browserName === "Firefox" || browserName === "Edge") {
                browser.tabs.create({url:url, active:false});
            } else {
                chrome.tabs.create({url:url, active:false});
            }
            return false;
        }
    }

    function clickHandler(event, callback) {
        if(event.ctrlKey) {
            props.setClicked(props.id);
        } else if(event.shiftKey) {
            props.setShiftClicked(props.id);
        } else {
            callback();
        }
    }
}

Link.propTypes = {
    item:PropTypes.object,
    openFolder:PropTypes.func,
    id:PropTypes.number,
    saveDraggingId:PropTypes.func,
    dropElement:PropTypes.func,
    draggingId:PropTypes.number,
    setClicked:PropTypes.func,
    setShiftClicked:PropTypes.func,
    darkMode:PropTypes.bool
};

export default Link;