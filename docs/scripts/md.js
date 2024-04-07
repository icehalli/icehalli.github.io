class _Md {
    static render(data) {        
        const md = markdownit();
        const data = data.trim();
        return md.render(data);
    }
}