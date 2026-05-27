import { getAllMovementsRequest } from "../../services/admin/movementService.js";

export const getAllDepartments = async (params = {}) => {

    const response = await getAllMovementsRequest(params);
    
    return response;
};