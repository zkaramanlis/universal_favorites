import React from "react";
import {shallow, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
import Edit from "../Edit";

configure({adapter: new Adapter()});

const linkProps = {
    goBack: jest.fn(),
    save: jest.fn(),
    link: {type:"link", link:"http://example.com", label:"example.com"}
};

const folderProps = {
    goBack: jest.fn(),
    save: jest.fn(),
    link: {type:"folder", label:"example.com"}
};

afterEach(() => {
    jest.clearAllMocks();
});

test("edit link shapshot test", () => {
    const component = renderer.create(<Edit {...linkProps} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("edit folder shapshot test", () => {
    const component = renderer.create(<Edit {...folderProps} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test("when back is clicked than goBack should be called", () => {
    const component = shallow(<Edit {...linkProps} />);
    component.find("#onlyBack").prop("onClick")();

    expect(linkProps.goBack).toHaveBeenCalledTimes(1);
});

test("when folder is changed then save should be called", () => {
    const component = shallow(<Edit {...folderProps} />);
    component.find("input").at(0).simulate("change", {target: {value: "example2.com"}});
    component.find(".plainButton").prop("onClick")();

    expect(folderProps.save).toHaveBeenCalledTimes(1);
    expect(folderProps.save).toHaveBeenCalledWith({type:"folder", label:"example2.com"});
});

test("when link is changed then save should be called", () => {
    const component = shallow(<Edit {...linkProps} />);
    const inputs = component.find("input");
    inputs.at(0).simulate("change", {target: {value: "example2.com"}});
    inputs.at(1).simulate("change", {target: {value: "http://example2.com"}});

    component.find(".plainButton").prop("onClick")();

    expect(linkProps.save).toHaveBeenCalledTimes(1);
    expect(linkProps.save).toHaveBeenCalledWith({type:"link", link:"http://example2.com", label:"example2.com"});
});