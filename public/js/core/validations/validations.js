export const isEmptyOrNull = (value, fieldName) => {
    
    if (value === null || 
        value === undefined || 
        (typeof value === 'string' && value.trim().length === 0)
    ) { 

        return `${ fieldName } es un valor requerido`;
    }

    return null;
};

export const isString = (value, fieldName) => {
    
    if (typeof value === 'string') return null;

    return `${ fieldName } no es una cadena de texto`;
};

export const isNumber = (value, fieldName) => {
    
    if (typeof value === 'number' && !isNaN(value)) return null;

    return `${ fieldName } no es un número válido`;
};

export const isBoolean = (value, fieldName) => {
    
    if (typeof value === 'boolean') return null;

    return `${ fieldName } no es un booleano válido`;
};

export const isLengthInRangeMin = (value, min, fieldName) => {

    const length = value.length;

    if (length < min) return `${ fieldName } debe tener al menos ${ min } caracteres`;

    return null;
}

export const isLengthInRangeMax = (value, max, fieldName) => {

    const length = value.length;

    if (length > max) return `${ fieldName } no debe exceder los ${ max } caracteres`;
    
    return null;
};

export const includeSpace = (value, fieldName) => {
    
    if (value.includes(' ')) return `${ fieldName } no debe contener espacios`;

    return null;
};

export const includeUppercase = (value, fieldName) => {
    
    if (!/[A-Z]/.test(value)) return `${ fieldName } debe tener al menos una letra mayúscula`;

    return null;
};