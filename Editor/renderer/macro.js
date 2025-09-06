"use strict";

const createMacroProcessor = (editor, stateIndicator) => {

    let recordingMacro = false;
    let macro = [];
    let previousState = null;

    const getState = target => {
        return {
            length: target.textLength,
            selection: [target.selectionStart, target.selectionEnd],
        }
    }; //getState
    const getDelta = (older, newer) => {
        return { // delta
            length: newer.length - older.length,
            selection: [newer.selection[0] - older.selection[0], newer.selection[1] - older.selection[1]],
        };
    } //getDelta

    editor.addEventListener(definitionSet.events.input, event => {
        if (!recordingMacro) return;        
        const currentState = getState(event.target);
        const delta = getDelta(previousState, currentState);
        previousState = currentState;
        let action;
        let data = event.data;
        if (!data && event.inputType == "insertLineBreak") //special case, ugly one
            data = "\n";
        macro.push({
                    data: data,
                    action: action,
                    state: currentState,
                    delta: delta,
                });
    }); //editor input

    const playMacro = () => {
        if (recordingMacro) return;
        for (const element of macro) { // SA??? not fully implemented
            const dataLength = element.data ? element.data.length : 0;
            let currentState = getState(editor);
            const added = element.delta.length - dataLength;
            if (added == 0) {
                if (!element.data)
                    element.data = "";
                editor.setSelectionRange(
                    currentState.selection[0] + element.delta.selection[0],
                    currentState.selection[1] + element.delta.selection[1],);
                editor.setRangeText(element.data);
            } else {
                if (!element.data)
                    element.data = "";
                let from = currentState.selection[0];
                let to = currentState.selection[0] + added;
                if (to < from) {
                    const tmp = to;
                    to = from;
                    from = tmp;
                } //if
                editor.setRangeText(element.data, from, to);
                editor.setSelectionRange(
                    currentState.selection[0] + element.delta.selection[0],
                    currentState.selection[1] + element.delta.selection[1],);
            } //if delete
            currentState = getState(editor);
        } //loop
    }; //playMacro

    const recordingState = () => recordingMacro;
    const setRecordingState = on => {
        if (on)
            macro = [];
        recordingMacro = on;
        stateIndicator.innerHTML = on
            ? definitionSet.status.macroRecording
            : (macro.length > 0
                ? definitionSet.status.macroAvailable
                : null);
        if (on)
            previousState = getState(editor);
    } //setRecordingState
    const canRecord = () => !recordingMacro;
    const canStopRecording = () => recordingMacro;
    const canPlay = () => !recordingMacro && macro.length > 0;

    // Hot keys Ctrl+Shift+R (record start/stop), Ctrl+Shift+P (play macro):
    window.addEventListener(definitionSet.events.keydown, event => {
        if (event.shiftKey && event.ctrlKey) {
            if (event.code == definitionSet.keys.KeyP && canPlay()) {
                playMacro();
                event.preventDefault();
            } else if (event.code == definitionSet.keys.KeyR) {
                let decision = null;
                if (canRecord())
                    decision = true;
                else if (canStopRecording())
                    decision = false;
                if (decision != null)
                    setRecordingState(decision);
                event.preventDefault();
            } //if
        } //if
    }); //window.addEventListener

    return { canRecord, canStopRecording, canPlay, recordingState, setRecordingState, playMacro, };

};
