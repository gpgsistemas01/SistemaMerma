export const errorMessages = {
    // 🔐 AUTH / GENERALES
    LOGIN_ERROR: 'Usuario o contraseña incorrectos.',
    VALIDATION_ERROR: 'Errores de validación.',
    INVALID_AUTH: 'Sesión inválida. Inicia sesión nuevamente.',
    INVALID_LINK: 'Enlace inválido. Solicita uno nuevo.',
    SERVER_ERROR: 'Error del servidor.',
    DETECTED_REUSE: 'Reuso de sesión detectado.',

    // 📂 CATEGORY
    CATEGORY_ID_REQUIRED: 'La categoría es requerida.',
    CATEGORY_ID_INVALID_UUID: 'La categoría no es válida.',

    // 📦 UOM
    UOM_ID_REQUIRED: 'La unidad de medida es requerida.',
    UOM_ID_INVALID_UUID: 'La unidad de medida no es válida.',

    // SUPPLIER
    SUPPLIER_ID_REQUIRED: 'El proveedor es requerido.',
    INVALID_UUID: 'El proveedor no es válido.',

    // RECEIVED BY
    RECEIVED_BY_ID_REQUIRED: 'La person que recibe es requerida.',
    RECEIVED_BY_ID_INVALID_UUID: 'La persona que recibe no es válida.',

    // 👤 USERNAME
    USERNAME_REQUIRED: 'El nombre de usuario es requerido.',
    USERNAME_INVALID_TYPE: 'El nombre de usuario debe ser texto.',
    USERNAME_NO_SPACES: 'El nombre de usuario no debe contener espacios.',
    USERNAME_INVALID_FORMAT: 'Solo se permiten letras, números y guiones bajos.',
    USERNAME_TOO_LONG: 'El nombre de usuario no debe exceder 50 caracteres.',

    // 🔑 PASSWORD
    PASSWORD_REQUIRED: 'La contraseña es requerida.',
    PASSWORD_INVALID_TYPE: 'La contraseña debe ser texto.',
    PASSWORD_NEEDS_NUMBER: 'Debe contener al menos un número.',
    PASSWORD_NEEDS_UPPERCASE: 'Debe contener al menos una mayúscula.',
    PASSWORD_INVALID_FORMAT: 'Debe contener al menos un carácter especial.',
    PASSWORD_TOO_SHORT: 'Debe tener al menos 8 caracteres.',
    PASSWORD_TOO_LONG: 'No debe exceder 50 caracteres.',

    // 🧑 NAME
    NAME_REQUIRED: 'El nombre es requerido.',
    NAME_INVALID_TYPE: 'El nombre debe ser texto.',
    NAME_TOO_LONG: 'El nombre no debe exceder 50 caracteres.',
    NAME_INVALID_FORMAT: 'Contiene caracteres no válidos.',

    // 📞 PHONE
    NUMBERPHONE_INVALID_FORMAT: 'El teléfono no es válido.',
    NUMBERPHONE_TOO_LONG: 'El teléfono no debe exceder 20 caracteres.',

    // 💰 UNIT COST
    UNIT_COST_REQUIRED: 'El costo unitario es requerido.',
    UNIT_COST_INVALID_NUMBER: 'El costo debe ser numérico.',
    UNIT_COST_TOO_LONG: 'El costo es demasiado grande.',

    // 📉 MIN STOCK
    MIN_STOCK_REQUIRED: 'El stock mínimo es requerido.',
    MIN_STOCK_INVALID_NUMBER: 'Debe ser un número.',
    MIN_STOCK_TOO_LONG: 'El valor es demasiado grande.',
    MIN_STOCK_GREATER_THAN_MAX: 'El stock mínimo no puede ser mayor al máximo.',

    // 📈 MAX STOCK
    MAX_STOCK_REQUIRED: 'El stock máximo es requerido.',
    MAX_STOCK_INVALID_NUMBER: 'Debe ser un número.',
    MAX_STOCK_TOO_LONG: 'El valor es demasiado grande.',

    // 📅 EXPIRY DATE
    EXPIRY_DATE_INVALID_FORMAT: 'La fecha de caducidad no es válida.',

    // RECEPTION DATE
    RECEPTION_DATE_REQUIRED: 'La fecha de recepción es requerida.',
    RECEPTION_DATE_INVALID_FORMAT: 'La fecha de recepción no es válida.',

    // 📏 THICKNESS
    THICKNESS_INVALID_NUMBER: 'Debe ser un número.',
    THICKNESS_TOO_LONG: 'El valor es demasiado grande.',

    // 📐 BASE
    BASE_INVALID_NUMBER: 'Debe ser un número.',
    BASE_TOO_LONG: 'El valor es demasiado grande.',

    // 📏 HEIGHT
    HEIGHT_INVALID_NUMBER: 'Debe ser un número.',
    HEIGHT_TOO_LONG: 'El valor es demasiado grande.',

    // 🎨 COLOR
    COLOR_INVALID_TYPE: 'El color debe ser texto.',
    COLOR_TOO_LONG: 'El color no debe exceder más de 50 caracteres.',

    // 🏷 TYPE
    TYPE_INVALID_TYPE: 'El tipo debe ser texto.',
    TYPE_TOO_LONG: 'El tipo no debe exceder más de 50 caracteres.',

    // 📦 PRESENTATION
    PRESENTATION_INVALID_TYPE: 'La presentación debe ser texto.',
    PRESENTATION_TOO_LONG: 'La presentación no debe exceder más de 50 caracteres.',

    // OBSERVATIONS
    OBSERVATIONS_INVALID_TYPE: 'Las observaciones deben ser texto.',
    OBSERVATIONS_TOO_LONG: 'Las observaciones no deben exceder más de 50 caracteres.',

    // 🔘 ACTIVE
    ACTIVE_REQUIRED: 'El estado activo es requerido.',
    ACTIVE_INVALID_BOOLEAN: 'El estado activo debe ser verdadero o falso.',

    // DETAILS
    DETAILS_REQUIRED: 'La lista de detalles debe contener al menos un producto.',
    DETAILS_INVALID_FORMAT_REQUIRED: 'Cada detalle debe contener un producto y una cantidad.',
    DETAILS_INVALID_FORMAT_QUANTITY: 'La cantidad de cada detalle debe ser un número mayor a cero.',
    INVALID_FORMAT_DESCRIPTION: 'Si hay descripción, entonces debe ser texto y no debe ser mayor a 50 caracteres.'
};

const successMessages = {
    CREATED_ACCOUNT: '¡Cuenta registrada exitosamente!',
    UPDATED_ACCOUNT: '¡Cuenta actualizada con éxito!',
    SUCCESS_LOGIN: '¡Inicio de sesión exitoso!',
    SUCCESS_LOGOUT: 'Sesión cerrada exitosamente.',
    CREATED_PRODUCT: '¡Producto creada exitosamente!',
    UPDATED_PRODUCT: '¡Producto actuallizada exitosamente!',
    CREATED_SUPPLIER: '¡Proveedor creada exitosamente!',
    UPDATED_SUPPLIER: '¡Proveedor actuallizada exitosamente!',
    CREATED_GOODS_RECEIPT: '¡Entrada de mercancía creada exitosamente!',
    UPDATED_GOODS_RECEIPT: '¡Entrada de mercancía actualizada exitosamente!',
    CREATED_GOODS_ISSUE: '¡Salida de almacén creada exitosamente!',
    UPDATED_GOODS_ISSUE: '¡Salida de almacén actualizada exitosamente!'
};

export const getErrorMessage = (code) => errorMessages[code] ?? null;

export const getSuccessMessage = (code) => successMessages[code] ?? null;
