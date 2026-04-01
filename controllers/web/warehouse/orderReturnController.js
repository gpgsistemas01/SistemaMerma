export const getOrderReturnsPage = async (req, res) => {

    const { user } = req;

    return res.render('pages/warehouse/orderReturns/orderReturnsPage', {
        currentRoute: '/devoluciones-compra',
        user
    });
}