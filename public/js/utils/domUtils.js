export const on = (event, selector, handler, options = {}) => {

    document.addEventListener(event, e => {

        const element = e.target.closest(selector);

        if (!element || !document.contains(element)) return;

        handler(e, element);
    }, options);
}

export const bindChangeResetSelect = ({ sourceSelector, targetSelector, reset }) => {
    
    const source = document.querySelector(sourceSelector);

    if (!source) return;
    if (source.dataset.resetBound === 'true') return;
    source.dataset.resetBound = 'true';

    source.addEventListener('change', () => {
        if (typeof reset === 'function') reset();
        else {
            const target = document.querySelector(targetSelector);
            if (!target) return;
            target.value = '';
            target.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
};