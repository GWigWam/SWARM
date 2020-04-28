type nrWatcher = (newVal: number) => void;

class Setting {
    private watchers = [] as nrWatcher[]
    private _value: number;

    constructor(public readonly key: string, init: number) {
        this._value = init;
    }

    public watch(watcher: nrWatcher) {
        this.watchers.push(watcher);
    }

    get value(): number {
        return this._value;
    }

    set value(val: number) {
        if(val != this._value) {
            this._value = val;
            this.watchers.forEach(w => w(val));
        }
    }
}

class Settings {
    all = [] as Setting[]

    public add(key: string, init: number, watcher: nrWatcher|null = null) : Setting {
        if(this.all.some(s => s.key == key)) {
            throw `Duplicate setting key: '${key}'`;
        }
        const set = new Setting(key, init);
        if(watcher) {
            set.watch(watcher);
        }
        this.all.push(set);
        return set;
    }

    public get(key: string): Setting|undefined {
        return this.all.find(s => s.key == key);
    }
}

const instance = new Settings();
export default instance;
