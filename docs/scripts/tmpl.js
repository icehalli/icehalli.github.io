class _Template {
    _props = [];
    _tag = 'div';
    constructor(tag){
        if(tag)
            this._tag = tag;
    }
    id(p) {
        this.addProp(`id="${p}"`);
    }
    classes(p) {
        this.addProp(`class="${p}"`);
    }
    addProp(p) {
        this._props.push(p.trim() + ' ');
    }
    getJQ(){
        return $(this.get());
    }
    get(){
        let props = '';
        for(var p of this._props)
        props += p;
        return `<${this._tag} ${props}>`;
    }
}
