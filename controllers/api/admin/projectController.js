import { findAllProjects } from "../../../services/warehouse/projectService.js";
import { getLoggedUser } from "../../../services/userService.js";

export const getAllProjects = async (req, res) => {

    const search = req.query.search?.value || req.query.search || '';
    const currentUser = await getLoggedUser(req.userId);
    const canViewAllProjects = ['Almacén', 'Sistemas'].includes(currentUser?.department);
    const department = canViewAllProjects ? '' : (currentUser?.department || '');

    const result = await findAllProjects({ search, department });

    res.status(200).json(result);
};
