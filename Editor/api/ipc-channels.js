"use strict";

const ipcChannel = {
    fileIO: {
        openFile: 0,
        openFromCommandLine: 0,
        saveFileAs: 0,
        saveExistingFile: 0,
    }, //fileIO
    plugin: {
        loadAll: 0,
    }, //plugin
    metadata: {
        request: 0,
        source: 0, // show application source code in a default external browser
    }, //metadata
}; //ipcChannel

const bridgeAPI = {
    bridgeFileIO: 0,
    bridgePlugin: 0,
    bridgeMetadata: 0,
}; //bridgeAPI

for (const subset of [ipcChannel.fileIO, ipcChannel.plugin, bridgeAPI, ipcChannel.metadata])
    for (const index in subset)
        if (!subset[index])
            subset[index] = index;
Object.freeze(ipcChannel);

module.exports = { bridgeAPI, ipcChannel };
