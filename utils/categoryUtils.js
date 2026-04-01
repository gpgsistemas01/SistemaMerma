export const getCategory = (categoryId) => {
    switch (categoryId) {
        case 1:
            return 'Gaming';
        case 2:
            return 'Entretenimiento';
        case 3:
            return 'Deportes'
        case 4:
            return 'Tecnología'
        default:
            return 'Sin categoría';
    }
}

export const getCategoryId = (categoryName) => {
    switch (categoryName) {
        case 'gaming':
            return 1;
        case 'entertainment':
            return 2;
        case 'sports':
            return 3;
        case 'technology':
            return 4;
        default:
            return 'none';
    }
}