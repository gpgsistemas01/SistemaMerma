export const getSuppliesPage = async (req, res) => {

    const { user } = req;

    return res.render('pages/warehouse/supplies/suppliesPage', {
        currentRoute: '/insumos',
        user
    });
}