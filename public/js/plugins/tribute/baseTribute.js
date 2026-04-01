export const createTribute = (id) => {
    const tribute = new Tribute({
        trigger: '@',
        values: async (text, cb) => {
            const res = await fetch(`/api/users?q=${ text }`);
            cb(await res.json());
        },
        selectTemplate: item => '@' + item.original.username
    });
    tribute.attach(document.getElementById(id));
}