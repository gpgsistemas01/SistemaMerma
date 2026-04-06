export const getPurchaseRequisitionsPage = async (req, res) => {

    const { user } = req;
    const department = user?.department || '';

    return res.render('pages/warehouse/purchaseRequisitions/purchaseRequisitionsPage', {
        currentRoute: '/requisiciones',
        user,
        department
    });
}
