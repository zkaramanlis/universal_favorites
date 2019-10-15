import React, { useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import PropTypes from "prop-types";

function FolderSubDrop(props) {
    const [, drop] = useDrop({
        accept:"LINK",
        drop({ id: draggingId }){
            props.dropElement(props.id, draggingId, true);
        },
    });

    return(
        <span ref={drop}>
            <img src="https://img.icons8.com/color/48/000000/folder-invoices.png" alt="folder" className="icon" />
            {props.label}
        </span>
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

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    });

    let style = null;
    if(isOver) {
        if(props.id < props.draggingId) {
            style = {borderTop:"2px dashed gray"};
        }
        else if(props.id > props.draggingId) {
            style = {borderBottom:"2px dashed gray"};
        }
    }

    let label = props.item.label;
    if(label.length > 20){
        label = label.substring(0, 19);
        label += "...";
    }

    if(props.item.type === "folder"){
        return (
            <div
                ref={node => drag(drop(node))}
                className="menu-item"
                style={style}
                onClick={() => props.openFolder(props.item.data, props.id)}
            >
                <FolderSubDrop label={props.item.label} dropElement={props.dropElement} id={props.id} />
                <img src="https://img.icons8.com/material/24/000000/sort-right--v1.png" alt="arrow" className="icon arrow" />
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
        >
            <a href={url} className="link" target="_blank" rel="noopener noreferrer">
                <img src={"https://www.google.com/s2/favicons?domain=" + props.item.link} alt="link" 
                    className="icon" 
                    onError={getFallbackFavicon} />
                {label}
            </a>
        </div>);
}

Link.propTypes = {
    item:PropTypes.object,
    openFolder:PropTypes.func,
    id:PropTypes.number,
    saveDraggingId:PropTypes.func,
    dropElement:PropTypes.func,
    draggingId:PropTypes.number
};

function getFallbackFavicon(event) {
    event.target.src = "https://img.icons8.com/material/24/000000/internet.png";
}

export default Link;