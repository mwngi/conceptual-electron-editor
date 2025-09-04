pluginProcessor.registerPlugin({
    name: "Demo: to lower case, and add this name",
    description: "Test 1",
    bufferHandler: function(editor) {
        if (!(editor.value && editor.value.trim().length > 0))
	    return "Nothing to edit.<br/>Add some text to the editor.";
	editor.value = `${editor.value.toLowerCase()}\n${this.name}`;
    },
});
