import React from "react";
import Toggle from "react-toggle";
import PropTypes from "prop-types";
import "react-toggle/style.css";

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
        // chrome.tabs.query({"active": true, "lastFocusedWindow": true}, (tabs) => {
        //     var url = tabs[0].url;

        //     this.setState({url:url});
        // });
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
                    <img src="https://img.icons8.com/ios-filled/50/000000/back.png" alt="back" className="icon" />
                </button><br />

                <label id="toggle-bar">
                    <span>{this.state.isFolder ? "Folder:" : "Link:"}</span>
                    <Toggle 
                        checked={this.state.isFolder} onChange={this.handleChecked}
                        icons={{
                            checked: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                width="50" height="50"
                                viewBox="0 0 172 172" className="icon toggleIcons"
                                style={{"fill":"#000000"}}><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{"mixBlendMode":"normal"}}><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M143.33333,43h-57.33333l-14.33333,-14.33333h-43c-7.88333,0 -14.33333,6.45 -14.33333,14.33333v86c0,7.88333 6.45,14.33333 14.33333,14.33333h114.66667c7.88333,0 14.33333,-6.45 14.33333,-14.33333v-71.66667c0,-7.88333 -6.45,-14.33333 -14.33333,-14.33333z"></path></g></g></svg>,
                            unchecked: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                width="24" height="24"
                                viewBox="0 0 172 172" className="icon toggleIcons"
                                style={{"fill":"#000000"}}><g fill="none" fillRule="nonzero" stroke="none" strokeWidth="1" strokeLinecap="butt" strokeLinejoin="miter" strokeMiterlimit="10" strokeDasharray="" strokeDashoffset="0" fontFamily="none" fontWeight="none" fontSize="none" textAnchor="none" style={{"mixBlendMode":"normal"}}><path d="M0,172v-172h172v172z" fill="none"></path><g fill="#ffffff"><path d="M86,14.33333c-23.37767,0 -44.09986,11.30183 -57.19336,28.66667h-0.13997v0.18197c-7.0735,9.44567 -11.91346,20.66105 -13.63346,32.86588c-4.58667,32.5295 14.60936,62.72535 44.6377,76.03385c9.08733,4.02767 17.90043,5.57813 26.35709,5.57097c3.956,0.00717 7.13867,-3.25299 7.13867,-7.19466v-7.12468v-50.16667c0,-3.956 -3.21067,-7.16667 -7.16667,-7.16667h-14.33333c-3.956,0 -7.16667,-3.21067 -7.16667,-7.16667c0,-3.98467 3.25165,-7.21683 7.25065,-7.16667c3.92733,0.05017 7.08268,-3.23933 7.08268,-7.16667v-7.16667c0,-3.956 3.21067,-7.16667 7.16667,-7.16667h7.16667c7.91917,0 14.33333,-6.41417 14.33333,-14.33333v-2.93945c20.984,8.52833 35.83333,29.09779 35.83333,53.10612c0,0.086 -0.014,0.16595 -0.014,0.25195c0,0 0.02775,-0.00007 0.02799,0c0.13557,3.85389 3.2964,6.90957 7.15267,6.91472c3.95804,0 7.16667,-3.20863 7.16667,-7.16667c0.00119,-0.22427 -0.00815,-0.44848 -0.02799,-0.67187c-0.36576,-39.2056 -32.34826,-70.99479 -71.63867,-70.99479zM30.16439,73.16439l34.33561,34.33561v7.16667c0,7.91917 6.41417,14.33333 14.33333,14.33333v13.84343c-28.23667,-3.5475 -50.16667,-27.66076 -50.16667,-56.84343c0,-4.41467 0.55172,-8.70045 1.49772,-12.83561zM112.03515,78.66536c-2.40125,0.3104 -4.53515,2.27878 -4.53515,5.12305v51.18848c0,3.14617 3.7747,4.76102 6.06087,2.58952l10.2321,-9.72818l11.08593,25.55924c1.91351,4.4075 7.06421,6.39434 11.43588,4.40918c4.31433,-1.96367 6.2257,-7.05155 4.2692,-11.36588l-11.14193,-24.60742h11.2959c3.225,0 4.81353,-3.92285 2.49153,-6.15885l-36.98112,-35.59538c-1.23087,-1.1825 -2.77246,-1.59997 -4.21322,-1.41374z"></path></g></g></svg>,
                        }}
                    />
                </label><br />

				Name: <input className="inputField" type="text" onChange={this.updateName} value={this.state.name} /><br />
				URL: <input className="inputField" type="text" onChange={this.updateUrl} value={this.state.url} disabled={this.state.isFolder} /><br />

                <button className="plainButton" onClick={this.submit}>Submit</button>
            </div>
        );
    }

    handleChecked = (event) => {
        this.setState({isFolder:event.target.checked});
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