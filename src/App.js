/*global chrome browser*/
import React from "react";
import ButtonRow from "./ButtonRow";
import LinkColumn from "./LinkColumn";
import Settings from "./Settings";
import Add from "./Add";
import {checkForFile, getFile, uploadFile, getLastChanged} from "./Network";
import axios from "axios";
import Edit from "./Edit";
import { isMobile, browserName } from "react-device-detect";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import TouchBackend from "react-dnd-touch-backend";
import CustomDragLayer from "./CustomDragLayer";
import "./ButtonRow.css";
import "./react-contextmenu.css";
if(isMobile) {
    import("./App-mobile.css").then(() => true);
}
else {
    import("./App.css").then(() => true);
}


class App extends React.Component {

    constructor(props){
        super(props);

        this.links = {
            type:"home",
            label:"home",
            data:[]
        };
        this.history = [];

        this.rightClickRef = React.createRef();

        this.state = {
            currentLinks:[],
            backDisabled:true,
            addDisabled:false,
            settingsMenu:false,
            addMenu:false,
            editMenu:false,
            editLink:"",
            searchString:"",
            draggingId:null,
            hideContextMenu:true,
            contextX:0,
            contextY:0
        };
    }

    componentDidMount = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.get(["settingsMenu", "accessToken", "links", "fileId", "date"])
                .then(this.mountCallback, (err) => console.log(err));
            browser.runtime.connect();
        }
        else {
            chrome.storage.local.get(["settingsMenu", "accessToken", "links", "fileId", "date"], this.mountCallback);
            chrome.runtime.connect();
        }
    }

    mountCallback = (result) => {
        this.setState({settingsMenu:result.settingsMenu});

        if(result.links) {
            this.links = result.links;
            this.setState({currentLinks:result.links.data});
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
                                this.setState({currentLinks:this.links.data});
                            });
                    }
                });
        }
    }
  
    render() {
        let backend = HTML5Backend;
        if(isMobile) {
            backend = TouchBackend;
        }

        if(this.state.settingsMenu) {
            return (<Settings goBack={this.closeSubMenu} sync={this.sync} />);
        }
        if(this.state.addMenu) {
            return <Add goBack={this.closeSubMenu} addLink={this.addLink} addFolder={this.addFolder} />;
        }
        if(this.state.editMenu) {
            return <Edit goBack={this.closeSubMenu} link={this.state.editLink} save={this.saveEdit} />;
        }
        return (
            <DndProvider backend={backend}>
                <div className="menu">
                    <CustomDragLayer />
                    <ButtonRow backDisabled={this.state.backDisabled} goBack={this.goBack} settings={this.openSettings} 
                        addDisabled={this.state.addDisabled} add={this.openAddMenu} moveUp={this.moveUp} />
                    <input type="text" className="inputField" placeholder="Search" onChange={this.search} value={this.state.searchString} />

                    <LinkColumn openFolder={this.openFolder} links={this.state.currentLinks} draggingId={this.state.draggingId}
                        dropElement={this.dropElement} saveDraggingId={this.saveDraggingId} showContextMenu={this.showContextMenu} />
                </div>
                <div id="ContextMenu" hidden={this.state.hideContextMenu} ref={this.rightClickRef}
                    style={{left:this.state.contextX, bottom:this.state.contextY}}>
                    <span onClick={this.edit}>Edit</span>
                    <span onClick={this.delete}>Delete</span>
                    <span onClick={() => {
                        document.removeEventListener("click", this.handleClick);
                        this.setState({hideContextMenu:true});
                    }}>Close</span>
                </div>
            </DndProvider>
        );
    }

    saveDraggingId = (id) => {
        this.setState({draggingId:id});
    }

    dropElement = (droppingId, draggingId, isFolder) => {

        if(isNaN(draggingId) || draggingId === droppingId || this.state.searchString) {
            return;
        }

        let list = this.links;
        this.history.forEach(id => {
            list = list.data[id];
        });

        let destination = list.data[droppingId];
        let source = list.data[draggingId];
        list.data.splice(draggingId, 1);
        
        if(destination && isFolder) {
            destination.data.push(source);
        }
        else {
            list.data.splice(droppingId, 0, source);
        }
           
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({linksChanged:true, links:this.links});
        } else {
            chrome.storage.local.set({linksChanged:true, links:this.links});
        }
        this.setState({currentLinks:list.data});
    }

    search = (event) => {
        let searchString = event.target.value.toLowerCase();

        if(searchString === "") {
            this.setState({currentLinks:this.links.data, backDisabled:true, addDisabled:false, searchString:""});
            return;
        }

        let topFolder = Object.assign({}, this.links);
        topFolder.history = [];

        let stack = [topFolder];
        let results = [];

        while(stack.length > 0) {
            let folder = stack.shift();

            folder.data.forEach((element, id) => {
                if(element.type === "link") {
                    if(element.label.toLowerCase().includes(searchString)) {
                        let link = Object.assign({}, element);
                        link.history = folder.history.slice();
                        link.history.push(id);

                        results.push(link);
                    }
                } else{
                    let innerFolder = Object.assign({}, element);
                    innerFolder.history = folder.history.slice();
                    innerFolder.history.push(id);

                    stack.push(innerFolder);
                }
            });
        }

        this.history = [];

        this.setState({currentLinks:results, backDisabled:false, addDisabled:true, searchString:event.target.value});
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

        let link = list.data[draggingId];
        list.data.splice(draggingId, 1);
        parentList.data.push(link);

        this.history.pop();

        let backDisabled = this.state.backDisabled;
        if(parentList.type === "home") {
            backDisabled = true;
        }

        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({linksChanged:true, links:this.links});
        } else {
            chrome.storage.local.set({linksChanged:true, links:this.links});
        }
        this.setState({currentLinks:parentList.data.slice(), backDisabled:backDisabled});
    }

    handleClick = (event) => {
        let isOutside = !(event.target.contains === this.rightClickRef);
        if(isOutside) {
            document.removeEventListener("click", this.handleClick);
            this.setState({hideContextMenu:true});
        }
    }

    showContextMenu = (event, id) => {
        event.preventDefault();

        let x = event.clientX;
        let y = window.innerHeight - event.clientY;

        document.addEventListener("click", this.handleClick);

        this.linkId = id;
        this.setState({hideContextMenu:false, contextX:x, contextY:y});
    }

    edit = () => {

        let currentLinksItem = this.state.currentLinks[this.linkId];
        if(currentLinksItem.history) {
            this.history = currentLinksItem.history;
            this.linkId = this.history.pop();
        }

        let list = this.links;
        this.history.forEach(id => {
            list = list.data[id];
        });

        let backDisabled = this.state.backDisabled;
        if(this.history.length === 0) {
            backDisabled = true;
        }

        document.removeEventListener("click", this.handleClick);
        this.setState({editLink:list.data[this.linkId], editMenu:true, hideContextMenu:true,
            backDisabled:backDisabled, searchString:"", addDisabled:false, currentLinks:list.data.slice()});
    }

    delete = () => {

        let currentLinksItem = this.state.currentLinks[this.linkId];
        if(currentLinksItem.history) {
            this.history = currentLinksItem.history;
            this.linkId = this.history.pop();
        }

        let list = this.links;
        this.history.forEach(id => {
            list = list.data[id];
        });

        list.data.splice(this.linkId, 1);

        let backDisabled = this.state.backDisabled;
        if(this.history.length === 0) {
            backDisabled = true;
        }

        document.removeEventListener("click", this.handleClick);

        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({linksChanged:true, links:this.links});
        } else {
            chrome.storage.local.set({linksChanged:true, links:this.links});
        }
        this.setState({currentLinks:list.data.slice(), searchString:"", hideContextMenu:true,
            backDisabled:backDisabled, addDisabled:false});
    }

    saveEdit = (link) => {
        let list = this.links;
        this.history.forEach(id => {
            list = list.data[id];
        });

        list.data[this.linkId] = link;

        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({linksChanged:true, links:this.links});
        } else {
            chrome.storage.local.set({linksChanged:true, links:this.links});
        }
        this.setState({currentLinks:list.data.slice(), editMenu:false});
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

            if(browserName === "Firefox" || browserName === "Edge") {
                browser.storage.local.set({fileId:id, links:this.links, date:date, settingsMenu:false});
            } else {
                chrome.storage.local.set({fileId:id, links:this.links, date:date, settingsMenu:false});
            }
            this.setState({currentLinks:this.links.data, settingsMenu:false});
        }
        else{
            let res = await uploadFile(this.links);

            if(browserName === "Firefox" || browserName === "Edge") {
                browser.storage.local.set({fileId:res.id, links:this.links, date:res.modifiedTime, settingsMenu:false});
            } else {
                chrome.storage.local.set({fileId:res.id, links:this.links, date:res.modifiedTime, settingsMenu:false});
            }
            this.setState({settingsMenu:false});
        }
    }

    addFolder = (name) => {
        let list = this.links;
        this.history.forEach(id => {
            list = list.data[id];
        });

        let newLinksList = this.state.currentLinks.slice();
        newLinksList.push({type:"folder", label:name, data:[]});

        list.data = newLinksList;

        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({linksChanged:true, links:this.links});
        } else {
            chrome.storage.local.set({linksChanged:true, links:this.links});
        }
        this.setState({currentLinks:newLinksList, addMenu:false});
    }

    addLink = (name, url) => {
        let list = this.links;
        this.history.forEach(id => {
            list = list.data[id];
        });

        let newLinksList = this.state.currentLinks.slice();
        newLinksList.push({type:"link", label:name, link:url});

        list.data = newLinksList;

        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({linksChanged:true, links:this.links});
        } else {
            chrome.storage.local.set({linksChanged:true, links:this.links});
        }
        this.setState({currentLinks:newLinksList, addMenu:false});
    }

    closeSubMenu = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.storage.local.set({settingsMenu:false});
        } else {
            chrome.storage.local.set({settingsMenu:false});
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

    openFolder =(items, id)=> {
        this.history.push(id);
        this.setState({currentLinks:items, backDisabled:false});
    }

    goBack = () => {

        let links = this.links;

        this.history.pop();
        this.history.forEach(id => {
            links = links.data[id];
        });

        if(links.type === "home"){
            this.setState({currentLinks:links.data, backDisabled:true, searchString:"", addDisabled:false});
        }
        else{
            this.setState({currentLinks:links.data, backDisabled:false, searchString:"", addDisabled:false});
        }
    }
}

export default App;
