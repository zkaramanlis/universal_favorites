import React from "react";
import {mount, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import LinkMobile from "../LinkMobile";
import chrome from "sinon-chrome";
import { DndProvider } from "react-dnd";
import toJson from "enzyme-to-json";
import TestBackend from "react-dnd-test-backend";

window.chrome = chrome;

configure({adapter: new Adapter()});

const props = {
    openFolder: jest.fn(),
    id: 0,
    saveDraggingId: jest.fn(),
    dropElement: jest.fn(),
    draggingId: 0,
    setClicked: jest.fn(),
    setShiftClicked: jest.fn()
};

const linkItem = {
    type:"link",
    link:"http://example.com",
    label: "example.com"
};

const folderItem = {
    type:"folder",
    label: "example.com"
};

var linkComponent;
var folderComponent;

beforeEach(() => {
    linkComponent = mount(
        <DndProvider backend={TestBackend}>
            <LinkMobile item={linkItem} {...props} />
        </DndProvider>
    );

    folderComponent = mount(
        <DndProvider backend={TestBackend}>
            <LinkMobile item={folderItem} {...props} />
        </DndProvider>
    );
});

test("link snapshot test", () => {

    let tree = toJson(linkComponent);
    expect(tree).toMatchSnapshot();

    const clickedComponent = mount(
        <DndProvider backend={TestBackend}>
            <LinkMobile item={Object.assign({}, {clicked:true}, linkItem)} {...props} />
        </DndProvider>
    );

    tree = toJson(clickedComponent);
    expect(tree).toMatchSnapshot();
});

test("folder snapshot test", () => {
    let tree = toJson(folderComponent);
    expect(tree).toMatchSnapshot();

    const clickedComponent = mount(
        <DndProvider backend={TestBackend}>
            <LinkMobile item={Object.assign({}, {clicked:true}, folderItem)} {...props} />
        </DndProvider>
    );

    tree = toJson(clickedComponent);
    expect(tree).toMatchSnapshot();
});

test("when folder is clicked openFolder should be called", () => {

    folderComponent.find(".menu-item").prop("onClick")({});

    expect(props.openFolder).toHaveBeenCalledTimes(1);
    expect(props.openFolder).toHaveBeenCalledWith(folderItem, props.id);
});