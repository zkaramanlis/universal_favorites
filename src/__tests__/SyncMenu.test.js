import React from "react";
import {shallow, configure} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SyncMenu from "../SyncMenu";
import chrome from "sinon-chrome";
import toJson from "enzyme-to-json";

window.chrome = chrome;

configure({adapter: new Adapter()});

const props = {
    sync:jest.fn(),
    goBack:jest.fn()
};

var component;

beforeEach(() => {
    component = shallow(<SyncMenu {...props} />);
});

test("sync menu snapshot test", () => {
    let tree = toJson(component);
    expect(tree).toMatchSnapshot();
});