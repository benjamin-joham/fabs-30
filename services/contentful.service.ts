import 'server-only';
import { Item, fetchGraphQL } from '@/lib/api';

const fetchPosts = async (): Promise<Item[]> => {
  const entries = await fetchGraphQL(
    `query {
      itemCollection {
        items {
          name
          year
          text
          image {
            url
            title
          }
        }
      }
    }`,
  );
  return entries?.data?.itemCollection?.items;
}

export default {
  fetchPosts
}