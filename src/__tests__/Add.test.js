import React from "react";
import {shallow, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
import Add from "../Add";
import chrome from "sinon-chrome";

window.chrome = chrome;
chrome.tabs.query.yields([{url:"http://example.com"}]);

configure({adapter: new Adapter()});

const props = {
    goBack: jest.fn(),
    addFolder: jest.fn(),
    addLink: jest.fn()
};

afterEach(() => {
    jest.clearAllMocks();
});

test("Add Menu Snapshot Test", () => {

    const component = renderer.create(<Add {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.root.findByProps({className:"toggle-bar-disabled-button"}).props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("when back is clicked than goBack should be called", () => {
    const component = shallow(<Add {...props} />);
    component.find("#onlyBack").prop("onClick")();

    expect(props.goBack).toHaveBeenCalledTimes(1);
});

test("when link is submitted then addLink should be called", () => {
    const component = shallow(<Add {...props} />);
    component.find(".plainButton").prop("onClick")();

    expect(props.addLink).toHaveBeenCalledTimes(1);
    expect(props.addLink).toHaveBeenCalledWith("example.com", "http://example.com");
});

test("when folder is submitted then addFolder should be called", () => {
    const component = shallow(<Add {...props} />);
    component.find(".toggle-bar-disabled-button").prop("onClick")();
    component.find(".plainButton").prop("onClick")();

    expect(props.addFolder).toHaveBeenCalledTimes(1);
    expect(props.addFolder).toHaveBeenCalledWith("example.com");
});