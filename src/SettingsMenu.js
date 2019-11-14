/*global chrome browser*/
import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import { browserName } from "react-device-detect";
import SyncMenu from "./SyncMenu";
import uuidv1 from "uuid/v1";
import AboutMenu from "./AboutMenu";
import Back from "./images/back.png";

function SettingsMenu(props) {
    const [syncMenu, setSyncMenu] = useState(false);
    const [aboutMenu, setAboutMenu] = useState(false);

    useEffect(() => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.get(["syncMenu"])
                .then((res) => {
                    if(res.syncMenu) {
                        setSyncMenu(true);
                    }
                }, (err) => console.log(err));
        }
        else {
            chrome.storage.local.get(["syncMenu"], (res) => {
                if(res.syncMenu) {
                    setSyncMenu(true);
                }
            });
        }
    }, []);

    if(syncMenu) {
        return <SyncMenu goBack={closeSyncMenu} sync={props.sync} />;
    }
    if (aboutMenu) {
        return <AboutMenu goBack={closeAboutMenu} />;
    }
    return(
        <div className="menu">
            <button id="onlyBack" className="menuButton" onClick={props.goBack}>
                <img src={Back} alt="back" className="icon" />
            </button>
                
            <div className="settings-menu-item" onClick={openSyncMenu}>Sync With Drive</div>
            <div className="settings-menu-item" onClick={getBookmarks}>Import Bookmarks</div>
            <div className="settings-menu-item" onClick={openAboutMenu}>About</div>
        </div>
    );

    function openAboutMenu() {
        setAboutMenu(true);
    }

    function closeAboutMenu() {
        setAboutMenu(false);
    }

    function openSyncMenu() {
        saveSettingsToBrowser(true);
        setSyncMenu(true);
    }

    function closeSyncMenu() {
        saveSettingsToBrowser(false);
        setSyncMenu(false);
    }

    function saveSettingsToBrowser(state) {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({syncMenu:state});
        } else {
            chrome.storage.local.set({syncMenu:state});
        }
    }

    function getBookmarks() {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.bookmarks.getTree().then((bookmarks) => {
                let bookmarkObject = {type:"folder", label:"imported", data:[], id:uuidv1()};
                if(bookmarks[0]) {
                    printBookmarks(bookmarks[0].children, bookmarkObject);
                }
                props.addImportedFolder(bookmarkObject);
            });
        } else {
            chrome.bookmarks.getTree((bookmarks) => {
                let bookmarkObject = {type:"folder", label:"imported", data:[], id:uuidv1()};
                if(bookmarks[0]) {
                    printBookmarks(bookmarks[0].children, bookmarkObject);
                }
                props.addImportedFolder(bookmarkObject);
            });
        }
    }
      
    function printBookmarks(bookmarks, bookmarkObject) {
        bookmarks.forEach((bookmark) => {
            if (bookmark.children) {
                let subFolder = {type:"folder", label:bookmark.title, data:[], id:uuidv1()};
                printBookmarks(bookmark.children, subFolder);
                bookmarkObject.data.push(subFolder);
            } else {
                bookmarkObject.data.push({type:"link", label:bookmark.title, link:bookmark.url, id:uuidv1()});
            }
        });
    }
}

SettingsMenu.propTypes = {
    sync:PropTypes.func,
    goBack:PropTypes.func,
    addImportedFolder:PropTypes.func
};

export default SettingsMenu;