interface Map<K, V> {
    getOrCreate(key: K, creator: (() => V)):V;
}

function GetOrCreate<K, V>(map: Map<K, V>, key: K, creator: (() => V)): V {
    let value = map.get(key);
    if (!value) {
        value = creator();
        map.set(key, value);
    }
    return value;
}

Map.prototype.getOrCreate = 
    function(key: string, creator: (() => any)) { return GetOrCreate(this, key, creator); };

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

function randomIntFromRange(min: number, max: number): number {
    return Math.floor(Math.random() * Math.floor(max-min)) + Math.floor(min);
}