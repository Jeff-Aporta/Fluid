export const snippetsHTML = {
    detail: (props: any = {}) => {
        /** define props y clases base */
        const { title = '', content = [], summaryClass = '', contentClass = '', class: className = '', open, ...rest } = props;
        const defaultClass = "group bg-slate-900 border border-slate-800 rounded-lg overflow-hidden m-[10px]";
        /** combina clases */
        const combinedClass = `${defaultClass} ${className}`.trim();
        /** configura estado inicial */
        const detailsProps: any = { class: combinedClass, ...rest };
        if (open) detailsProps.open = true;
        return { details: { ...detailsProps, children: [{ summary: { class: `cursor-pointer p-1.5 font-bold select-none flex items-center justify-between hover:bg-slate-800 transition-colors list-none ${summaryClass}`.trim(), children: [{ span: { content: title } }, { span: { class: 'text-slate-300 transform transition-transform duration-200 group-open:rotate-180', content: '▼' } }] } }, { div: { class: `p-2 text-sm border-t border-slate-800 text-slate-300 ${contentClass}`.trim(), children: Array.isArray(content) ? content : [content] } }] } };
    },
    tabs: (props: any = {}) => {
        const { header = [], content = [], ...rest } = props;
        return { div: { class: 'fluid-tabs', children: [{ div: { class: 'fluid-tabs-header', children: header } }, { div: { class: 'fluid-tabs-content', children: content } }], ...rest } };
    },
    tabButton: (props: any = {}) => {
        const { active = false, title = '', id = '', ...rest } = props;
        return { button: { class: 'fluid-tab-btn' + (active ? ' active' : ''), content: title, attr: { 'data-tab-target': id }, ...rest } };
    },
    tabPanel: (props: any = {}) => {
        const { active = false, id = '', children = [], ...rest } = props;
        return { div: { class: 'fluid-tab-panel' + (active ? ' active' : ''), style: active ? { display: 'block' } : {}, attr: { 'data-tab-content': id }, children: Array.isArray(children) ? children : [children], ...rest } };
    },
    card: (props: any = {}) => {
        const { title, footer, children = [], ...rest } = props;
        const cardChildren = [];
        if (title) cardChildren.push(title);
        cardChildren.push({ div: { class: 'flex-1', children: Array.isArray(children) ? children : [children] } });
        if (footer) cardChildren.push(footer);
        return { div: { class: 'bg-slate-900 p-4 border border-slate-800 rounded-lg overflow-hidden flex flex-col', children: cardChildren, ...rest } };
    },
    row: (props: any = {}) => {
        const { gap = '10px', wrap = true, alignItems = 'center', children = [], style = {}, ...rest } = props;
        return { div: { class: 'fluid-row', style: { display: 'flex', gap, flexWrap: wrap ? 'wrap' : 'nowrap', alignItems, ...style }, children: Array.isArray(children) ? children : [children], ...rest } };
    },
    api: {
        image: (props: any = {}) => {
            const { src = '', alt = '', className = '', style = {}, type = '', code = '', loadingText = 'Cargando diagrama...', ...rest } = props;
            /** 1. Graphviz */
            if (type === 'graphviz') {
                const url = `https://quickchart.io/graphviz?format=svg&graph=${encodeURIComponent(code)}`;
                return { div: { class: 'graphviz-canvas', style: { textAlign: 'center', padding: '20px', color: '#666', ...style }, content: loadingText, attr: { 'data-src': url }, ...rest } };
            }
            /** 2. Chart / QuickChart */
            if (type === 'chart') {
                const url = code ? `https://quickchart.io/chart?c=${encodeURIComponent(code)}` : '';
                return { img: { src: url, alt: alt || 'Chart', class: (className ? className + ' ' : '') + 'chart-img no-loupe', style: { display: 'block', maxWidth: '100%', margin: '0 auto', ...style }, ...rest } };
            }
            /** 3. LaTeX */
            if (type === 'latex') {
                const url = `https://latex.codecogs.com/svg.image?\\large&space;${encodeURIComponent(code)}`;
                return { img: { src: url, alt: alt || code, class: className || 'latex-img', style: { display: 'block', maxWidth: '100%', margin: '0 auto', ...style }, ...rest } };
            }
            /** 4. Imagen Estandar */
            return { img: { src, alt, class: className, style: { display: 'block', maxWidth: '100%', margin: '0 auto', ...style }, ...rest } };
        },
        codeModal: (props: any = {}) => {
            const { id = '', title = 'Código Fuente', code = '', btnLabel = 'Ver Código' } = props;
            return { dialog: { id, class: "fluid-dialog border border-[#333] rounded-lg bg-[#1e1e1e] text-[#d4d4d4] p-0 max-w-[80vw] max-h-[80vh] shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop:bg-black/70", children: [{ div: { class: "flex justify-between items-center px-5 py-2.5 border-b border-[#333] bg-[#252526] sticky top-0 z-10", children: [{ h3: { class: "m-0 text-xs uppercase text-[#888]", content: title } }, { button: { class: "bg-transparent border-none text-white cursor-pointer text-base", content: '✕', attr: { command: 'close', commandfor: id } } }] } }, { div: { children: [{ pre: { class: "m-0 p-5 overflow-auto", children: [{ code: { content: code } }] } }] } }] }, button: { content: btnLabel, class: "absolute top-[10px] right-[10px] py-[5px] px-[10px] text-xs bg-black/50 text-white border-none rounded cursor-pointer z-[100] opacity-70 transition-opacity duration-300 hover:opacity-100", attr: { command: 'show-modal', commandfor: id } } };
        },
        alert: (props: any = {}) => {
            const { type = 'note', title = '', content = '', ...rest } = props;
            const colors: any = { note: { border: 'border-blue-500', bg: 'bg-blue-900/20', text: 'text-blue-200', icon: 'fa-solid fa-circle-info' }, tip: { border: 'border-green-500', bg: 'bg-green-900/20', text: 'text-green-200', icon: 'fa-solid fa-lightbulb' }, important: { border: 'border-purple-500', bg: 'bg-purple-900/20', text: 'text-purple-200', icon: 'fa-solid fa-circle-exclamation' }, warning: { border: 'border-yellow-500', bg: 'bg-yellow-900/20', text: 'text-yellow-200', icon: 'fa-solid fa-triangle-exclamation' }, warn: { border: 'border-yellow-500', bg: 'bg-yellow-900/20', text: 'text-yellow-200', icon: 'fa-solid fa-triangle-exclamation' }, caution: { border: 'border-red-500', bg: 'bg-red-900/20', text: 'text-red-200', icon: 'fa-solid fa-ban' } };
            const style = colors[type.toLowerCase()] || colors.note;
            return { div: { class: `flex flex-col border-l-4 p-4 my-4 rounded-r ${style.border} ${style.bg} ${style.text}`, children: [{ div: { class: 'font-bold flex items-center gap-2 mb-1', children: [{ i: { class: style.icon } }, { span: { content: title || type.toUpperCase() } }] } }, { div: { class: 'opacity-90', content } }], ...rest } };
        }
    }
};