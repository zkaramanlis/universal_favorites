import React from "react";
import {mount, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LinkColumn from "../LinkColumn";
import chrome from "sinon-chrome";
import toJson from "enzyme-to-json";
import TestBackend from "react-dnd-test-backend";
import { DndProvider } from "react-dnd";
import { act } from "react-dom/test-utils";


window.chrome = chrome;

configure({adapter: new Adapter()});

const props = {
    links: [
        {type:"folder", label:"folder", id:0},
        {type:"link", link:"http://example.com", label:"example.com", id:1}
    ],
    changeLinks: jest.fn(),
    openFolder: jest.fn(),
    showEdit: jest.fn(),
    deleteLink: jest.fn(),
    tempChangeLinks: jest.fn()
};

var component;

beforeEach(() => {
    component = mount(<DndProvider backend={TestBackend}><LinkColumn {...props} /></DndProvider>);
});

test("link column snapshot test", async () => {
    let tree = toJson(component);
    expect(tree).toMatchSnapshot();

    await act(async () => {
        let links = component.find(".LinkColumnDiv");
        links.at(0).simulate("contextmenu", {clientX:20, preventDefault: jest.fn()});
    
        tree = toJson(component);
        expect(tree).toMatchSnapshot();
    });
});