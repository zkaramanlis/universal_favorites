import React from "react";
import PropTypes from "prop-types";
import clientId from "./client_id.json";
import axios from "axios";

class Settings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            authCode:""
        };
    }

    static get propTypes(){
        return({
            sync:PropTypes.func,
            goBack:PropTypes.func
        });
    }
	
    render() {
        return(
            <div className="menu">
                <button id="onlyBack" className="menuButton" onClick={this.backToFavs}>
                    <img src="https://img.icons8.com/ios-filled/50/000000/back.png" alt="back" className="icon" />
                </button>

                <p id="warningBlock">
                    Click on &apos;Authorize Access&apos; to sync this extension and google drive using the
                    provided code, which should be entered in the &apos;code&apos; block before submitting.
                    <br /><br />
                    Syncing to google drive will allow this extension to put a small JSON file named
                    &apos;FavoritesBar_SyncFile.json&apos; in your google drive to sync between different
                    browsers. Nothing else will be modifed, and the requested access only allows this
                    application to touch that file.
                </p>

                <form method="GET" target="_blank" action="https://accounts.google.com/o/oauth2/v2/auth">
                    <input type="hidden" name="client_id" value={clientId.installed.client_id} />
                    <input type="hidden" name="redirect_uri" value={clientId.installed.redirect_uris} />
                    <input type="hidden" name="response_type" value="code" />
                    <input type="hidden" name="scope" value="https://www.googleapis.com/auth/drive.file" />
                    <button type="submit">Authorize Access</button>
                </form><br />

				Code: <input key="code" type="Text" value={this.state.authCode} onChange={this.updateCode} /><br />
                <button onClick={this.submitAuth}>Submit</button>
            </div>
        );
    }

    submitAuth = () => {
        axios.post("https://oauth2.googleapis.com/token", {
            code:this.state.authCode,
            client_id:clientId.installed.client_id,
            client_secret:clientId.installed.client_secret,
            redirect_uri:clientId.installed.redirect_uris,
            grant_type:"authorization_code"
        }).then(res => {
            this.props.sync(res.data.access_token, res.data.refresh_token);
        }).catch(err => console.error(err));
    }
    updateCode = (event) => {
        this.setState({authCode:event.target.value});
    }
    backToFavs = () => {
        this.props.goBack();
    }
}

export default Settings;