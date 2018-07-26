
async function getPlainText(uri: string): Promise<string> {
    const request = new Request(uri, {
        headers: new Headers({ 'Content-Type': 'text/plain' })
    });

    const response = await fetch(request);
    return response.text();
}

async function getBinary(uri: string): Promise<ArrayBuffer> {
    const request = new Request(uri, {
        headers: new Headers({ 'Content-Type': 'application/octet-stream' })
    });

    const response = await fetch(request);
    return response.arrayBuffer();
}

function createText(tag: string, text?:string): Node {
    if (tag === '')
        return document.createTextNode(text);

    const element = document.createElement(tag);
    if (text)
        element.innerText = text;

    return element;
}
