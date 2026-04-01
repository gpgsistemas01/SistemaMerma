export const getUser = async (req, res) => {

    const { user } = req;

    return res.render('pages/admin/users/userPage', {
        currentRoute: '/usuarios',
        user
    });
}