/*global chrome browser*/
import React, { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import PropTypes from "prop-types";
import { browserName } from "react-device-detect";

function FolderSubDrop(props) {
    const [, drop] = useDrop({
        accept:"LINK",
        drop({ id: draggingId }){
            props.dropElement(props.id, draggingId, true);
        },
    });

    return(
        <div ref={drop} className="menu-item-content">
            <img src="https://img.icons8.com/color/48/000000/folder-invoices.png" alt="folder" className="icon" />
            {props.label}
        </div>
    );
}

FolderSubDrop.propTypes = {
    label:PropTypes.string,
    dropElement:PropTypes.func,
    id:PropTypes.number
};

function LinkMobile(props) {
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
                ref={node => drop(node)}
                className="menu-item"
                style={style}
                onClick={(event) => clickHandler(event,
                    () => props.openFolder(props.item.data, props.id))}
            >
                <FolderSubDrop label={label} dropElement={props.dropElement} id={props.id} />
                <img src="https://img.icons8.com/metro/26/000000/drag-reorder.png" alt="drag section" ref={node => drag(node)} className="icon dragIcon" />
            </div>);
    }

    let url = props.item.link;
    if(!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "http://" + url;
    }

    return(
        <div 
            ref={node => drop(node)}
            className="menu-item" 
            style={style}
            onClick={(event) => clickHandler(event, () => {
                if(browserName === "Firefox" || browserName === "Edge") {
                    browser.tabs.create({url:url});
                } else {
                    chrome.tabs.create({url:url});
                }
            })}
        >
            <div className="menu-item-content">
                <img src={"https://www.google.com/s2/favicons?domain=" + props.item.link} alt="link" 
                    className="icon" 
                    onError={getFallbackFavicon} />
                {label}
                <img src="https://img.icons8.com/metro/26/000000/drag-reorder.png" alt="drag section" ref={node => drag(node)} className="icon dragIcon" />
            </div>
        </div>);

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

LinkMobile.propTypes = {
    item:PropTypes.object,
    openFolder:PropTypes.func,
    id:PropTypes.number,
    saveDraggingId:PropTypes.func,
    dropElement:PropTypes.func,
    draggingId:PropTypes.number,
    setClicked:PropTypes.func,
    setShiftClicked:PropTypes.func
};

function getFallbackFavicon(event) {
    event.target.src = "https://img.icons8.com/material/24/000000/internet.png";
}

export default LinkMobile;