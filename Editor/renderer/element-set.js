"use strict";

const getElementSet = document => {
    return {
        editor: document.querySelector("textarea"),
        menu: document.querySelector("menu"),
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
            pluginParent: document.querySelector("#menu-plugins"),
        },
        modifiedFlag: document.querySelector("span#id-modified-flag"),
    };
}; //elementSet


