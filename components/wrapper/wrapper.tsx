'use client';

import { Button, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from "react";
import FlipCard from "../flip-card/flip-card";
import { Item } from "@/lib/api";
import ReactCardFlip from "react-card-flip";
import CustomImage from "../custom-image/custom-image";
import { useBem } from "@/hooks/bem";
import './wrapper.scss';
import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { TypographyStylesProvider } from '@mantine/core';

type Properties = {
  items: Item[]
}
export default function Wrapper ({ items }: Properties) {
  const b = useBem('Wrapper');
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [isFlipped, setIsFlipped] = useState(false);
  const [transformedText, setTransformedText] = useState<string | undefined>(undefined)

  useEffect(() => {
    console.log('modal item changed', selectedItem)
    void markdownToHtml()
  }, [selectedItem])

  const handleFlipClick = () => {
    setIsFlipped(!isFlipped)
    console.log('clicked and flipped', isFlipped)
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

  return (
    <>
    {items.map((item) => {
        // console.log('item', item)
        return (
          <FlipCard
            item={item}
            key={item.name}
            onClick={open}
            setItem={setSelectedItem}
          />
        )
      })}
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