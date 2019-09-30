/*global chrome */
import {getLastChanged, getFile, updateFile} from "./Network";
import axios from "axios";

chrome.runtime.onStartup.addListener(() => {

    chrome.storage.local.get(["accessToken", "fileId", "date"], (result) => {
        if(result.accessToken && result.fileId && result.date) {
            let axiosWithAuth = axios.create({headers:{
                Authorization:"Bearer " + result.accessToken
            }});

            getLastChanged(axiosWithAuth, result.fileId)
                .then(date => {
                    if(date !== result.date) {
                        getFile(axiosWithAuth, result.fileId)
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
                let axiosWithAuth = axios.create({headers:{
                    Authorization:"Bearer " + result.accessToken
                }});
    
                chrome.storage.local.set({linksChanged:false});
                updateFile(axiosWithAuth, result.fileId, result.links)
                    .then(res => {
                        chrome.storage.local.set({fileId:res.id, date:res.modifiedTime});
                    });
            }
        });
    });
});