const product = { img: 'https://xrcypnyewxnsnjwsixot.supabase.co/storage/v1/object/public/product-images/cakes/round/round-(1).webp?t=123' };
const id = 'c1';
let fileName = `product-${id}.webp`;
if (product.img && product.img.includes('product-images')) {
  const bucketIndex = product.img.indexOf('product-images/');
  if (bucketIndex !== -1) {
    fileName = product.img.substring(bucketIndex + 'product-images/'.length).split('?')[0];
  }
}
console.log('Extracted fileName:', fileName);
