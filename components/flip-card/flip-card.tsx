'use client';
import { ImageSizes } from "@/models/enum/images";
import { Dispatch, SetStateAction, useState } from "react";
import ReactCardFlip from "react-card-flip";
import CustomImage from "../custom-image/custom-image";
import { Item } from "@/lib/api";
import { useBem } from "@/hooks/bem";
import { modals } from '@mantine/modals';
import './flip-card.scss';
import { Draggable } from "@hello-pangea/dnd";

type Properties = {
  item: Item
  onClick: () => void;
  setItem: Dispatch<SetStateAction<Item | undefined>>
  index: number;
  className?: string;
}
export default function FlipCard({ item, onClick, setItem, index, className }: Properties) {
  const b = useBem('FlipCard');
  const imageSizes: ImageSizes = {
    xs: className === 'initial' ? 204 : 120,
    fallback: className === 'initial' ? 204 : 120 ,
  };


  const handleOnClick = () => {
    setItem(item)
    onClick();
  }

  return (
    <Draggable draggableId={item.name} index={index}>
      {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={className}
      > 
        <CustomImage
          // className={className}
            key={item.name}
            imageSizes={imageSizes}
            src={item.image.url}
            alt={item.image.title}
            onClick={handleOnClick}
          />
  </div>)}
    </Draggable>
  )
}