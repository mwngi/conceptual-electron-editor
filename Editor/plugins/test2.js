pluginProcessor.registerPlugin({
    name: "Test 2",
    description: "Test 2",
    bufferHandler: editor => {
	editor.value = "This is the second plugin operation";
    },
});