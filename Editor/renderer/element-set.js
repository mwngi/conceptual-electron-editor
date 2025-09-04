"use strict";

const getElementSet = document => {
    return {
        editor: document.querySelector("textarea"),
        menu: document.querySelector("menu"),
        statusBar: document.querySelector("footer"),
        menuItems: {
            file: {
                newFile: document.querySelector("#menu-new"),
                open: document.querySelector("#menu-open"),
                saveAs: document.querySelector("#menu-save-as"),
                saveExisting: document.querySelector("#menu-save-existing"),
            },
            help: {
                about: document.querySelector("#menu-about"),
                sourceCode: document.querySelector("#menu-source-code"),
            },
            macro: {
                startRecording: document.querySelector("#menu-start-macro-recoding"),
                stopRecording: document.querySelector("#menu-stop-macro-recoding"),
                play: document.querySelector("#menu-play-macro"),
            },
            view: {
                statusBar: document.querySelector("#menu-status-bar"),
                fullscreen: document.querySelector("#menu-full-screen"),
            },
            pluginParent: document.querySelector("#menu-plugins"),
        },
        modifiedFlag: document.querySelector("span#id-modified-flag"),
    };
}; //elementSet


