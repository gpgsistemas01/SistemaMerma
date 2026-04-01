import { validatecommentNotifications, validatefollowingNotifications, validateName, validateLastName, validatenewsletterNotifications, validateUsername, validateAvatarPath, validateCoverPath } from "../fields/fieldsValidator.js";

export const profileValidation = [
    validateUsername,
    validateName,
    validateLastName,
    validateAvatarPath,
    validateCoverPath
]

export const preferencesValitdation = [
    validatecommentNotifications,
    validatefollowingNotifications,
    validatenewsletterNotifications,
];