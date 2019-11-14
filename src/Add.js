/*global chrome browser*/
import React from "react";
import PropTypes from "prop-types";
import { browserName } from "react-device-detect";
import urlParse from "url-parse";
import Back from "./images/back.png";

class Add extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            name:"",
            url:"",
            isFolder:false
        };
    }

    componentDidMount = () => {
        if(browserName === "Firefox" || browserName === "Edge") {
            browser.tabs.query({"active": true, "lastFocusedWindow": true}).then((tabs) => {
                let url = tabs[0].url;
                let hostName = urlParse(url, true).hostname;
                hostName = hostName.replace("www.", "");

                this.setState({url:url, name:hostName});
            }).catch(err => console.error(err));
        } else {
            chrome.tabs.query({"active": true, "lastFocusedWindow": true}, (tabs) => {
                let url = tabs[0].url;
                let hostName = urlParse(url, true).hostname;
                hostName = hostName.replace("www.", "");

                this.setState({url:url, name:hostName});
            });
        }
    }

    static get propTypes(){
        return({
            goBack:PropTypes.func,
            addFolder:PropTypes.func,
            addLink:PropTypes.func
        });
    }

    render(){
        return(
            <div className="menu">
                <button id="onlyBack" className="menuButton" onClick={this.backToFavs}>
                    <img src={Back} alt="back" className="icon" />
                </button><br />

                <label id="toggle-bar">
                    <button className={this.state.isFolder ? "toggle-bar-disabled-button" : "toggle-bar-enabled-button"} 
                        disabled={!this.state.isFolder} style={{borderRight:"none", borderRadius:"8px 0 0 8px"}} onClick={() => this.handleChecked(false)}>Link</button>
                    <button className={this.state.isFolder ? "toggle-bar-enabled-button" : "toggle-bar-disabled-button"} 
                        disabled={this.state.isFolder} style={{borderRadius:"0 8px 8px 0"}} onClick={() => this.handleChecked(true)}>Folder</button>
                </label><br />

				Name: <input className="inputField" type="text" onChange={this.updateName} value={this.state.name} /><br />
				URL: <input className="inputField" type="text" onChange={this.updateUrl} value={this.state.url} disabled={this.state.isFolder} /><br />

                <button className="plainButton" onClick={this.submit}>Submit</button>
            </div>
        );
    }

    handleChecked = (isFolder) => {
        this.setState({isFolder:isFolder});
    }
    updateName = (event) => {
        this.setState({name:event.target.value});
    }
    updateUrl = (event) => {
        this.setState({url:event.target.value});
    }
    backToFavs = () => {
        this.props.goBack();
    }
    submit = () => {
        if(this.state.name === "") {
            return;
        }

        if(this.state.isFolder){
            this.props.addFolder(this.state.name);
        }
        else{
            if(this.state.url === "") {
                return;
            }

            this.props.addLink(this.state.name, this.state.url);
        }
    }
}

export default Add;