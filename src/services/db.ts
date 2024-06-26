import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

export const ERROR_CODES = Object.freeze({
  NOT_FOUND: "P2025",
  UNIQUE_CONTRAINT_FAILED: "P2002",
  RELATED_RECODE_NOT_FOUND: "P2015",
  TOO_MANY_DB_CONNECTION_OPEN: "P2037",
});

export const handlePrismaErrors = (e: any) => {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // console.log(
    //   "--------------------------------------->",
    //   e.code,
    //   // e.message,
    //   e.meta,
    //   e.name
    // );

    if (e.code === ERROR_CODES.NOT_FOUND) {
      if (e.meta?.cause)
        return { status: 404, errors: { detail: e.meta!.cause } };
      return { status: 404, errors: { detail: e.message } };
    } else if (e.code === ERROR_CODES.UNIQUE_CONTRAINT_FAILED) {
      const taget = (e.meta as any).target as string;
      const fieldName = taget.split("_").slice(1, -1).join("_");
      return {
        status: 400,
        errors: { [fieldName]: { _errors: ["Must be unique"] } },
      };
    }
  }
};
