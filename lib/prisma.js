import { PrismaClient, Presentation, MovementType, ReferenceType, ReferenceDetailType } from "../generated/prisma/client.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });
export { Presentation, MovementType, ReferenceType, ReferenceDetailType, Prisma };