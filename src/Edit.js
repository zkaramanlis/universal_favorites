import React from "react";
import PropTypes from "prop-types";

class Edit extends React.Component {

    constructor(props){
        super(props);

        let isFolder = false;
        let url = "";
        if(props.link.type === "folder") {
            isFolder = true;
        }
        else {
            url = props.link.link;
        }

        this.state = {
            name:props.link.label,
            url:url,
            isFolder:isFolder
        };
    }

    static get propTypes(){
        return({
            goBack:PropTypes.func,
            save:PropTypes.func,
            link:PropTypes.object
        });
    }

    render(){
        return(
            <div className="menu">
                <button id="onlyBack" className="menuButton" onClick={this.backToFavs}>
                    <img src="https://img.icons8.com/ios-filled/50/000000/back.png" alt="back" className="icon" />
                </button><br />

				Name: <input type="text" onChange={this.updateName} value={this.state.name} /><br />
                {this.state.isFolder ? 
                    null
                    : <React.Fragment>URL: <input type="text" onChange={this.updateUrl} value={this.state.url} /><br /></React.Fragment>}

                <button onClick={this.submit}>Submit</button>
            </div>
        );
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

    let link = Object.assign({}, this.props.link);

    link.label = this.state.name;

    if(this.state.isFolder){
        this.props.save(link);
    }
    else{
        if(this.state.url === "") {
            return;
        }

        link.link = this.state.url;

        this.props.save(link);
    }
}
}

export default Edit;