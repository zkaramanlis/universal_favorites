import React from "react";
import PropTypes from "prop-types";
import Link from "./Link";

function LinkColumn(props) {
    return (
        <div>
            {props.links.map((item, id) => (
                <div key={item.id} onContextMenu={(event) => props.showContextMenu(event, id)}>
                    <Link 
                        item={item} id={id} openFolder={props.openFolder} draggingId={props.draggingId} 
                        dropElement={props.dropElement} saveDraggingId={props.saveDraggingId}
                    />
                </div>)
            )}
        </div>);
}

LinkColumn.propTypes = {
    links:PropTypes.array,
    openFolder:PropTypes.func,
    dropElement:PropTypes.func,
    saveDraggingId:PropTypes.func,
    draggingId:PropTypes.number,
    showContextMenu:PropTypes.func
};

export default LinkColumn;