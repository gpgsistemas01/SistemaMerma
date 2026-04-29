import { findAllProfiles } from "../../../services/admin/profileService.js";

const allowedDepartments = ['ALMACÉN Y PROVEDURÍA', 'SISTEMAS'];

export const getAllProfiles = async (req, res) => {

    const { department } = req.query;
    const strictDepartmentFilter = req.query.strictDepartmentFilter === 'true';
    const { user } = req;
    const start = parseInt(req.query.start) || 0;
    const length = parseInt(req.query.length) || 10;
    const search = req.query.search?.value || req.query.search || '';

    const columns = ['fullName'];
    const orderColumnIndex = req.query.order?.[0]?.column || 0;
    const orderDir = req.query.order?.[0]?.dir || 'asc';

    const userDepartments = (user?.accesses || [])
        .map(access => access.department)
        .filter(Boolean);
    const canViewAllProfiles = userDepartments.some(departmentName =>
        allowedDepartments.includes(departmentName)
    );

    const departments = department
        ? [department]
        : (canViewAllProfiles && !strictDepartmentFilter ? [] : userDepartments);

    const result = await findAllProfiles({
        departments,
        skip: start,
        take: length,
        search,
        orderBy: columns[orderColumnIndex],
        orderDir
    });

    res.status(200).json(result);
}
