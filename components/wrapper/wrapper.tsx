'use client';

import { Button, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useState } from "react";
import FlipCard from "../flip-card/flip-card";
import { Item } from "@/lib/api";
import ReactCardFlip from "react-card-flip";
import CustomImage from "../custom-image/custom-image";
import { useBem } from "@/hooks/bem";
import './wrapper.scss';
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { TypographyStylesProvider } from '@mantine/core';
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { handleAction } from "@/utils/action.utils";
import { updateColumnId } from "@/actions/database.actions";
import { useMutation } from "@tanstack/react-query";

type Properties = {
  items: Item[]
}

const mapColumns = (items: Item[]) => {
  const backlogItems = items.filter(item => item.columnId === 'backlog');
  return items.reduce((acc, item) => {
    if (!acc[item.year.toString()]) {
      acc[item.year.toString()] = {
        items: [],
        title: item.year.toString()
      };
    }
    if (item.columnId !== 'backlog') {
      acc[item.year.toString()].items.push(item);
    }
    return acc;
  }, { backlog: { items: backlogItems, title: 'Stapel' } } as Record<string, { items: Item[]; title: string; }>);
}

export default function Wrapper ({ items }: Properties) {
  const b = useBem('Wrapper');
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [isFlipped, setIsFlipped] = useState(false);
  const [transformedText, setTransformedText] = useState<string | undefined>(undefined)
  const [started, setStarted] = useState(false)

  const [columns, setColumns] = useState(mapColumns(items));

  const updateColumnMutation = useMutation({
    mutationFn: async (data: { id: string, columnId: string }) => {
      return handleAction(await updateColumnId(data.id, data.columnId));
    },
    onError: (error) => {
      console.log('error', error)
    },
  });

  // console.log('columns', columns)

  useEffect(() => {
    // console.log('modal item changed', selectedItem)
    void markdownToHtml()
  }, [selectedItem])

  const handleFlipClick = () => {
    setIsFlipped(!isFlipped)
    // console.log('clicked and flipped', isFlipped)
  }

  const markdownToHtml = async () => {
    const text = await richTextFromMarkdown(selectedItem?.text ?? '')
    // console.log('text', documentToHtmlString(text))
    setTransformedText(documentToHtmlString(text))
  }

  const onClose = () => {
    close()
    setIsFlipped(false)
  }

  const handleStartClick = useCallback(() => {
    setStarted(true)
  }, [started])

  const onDragEnd = useCallback(async(result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
      updateColumnMutation.mutate({ id: removed.id, columnId: destination.droppableId })
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [[columns, setColumns]]);

  const onDragStart = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  }

  return (
    <>
    <div className={b('page-description', { hide: started })}>
      <Text size={'md'}>Hallo Fabian 😉</Text>
      <Text size={'md'}>Das ist deine Chance zu beweisen, dass du dein Leben korrekt ordnen kannst.</Text>
      <Text size={'md'}>Klicke auf den Start Button um los zu legen.</Text>
      <Button onClick={handleStartClick}>Start</Button>
    </div>
    <div className={b('context', { show: started })}>
    <DragDropContext
      onDragEnd={onDragEnd}
      onDragStart={onDragStart}
    >
      <div className={b()}>
          {Object.entries(columns).sort((a, b) => b[0].localeCompare(a[0])).map(([columnId, column], index) => {
            return (
              <Droppable key={columnId} droppableId={columnId} direction={columnId === 'backlog' ? 'horizontal' : 'vertical'}>
                {(provided, snapshot) => (
                  <div className={b('task-list')}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <Title order={2} className={b('title')}>{column.title}</Title>
                    <div className={b('posts-container', { active: snapshot.isDraggingOver })}>
                      {/* {column.items.length} */}
                      {column.items.map((item, index) => (
                        <FlipCard
                        item={item}
                        key={item.name}
                        index={index}
                        onClick={open}
                        setItem={setSelectedItem}
                        {...(columnId === 'backlog' && {className: 'initial'})}
                      />
                        // <TaskCard key={item.name} item={item as Item} index={index} />
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
      </div>
    </DragDropContext>
    </div>
    {/* {items.map((item, index) => {
        // console.log('item', item)
        return (
          <FlipCard
            item={item}
            key={item.name}
            index={index}
            onClick={open}
            setItem={setSelectedItem}
          />
        )
      })} */}
    <Modal opened={opened} onClose={onClose} size={"lg"} className={b('modal')}>
      <ReactCardFlip isFlipped={isFlipped}>
          <div key="front">
            <div className={b('image')}>
              <CustomImage
                key={selectedItem?.name}
                imageSizes={{
                  xs: 600
                }}
                src={selectedItem?.image.url ?? ''}
                alt={selectedItem?.image.title ?? ''}
                // className={b('image')}
              />
            </div>
          </div>
          <div key="back">
            <TypographyStylesProvider>
          <div className={b('information')}>
              <Title className={b('title')} order={1}>{selectedItem?.name}</Title>
              <div className={b('details')} dangerouslySetInnerHTML={{ __html: transformedText ?? ''}}></div>
          </div>
            </TypographyStylesProvider>
          </div>
        </ReactCardFlip>
        <Button onClick={handleFlipClick}>Flip</Button>
    </Modal>
    </>
  )
}