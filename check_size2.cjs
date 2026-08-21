const https = require('https');

https.get('https://xrcypnyewxnsnjwsixot.supabase.co/storage/v1/object/public/product-images/product-t2-1781028009579.webp?t=1781029565715', (res) => {
  let size = 0;
  res.on('data', chunk => size += chunk.length);
  res.on('end', () => console.log('Size:', size));
});
