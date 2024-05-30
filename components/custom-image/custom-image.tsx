'use client';
import { useBem } from '@/hooks/bem';
import Image from 'next/image';
import { ImageProps, StaticImport } from 'next/dist/shared/lib/get-img-props';
import { ImageSizes } from '@/models/enum/images';
import { SizePerBreakpoint } from '@/models/general/image';
import { Breakpoints } from '@/models/enum/brakepoints';
import './custom-image.scss';
import { useCallback, useEffect, useState } from 'react';
import FallbackImage from '@/public/icons/i-fallback-image.svg';
import { isPositiveNumber } from '@/utils/number.utils';

type Properties = {
  imageSizes?: ImageSizes;
  aspectRatio?: number;
  src?: string | StaticImport;
  position?: 'top' | 'center' | 'bottom';
} & ImageProps;

/**
 * Gets the sizes attribute value for the srcset image.
 *
 * Example output: "(max-width: 960px) 90vw,(max-width: 1200px) 70vw,(max-width: 1680px) 30vw, 1200px"
 */
function getMappedSizes(sizes: ImageSizes): string {
  if (!sizes) {
    return '';
  }

  // Holds the requested image width per viewport: { <viewport>: <imageWidth> }
  const mappedSizesPerBreakpoints: SizePerBreakpoint = {};
  const fallback = sizes.fallback ? `,${sizes.fallback}px` : ',100vw';

  return (
    Object.keys(sizes)
      .map((size: string | number) => {
        // we return for XL as the XL viewport does not have a max width, it will be used as sizes fallback value without a media query
        if (size === 'fallback') {
          return null;
        }

        // Reads the breakpoint for the current size from the Breakpoint service.
        const breakpoint: Breakpoints = Breakpoints[size as keyof typeof Breakpoints];

        // check if the provided size key exists as breakpoint key
        // if yes, take the corresponding breakpoint value,
        // otherwise take the size key (which is a number in that case)
        const breakpointValue: number = breakpoint >= 0 ? breakpoint : (size as number);

        // Declare the current breakpoint / width combination in the mappedSizesPerBreakpoints object.
        mappedSizesPerBreakpoints[breakpointValue] = sizes?.[
          size as keyof ImageSizes
        ] as number;

        return breakpointValue;
      })
      .filter(isPositiveNumber)
      .sort((a, b) => (a > b ? 1 : -1))
      .map(breakpoint => {
        if (typeof breakpoint === 'number') {
          // Calculates the image for the looped breakpoint from "px" to "vw".
          const viewWidth = Math.floor(
            (mappedSizesPerBreakpoints[breakpoint] / breakpoint) * 100,
          );

          return `(max-width: ${breakpoint - 1}px) ${viewWidth}vw`;
        }

        return null;
      })
      .join(',') + fallback
  );
}

type ContentfulImageProps  ={
  src: string;
  width?: number;
  quality?: number;
  [key: string]: any; // For other props that might be passed
}

const contentfulLoader = ({ src, width, quality }: ContentfulImageProps) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default function CustomImage({
  imageSizes,
  aspectRatio,
  position = 'center',
  ...rest
}: Properties) {
  const b = useBem('custom-image');
  const [error, setError] = useState(!rest.src);

  useEffect(() => {
    setError(!rest.src || !(imageSizes || (rest.width && rest.height)));
  }, [rest.src, imageSizes, rest.width, rest.height]);

  const errorHandler = useCallback(() => {
    setError(true);
  }, [setError]);

  const largestImageSize: number = imageSizes ? Math.max(...Object.values(imageSizes)) : 1;
  const largestImageWidth: number = largestImageSize;
  const largestImageHeight: number = largestImageSize * (aspectRatio || 1);

  return (
    <div className={b('', { aspectRatio: !!aspectRatio && `${aspectRatio}`, fallback: error })}>
      {error && <FallbackImage />}
      {!error && (
        <Image
          className={b('img', { position })}
          sizes={imageSizes ? getMappedSizes(imageSizes) : undefined}
          onError={errorHandler}
          width={rest.fill ? undefined : rest.width || largestImageWidth}
          height={rest.fill ? undefined : rest.height || largestImageHeight}
          {...rest}
          loader={contentfulLoader}
          alt={rest.alt || ''}
        />
      )}
    </div>
  );
}
