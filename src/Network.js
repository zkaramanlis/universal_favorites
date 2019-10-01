/*global chrome*/
import clientId from "./client_id.json";
import axios from "axios";

export async function checkForFile() {
    return axios.get("https://www.googleapis.com/drive/v3/files", {
        q:"name = 'FavoritesBar_SyncFile.json'"
    })
        .then(res =>{
            if(res.data.files.length > 0){
                return res.data.files[0].id;
            }
        })
        .catch(async err => {
            if(err.response.status === 401){
                await refreshToken();
                return checkForFile();
            } else{
                console.error(err);
            }
        });
}

export async function getLastChanged(id) {
    return axios.get("https://www.googleapis.com/drive/v3/files/" + id + "?fields=modifiedTime")
        .then(res => res.data.modifiedTime)
        .catch(async err => {
            if(err.response.status === 401){
                await refreshToken();
                return getLastChanged(id);
            } else{
                console.error(err);
            }
        });
}

export async function getFile(id) {
    return axios.get("https://www.googleapis.com/drive/v3/files/" + id + "?alt=media")
        .then(res => res.data)
        .catch(async err => {
            if(err.response.status === 401){
                await refreshToken();
                return getFile(id);
            } else{
                console.error(err);
            }
        });
}

export async function uploadFile(links) {
    let boundary = "favorites";
    let delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var file = JSON.stringify(links);
    var metadata = {
        "name":"FavoritesBar_SyncFile.json",
        "mimeType": "application/json"
    };
    var multipartRequestBody =
            delimiter +
            "Content-Type: application/json\r\n\r\n" +
            JSON.stringify(metadata) +
            delimiter +
            "Content-Type: application/json\r\n\r\n" +
            file +
            close_delim;
        
    return axios.post("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=modifiedTime,id", 
        multipartRequestBody, 
        {headers:{
            "Content-Type":"multipart/related; boundary=favorites"
        }})
        .then(res => res.data)
        .catch(async err => {
            if(err.response.status === 401){
                await refreshToken();
                return uploadFile(links);
            } else{
                console.error(err);
            }
        });
}

export async function updateFile(id, links) {
    let boundary = "favorites";
    let delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    var file = JSON.stringify(links);
    var metadata = {
        "name":"FavoritesBar_SyncFile.json",
        "mimeType": "application/json"
    };
    var multipartRequestBody =
            delimiter +
            "Content-Type: application/json\r\n\r\n" +
            JSON.stringify(metadata) +
            delimiter +
            "Content-Type: application/json\r\n\r\n" +
            file +
            close_delim;

    return axios.patch("https://www.googleapis.com/upload/drive/v3/files/" + id + "?uploadType=multipart&fields=modifiedTime,id", 
        multipartRequestBody, 
        {headers:{
            "Content-Type":"multipart/related; boundary=favorites"
        }})
        .then(res => res.data)
        .catch(async err => {
            if(err.response.status === 401){
                await refreshToken();
                return updateFile(id, links);
            } else{
                console.error(err);
            }
        });
}

export async function refreshToken() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["refreshToken"], (result) => {
            if(result.refreshToken){
                axios.post("https://oauth2.googleapis.com/token", {
                    refresh_token:result.refreshToken,
                    client_id:clientId.installed.client_id,
                    client_secret:clientId.installed.client_secret,
                    grant_type:"refresh_token"
                }).then(res => {
                    axios.defaults.headers.common["Authorization"] = "Bearer " + res.data.accessToken;
                    chrome.storage.local.set({accessToken:res.data.access_token});
                    resolve();
                }).catch(err => reject(err));
            }

            reject("no refresh token");
        });
    });
}