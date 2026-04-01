export const getPurchaseOrdersPage = async (req, res) => {

    const { user } = req;

    return res.render('pages/warehouse/purchaseOrders/purchaseOrdersPage', {
        currentRoute: '/compras',
        user
    });
}