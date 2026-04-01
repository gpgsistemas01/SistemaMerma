export const getInventoryAdjustmentsPage = async (req, res) => {

    const { user } = req;

    return res.render('pages/warehouse/inventoryAdjustments/inventoryAdjustmentsPage', {
        currentRoute: '/ajustes-inventario',
        user
    });
}