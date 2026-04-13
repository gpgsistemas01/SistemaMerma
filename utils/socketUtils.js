let socketInstance = null;

export const initSocket = (io) => {

    socketInstance = io;
    return socketInstance;
};

export const emitStockUpdated = ({ source = 'unknown', referenceId = null, notification = null } = {}) => {

    if (!socketInstance) return;

    socketInstance.emit('stock:updated', {
        source,
        referenceId,
        notification,
        updatedAt: new Date().toISOString()
    });
};
