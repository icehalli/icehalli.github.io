class _Md {
    static render(data) {        
        const md = markdownit().use(markdownitEmoji);
        data = data.trim();
        return md.render(data);
    }
}