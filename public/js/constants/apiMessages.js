const errorMessages = {
    PASSWORD_NOT_STRING: 'La contraseña debe ser una cadena de texto.',
    PASSWORD_NEEDS_NUMBER: 'La contraseña debe contener al menos un número.',
    PASSWORD_NEEDS_UPPERCASE: 'La contraseña debe contener al menos una letra mayúscula.',
    INVALID_PASSWORD_FORMAT: 'La contraseña debe contener al menos un caracter especial.',
    PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 8 caracteres.',
    PASSWORD_TOO_LONG: 'La contraseña no debe tener más de 100 caracteres.',
    PASSWORDS_DO_NOT_MATCH: 'Las contraseñas no coinciden.',
    EMPTY_USERNAME: 'El nombre de usuario es requerido.',
    USERNAME_NOT_STRING: 'El nombre de usuario debe ser una cadena de texto.',
    USERNAME_INCLUDE_SPACE: 'El nombre de usuario no debe contener espacios.',
    INVALID_USERNAME_CHARS: 'El nombre de usuario debe contener solo números, letras y guiones bajos.',
    USERNAME_TOO_SHORT: 'El nombre de usuario debe tener al menos 3 caracteres.',
    USERNAME_TOO_LONG: 'El nombre de usuario no debe tener más de 100 caracteres.',
    EMPTY_NAME: 'El nombre es requerido.',
    NAME_NOT_STRING: 'El nombre debe ser una cadena de texto.',
    NAME_TOO_SHORT: 'El nombre debe tener al menos 2 caracteres.',
    NAME_TOO_LONG: 'El nombre no debe tener más de 50 caracteres.',
    INVALID_NAME_CHARS: 'El nombre debe contener solo letras, números, signos de puntuación o espacios.',
    EMPTY_LAST_NAME: 'El apellido es requerido.',
    LAST_NAME_NOT_STRING: 'El apellido debe ser una cadena de texto.',
    LAST_NAME_TOO_SHORT: 'El apellido debe tener al menos 2 caracteres.',
    LAST_NAME_TOO_LONG: 'El apellido no debe tener más de 50 caracteres.',
    INVALID_LAST_NAME_CHARS: 'El apellido debe contener solo letras y espacios.',
    EMPTY_OPTION: 'Esta opción es requerida.',
    OPTION_NOT_BOOLEAN: 'Esta opción debe ser un valor booleano.',
    EMPTY_TEXT: 'El texto de búsqueda es requerido.',
    TEXT_NOT_STRING: 'El texto de búsqueda debe ser una cadena de texto.',
    TEXT_TOO_SHORT: 'El texto de búsqueda debe tener al menos un caracter.',
    TEXT_TOO_LONG: 'El texto de búsqueda debe tener menos de 500 caracteres.',
    LOGIN_ERROR: 'Usuario o contraseña incorrectos.',
    VALIDATION_ERROR: 'Errores de validación',
    INVALID_AUTH: 'Sesión inválida. Inicia sesión nuevamente.',
    INVALID_LINK: 'Enlace inválido. Solicita uno nuevo.',
    SERVER_ERROR: 'Error del servidor.',
    DETECTED_REUSE: 'Reuso de sesión detectado.',
    EMPTY_SUBJECT: 'El asunto es requerido.',
    SUBJECT_NOT_STRING: 'El asunto debe ser una cadena de texto.',
    FORBIDDEN_SUBJECT: 'El asunto debe ser [error, colaboración, sugerencia, noticias, otro].',
    EMPTY_MESSAGE: 'El mensaje es requerido.',
    MESSAGE_NOT_STRING: 'El mensaje debe ser una cadena de texto.',
    MESSAGE_TOO_SHORT: 'El mensaje es muy corto.',
    MESSAGE_TOO_LONG: 'El mensaje debe tener un máximo de 500 caracteres.',
    CATEGORY_NOT_FOUND: 'Categoría no encontrada.'
};

const successMessages = {
    CREATED_ACCOUNT: '¡Cuenta registrada exitosamente!',
    UPDATED_ACCOUNT: '¡Cuenta actualizada con éxito!',
    UPDATED_ACCOUNT_PASSWORD: '¡Contraseña actualizada con éxito!',
    SUCCESS_LOGIN: '¡Inicio de sesión exitoso!',
    SUCCESS_LOGOUT: 'Sesión cerrada exitosamente.',
    CREATED_CATEGORY: '¡Categoría creada exitosamente!',
    UPDATED_CATEGORY: '¡Categoría actuallizada exitosamente!'
};

export const getErrorMessage = (code) => errorMessages[code] ?? null;

export const getSuccessMessage = (code) => successMessages[code] ?? null;