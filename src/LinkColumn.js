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
                        dropElement={dropElement} saveDraggingId={(id) => setDraggingId(id)} setClicked={setClicked}
                    />
                </div>)
            )}
            <div id="ContextMenu" hidden={hideContextMenu} ref={ref.rightClickRef}
                style={{left:contextX, bottom:contextY}}>
                <span onClick={showEdit}>Edit</span>
                <span onClick={deleteLink}>Delete</span>
                {isFolder ? <span onClick={openAllFolderLinks}>Open All</span> : null}
                <span onClick={closeContextMenu}>Close</span>
            </div>
        </div>);

    function setClicked(id) {
        let list = props.links.slice();
        let newItem = Object.assign({}, list[id]);
        if(newItem.clicked) {
            delete newItem.clicked;
        } else {
            newItem.clicked = true;
        }
        list[id] = newItem;

        props.tempChangeLinks(list);
    }

    function dropElement (droppingId, draggingId, isFolder) {

        if(draggingId === droppingId) {
            return;
        }

        let list = props.links.slice();

        let destinationID = list[droppingId].id;

        let source = [];
        if(!list[draggingId].clicked) {
            source.push(list[draggingId]);
            list.splice(draggingId, 1);
        }
        list = list.filter(item => {
            if(item.clicked) {
                let itemCopy = Object.assign({}, item);
                delete itemCopy.clicked;
                source.push(itemCopy);
                return false;
            }
            return true;
        });

        let destIndex = list.findIndex(item => item.id === destinationID);
    
        if(isFolder) {
            list[destIndex].data.push(...source);
        }
        else {
            if(droppingId > draggingId) {
                destIndex++;
            }
            list.splice(destIndex, 0, ...source);
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
        closeContextMenu();
    }

    function handleClick (event) {
        event.preventDefault();
        let isOutside = !(event.target.contains === ref.rightClickRef);
        if(isOutside) {
            closeContextMenu();
        }
    }

    function showEdit () {
        closeContextMenu();

        let currentLinksItem = props.links.find(link => link.id === ref.contextId);
        props.showEdit(currentLinksItem);
    }

    function deleteLink() {
        closeContextMenu();
        props.deleteLink(ref.contextId);
    }

    function closeContextMenu() {
        document.removeEventListener("click", handleClick);
        setHideContextMenu(true);
    }
}

LinkColumn.propTypes = {
    links:PropTypes.array,
    changeLinks:PropTypes.func,
    openFolder:PropTypes.func,
    showEdit:PropTypes.func,
    deleteLink:PropTypes.func,
    tempChangeLinks:PropTypes.func
};

export default LinkColumn;