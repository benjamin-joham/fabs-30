'use client';
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, List } from '@mantine/core';
import { useBem } from '@/hooks/bem';
import './drawer.scss'

export default function CustomDrawer() {
  const b = useBem('CustomDrawer')
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title="Admin Panel"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {/* Drawer content */}
        <List>
          <List.Item>Update Posts from Contentful</List.Item>
          <List.Item>Reset Database</List.Item>
        </List>
      </Drawer>

      <Button className={b('button')} onClick={open}>=</Button>
    </>
  );
}