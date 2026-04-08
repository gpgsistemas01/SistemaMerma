export const getProductConsumptionsPage = async (req, res) => {
    const { user } = req;

    return res.render('pages/warehouse/productConsumptions/productConsumptionsPage', {
        currentRoute: '/consumos-producto',
        user
    });
};
