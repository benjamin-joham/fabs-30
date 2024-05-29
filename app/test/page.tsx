

import CustomImage from "@/components/custom-image/custom-image";
import { getAllItems } from "@/lib/api";
import { ImageSizes } from "@/models/enum/images";
import Image from "next/image";

export default async function TestPage() {
  const items = await getAllItems();

  const imageSizes: ImageSizes = {
    xs: 204,
    fallback: 224,
  };

  return (
    <div className="container mx-auto px-5">
      {JSON.stringify(items)}
      {items.map((item) => {
        console.log('item', item)
        return (
          <CustomImage
            key={item.name}
            imageSizes={imageSizes}
            src={item.image.url}
            alt={item.image.title}
          />
        )
      })}
    </div>
  );
}
