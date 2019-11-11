import React from "react";
import {shallow, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SettingsMenu from "../SettingsMenu";
import chrome from "sinon-chrome";
import toJson from "enzyme-to-json";

window.chrome = chrome;

configure({adapter: new Adapter()});

const props = {
    sync: jest.fn(),
    goBack: jest.fn(),
    addImportedFolder: jest.fn()
};

var component;

beforeEach(() => {
    component = shallow(<SettingsMenu {...props} />);
});

afterEach(() => {
    jest.clearAllMocks();
});

test("settings menu snapshot test", () => {
    let tree = toJson(component);
    expect(tree).toMatchSnapshot();
});

test("import bookmarks should create list of links from chrome bookmarks", () => {
    chrome.bookmarks.getTree.yields([{
        children: [
            {title:"folder1", children:[
                {title:"link1", url:"http://example.com"},
                {title:"link2", url:"http://example.com"}
            ]},
            {title:"link3", url:"http://example.com"},
            {title:"link4", url:"http://example.com"}
        ]
    }]);

    component.find(".settings-menu-item").at(1).prop("onClick")({});

    expect(props.addImportedFolder).toHaveBeenCalledTimes(1);
    expect(props.addImportedFolder).toHaveBeenCalledWith(expect.objectContaining({
        type:"folder", label:"imported", id:expect.any(String), data:[
            {type:"folder", label:"folder1", id:expect.any(String), data:[
                {type:"link", label:"link1", id:expect.any(String), link:"http://example.com"},
                {type:"link", label:"link2", id:expect.any(String), link:"http://example.com"}
            ]},
            {type:"link", label:"link3", id:expect.any(String), link:"http://example.com"},
            {type:"link", label:"link4", id:expect.any(String), link:"http://example.com"}
        ]
    }));
});