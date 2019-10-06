import React from "react";
import { ContextMenuTrigger } from "react-contextmenu";
import PropTypes from "prop-types";
import Link from "./Link";

function collect(props) {
    return {linkId:props.linkId};
}

function LinkColumn(props) {
    return (
        <div>
            {props.links.map((item, id) => (
                <ContextMenuTrigger linkId={id} key={id} id="ContextMenu" collect={collect} holdToDisplay={-1}>
                    <Link 
                        key={id} item={item} id={id} openFolder={props.openFolder} draggingId={props.draggingId} 
                        dropElement={props.dropElement} saveDraggingId={props.saveDraggingId}
                    />
                </ContextMenuTrigger>)
            )}
        </div>);
}

LinkColumn.propTypes = {
    links:PropTypes.array,
    openFolder:PropTypes.func,
    dropElement:PropTypes.func,
    saveDraggingId:PropTypes.func,
    draggingId:PropTypes.number
};

export default LinkColumn;