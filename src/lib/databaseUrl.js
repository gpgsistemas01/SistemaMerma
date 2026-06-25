const getEnvironmentOptions = () => ({
    databaseUrl: process.env.DATABASE_URL,
    databaseUrlDirect: process.env.DATABASE_URL_DIRECT,
    directUrl: process.env.DIRECT_URL
});

const hasExplicitOptions = (options) => options && Object.keys(options).length > 0;

export const resolveDatabaseUrl = (options) => {

    const {
        databaseUrl,
        databaseUrlDirect,
        directUrl
    } = hasExplicitOptions(options) ? options : getEnvironmentOptions();

    return databaseUrl || databaseUrlDirect || directUrl;
};

export const getDatabaseUrl = (options = {}) => {

    const databaseUrl = resolveDatabaseUrl(options);

    if (!databaseUrl) {
        throw new Error('DATABASE_URL is required to connect to the database.');
    }

    return databaseUrl;
};
