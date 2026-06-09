import { createSuccessResponseFromRequest } from "../../utils/responseUtils.js";
import { getAllProfilesRequest, registerProfileRequest, updateProfileRequest } from "../../services/admin/profileService.js";

export const getAllProfiles = async (params = {}) => {

    const response = await getAllProfilesRequest({ params });

    return response;
};

export const registerProfile = async ({ formData }) => {

    const response = await registerProfileRequest({ data: formData });

    return createSuccessResponseFromRequest({ response, dataKey: 'profile' });
}

export const updateProfile = async ({ formData, id }) => {

    const response = await updateProfileRequest({ data: formData, id });

    return createSuccessResponseFromRequest({ response, dataKey: 'profile' });
}
