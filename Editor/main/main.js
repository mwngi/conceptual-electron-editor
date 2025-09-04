"use strict";

const { ipcChannel } = require("../api/ipc-channels.js");
const { definitionSet } = require("../definition-set.js");
const { utilitySet } = require("./utility.js");
const { pluginProvider } = require("./plugin-provider.js");
const { app, dialog, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');
const path = require('node:path');
const shell = require('electron').shell;

const image = null;

const handlePlugins = (applicationPath, window) => {
    pluginProvider.setup({ definitionSet, fs, path, applicationPath, window });
    pluginProvider.sendScripts(ipcChannel.plugin.loadAll);
}; //handlePlugins

const subscribeToEvents = window => {
    const getPackage = () => {
        const packageFileName = path.join(app.getAppPath(), definitionSet.paths.package);
        if (fs.existsSync(packageFileName))
            return JSON.parse(fs.readFileSync(packageFileName));
    }; //getPackage
    ipcMain.handle(ipcChannel.metadata.request, async (_event) => {
        const thePackage = getPackage();
        return {
            package: thePackage,
            versions: process.versions,
            applicationVersion: app.getVersion(),
            applicationName: app.name,
    }}); //metadata.request
    ipcMain.on(ipcChannel.metadata.source, () => {
        const thePackage = getPackage();
        if (thePackage) {
            const source = thePackage.repository;
            if (source)
                shell.openExternal(source);
        } //if
    }); //metadata.source
    utilitySet.setup({ definitionSet, dialog, fs, window, image, app, process, });
    ipcMain.on(ipcChannel.fileIO.openFile, () => {
        utilitySet.openFile((filename, text, error) =>
            window.webContents.send(ipcChannel.fileIO.openFile, filename, path.basename(filename), text, error));
    });
    ipcMain.on(ipcChannel.fileIO.saveFileAs, (_event, text) => {
        utilitySet.saveFileAs(text, (filename, error) =>
            window.webContents.send(ipcChannel.fileIO.saveFileAs, filename, path.basename(filename), error));
    });
    ipcMain.on(ipcChannel.fileIO.saveExistingFile, (_event, filename, text) => {
        utilitySet.saveExistingFile(filename, text, (filename, error) =>
            window.webContents.send(ipcChannel.fileIO.saveExistingFile, filename, path.basename(filename), error));
    });
}; //subscribeToEvents

const handleCommandLine = window => {
    const filename = utilitySet.processCommandLine();
    if (filename)
        utilitySet.openKnownFile(filename, (text, error) =>
            window.webContents.send(
                ipcChannel.fileIO.openFromCommandLine,
                filename,
                path.basename(filename), text, error));
}; //handleCommandLine

function createWindow() {
    const applicationPath = app.getAppPath();
    const window = new BrowserWindow(
        definitionSet.createWindowProperties(
            path.join(applicationPath, definitionSet.paths.preload)));
    window.maximize(); //SA???
    window.once(definitionSet.events.readyToShow, () => {
        handlePlugins(applicationPath, window);
        handleCommandLine(window);
        window.show();
    }); //once ready to show
    window.loadFile(path.join(applicationPath, definitionSet.paths.index));
    subscribeToEvents(window);
    Menu.setApplicationMenu(null);
}; //createWindow

app.whenReady().then(() => {
    createWindow();
    app.on(definitionSet.events.activate, function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
}); //app.whenReady

app.on(definitionSet.events.windowAllClosed, function () {
    if (!definitionSet.isDarwin(process))
        app.quit();
}); //app on window all closed
