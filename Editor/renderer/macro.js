"use strict";

const createMacroProcessor = editor => {

    let recordingMacro = false;
    let macro = [];
    const playMacro = () => {
        if (recordingMacro) return;
        const initialSelection = editor.selectionStart;
        let delta = null;
        for (const event of macro) { // SA??? not fully implemented
            if (event.type == definitionSet.events.selectionchange) {
                if (delta == null)
                    delta = initialSelection - event.point.start;
                editor.setSelectionRange(event.point.start + delta, event.point.end + delta);
            } else {
                if (event.key.length == 1) {
                    editor.setRangeText(event.key);
                } else if (event.code == definitionSet.keys.Backspace) {
                    editor.setRangeText("");
                } else if (event.code == definitionSet.keys.Delete) {
                    editor.setRangeText("");
                } else if (event.code == definitionSet.keys.Enter) {
                    editor.setRangeText("\n");
                } //if
            } //if keyboard type
        } //loop
    }; //playMacro

    const recordingState = () => recordingMacro;
    const setRecordingState = on => {
        if (on) macro = [];
        recordingMacro = on;
    } //setRecordingState
    const canRecord = () => !recordingMacro;
    const canStopRecording = () => recordingMacro;
    const canPlay = () => !recordingMacro && macro.length > 0;

    editor.onkeydown = event => {
        if (!recordingMacro) return;
        macro.push(event);
    }; //editor.onkeydown

    editor.onselectionchange = event => {
        if (!recordingMacro) return;
        event.point = { start: event.target.selectionStart, end: event.target.selectionEnd, }
        macro.push(event);
    }; //editor.onselectionchange

    return { canRecord, canStopRecording, canPlay, recordingState, setRecordingState, playMacro, };

};
