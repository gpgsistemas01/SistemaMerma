export const generateReferenceNumber = async ({ type, sequence, tx }) => {

    const counter = await tx.referenceNumberCounter.update({
        where: { prefix: type },
        data: {
            counter: {
                increment: 1
            }
        }
    });

    const year = new Date().getFullYear();
    return `${type}-${year}-${counter.counter.toString().padStart(6, '0')}`;
}