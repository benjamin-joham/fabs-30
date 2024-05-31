
import Wrapper from "@/components/wrapper/wrapper";
import { useBem } from "@/hooks/bem";
import { Item, getAllItems } from "@/lib/api";
import { Text, Title } from "@mantine/core";
import './page.scss';
import { fetchDatabaseData } from "@/actions/database.actions";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const b = useBem('HomePage');
  // const allPosts = await getAllPosts(isEnabled);
  // const heroPost = allPosts?.[0];
  // const morePosts = allPosts?.slice(1);
  // const items = await getAllItems();
  const items = await fetchDatabaseData();

  return (
    <div className={b()}>
      <Title className={b('page-title')} order={1}>Fabian's visuelle Zeitachse</Title>

      <Wrapper items={items as Item[]} />
    </div>
  );
}
