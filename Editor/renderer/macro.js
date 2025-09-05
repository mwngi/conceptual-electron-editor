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
        macro.push({
                    data: event.data ? event.data : "\n",
                    action: action,
                    state: getState(event.target),
                });
    }); //editor.onkeydown

    const playMacro = () => {
        if (recordingMacro) return;
        let initialState = getState(editor);
        for (const element of macro) { // SA??? not fully implemented
            const delta = getState(initialState, element.state);
            editor.setRangeText(element.data ? element.data : "?"); //SA??? about ?
            if (element.data && initialState)
                editor.setSelectionRange(
                    initialState.selection[0] + delta.selection[0],
                    initialState.selection[1] + delta.selection[1],)
            initialState = element.state;
        } //loop
        /*
        selectionDirection { forward, backward}
        selectionStart
        selectionEnd
        textLength R/O
        setRangeText()
        setSelectionRange()
                navigator.clipboard.readText().then(
                    v => {
                        editor.editor.setRangeText(v);
                    });

        */
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
