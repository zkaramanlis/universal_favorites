/*global chrome browser*/
import {getLastChanged, getFile, updateFile} from "./Network";
import axios from "axios";
import { browserName } from "react-device-detect";

if(browserName === "Firefox" || browserName === "Edge") {
    browser.runtime.onStartup.addListener(() => {

        browser.storage.local.get(["accessToken", "fileId", "date"]).then((result) => {
            if(result.accessToken && result.fileId && result.date) {
                axios.defaults.headers.common["Authorization"] = "Bearer " + result.accessToken;

                getLastChanged(result.fileId)
                    .then(date => {
                        if(date !== result.date) {
                            getFile(result.fileId)
                                .then(file => {
                                    browser.storage.local.set({links:file, date:date});
                                });
                        }
                    });
            }
        }).catch(err => console.error(err));
    });

    browser.runtime.onConnect.addListener(port => {
        port.onDisconnect.addListener(() => {
            browser.storage.local.get(["accessToken", "linksChanged", "links", "fileId"])
                .then((result) => {
                    if(result.accessToken && result.linksChanged && result.links && result.fileId) {
                        axios.defaults.headers.common["Authorization"] = "Bearer " + result.accessToken;
    
                        browser.storage.local.set({linksChanged:false});
                        updateFile(result.fileId, result.links)
                            .then(res => {
                                browser.storage.local.set({fileId:res.id, date:res.modifiedTime});
                            });
                    }
                }).catch(err => console.error(err));
        });
    });
} else {
    chrome.runtime.onStartup.addListener(() => {

        chrome.storage.local.get(["accessToken", "fileId", "date"], (result) => {
            if(result.accessToken && result.fileId && result.date) {
                axios.defaults.headers.common["Authorization"] = "Bearer " + result.accessToken;

                getLastChanged(result.fileId)
                    .then(date => {
                        if(date !== result.date) {
                            getFile(result.fileId)
                                .then(file => {
                                    chrome.storage.local.set({links:file, date:date});
                                });
                        }
                    });
            }
        });
    });

    chrome.runtime.onConnect.addListener(port => {
        port.onDisconnect.addListener(() => {
            chrome.storage.local.get(["accessToken", "linksChanged", "links", "fileId"], (result) => {
                if(result.accessToken && result.linksChanged && result.links && result.fileId) {
                    axios.defaults.headers.common["Authorization"] = "Bearer " + result.accessToken;
    
                    chrome.storage.local.set({linksChanged:false});
                    updateFile(result.fileId, result.links)
                        .then(res => {
                            chrome.storage.local.set({fileId:res.id, date:res.modifiedTime});
                        });
                }
            });
        });
    });
}