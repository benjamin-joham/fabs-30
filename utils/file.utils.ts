const BYTE_UNITS = ['B', 'kB', 'MB', 'GB'];

export const prettyBytes = (size?: string): string => {
  if (!size) {
    throw new TypeError(`Expected a number, got ${typeof size}`);
  }
  let bytes = Number.parseInt(size);

  if (Number.isNaN(bytes)) {
    throw new TypeError(`Expected a number number, got ${typeof bytes}: ${bytes}`);
  }

  if (bytes < 0) {
    throw new RangeError(`Expected a positive number, got ${typeof bytes}: ${bytes}`);
  }

  const exponent = Math.min(Math.floor(Math.log10(bytes) / 3), BYTE_UNITS.length - 1);
  bytes /= Math.pow(1000, exponent);

  const unit = BYTE_UNITS[exponent];

  return `${bytes.toPrecision(3)} ${unit}`;
};

export const mapMimeType = (mime?: string): string => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (mime) {
    case 'application/pdf': {
      return 'PDF';
    }
    default: {
      throw new TypeError(`Unknown mime type: ${mime}`);
    }
  }
};
