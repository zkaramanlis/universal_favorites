import React from "react";
import { DragLayer } from "react-dnd";
import PropTypes from "prop-types";
import { isMobile } from "react-device-detect";

const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
};
  
function getItemStyles(currentOffset) {
    if (!currentOffset) {
        return {
            display: "none",
        };
    }
  
    const { x, y } = currentOffset;

    let adjustedX = x;
    if(isMobile) {
        adjustedX = 0 - (window.innerWidth - x);
    }

    const transform = `translate(${adjustedX}px, ${y}px)`;

    return {
        transform: transform,
        WebkitTransform: transform,
    };
}

function getFallbackFavicon(event) {
    event.target.src = "https://img.icons8.com/material/24/000000/internet.png";
}
  
function CustomDragLayer({ item, currentOffset, isDragging }) {
    if (!isDragging) {
        return null;
    }

    let icon = <img src={"https://www.google.com/s2/favicons?domain=" + item.link} alt="link" 
        className="icon" 
        onError={getFallbackFavicon} />;
    if(item.draggingType === "folder") {
        icon = <img src="https://img.icons8.com/color/48/000000/folder-invoices.png" alt="folder" className="icon" />;
    }
  
    return (
        <div style={layerStyles}>
            <div style={getItemStyles(currentOffset)}>
                <div className="dragBox">{icon}{item.label}</div>
            </div>
        </div>
    );
}

CustomDragLayer.propTypes = {
    item:PropTypes.object,
    currentOffset:PropTypes.any,
    isDragging:PropTypes.bool
};
  
function collect(monitor) {
    return {
        item: monitor.getItem(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    };
}
  
export default DragLayer(collect)(CustomDragLayer);