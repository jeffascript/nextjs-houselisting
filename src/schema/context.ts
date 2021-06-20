import { PrismaClient } from "../prisma";

export interface IContext {
  uid: string | null;
  prisma: PrismaClient;
}

export interface AuthorizedContext extends IContext {
  uid: string;
}
