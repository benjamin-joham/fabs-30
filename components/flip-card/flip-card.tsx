'use client';
import { ImageSizes } from "@/models/enum/images";
import { Dispatch, SetStateAction, useState } from "react";
import ReactCardFlip from "react-card-flip";
import CustomImage from "../custom-image/custom-image";
import { Item } from "@/lib/api";
import { useBem } from "@/hooks/bem";
import { modals } from '@mantine/modals';
import './flip-card.scss';

type Properties = {
  item: Item
  onClick: () => void;
  setItem: Dispatch<SetStateAction<Item | undefined>>
}
export default function FlipCard({ item, onClick, setItem }: Properties) {
  const b = useBem('FlipCard');
  const [isFlipped, setIsFlipped] = useState(false);

  const imageSizes: ImageSizes = {
    xs: 204,
    fallback: 224,
  };

  const handleFlipClick = () => {
    setIsFlipped(!isFlipped)
    console.log('clicked and flipped', isFlipped)
  }

  const handleOnClick = () => {
    setItem(item)
    // console.log('clicked')
    // setContent(
    //   <div className={b('modal-content')}>
    //     <ReactCardFlip isFlipped={isFlipped}>
    //       <div key="front" onClick={handleFlipClick}>
    //         <div className={b('image')}>
    //           <CustomImage
    //             key={item.name}
    //             imageSizes={{
    //               xs: 600
    //             }}
    //             src={item.image.url}
    //             alt={item.image.title}
    //             // className={b('image')}
    //           />
    //         </div>
    //       </div>
    //       <div key="back" onClick={handleFlipClick}>
    //       <div className={b('information')}>
    //         <p>{item.name}</p>
    //         <div className={b('details')}>
    //           <p>
    //             <span>
    //               {item.text}
    //             </span>
    //           </p>
    //         </div>
    //       </div>
    //       </div>
    //     </ReactCardFlip>
    //     </div>
    // )
    onClick();
  }

  return (
    <>
      <CustomImage
          key={item.name}
          imageSizes={imageSizes}
          src={item.image.url}
          alt={item.image.title}
          onClick={handleOnClick}
        />

    </>
  )
}