"use strict";

const getDefinitionSet = () => {

    const definitionSet = {
        SA: `<a href="https://www.SAKryukov.org">Sergey A Kryukov</a>`,
        copyright: function() {
            return `Copyright &copy; 2025 by ${this.SA}`
        },
        standaloneExecutionProtection: function() {
            const electron = `<a href="https://www.electronjs.org">Electron</a>`;
            document.body.innerHTML = `<aside>This HTML only works under ${electron}</aside>
            <p>Conceptual Electron Editor, ${this.copyright()}</p>`;
            window.stop();
        }, //standalongExecutionProtection
        plugin: {
            invalid: "Invalid plugin! Click to see the explanation",
            invalidExplanation: file =>
                `<p style="color: red">Invalid plugin ${String.fromCharCode(0x201C)}${file}${String.fromCharCode(0x201D)}</p>
                <br/>A valid plugin should register itself.
                <br/>Please see ${String.fromCharCode(0x201C)}plugins.readme.txt${String.fromCharCode(0x201D)}.<br/><br/>`,
            returnResult: (name, theResult) => `<p>${name}:</p><br/>${theResult}</br></br>`,
            nameInMenu: name => `${name}`,
        },
        aboutDialog: metadata =>
            `<h4><img src="../images/electron.png"/>${metadata?.package?.description}</h4>
            <br/>Application version: ${metadata.applicationVersion}
            <br>Electron: v.&thinsp;${metadata.versions.electron}
            <br/>Chromium: v.&thinsp;${metadata.versions.chrome}
            <br/>Node.js: v.&thinsp;${metadata.versions.node}
            <br/><br/>`,
        events: {
            DOMContentLoaded: 0,
            selectionchange: 0,
        },
        keys: {
            Backspace: 0,
            Delete: 0,
            Enter: 0,
        },
        elements: {
            script: 0,
            option: 0,
        },
        fileNaming: {
            title:  (baseFilename, originalTitle) =>
                `${baseFilename} ${String.fromCharCode(0x2014)} ${originalTitle}`,
        },
        status: {
            modified: "Modified",
        },
        errorHandling: {
            format: (errorKind, errorMessage) => `${errorKind}:<br/><br/><span style="color: red">${errorMessage}</span>`,
            save: "Save file error",
            open: "Open file error",
        },
    }; //definitionSet

    for (const subset of [definitionSet.events, definitionSet.elements, definitionSet.keys])
        for (const index in subset)
            if (!subset[index])
                subset[index] = index;
    Object.freeze(definitionSet);

    return definitionSet;

};
