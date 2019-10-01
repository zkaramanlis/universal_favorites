/*global chrome*/
import React from "react";
import ButtonRow from "./ButtonRow";
import LinkColumn from "./LinkColumn";
import { DragDropContext } from "react-beautiful-dnd";
import Settings from "./Settings";
import Add from "./Add";
import {checkForFile, getFile, uploadFile, getLastChanged} from "./Network";
import axios from "axios";
import { ContextMenu, MenuItem } from "react-contextmenu";
import Edit from "./Edit";
import "./App.css";
import "./ButtonRow.css";
import "./react-contextmenu.css";


class App extends React.Component {

    constructor(props){
        super(props);

        this.links = {
            type:"home",
            label:"home",
            data:[]
        };
        this.history = [];

        this.linkId = 0;

        this.state = {
            currentLinks:[],
            backDisabled:true,
            settingsDisabled:false,
            addDisabled:false,
            settingsMenu:false,
            addMenu:false,
            editMenu:false,
            editLink:"",
            searchString:""
        };
    }

    componentDidMount = () => {
        chrome.storage.local.get(["settingsMenu", "accessToken", "links", "fileId", "date"], (result) => {
            this.setState({settingsMenu:result.settingsMenu});

            if(result.accessToken) {
                this.accessToken = result.accessToken;
            }
            if(result.links) {
                this.links = result.links;
                this.setState({currentLinks:result.links.data});
            }

            if(this.accessToken && result.fileId && result.date) {
                axios.defaults.headers.common["Authorization"] = "Bearer " + this.accessToken;
    
                getLastChanged(result.fileId)
                    .then(date => {
                        if(date !== result.date) {
                            getFile(result.fileId)
                                .then(file => {
                                    this.links = file;

                                    chrome.storage.local.set({links:file, date:date});
                                    this.setState({currentLinks:this.links.data});
                                });
                        }
                    });
            }
        });

        chrome.runtime.connect();
    }
  
    render() {
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
            <div>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <div className="menu">
                        <ButtonRow backDisabled={this.state.backDisabled} goBack={this.goBack}
                            settingsDisabled={this.state.settingsDisabled} settings={this.openSettings} 
                            addDisabled={this.state.addDisabled} add={this.openAddMenu}/>

                        <LinkColumn searchString={this.state.searchString} openFolder={this.openFolder} links={this.state.currentLinks} search={this.search} />
                    </div>
                </DragDropContext>
                <ContextMenu id="ContextMenu">
                    <MenuItem onClick={this.edit}>Edit</MenuItem>
                    <MenuItem onClick={this.delete}>Delete</MenuItem>
                </ContextMenu>
            </div>
        );
    }

    search = (searchString) => {
        let topFolder = Object.assign({}, this.links);
        topFolder.history = [];

        let stack = [topFolder];
        let results = [];

        while(stack.length > 0) {
            let folder = stack.shift();

            folder.data.forEach((element, id) => {
                if(element.type === "link") {
                    if(element.label.includes(searchString)) {
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

        this.setState({currentLinks:results, backDisabled:false, addDisabled:true, searchString:searchString});
    }

    edit = (e, data) => {

        this.linkId = data.linkId;

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
        if(this.history === []) {
            backDisabled = true;
        }

        this.setState({editLink:list.data[this.linkId], editMenu:true, searchString:"", backDisabled:backDisabled, addDisabled:false});
    }

    delete = (e, data) => {

        this.linkId = data.linkId;

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
        if(this.history === []) {
            backDisabled = true;
        }

        chrome.storage.local.set({linksChanged:true, links:this.links});
        this.setState({currentLinks:list.data.slice(), searchString:"", backDisabled:backDisabled, addDisabled:false});
    }

    saveEdit = (link) => {
        let list = this.links;
        this.history.forEach(id => {
            list = list.data[id];
        });

        list.data[this.linkId] = link;

        chrome.storage.local.set({linksChanged:true, links:this.links});
        this.setState({currentLinks:list.data.slice(), editMenu:false});
    }

    sync = async (accessToken, refreshToken) => {
        chrome.storage.local.set({accessToken:accessToken, refreshToken:refreshToken});
        this.accessToken = accessToken;

        axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;

        let id = await checkForFile();
        if(id) {
            let file = await getFile(id);

            this.links = file;

            let date = await getLastChanged(id);

            chrome.storage.local.set({fileId:id, links:this.links, date:date, settingsMenu:false});
            this.setState({currentLinks:this.links.data, settingsMenu:false});
        }
        else{
            let res = await uploadFile(this.links);

            chrome.storage.local.set({fileId:res.id, links:this.links, date:res.modifiedTime, settingsMenu:false});
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
        chrome.storage.local.set({linksChanged:true, links:this.links});
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
        chrome.storage.local.set({linksChanged:true, links:this.links});
        this.setState({currentLinks:newLinksList, addMenu:false});
    }

    closeSubMenu = () => {
        chrome.storage.local.set({settingsMenu:false});
        this.setState({settingsMenu:false, addMenu:false, editMenu:false});
    }

    openSettings = () => {
        chrome.storage.local.set({settingsMenu:true});
        this.setState({settingsMenu:true});
    }

    openAddMenu = () => {
        this.setState({addMenu:true});
    }

    onDragEnd =(result)=> {
        if(!result.destination){
            return;
        }

        let list = this.links;
        this.history.forEach(id => {
            list = list.data[id];
        });

        let newLinksList = this.state.currentLinks.slice();
        let link = newLinksList[result.source.index];

        newLinksList.splice(result.source.index, 1);
        newLinksList.splice(result.destination.index, 0, link);

        list.data = newLinksList;

        chrome.storage.local.set({linksChanged:true, links:this.links});
        this.setState({currentLinks:newLinksList});
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
