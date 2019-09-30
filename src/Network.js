/*global chrome*/
import clientId from "./client_id.json";

export async function checkForFile(axios) {
    return axios.get("https://www.googleapis.com/drive/v3/files", {
        q:"name = 'FavoritesBar_SyncFile.json'"
    })
        .then(res =>{
            if(res.data.files.length > 0){
                return res.data.files[0].id;
            }
        })
        .catch(err => {
            if(err.error && err.error.errors && err.error.errors[0].reason === "authError"){
                return this.refreshToken(axios).then(() => this.checkForFile());
            } else{
                console.error(err);
            }
        });
}

export async function getLastChanged(axios, id) {
    return axios.get("https://www.googleapis.com/drive/v3/files/" + id + "?fields=modifiedTime")
        .then(res => res.data.modifiedTime)
        .catch(err => {
            if(err.error && err.error.errors && err.error.errors[0].reason === "authError"){
                return this.refreshToken(axios).then(() => this.getFile(id));
            } else{
                console.error(err);
            }
        });
}

export async function getFile(axios, id) {
    return axios.get("https://www.googleapis.com/drive/v3/files/" + id + "?alt=media")
        .then(res => res.data)
        .catch(err => {
            if(err.error && err.error.errors && err.error.errors[0].reason === "authError"){
                return this.refreshToken(axios).then(() => this.getFile(id));
            } else{
                console.error(err);
            }
        });
}

export async function uploadFile(axios, links) {
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
        .catch(err => {
            if(err.error && err.error.errors && err.error.errors[0].reason === "authError"){
                return this.refreshToken(axios).then(() => this.uploadFile());
            } else{
                console.error(err);
            }
        });
}

export async function refreshToken(axios) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["refreshToken"], (result) => {
            if(result.refreshToken){
                axios.post("https://oauth2.googleapis.com/token", {
                    refresh_token:result.refreshToken,
                    client_id:clientId.installed.client_id,
                    client_secret:clientId.installed.client_secret,
                    grant_type:"refresh_token"
                }).then(res => {
                    axios = axios.create({headers:{
                        Authorization:"Bearer " + res.access_token
                    }});
                    chrome.storage.local.set({accessToken:res.access_token});
                    resolve();
                }).catch(err => reject(err));
            }

            reject("now refresh token");
        });
    });
}

export async function updateFile(axios, id, links) {
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
        .catch(err => {
            if(err.error && err.error.errors && err.error.errors[0].reason === "authError"){
                return this.refreshToken(axios).then(() => this.uploadFile());
            } else{
                console.error(err);
            }
        });
}