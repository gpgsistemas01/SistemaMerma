import { prisma } from "../../lib/prisma.js";

export const findAllProjects = async ({ search = '', department = '' }) => {

    const conditions = [];

    if (search) {
        conditions.push({
            OR: [
                {
                    referenceNumber: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ]
        });
    }

    if (department) {
        conditions.push({
            OR: [
                {
                    purchaseRequisitions: {
                        some: {
                            department: {
                                name: department
                            }
                        }
                    }
                },
                {
                    goodsIssues: {
                        some: {
                            department: {
                                name: department
                            }
                        }
                    }
                }
            ]
        });
    }

    const where = conditions.length ? { AND: conditions } : {};

    const projects = await prisma.project.findMany({
        where,
        orderBy: {
            date: 'desc'
        },
        select: {
            id: true,
            referenceNumber: true,
            name: true
        },
        take: 30
    });

    return {
        data: projects
    };
};
