export type PageProperties = {
  params: {
    lang: string;
    [key: string]: string;
  };
  searchParams?: {
    [key: string]: string;
  };
};
