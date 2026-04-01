export const getReport = async (req, res) => {

    const { user } = req;

    return res.render('pages/warehouse/reports/reportPage', {
        currentRoute: '/reportes',
        user
    });
}