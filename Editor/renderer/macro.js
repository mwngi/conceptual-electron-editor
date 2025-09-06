"use strict";

const createMacroProcessor = (editor, stateIndicator) => {

    let recordingMacro = false;
    let macro = [];
    let previousState = null;

    const getState = target => {
        return {
            length: target.textLength,
            position: target.selectionStart,
        }
    }; //getState
    const getDelta = (older, newer) => {
        return { // delta
            length: newer.length - older.length,
            position: newer.position - older.position,
        };
    } //getDelta

    editor.addEventListener(definitionSet.events.input, event => {
        if (!recordingMacro) return;        
        const currentState = getState(event.target);
        const delta = getDelta(previousState, currentState);
        previousState = currentState;
        let data = event.data ? event.data : "";
        if (!data && event.inputType == "insertLineBreak") //special case, ugly one
            data = "\n";
        macro.push({
                    data: data,
                    state: currentState,
                    delta: delta,
                });
    }); //editor input

    const playMacro = () => {
        if (recordingMacro) return;
        for (const element of macro) {
            const dataLength = element.data ? element.data.length : 0;
            let currentState = getState(editor);
            const added = element.delta.length - dataLength;
            const range = currentState.position + element.delta.position;
            editor.setSelectionRange(range, range);
            if (added == 0)
                editor.setRangeText(element.data);
            else
                editor.setRangeText(element.data, range, range  - element.delta.length);
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
