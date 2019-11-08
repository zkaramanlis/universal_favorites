/*global chrome browser*/
import React, {useState, useRef} from "react";
import PropTypes from "prop-types";
import Link from "./Link";
import LinkMobile from "./LinkMobile";
import { isMobile, browserName } from "react-device-detect";

function LinkColumn(props) {
    const [draggingId, setDraggingId] = useState(0);
    const [hideContextMenu, setHideContextMenu] = useState(true);
    const [contextX, setContextX] = useState(0);
    const [contextY, setContextY] = useState(0);
    const [isFolder, setIsFolder] = useState(false);
    const ref = useRef({rightClickRef:React.createRef()});

    return (
        <div style={{position:"relative"}}>
            {props.links.map((item, id) => (
                <div key={item.id} className="LinkColumnDiv" onContextMenu={(event) => showContextMenu(event, id)}>
                    { isMobile ?
                        <LinkMobile
                            item={item} id={id} openFolder={props.openFolder} draggingId={draggingId} 
                            dropElement={dropElement} saveDraggingId={(id) => setDraggingId(id)}
                        />
                        :
                        <Link
                            item={item} id={id} openFolder={props.openFolder} draggingId={draggingId} 
                            dropElement={dropElement} saveDraggingId={(id) => setDraggingId(id)} 
                            setClicked={setClicked} setShiftClicked={setShiftClicked}
                        />
                    }
                </div>)
            )}
            <div id="ContextMenu" hidden={hideContextMenu} ref={ref.rightClickRef}
                style={{left:contextX, top:contextY}}>
                <span onClick={showEdit}>Edit</span>
                <span onClick={deleteLink}>Delete</span>
                {isFolder ? <span onClick={openAllFolderLinks}>Open All</span> : null}
                <span onClick={closeContextMenu}>Close</span>
            </div>
        </div>);

    function setShiftClicked(id) {
        let list = props.links.slice();

        let firstClicked = list.findIndex(item => item.clicked === true);
        let start;
        let end;

        if(firstClicked < 0) {
            start = id;
            end = id;
        }else if(firstClicked < id) {
            start = firstClicked;
            end = id;
        } else {
            start = id;
            end = firstClicked;
        }

        for(let i = start;i <= end;i++) {
            if(!list[i].clicked) {
                list[i] = createClickedItem(list[i]);
            }
        }

        props.tempChangeLinks(list);
    }

    function setClicked(id) {
        let list = props.links.slice();
        list[id] = createClickedItem(list[id]);

        props.tempChangeLinks(list);
    }

    function createClickedItem(item) {
        let newItem = Object.assign({}, item);
        if(newItem.clicked) {
            delete newItem.clicked;
        } else {
            newItem.clicked = true;
        }
        return newItem;
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

        let currentLinksItem = props.links[id];
        

        let yHeight;
        if(isMobile) {
            yHeight = id * 50;
            if(currentLinksItem.type === "folder" && id > 1) {
                yHeight -= (160 - 25);
            } else if (currentLinksItem.type === "link" && id > 1) {
                yHeight -= (120 - 25);
            }
        } else {
            yHeight = id * 30;
            if(currentLinksItem.type === "folder" && id > 1) {
                yHeight -= (80 - 15);
            } else if (currentLinksItem.type === "link" && id > 1) {
                yHeight -= (60 - 15);
            }
        }

        setContextX(event.clientX);
        setContextY(yHeight);

        document.addEventListener("click", handleClick);

        setIsFolder(currentLinksItem.type === "folder");

        ref.contextId = props.links[id].id;
        setHideContextMenu(false);
    }

    function openAllFolderLinks () {
        let currentLinksItem = props.links.find(link => link.id === ref.contextId);
        currentLinksItem.data.forEach(item => {
            if(item.type === "link") {
                if(browserName === "Firefox" || browserName === "Edge") {
                    browser.tabs.create({url:item.link, active:false});
                } else {
                    chrome.tabs.create({url:item.link, active:false});
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