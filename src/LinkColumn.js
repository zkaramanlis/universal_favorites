import React from "react";
import {Droppable, Draggable} from "react-beautiful-dnd";
import { ContextMenuTrigger } from "react-contextmenu";
import PropTypes from "prop-types";

class LinkColumn extends React.Component {
    render() {
        return (
            <Droppable droppableId="LinkColumn" isCombineEnabled>
                {(provided) =>
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <input type="text" id="searchBar" placeholder="Search" onChange={this.search} value={this.props.searchString} />
                        {this.getLinks()}
                        {provided.placeholder}
                    </div>
                }
            </Droppable>);
    }

    static get propTypes(){
        return({
            links:PropTypes.array,
            openFolder:PropTypes.func,
            search:PropTypes.func,
            searchString:PropTypes.string
        });
    }

    getLinks = () => {
        return(
            this.props.links.map((item, id) => (
                <ContextMenuTrigger linkId={id} key={id} id="ContextMenu" collect={this.collect}>
                    <Draggable draggableId={id.toString()} index={id} key={id}>
                        {(provided, snapshot) => (
                            <div 
                                key={id} 
                                className="menu-item" 
                                onClick={item.type === "folder" ? () => this.openFolder(item.data, id) : undefined}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                style={{
                                    backgroundColor:snapshot.combineTargetFor ? "lightgray" : null,
                                    ...provided.draggableProps.style,
                                }}
                            >
                                {this.getContent(item, id)}
                            </div>
                        )}
                    </Draggable>
                </ContextMenuTrigger>)
            )
        );
    }

    search = (event) => {
        this.props.search(event.target.value);
    }

    collect = (props) => {
        return {linkId:props.linkId};
    }

    getContent(item) {
        let label = item.label;
        if(label.length > 14){
            label = label.substring(0, 11);
            label += "...";
        }

        if(item.type === "folder"){
            return (
                <React.Fragment>
                    <img src="https://img.icons8.com/color/48/000000/folder-invoices.png" alt="folder" className="icon" />
                    {label}
                    <img src="https://img.icons8.com/material/24/000000/sort-right--v1.png" alt="arrow" className="icon arrow" />
                </React.Fragment>);
        }

        let url = item.link;
        if(!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "//" + url;
        }

        return(
            <React.Fragment>
                <a href={url} className="link">
                    <img src={"https://www.google.com/s2/favicons?domain=" + item.link} alt="link" className="icon" onError={this.getFallbackFavicon} />
                    {label}
                </a>
            </React.Fragment>);
    }

    getFallbackFavicon = (event) => {
        event.target.src = "https://img.icons8.com/material/24/000000/internet.png";
    }

    openFolder = (items, id) => {
        this.props.openFolder(items, id);
    }
}

export default LinkColumn;