"use strict";

const createMacroProcessor = (editor, stateIndicator) => {

    let recordingMacro = false;
    let macro = [];

    const getState = (target, newState) => {
        if (newState)
            return { // delta
                length: newState.length - target.length,
                selection: [ newState.selection[0] - target.selection[0], newState.selection[1] - target.selection[1] ],
            };
        else
            return {
                length: target.textLength,
                selection: [ target.selectionStart, target.selectionEnd ],
    }}; //getState

    editor.addEventListener(definitionSet.events.input, event => {
        if (!recordingMacro) return;
        let action;
        if (event.inputType.startsWith("insert")) //SA??? see https://w3c.github.io/input-events/#interface-InputEvent-Attributes
            action = "+";
        else if (event.inputType.startsWith("delete")) //SA???
            action = "-";
        else
            action = "";
        let data = event.data;
        if (!data && event.inputType == "insertLineBreak") //special case, ugly one
            data = "\n";
        macro.push({
                    data: data,
                    action: action,
                    state: getState(event.target),
                });
    }); //editor.onkeydown

    const playMacro = () => {
        if (recordingMacro) return;
        let initialState = getState(editor);
        let delta = null;
        for (const element of macro) { // SA??? not fully implemented            
            if (!delta)
                delta = getState(element.state, initialState);
            if (element.action == "+") {
                if (!element.data)
                    element.data = "?";
                editor.setRangeText(element.data);
                if (element.data)
                    editor.setSelectionRange(
                        element.state.selection[0] + delta.selection[0] + element.data.length,
                        element.state.selection[1] + delta.selection[1] + element.data.length,)
            } else if (macro.action == "-") {

            } //if delete
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
    } //setRecordingState
    const canRecord = () => !recordingMacro;
    const canStopRecording = () => recordingMacro;
    const canPlay = () => !recordingMacro && macro.length > 0;

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
