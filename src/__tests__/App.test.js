import React from "react";
import {shallow, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import App from "../App";
import chrome from "sinon-chrome";

window.chrome = chrome;

configure({adapter: new Adapter()});

var component;
var instance;

beforeEach(() => {
    component = shallow(<App />);
    instance = component.instance();
});

afterEach(() => {
    chrome.flush();
});

test("when folder is imported folder then storage and list should be updated and settings menu closed", () => {
    let importedLinks = {label:"imported", type:"folder", data:[
        {label:"link1", type:"link", link:"http://example.com"},
        {label:"folder", type:"folder", data:[
            {label:"link2", type:"link", link:"http://example.com"}
        ]}
    ]};

    instance.addImportedFolder(importedLinks);
    component.update();

    let currentLinks = component.state("currentLinks");

    expect(currentLinks[0].label).toBe("imported");
    expect(currentLinks[0].data[0].label).toBe("link1");
    expect(currentLinks[0].data[1].label).toBe("folder");

    expect(chrome.storage.local.set.calledWith({
        linksChanged:true, 
        links:{label:"home", type:"home", data:[importedLinks]}
    })).toBe(true);

    expect(component.state("settingsMenu")).toBe(false);
    expect(chrome.storage.local.set.calledWith({settingsMenu:false, syncMenu:false})).toBe(true);
});

test("when tempChangeLinks is called then the list should be updated", () => {
    let newLinks = [
        {label:"link1", type:"link", link:"http://example.com"},
        {label:"folder", type:"folder", data:[
            {label:"link2", type:"link", link:"http://example.com"}
        ]}
    ];

    instance.tempChangeLinks(newLinks);
    component.update();

    let currentLinks = component.state("currentLinks");

    expect(currentLinks[0].label).toBe("link1");
    expect(currentLinks[1].label).toBe("folder");
    expect(currentLinks[1].data[0].label).toBe("link2");
});

test("when getList is called then the stored links should be returned at the given location", () => {
    let importedLinks = {label:"imported", type:"folder", data:[
        {label:"link1", type:"link", link:"http://example.com"},
        {label:"folder", type:"folder", data:[
            {label:"link2", type:"link", link:"http://example.com"}
        ]}
    ]};

    instance.addImportedFolder(importedLinks);
    component.update();
    instance = component.instance();

    let list = instance.getList([]);
    expect(list.label).toBe("home");
    expect(list.data[0].label).toBe("imported");

    list = instance.getList([0]);
    expect(list.label).toBe("imported");
    expect(list.data[0].label).toBe("link1");
    expect(list.data[1].label).toBe("folder");

    list = instance.getList([0, 1]);
    expect(list.label).toBe("folder");
    expect(list.data[0].label).toBe("link2");
});

test("when changeLinks is called then the currently viewed links should be updated in the view and in storage", () => {
    let newLinks = [
        {label:"link1", type:"link", link:"http://example.com"},
        {label:"folder", type:"folder", data:[
            {label:"link2", type:"link", link:"http://example.com"}
        ]}
    ];

    instance.changeLinks(newLinks);
    component.update();

    let currentLinks = component.state("currentLinks");

    expect(currentLinks[0].label).toBe("link1");
    expect(currentLinks[1].label).toBe("folder");
    expect(currentLinks[1].data[0].label).toBe("link2");

    expect(chrome.storage.local.set.calledWith({
        linksChanged:true, 
        links:{label:"home", type:"home", data:newLinks}
    })).toBe(true);
});

test("when a search is done then the list should be updated with matches and add and settings buttons disabled", () => {
    let newLinks = [
        {label:"link1", type:"link", link:"http://example.com"},
        {label:"folder", type:"folder", data:[
            {label:"link2", type:"link", link:"http://example.com"}
        ]}
    ];

    instance.changeLinks(newLinks);
    component.update();
    instance = component.instance();

    instance.search({target:{value:"link"}});
    component.update();

    let currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("link1");
    expect(currentLinks[1].label).toBe("link2");

    expect(component.state("settingsDisabled")).toBe(true);
    expect(component.state("addDisabled")).toBe(true);
    expect(component.state("backDisabled")).toBe(false);
});

test("when a link is moved up then the current links and storage should be updated", () => {
    let newLinks = [
        {label:"link1", type:"link", link:"http://example.com"},
        {label:"folder", type:"folder", data:[
            {label:"link2", type:"link", link:"http://example.com"}
        ]}
    ];

    instance.changeLinks(newLinks);
    component.update();
    instance = component.instance();

    instance.openFolder(newLinks[1], 1);
    component.update();
    instance = component.instance();

    instance.moveUp(0);
    let currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("link1");
    expect(currentLinks[1].label).toBe("folder");
    expect(currentLinks[1].data.length).toBe(0);
    expect(currentLinks[2].label).toBe("link2");
});

test("when link is deleted then it should be removed from links and storage", () => {
    let newLinks = [
        {label:"link1", type:"link", link:"http://example.com", id:0},
        {label:"folder", type:"folder", id:1, data:[
            {label:"link2", type:"link", link:"http://example.com", id:2}
        ]}
    ];

    instance.changeLinks(newLinks);
    component.update();
    instance = component.instance();

    instance.deleteLink(0);
    component.update();

    let currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("folder");
    expect(currentLinks.length).toBe(1);

    newLinks.splice(0, 1);

    expect(chrome.storage.local.set.calledWith({
        linksChanged:true, 
        links:{label:"home", type:"home", data:newLinks}
    })).toBe(true);
});

test("when a link is edited then list and storage should be updated", () => {
    let newLinks = [
        {label:"link1", type:"link", link:"http://example.com", id:0},
        {label:"folder", type:"folder", id:1, data:[
            {label:"link2", type:"link", link:"http://example.com", id:2}
        ]}
    ];

    instance.changeLinks(newLinks);
    component.update();
    instance = component.instance();

    let currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("link1");

    newLinks[0].label = "changedLink1";
    instance.saveEdit(newLinks[0]);
    component.update();
    
    currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("changedLink1");

    expect(chrome.storage.local.set.calledWith({
        linksChanged:true, 
        links:{label:"home", type:"home", data:newLinks}
    })).toBe(true);
});

test("when a folder is added then list and storage should be updated", () => {
    instance.addFolder("folder");
    component.update();

    let currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("folder");

    expect(chrome.storage.local.set.args[0][0]).toMatchObject({
        linksChanged:true, 
        links:{label:"home", type:"home", data:[{label:"folder", type:"folder", data:[]}]}
    });
});

test("when a link is added then list and storage should be updated", () => {
    instance.addLink("link1", "http://example.com");
    component.update();

    let currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("link1");

    expect(chrome.storage.local.set.args[0][0]).toMatchObject({
        linksChanged:true, 
        links:{label:"home", type:"home", data:[{label:"link1", type:"link", link:"http://example.com"}]}
    });
});

test("when a folder is opened then links should be updated and back button enabled", () => {
    let newLinks = [
        {label:"link1", type:"link", link:"http://example.com", id:0},
        {label:"folder", type:"folder", id:1, data:[
            {label:"link2", type:"link", link:"http://example.com", id:2}
        ]}
    ];

    instance.changeLinks(newLinks);
    component.update();
    instance = component.instance();
    
    instance.openFolder(newLinks[1], 1);
    component.update();

    let currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("link2");

    expect(component.state("backDisabled")).toBe(false);
});

test("when back button is pressed links go to the previous folder", () => {
    let newLinks = [
        {label:"link1", type:"link", link:"http://example.com", id:0},
        {label:"folder", type:"folder", id:1, data:[
            {label:"link2", type:"link", link:"http://example.com", id:2}
        ]}
    ];

    instance.changeLinks(newLinks);
    component.update();
    instance = component.instance();

    instance.openFolder(newLinks[1], 1);
    component.update();
    instance = component.instance();

    let currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("link2");

    instance.goBack();
    component.update();
    
    currentLinks = component.state("currentLinks");
    expect(currentLinks[0].label).toBe("link1");
    expect(currentLinks[1].label).toBe("folder");
});