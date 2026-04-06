import { findAllProfiles } from "../../../services/admin/profileService.js";
import { getLoggedUser } from "../../../services/userService.js";

export const getAllProfiles = async (req, res) => {

    let { department } = req.query;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search?.value || req.query.search || '';

    const columns = ['name'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const currentUser = await getLoggedUser(req.userId);
    const canViewAllProfiles = ['Almacén', 'Sistemas'].includes(currentUser?.department);

    if (!department && !canViewAllProfiles) department = currentUser?.department || '';

    const result = await findAllProfiles({
        department,
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    res.status(200).json(result);
}
