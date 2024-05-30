'use client';

import { Button, Modal } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from "react";
import FlipCard from "../flip-card/flip-card";
import { Item } from "@/lib/api";
import ReactCardFlip from "react-card-flip";
import CustomImage from "../custom-image/custom-image";
import { useBem } from "@/hooks/bem";
import './wrapper.scss';

type Properties = {
  items: Item[]
}
export default function Wrapper ({ items }: Properties) {
  const b = useBem('Wrapper');
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    console.log('modal item changed', selectedItem)
  }, [setSelectedItem])

  const handleFlipClick = () => {
    setIsFlipped(!isFlipped)
    console.log('clicked and flipped', isFlipped)
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
    <Modal opened={opened} onClose={close} size={"lg"} className={b('modal')}>
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
          <div className={b('information')}>
            <p>{selectedItem?.name}</p>
            <div className={b('details')}>
              <p>
                <span>
                  {selectedItem?.text}
                </span>
              </p>
            </div>
          </div>
          </div>
        </ReactCardFlip>
        <Button onClick={handleFlipClick}>Flip</Button>
    </Modal>
    </>
  )
}