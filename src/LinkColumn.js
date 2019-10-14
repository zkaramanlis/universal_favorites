import React, {useState} from "react";
import PropTypes from "prop-types";
import Link from "./Link";

function LinkColumn(props) {
    const [draggingId, setDraggingId] = useState(0);

    return (
        <div>
            {props.links.map((item, id) => (
                <div key={item.id} onContextMenu={(event) => props.showContextMenu(event, id)}>
                    <Link 
                        item={item} id={id} openFolder={props.openFolder} draggingId={draggingId} 
                        dropElement={props.dropElement} saveDraggingId={(id) => setDraggingId(id)}
                    />
                </div>)
            )}
        </div>);
}

LinkColumn.propTypes = {
    links:PropTypes.array,
    openFolder:PropTypes.func,
    dropElement:PropTypes.func,
    showContextMenu:PropTypes.func
};

export default LinkColumn;