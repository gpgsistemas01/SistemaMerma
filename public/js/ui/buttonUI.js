export const updateButtonState = (btn, { isActive, delta = 0, icon, solid }) => {

    const span = btn.querySelector('span');

    if (span && delta !== 0) {

        const current = Number(span.textContent) || 0;
        span.textContent = current + delta;
    }

    const i = btn.querySelector('i');

    if (i) {

        i.classList.toggle('fa-regular', !solid);
        i.classList.toggle('fa-solid', solid);
        i.classList.remove('fa-bookmark', 'fa-thumbs-up', 'fa-thumbs-down');
        i.classList.add(icon);
    }

    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
}

export const getOppositeAction = (action) => action === 'like' ? 'dislike' : 'like';