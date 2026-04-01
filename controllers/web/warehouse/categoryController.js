export const getCategoriesPage = async (req, res) => {

    const { user } = req;

    return res.render('pages/warehouse/categories/categoriesPage', {
        currentRoute: '/categorias',
        user
    });
}