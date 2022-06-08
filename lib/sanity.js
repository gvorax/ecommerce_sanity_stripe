import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';


export const client = sanityClient({
  projectId:'kz8tqumh',
  dataset:'production',
  apiVersion:'2022-06-07',
  useCdn:true,
  token:process.env.NEXT_PUBLIC_TOKEN
})

const builder = imageUrlBuilder(client);

export const urlFor = (source)=> builder.image(source)