export const uploadTypes = {
    AVATAR: {
        field: 'avatarPath',
        maxSize: 2 * 1024 * 1024,
        mimes: ['image/jpeg', 'image/png', 'image/webp'],
        exts: ['.jpg', '.png', '.webp'],
    },
    COVER: {
        field: 'coverPath',
        maxSize: 5 * 1024 * 1024,
        mimes: ['image/jpeg', 'image/png', 'image/webp'],
        exts: ['.jpg', '.png', '.webp'],

    },
}