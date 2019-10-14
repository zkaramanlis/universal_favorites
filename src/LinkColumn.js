/*global chrome browser*/
import React, {useState, useRef} from "react";
import PropTypes from "prop-types";
import Link from "./Link";
import { browserName } from "react-device-detect";

function LinkColumn(props) {
    const [draggingId, setDraggingId] = useState(0);
    const [hideContextMenu, setHideContextMenu] = useState(true);
    const [contextX, setContextX] = useState(0);
    const [contextY, setContextY] = useState(0);
    const [isFolder, setIsFolder] = useState(false);
    const ref = useRef({rightClickRef:React.createRef()});

    return (
        <div>
            {props.links.map((item, id) => (
                <div key={item.id} onContextMenu={(event) => showContextMenu(event, id)}>
                    <Link 
                        item={item} id={id} openFolder={props.openFolder} draggingId={draggingId} 
                        dropElement={dropElement} saveDraggingId={(id) => setDraggingId(id)}
                    />
                </div>)
            )}
            <div id="ContextMenu" hidden={hideContextMenu} ref={ref.rightClickRef}
                style={{left:contextX, bottom:contextY}}>
                <span onClick={this.edit}>Edit</span>
                <span onClick={this.delete}>Delete</span>
                {isFolder ? <span onClick={openAllFolderLinks}>Open All</span> : null}
                <span onClick={() => {
                    document.removeEventListener("click", handleClick);
                    setHideContextMenu(true);
                }}>Close</span>
            </div>
        </div>);

    function dropElement (droppingId, draggingId, isFolder) {

        if(draggingId === droppingId) {
            return;
        }

        let list = props.links.slice();

        let destination = list[droppingId];
        let source = list[draggingId];
        list.splice(draggingId, 1);
    
        if(destination && isFolder) {
            destination.data.push(source);
        }
        else {
            list.splice(droppingId, 0, source);
        }

        props.changeLinks(list);
    }

    function showContextMenu (event, id) {
        event.preventDefault();

        setContextX(event.clientX);
        setContextY(window.innerHeight - event.clientY);

        document.addEventListener("click", handleClick);

        let currentLinksItem = props.links[id];

        setIsFolder(currentLinksItem.type === "folder");

        ref.contextId = props.links[id].id;
        setHideContextMenu(false);
    }

    function openAllFolderLinks () {
        let currentLinksItem = props.links.find(link => link.id === ref.contextId);
        currentLinksItem.data.forEach(item => {
            if(item.type === "link") {
                if(browserName === "Firefox" || browserName === "Edge") {
                    browser.tabs.create({url:item.link});
                } else {
                    chrome.tabs.create({url:item.link});
                }
            }
        });
        document.removeEventListener("click", handleClick);
        setHideContextMenu(true);
    }

    function handleClick (event) {
        let isOutside = !(event.target.contains === ref.rightClickRef);
        if(isOutside) {
            document.removeEventListener("click", handleClick);
            setHideContextMenu(true);
        }
    }
}

LinkColumn.propTypes = {
    links:PropTypes.array,
    changeLinks:PropTypes.func,
    openFolder:PropTypes.func
};

export default LinkColumn;