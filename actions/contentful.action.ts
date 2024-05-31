'use server';
import { Item } from "@/lib/api";
import contentfulService from "@/services/contentful.service";
import loggerService from "@/services/logger.service";
import { createAction } from "@/utils/action.utils";
import { prisma } from '@/lib/prisma';

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

      const post = await prisma.post.create({
        data: {
          ...item,
          year: item.year.toString(),
          image: {
            create: {
              url: item.image.url,
              title: item.image.title
            }
          },
          imageId: undefined,
          columnId: 'backlog'
        },
      })
      updatedPosts.push(post);
    });

    loggerService.debug(`Fetched ${updatedPosts.length} new posts from Contentful`, 'contentful.actions');
    loggerService.debug(`Has ${existingPosts.length} posts in DB`, 'contentful.actions');
  } catch {
    loggerService.error('Failed to fetch posts from Contentful', 'contentful.actions');
  }
});

