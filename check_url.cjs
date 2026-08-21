const https = require('https');

https.get('https://xrcypnyewxnsnjwsixot.supabase.co/storage/v1/object/public/product-images/product-t2-1781028009579.webp', (res) => {
  console.log('Status Code:', res.statusCode);
}).on('error', (e) => {
  console.error('Error:', e.message);
});
