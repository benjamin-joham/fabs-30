'use server';
import { Item } from "@/lib/api";
import contentfulService from "@/services/contentful.service";
import loggerService from "@/services/logger.service";
import { createAction } from "@/utils/action.utils";
import { prisma } from '@/lib/prisma';
import { v4 as uuid } from 'uuid';

const contentfulAction = createAction(error => loggerService.captureException(error, 'contentful.actions'));

export const fetchPosts = contentfulAction(async (): Promise<void> => {
  try {
    const items = await contentfulService.fetchPosts();

    const existingPosts = await prisma.post.findMany();

    console.log('existingPosts', existingPosts)

    const updatedPosts = []

    items.forEach(async (item: Item, index) => {
      if (existingPosts.find(post => post.name === item.name)) {
        return;
      }
      const imageId = uuid();
      const postId = uuid();

      await prisma.post.create({
        data: {
          ...item,
          year: item.year.toString(),
          id: postId,
          imageId: undefined,
          image: {
            create: {
              id: imageId,
              url: item.image.url,
              title: item.image.title
            }
          },
          columnId: 'backlog'
        },
      })
      updatedPosts.push(item);
    });

    loggerService.debug(`Fetched ${updatedPosts.length} new posts from Contentful`, 'contentful.actions');
    loggerService.debug(`Has ${existingPosts.length} posts in DB`, 'contentful.actions');
  } catch {
    loggerService.error('Failed to fetch posts from Contentful', 'contentful.actions');
  }
});

