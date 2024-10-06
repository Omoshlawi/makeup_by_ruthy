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

export function parseCustomRepresentation(
  customRep: string
): Record<string, any> | undefined {
  const mode = customRep?.split(":")[0]?.trim();
  if (!["include", "select"].includes(mode)) return;
  // Helper function to parse nested properties
  function parseFields(fields: string): Record<string, any> {
    const result: Record<string, any> = {};
    let currentKey = "";
    let depth = 0;
    let nested = "";

    for (let char of fields) {
      if (char === "(") {
        depth++;
        if (depth === 1) {
          continue;
        }
      } else if (char === ")") {
        depth--;
        if (depth === 0) {
          result[currentKey.trim()] = { [mode]: parseFields(nested) };
          currentKey = "";
          nested = "";
          continue;
        }
      }

      if (depth > 0) {
        nested += char;
      } else if (char === ",") {
        if (currentKey.trim()) {
          result[currentKey.trim()] = true; // Simple field
        }
        currentKey = "";
      } else {
        currentKey += char;
      }
    }

    if (currentKey.trim()) {
      result[currentKey.trim()] = true; // Last simple field
    }

    return result;
  }
  const parsedFields = parseFields(customRep);

  function processObject(obj: Record<string, any>): Record<string, any> {
    const processedObj: Record<string, any> = {};
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        processedObj[key.endsWith(":") ? key.slice(0, -1) : key] =
          processObject(obj[key]);
      } else {
        processedObj[key] = obj[key];
      }
    }
    return processedObj;
  }

  return processObject(parsedFields)[mode][mode];
}

export const paginate = (pageSize: number, page: number) =>
  (page - 1) * pageSize;

export const getFileds = (v?: string): any => ({
  include: v?.startsWith("include:")
    ? parseCustomRepresentation(v ?? "")
    : undefined,
  select: v?.startsWith("select:")
    ? parseCustomRepresentation(v ?? "")
    : undefined,
});
