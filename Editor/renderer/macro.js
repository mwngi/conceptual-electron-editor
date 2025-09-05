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
                    if (editor.selectionStart == editor.selectionEnd && editor.selectionStart > 0)
                        editor.setRangeText("", editor.selectionStart - 1, editor.selectionStart);
                    else
                        editor.setRangeText("");
                } else if (event.code == definitionSet.keys.Delete) {
                    if (editor.selectionStart == editor.selectionEnd && editor.textLength > editor.selectionStart)  
                        editor.setRangeText("", editor.selectionStart, editor.selectionStart + 1);
                    else
                        editor.setRangeText("");
                } else if (event.code == definitionSet.keys.Enter) {
                    editor.setRangeText("\n");
                } //if
            } //if keyboard type
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
        if (on) macro = [];
        recordingMacro = on;
    } //setRecordingState
    const canRecord = () => !recordingMacro;
    const canStopRecording = () => recordingMacro;
    const canPlay = () => !recordingMacro && macro.length > 0;

    editor.addEventListener(definitionSet.events.keydown, event => {
        if (!recordingMacro) return;
        if (event.ctrlKey || event.altKey) return;
        if (event.key.length == 1 ||
            event.code == definitionSet.keys.Backspace ||
            event.code == definitionSet.keys.Delete || 
            event.code == definitionSet.keys.Enter)
                macro.push(event);
    }); //editor.onkeydown

    editor.addEventListener(definitionSet.events.selectionchange, event => {
        if (!recordingMacro) return;
        event.point = { start: event.target.selectionStart, end: event.target.selectionEnd, }
        macro.push(event);
    }); //editor.onselectionchange

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
