import { successCodeMessages } from "../../messages/codeMessages.js";
import { setAuthCookies } from "../../utils/cookiesUtils.js";
import { saveUser, editPasswordByUserId } from "../../services/userService.js";
import { getNewRefreshToken, loginUser } from "../../services/authService.js";
import { createUserDtoForRegister } from "../../dtos/userDTO.js";

export const login = async (req, res) => {

    const tokens = await loginUser(req.body);

    setAuthCookies(res, tokens.newAccessToken, tokens.newRefreshToken);

    return res.status(200).json({ code: successCodeMessages.SUCCESS_LOGIN });
}

export const registerAccount = async (req, res) => {

    const userDto = await createUserDtoForRegister(req.body);
    const userId = await saveUser(userDto);

    return res.status(201).json({ code: successCodeMessages.CREATED_ACCOUNT });
}

export const resetPassword = async (req, res) => {

    const { password } = req.body || {};
    const { id } = req || {};

    await editPasswordByUserId(id, password);

    return res.status(200).json({ code: successCodeMessages.UPDATED_RESET_PASSWORD });
}

export const refreshAuthToken = async (req, res) => {

    const { refreshToken } = req.cookies;
    const  tokens = await getNewRefreshToken({ refreshToken });

    setAuthCookies(res, tokens.newAccessToken, tokens.newRefreshToken);

    return res.sendStatus(200);
}