'use client';
import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, List } from '@mantine/core';
import { useBem } from '@/hooks/bem';
import './drawer.scss'
import { useMutation } from '@tanstack/react-query';
import { handleAction } from '@/utils/action.utils';
import { fetchPosts } from '@/actions/contentful.action';
import { fetchDatabaseData, resetDatabase } from '@/actions/database.actions';
import { useRouter } from 'next/navigation';


export default function CustomDrawer() {
  const b = useBem('CustomDrawer')
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();

  const fetchPostsMutation = useMutation({
    mutationFn: async () => {
      return handleAction(await fetchPosts());
    },
    onSuccess: async () => {
      router.refresh();
    },
    onError: (error) => {
      console.log('error', error)
    },
  });

  const resetDatabaseMutation = useMutation({
    mutationFn: async () => {
      return handleAction(await resetDatabase());
    },
    onSuccess: async () => {
      router.refresh();
    },
    onError: (error) => {
      console.log('error', error)
    },
  });

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
          <List.Item onClick={() => fetchPostsMutation.mutate()}>Update Posts from Contentful</List.Item>
          {fetchPostsMutation.isPending && <div>Fetching posts...</div>}
          {fetchPostsMutation.isSuccess && <div>Successfully updated Posts!</div>}
          <List.Item onClick={() => resetDatabaseMutation.mutate()}>Reset Database</List.Item>
          {resetDatabaseMutation.isPending && <div>Deleting posts...</div>}
          {resetDatabaseMutation.isSuccess && <div>Successfully reset Database!</div>}
        </List>
      </Drawer>

      <Button className={b('button')} onClick={open}>=</Button>
    </>
  );
}