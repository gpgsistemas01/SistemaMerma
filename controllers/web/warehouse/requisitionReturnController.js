export const getrequisitionsReturnsPage = async (req, res) => {

    const { user } = req;

    return res.render('pages/warehouse/requisitionReturns/requisitionReturnsPage', {
        currentRoute: '/devoluciones-requisicion',
        user
    });
}