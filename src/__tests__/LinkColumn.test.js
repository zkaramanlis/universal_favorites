import React from "react";
import {shallow, mount, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LinkColumn from "../LinkColumn";
import chrome from "sinon-chrome";
import toJson from "enzyme-to-json";
import TestBackend from "react-dnd-test-backend";
import { DndProvider } from "react-dnd";


window.chrome = chrome;

configure({adapter: new Adapter()});

const props = {
    links: [
        {type:"folder", label:"folder", id:0, data:[
            {type:"link", link:"http://example.com", label:"example.com", id:2},
            {type:"link", link:"http://example2.com", label:"example2.com", id:3}
        ]},
        {type:"link", link:"http://example.com", label:"example.com", id:1},
        {type:"link", link:"http://example.com", label:"example.com", id:4}
    ],
    changeLinks: jest.fn(),
    openFolder: jest.fn(),
    showEdit: jest.fn(),
    deleteLink: jest.fn(),
    tempChangeLinks: jest.fn()
};

var component;

beforeEach(() => {
    component = shallow(<LinkColumn {...props} />);
});

afterEach(() => {
    jest.clearAllMocks();
});

test("link column snapshot test", async () => {
    let tree = toJson(component);
    expect(tree).toMatchSnapshot();

    let links = component.find(".LinkColumnDiv");
    links.at(0).simulate("contextmenu", {clientX:20, preventDefault: jest.fn()});
    component.update();
    
    tree = toJson(component);
    expect(tree).toMatchSnapshot();
});

test("when edit is clicked in context menu then showEdit should be called", () => {
    let links = component.find(".LinkColumnDiv");
    links.at(0).simulate("contextmenu", {clientX:20, preventDefault: jest.fn()});

    let contextMenu = component.find("#ContextMenu");
    contextMenu.children().at(0).prop("onClick")({});

    expect(props.showEdit).toHaveBeenCalledTimes(1);
    expect(props.showEdit).toHaveBeenCalledWith(props.links[0]);
});

test("when delete is clicked in context menu then deleteLink should be called", () => {
    let links = component.find(".LinkColumnDiv");
    links.at(0).simulate("contextmenu", {clientX:20, preventDefault: jest.fn()});

    let contextMenu = component.find("#ContextMenu");
    contextMenu.children().at(1).prop("onClick")({});

    expect(props.deleteLink).toHaveBeenCalledTimes(1);
    expect(props.deleteLink).toHaveBeenCalledWith(props.links[0].id);
});

test("when Open All is clicked in a folder's context menu then all links inside should be opened", () => {
    let links = component.find(".LinkColumnDiv");
    links.at(0).simulate("contextmenu", {clientX:20, preventDefault: jest.fn()});

    let contextMenu = component.find("#ContextMenu");
    contextMenu.children().at(2).prop("onClick")({});

    expect(chrome.tabs.create.called).toBe(true);
    expect(chrome.tabs.create.callCount).toBe(2);
    expect(chrome.tabs.create.calledWith({url:props.links[0].data[0].link, active:false}));
    expect(chrome.tabs.create.calledWith({url:props.links[0].data[1].link, active:false}));
});

test("when close is clicked in context menu then context menu should be hidden", () => {
    let links = component.find(".LinkColumnDiv");
    links.at(0).simulate("contextmenu", {clientX:20, preventDefault: jest.fn()});

    let contextMenu = component.find("#ContextMenu");
    expect(contextMenu.prop("hidden")).toBe(false);

    contextMenu.children().at(3).prop("onClick")({});

    contextMenu = component.find("#ContextMenu");
    expect(contextMenu.prop("hidden")).toBe(true);
});

test("when shift clicking appropriate links should be marked for App to update", () => {
    let mountedComponent = mount(<DndProvider backend={TestBackend}><LinkColumn {...props} /></DndProvider>);

    let expectedResult = props.links.map(a => ({...a}));
    expectedResult[0].clicked = true;

    let items = mountedComponent.find(".menu-item");
    items.at(0).prop("onClick")({shiftKey:true});

    expect(props.tempChangeLinks).toHaveBeenCalledTimes(1);
    expect(props.tempChangeLinks).toHaveBeenCalledWith(expectedResult);

    let updatedProps = Object.assign({}, props, {links:expectedResult});
    mountedComponent = mount(<DndProvider backend={TestBackend}><LinkColumn {...updatedProps} /></DndProvider>);
    items = mountedComponent.find(".menu-item");

    items.at(2).prop("onClick")({shiftKey:true});

    expectedResult[1].clicked = true;
    expectedResult[2].clicked = true;

    expect(props.tempChangeLinks).toHaveBeenCalledTimes(2);
    expect(props.tempChangeLinks).toHaveBeenLastCalledWith(expectedResult);
});

test("when ctrl clicking appriate link should be marked for app to update", () => {
    let mountedComponent = mount(<DndProvider backend={TestBackend}><LinkColumn {...props} /></DndProvider>);

    let expectedResult = props.links.map(a => ({...a}));
    expectedResult[0].clicked = true;

    let items = mountedComponent.find(".menu-item");
    items.at(0).prop("onClick")({ctrlKey:true});

    expect(props.tempChangeLinks).toHaveBeenCalledTimes(1);
    expect(props.tempChangeLinks).toHaveBeenCalledWith(expectedResult);
});