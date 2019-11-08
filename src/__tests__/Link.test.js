import React from "react";
import {mount, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Link from "../Link";
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
            <Link item={linkItem} {...props} />
        </DndProvider>
    );

    folderComponent = mount(
        <DndProvider backend={TestBackend}>
            <Link item={folderItem} {...props} />
        </DndProvider>
    );
});

test("link snapshot test", () => {

    let tree = toJson(linkComponent);
    expect(tree).toMatchSnapshot();

    const clickedComponent = mount(
        <DndProvider backend={TestBackend}>
            <Link item={Object.assign({}, {clicked:true}, linkItem)} {...props} />
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
            <Link item={Object.assign({}, {clicked:true}, folderItem)} {...props} />
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

test("when link is clicked current tab should be updated", () => {

    linkComponent.find(".menu-item").prop("onClick")({});

    expect(chrome.tabs.update.called).toBe(true);
});

test("when link or folder is ctrl clicked setClicked should be called", () => {

    linkComponent.find(".menu-item").prop("onClick")({ctrlKey:true});
    folderComponent.find(".menu-item").prop("onClick")({ctrlKey:true});

    expect(props.setClicked).toHaveBeenCalledTimes(2);
    expect(props.setClicked).toHaveBeenCalledWith(props.id);
});

test("when link or folder is ctrl clicked setShiftClicked should be called", () => {

    linkComponent.find(".menu-item").prop("onClick")({shiftKey:true});
    folderComponent.find(".menu-item").prop("onClick")({shiftKey:true});

    expect(props.setShiftClicked).toHaveBeenCalledTimes(2);
    expect(props.setShiftClicked).toHaveBeenCalledWith(props.id);
});