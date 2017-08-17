
function onload() {
    const currentNode = Nodes.getCurrentNode();
    Api.init(currentNode);
}

$(onload);