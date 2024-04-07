class _Md {
    static render(data) {        
        const md = markdownit();
        data = data.trim();
        return md.render(data);
    }
}