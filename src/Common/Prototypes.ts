interface String {
    score(text: string, fuzzy: number): number;
}

String.prototype.score =
    function (e: string, f: number) {
        if (this === e) return 1;
        if ("" === e) return 0;
        var d = 0, a, g = this.toLowerCase(), n = this.length, h = e.toLowerCase(), k = e.length, b; a = 0;
        var l = 1, m, c;
        f && (m = 1 - f);
        if (f)
            for (c = 0; c < k; c += 1)
            b = g.indexOf(h[c], a), -1 === b ? l += m : (a === b ? a = .7 : (a = .1, " " === this[b - 1] && (a += .8)), this[b] === e[c] && (a += .1), d += a, a = b + 1); else for (c = 0; c < k; c += 1) { b = g.indexOf(h[c], a); if (-1 === b) return 0; a === b ? a = .7 : (a = .1, " " === this[b - 1] && (a += .8)); this[b] === e[c] && (a += .1); d += a; a = b + 1 } d = .5 * (d / n + d / k) / l; h[0] === g[0] && .85 > d && (d += .15);
        return d
    };    

interface Map<K, V> {
    getOrCreate(key: K, creator: (() => V)): V;
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
    function (key: string, creator: (() => any)) {
        return GetOrCreate(this, key, creator);
    };


interface DataView {
    getAsciiFixed(offset: number, length: number): string;
}

DataView.prototype.getAsciiFixed = function (offset: number, length: number) {
    let s = '';
    for (let i = 0; i < length; i++)
        s += String.fromCharCode(this.getUint8(offset + i))
    return s;
}
