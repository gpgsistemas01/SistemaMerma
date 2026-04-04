import { verifyAccessToken } from "../services/jwtService.js";
import { errorMap } from "../messages/codeMessages.js";
import { clearAuthCookies } from "../utils/cookiesUtils.js";
import { getLoggedUser } from "../services/userService.js";

const getAuthTokenInfo = ( req, res) => {

    const { accessToken } = req.cookies;

    if (!accessToken) {
        
        clearAuthCookies(res);
        return null;
    }

    const tokenInfo = verifyAccessToken(accessToken);

    if (!tokenInfo) {

        clearAuthCookies(res);
        return null;
    }

    return tokenInfo;
}

export const verifyCookiesAuthTokenRequired = (req, res, next) => {

    const tokenInfo = getAuthTokenInfo(req, res);

    if (!tokenInfo) {
        
        res.cookie('returnTo', req.originalUrl, { httpOnly: true });

        return res.redirect('/revocar-sesion');
    }

    req.userId = tokenInfo.id;
    
    next();
}

export const verifyApiTokenRequired = (req, res, next) => {

    const tokenInfo = getAuthTokenInfo(req, res);

    if (!tokenInfo) return res.status(401).json({ code: errorMap.message.INVALID_AUTH });

    req.userId = tokenInfo.id;
    next();
}

const createAuthorizeMiddleware = (handler) => (permissions) => async (req, res, next) => {

    const user = await getLoggedUser(req.userId);

    if (
        !user ||
        !permissions.departments.includes(user.department) ||
        !permissions.roles.includes(user.role)
    ) {
        return handler(req, res);
    }

    req.user = user;
    next();
};

export const authorizeUserApi = createAuthorizeMiddleware((req, res) =>
    res.status(401).json({ code: errorMap.message.INVALID_AUTH })
);

export const authorizeUserWeb = createAuthorizeMiddleware((req, res) =>
    res.redirect('/error/404')
);