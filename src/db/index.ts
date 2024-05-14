import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

export const ERROR_CODES = Object.freeze({
  NOT_FOUND: "P2001",
  UNIQUE_CONTRAINT_FAILED: "P2003",
  RELATED_RECODE_NOT_FOUND: "P2015",
  TOO_MANY_DB_CONNECTION_OPEN: "P2037",
});

export const handlePrismaErrors = (e: any) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(e.code, e.message, e.meta, e.name);

    if (e.code === "P2025") {
      return { status: 404, errors: { detail: e.message } };
    }
  }
};
