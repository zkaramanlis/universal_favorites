/*global chrome browser*/
import React from "react";
import ButtonRow from "./ButtonRow";
import LinkColumn from "./LinkColumn";
import SettingsMenu from "./SettingsMenu";
import Add from "./Add";
import {checkForFile, getFile, uploadFile, getLastChanged, updateFile} from "./Network";
import axios from "axios";
import Edit from "./Edit";
import { isMobile, browserName } from "react-device-detect";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import CustomDragLayer from "./CustomDragLayer";
import uuidv1 from "uuid/v1";
import "./ButtonRow.css";
import "./react-contextmenu.css";
import "./App.css";


class App extends React.Component {

    constructor(props){
        super(props);

        this.links = {
            type:"home",
            label:"home",
            data:[]
        };
        this.history = [];

        this.state = {
            currentLinks:[],
            backDisabled:true,
            addDisabled:false,
            settingsDisabled:false,
            settingsMenu:false,
            addMenu:false,
            editMenu:false,
            editLink:"",
            searchString:"",
            darkMode:false
        };
    }

    componentDidMount = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.get(["settingsMenu", "accessToken", "links", "fileId", "date", "darkMode"])
                .then(this.mountCallback, (err) => console.log(err));
            browser.runtime.connect();
        }
        else {
            chrome.storage.local.get(["settingsMenu", "accessToken", "links", "fileId", "date", "darkMode"], this.mountCallback);
            chrome.runtime.connect();
        }
        
        if(isMobile) {
            window.addEventListener("blur", this.mobileWindowOutOfFocus);
        }
    }

    mountCallback = (result) => {
        this.setState({settingsMenu:result.settingsMenu});

        if(result.links) {
            this.links = result.links;
            this.setState({currentLinks:result.links.data.slice()});
        }

        if(result.darkMode) {
            this.setState({darkMode:true});
        }

        if(result.accessToken && result.fileId && result.date) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + result.accessToken;
    
            getLastChanged(result.fileId)
                .then(date => {
                    if(date !== result.date) {
                        getFile(result.fileId)
                            .then(file => {
                                this.links = file;
                                if(browserName === "Firefox" || browserName === "Edge") {
                                    browser.storage.local.set({links:file, date:date});
                                } else {
                                    chrome.storage.local.set({links:file, date:date});
                                }
                                this.setState({currentLinks:this.links.data.slice()});
                            });
                    }
                });
        }
    }

    mobileWindowOutOfFocus = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.get(["linksChanged", "links", "fileId"])
                .then((result) => {
                    if(result.linksChanged && result.links && result.fileId) {
                        browser.storage.local.set({linksChanged:false});
                        updateFile(result.fileId, result.links)
                            .then(res => {
                                browser.storage.local.set({fileId:res.id, date:res.modifiedTime});
                            });
                    }
                }).catch(err => console.error(err));
        } else {
            chrome.storage.local.get(["linksChanged", "links", "fileId"], (result) => {
                if(result.linksChanged && result.links && result.fileId) {
                    chrome.storage.local.set({linksChanged:false});
                    updateFile(result.fileId, result.links)
                        .then(res => {
                            chrome.storage.local.set({fileId:res.id, date:res.modifiedTime});
                        }).catch(err => console.error(err));
                }
            });
        }
    }

    componentWillUnmount = () => {
        if(isMobile) {
            window.removeEventListener("blur", this.mobileWindowOutOfFocus);
        }
    }
  
    render() {
        let backend = HTML5Backend;
        if(isMobile) {
            backend = TouchBackend;
        }

        let darkModeCss = "";
        if(this.state.darkMode) {
            darkModeCss = "/DarkMode.css";
        }

        let appMobileCss = "";
        if(isMobile) {
            appMobileCss = "/App-mobile.css";
        }

        if(this.state.settingsMenu) {
            return (
                <div>
                    <link rel="stylesheet" type="text/css" href={darkModeCss} />
                    <link rel="stylesheet" type="text/css" href={appMobileCss} />
                    <SettingsMenu goBack={this.closeSubMenu} sync={this.sync} addImportedFolder={this.addImportedFolder} 
                        darkMode={this.state.darkMode} toggleDarkMode={this.toggleDarkMode} />
                </div>
            );
        }
        if(this.state.addMenu) {
            return (
                <div>
                    <link rel="stylesheet" type="text/css" href={darkModeCss} />
                    <link rel="stylesheet" type="text/css" href={appMobileCss} />
                    <Add goBack={this.closeSubMenu} addLink={this.addLink} addFolder={this.addFolder} darkMode={this.state.darkMode} />
                </div>
            );
        }
        if(this.state.editMenu) {
            return (
                <div>
                    <link rel="stylesheet" type="text/css" href={darkModeCss} />
                    <link rel="stylesheet" type="text/css" href={appMobileCss} />
                    <Edit goBack={this.closeSubMenu} link={this.state.editLink} save={this.saveEdit} darkMode={this.state.darkMode} />
                </div>
            );
        }
        return (
            <DndProvider backend={backend}>
                <div className="menu">
                    <link rel="stylesheet" type="text/css" href={darkModeCss} />
                    <link rel="stylesheet" type="text/css" href={appMobileCss} />
                    <CustomDragLayer />
                    <ButtonRow backDisabled={this.state.backDisabled} goBack={this.goBack} settings={this.openSettings} darkMode={this.state.darkMode}
                        addDisabled={this.state.addDisabled} add={this.openAddMenu} moveUp={this.moveUp} settingsDisabled={this.state.settingsDisabled} />

                    <input type="text" className="inputField" placeholder="Search" onChange={this.search} value={this.state.searchString} />

                    <LinkColumn openFolder={this.openFolder} links={this.state.currentLinks} tempChangeLinks={this.tempChangeLinks}
                        changeLinks={this.changeLinks} deleteLink={this.deleteLink} showEdit={this.showEdit} darkMode={this.state.darkMode} />
                </div>
            </DndProvider>
        );
    }

    toggleDarkMode = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({darkMode:!this.state.darkMode});
        } else {
            chrome.storage.local.set({darkMode:!this.state.darkMode});
        }
        this.setState({darkMode:!this.state.darkMode});
    }

    addImportedFolder = (folder) => {
        if(this.state.searchString) {
            return;
        }

        let list = this.getList(this.history);
        list.data.push(folder);

        let currentLinks = this.state.currentLinks.slice();
        currentLinks.push(folder);
           
        this.saveLinksToBrowser();
        this.closeSubMenu();
        this.setState({currentLinks:currentLinks});
    }

    tempChangeLinks = (links) => {
        if(this.state.searchString) {
            return;
        }

        this.setState({currentLinks:links});
    }

    getList = (history) => {
        let list = this.links;
        history.forEach(id => {
            list = list.data[id];
        });

        return list;
    }

    saveLinksToBrowser = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({linksChanged:true, links:this.links});
        } else {
            chrome.storage.local.set({linksChanged:true, links:this.links});
        }
    }

    changeLinks = (links) => {

        if(this.state.searchString) {
            return;
        }

        let list = this.getList(this.history);

        list.data = links;
           
        this.saveLinksToBrowser();
        this.setState({currentLinks:links.slice()});
    }

    search = (event) => {
        let searchString = event.target.value.toLowerCase();

        if(searchString === "") {
            this.setState({currentLinks:this.links.data.slice(), backDisabled:true, addDisabled:false, searchString:"", settingsDisabled:false});
            return;
        }

        let topFolder = Object.assign({}, this.links);
        topFolder.history = [];

        let stack = [topFolder];
        let results = [];

        while(stack.length > 0) {
            let folder = stack.shift();

            folder.data.forEach((element, id) => {
                if(element.label.toLowerCase().includes(searchString)) {
                    let link = Object.assign({}, element);
                    link.history = folder.history.slice();

                    results.push(link);
                }
                if(element.type === "folder") {
                    let stackFolder = Object.assign({}, element);
                    stackFolder.history = folder.history.slice();
                    stackFolder.history.push(id);
    
                    stack.push(stackFolder);
                }
            });
        }

        this.history = [];

        results.sort((a, b) => {
            if(a.type === "folder") {
                if(b.type === "folder") {
                    return 0;
                }
                return -1;
            } else if(b.type === "folder") {
                return 1;
            }
            return 0;
        });

        this.setState({currentLinks:results, settingsDisabled:true, backDisabled:false, addDisabled:true, searchString:event.target.value});
    }

    moveUp = (draggingId) => {

        if(this.state.searchString || this.state.backDisabled) {
            return;
        }

        let list = this.links;
        let parentList = this.links;
        this.history.forEach(id => {
            parentList = list;
            list = list.data[id];
        });

        let currentLinks = this.state.currentLinks.slice();
        let source = [];
        if(!currentLinks[draggingId].clicked) {
            source.push(currentLinks[draggingId]);
            currentLinks.splice(draggingId, 1);
        }
        
        let filteredData = currentLinks.filter(item => {
            if(item.clicked) {
                let itemCopy = Object.assign({}, item);
                delete itemCopy.clicked;
                source.push(itemCopy);
                return false;
            }
            return true;
        });
        list.data = filteredData;

        parentList.data.push(...source);

        this.history.pop();

        let backDisabled = this.state.backDisabled;
        if(parentList.type === "home") {
            backDisabled = true;
        }

        this.saveLinksToBrowser();
        this.setState({currentLinks:parentList.data.slice(), backDisabled:backDisabled});
    }

    showEdit = (editLink) => {
        this.setState({editMenu:true, editLink:editLink});
    }

    deleteLink = (id) => {

        let index = this.state.currentLinks.findIndex(link => link.id === id);
        let currentLinksItem = this.state.currentLinks[index];
        
        let history = currentLinksItem.history ? currentLinksItem.history : this.history;

        let list = this.getList(history);
        let currentList = this.state.currentLinks.slice();

        let savedIndex = list.data.findIndex(link => link.id === id);

        list.data.splice(savedIndex, 1);

        currentList.splice(index, 1);

        this.saveLinksToBrowser();
        this.setState({currentLinks:currentList});
    }

    saveEdit = (link) => {

        let history = link.history ? link.history : this.history;

        let list = this.getList(history);

        let index = list.data.findIndex(savedLink => savedLink.id === link.id);
        list.data[index] = link;

        list = this.state.currentLinks.slice();

        index = list.findIndex(savedLink => savedLink.id === link.id);
        list[index] = link;

        this.saveLinksToBrowser();
        this.setState({currentLinks:list, editMenu:false});
    }

    sync = async (accessToken, refreshToken) => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({accessToken:accessToken, refreshToken:refreshToken});
        } else {
            chrome.storage.local.set({accessToken:accessToken, refreshToken:refreshToken});
        }

        axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;

        let id = await checkForFile();
        if(id) {
            let file = await getFile(id);

            this.links = file;

            let date = await getLastChanged(id);

            this.saveSyncToBrowser(id, date);
            this.setState({currentLinks:this.links.data, settingsMenu:false});
        }
        else{
            let res = await uploadFile(this.links);

            this.saveSyncToBrowser(res.id, res.modifiedTime);
            this.setState({settingsMenu:false});
        }
    }

    saveSyncToBrowser = (id, date) => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({fileId:id, links:this.links, date:date, settingsMenu:false, syncMenu:false});
        } else {
            chrome.storage.local.set({fileId:id, links:this.links, date:date, settingsMenu:false, syncMenu:false});
        }
    }

    addFolder = (name) => {
        let list = this.getList(this.history);

        let newLinksList = this.state.currentLinks.slice();
        newLinksList.push({type:"folder", label:name, data:[], id:uuidv1()});

        list.data = newLinksList;

        this.saveLinksToBrowser();
        this.setState({currentLinks:newLinksList.slice(), addMenu:false});
    }

    addLink = (name, url) => {
        let list = this.getList(this.history);

        let newLinksList = this.state.currentLinks.slice();
        newLinksList.push({type:"link", label:name, link:url, id:uuidv1()});

        list.data = newLinksList;

        this.saveLinksToBrowser();
        this.setState({currentLinks:newLinksList.slice(), addMenu:false});
    }

    closeSubMenu = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({settingsMenu:false, syncMenu:false});
        } else {
            chrome.storage.local.set({settingsMenu:false, syncMenu:false});
        }
        this.setState({settingsMenu:false, addMenu:false, editMenu:false});
    }

    openSettings = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({settingsMenu:true});
        } else {
            chrome.storage.local.set({settingsMenu:true});
        }
        this.setState({settingsMenu:true});
    }

    openAddMenu = () => {
        this.setState({addMenu:true});
    }

    openFolder =(item, id)=> {
        let correctItem = item;
        if(item.history) {
            this.history = item.history.slice();
            let links = this.getList(this.history);

            let correctId = links.data.findIndex(savedItem => savedItem.id === item.id);

            this.history.push(correctId);
            correctItem = links.data[correctId];
        } else {
            this.history.push(id);
        }

        this.setState({currentLinks:correctItem.data.slice(), backDisabled:false, searchString:"", addDisabled:false, settingsDisabled:false});
    }

    goBack = () => {

        this.history.pop();
        let links = this.getList(this.history);

        if(links.type === "home"){
            this.setState({currentLinks:links.data.slice(), backDisabled:true, searchString:"", addDisabled:false, settingsDisabled:false});
        }
        else{
            this.setState({currentLinks:links.data.slice(), backDisabled:false, searchString:"", addDisabled:false, settingsDisabled:false});
        }
    }
}

export default App;
