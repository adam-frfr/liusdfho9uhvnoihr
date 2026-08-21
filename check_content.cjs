const https = require('https');

https.get('https://xrcypnyewxnsnjwsixot.supabase.co/storage/v1/object/public/product-images/product-t2-1781028009579.webp?t=1781029565715', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk.toString('utf8'));
  res.on('end', () => console.log('Content:', data));
});
