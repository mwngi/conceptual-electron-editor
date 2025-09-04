"use strict";
const { bridgeAPI, ipcChannel } = require("./ipc-channels.js");
const { ipcRenderer, contextBridge} = require("electron/renderer"); 

contextBridge.exposeInMainWorld(bridgeAPI.bridgeFileIO, { // to be used only in renderer loaded from HTML
    openFile: handler => {
            ipcRenderer.send(ipcChannel.fileIO.openFile);
            ipcRenderer.once(ipcChannel.fileIO.openFile, (_event, filename, baseFilename, text, error) => {
                handler(filename, baseFilename, text, error);
            });
    }, //openFile
    subscribeToCommandLine: handler =>
        ipcRenderer.on(ipcChannel.fileIO.openFromCommandLine, (_event, filename, simpleFileName, text, error) => handler(filename, simpleFileName, text, error)),
    saveFileAs: (text, handler) => {
        ipcRenderer.send(ipcChannel.fileIO.saveFileAs, text);
        ipcRenderer.once(ipcChannel.fileIO.saveFileAs, (_event, filename, baseFilename, error) =>
                handler(filename, baseFilename, error));
    }, //saveFileAs
    saveExistingFile: (filename, text, handler) => {
        ipcRenderer.send(ipcChannel.fileIO.saveExistingFile, filename, text);
        ipcRenderer.once(ipcChannel.fileIO.saveExistingFile, (_event, filename, baseFilename, error) =>
                handler(filename, baseFilename, error));
    }, //saveExistingFile
}); //contextBridge.exposeInMainWorld

contextBridge.exposeInMainWorld(bridgeAPI.bridgePlugin, {
    subscribeToPlugin: handler => 
        ipcRenderer.on(ipcChannel.plugin.loadAll, (_event, text) => {
            handler(text);
        }),
}); //contextBridge.exposeInMainWorld

contextBridge.exposeInMainWorld(bridgeAPI.bridgeMetadata, {
    metadata: async () =>
        await ipcRenderer.invoke(ipcChannel.metadata.request),
}); //contextBridge.exposeInMainWorld