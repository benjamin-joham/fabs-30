

import FlipCard from "@/components/flip-card/flip-card";
import { useBem } from "@/hooks/bem";
import { getAllItems } from "@/lib/api";
import { Title } from "@mantine/core";
import './page.scss';
import Wrapper from "@/components/wrapper/wrapper";

export default async function TestPage() {
  const b = useBem('TestPage');
  // const items = await getAllItems();

  return (
    <div className={b()}>
      <Title className={b('title')}>Test Page</Title>
      <Wrapper items={[]} />
    </div>
  );
}
