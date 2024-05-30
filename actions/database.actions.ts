'use server';
import loggerService from "@/services/logger.service";
import { createAction } from "@/utils/action.utils";
import { prisma } from '@/lib/prisma';
import { Item } from "@/lib/api";

const databaseAction = createAction(error => loggerService.captureException(error, 'contentful.actions'));
export const resetDatabase = databaseAction(async (): Promise<void> => {
  if (await prisma.post.count(undefined) !== 0) {
    await prisma.post.deleteMany();
  }
  if (await prisma.image.count(undefined) !== 0) {
    await prisma.image.deleteMany();
  }
  // await prisma.columns.create({
  //   data: {
  //     id: 'backlog',
  //   }
  // })
  loggerService.debug('Database reset', 'database.actions');
});

export const fetchDatabaseData = databaseAction(async (): Promise<Item[]> => {
  const items = await prisma.post.findMany({
    include: {
      image: true
    }
  });
  if (!items) {
    return [];
  }

  // console.log('items', items)
  // return [];

  return items as unknown as Item[];
});

export const updateColumnId = databaseAction(async (id: string, columnId: string): Promise<void> => {
  await prisma.post.update({
    where: { id },
    data: {
      columnId
    }
  });
  try {
    console.log(typeof columnId)
    loggerService.debug(`Updated column id ${columnId} for post ${id}`, 'database.actions');
  } catch {
    loggerService.error(`Failed to update column id ${columnId} for post ${id} `, 'database.actions');
  }
});