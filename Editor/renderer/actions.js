"use strict";

const subscribe = (elementSet, menu, metadata) => {

    const originalTitle = document.title;
    let currentFilename = null;
    let isModified = false;

    const reportError = (error, errorKind) =>
        modalDialog.show(definitionSet.errorHandling.format(errorKind, error.message));

    const updateModifiedFlag = flag => {
        isModified = flag;
        elementSet.modifiedFlag.innerHTML = flag
            ? definitionSet.status.modified
            : null;
    }; //updateModifiedFlag
    elementSet.editor.oninput = () => updateModifiedFlag(true);
       
    const handleFileOperationResult = (filename, baseFilename, text, error, isSave) => {
        if (!error) {
            currentFilename = filename;
            document.title = definitionSet.fileNaming.title(baseFilename, originalTitle);
            if (text) elementSet.editor.value = text;        
            updateModifiedFlag(false);
        } else
            reportError(error, isSave ? definitionSet.errorHandling.save : definitionSet.errorHandling.open);
    }; //handleFileOperationResult

    window.bridgeFileIO.subscribeToCommandLine((filename, baseFilename, text, error) =>
        handleFileOperationResult(filename, baseFilename, text, error));

    menu.subscribe(elementSet.menuItems.file.newFile.textContent, actionRequest => {
        if (!actionRequest) return true;
        elementSet.editor.value = null;
        elementSet.editor.focus();
        return true;
    }); //file.newFile

    menu.subscribe(elementSet.menuItems.file.open.textContent, actionRequest => {
        if (!actionRequest) return true;
        window.bridgeFileIO.openFile((filename, baseFilename, text, error) =>
            handleFileOperationResult(filename, baseFilename, text, error));
        return true;
    }); //file.newFile

    const saveAs = () =>
        window.bridgeFileIO.saveFileAs(elementSet.editor.value, (filename, baseFilename, error) =>
            handleFileOperationResult(filename, baseFilename, null, error, true));

    menu.subscribe(elementSet.menuItems.file.saveAs.textContent, actionRequest => {
        if (!actionRequest) return true;
        saveAs();
        return true;
    }); //file.newFile

    menu.subscribe(elementSet.menuItems.file.saveExisting.textContent, actionRequest => {
        if (!actionRequest) return isModified;
        if (currentFilename)
            window.bridgeFileIO.saveExistingFile(currentFilename, elementSet.editor.value, (filename, baseFilename, error) =>
                handleFileOperationResult(filename, baseFilename, null, error, true));
        else
            saveAs();
        return true;
    }); //file.newFile

    menu.subscribe(elementSet.menuItems.help.about.textContent, actionRequest => {
        if (!actionRequest) return true;
        modalDialog.show(definitionSet.aboutDialog(metadata));
        return true;
    }); //file.newFile

    menu.subscribe(elementSet.menuItems.help.sourceCode.textContent, actionRequest => {
        if (!actionRequest) return false;
        return true;
    }); //file.newFile

}; //subscribe
