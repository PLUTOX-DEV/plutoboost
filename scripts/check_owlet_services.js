const https = require('https');
const http = require('http');
const url = require('url');

const target = 'http://localhost:5000/services?force=1';

function fetch(targetUrl) {
  return new Promise((resolve, reject) => {
    const parsed = url.parse(targetUrl);
    const lib = parsed.protocol === 'https:' ? https : http;
    const opts = { ...parsed };
    const req = lib.get(opts, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async function(){
  try {
    const r = await fetch(target);
    if (r.status !== 200) {
      console.error('HTTP_ERROR', r.status);
      process.exit(2);
    }
    let json;
    try { json = JSON.parse(r.body); } catch(e) { console.error('PARSE_ERR', e.message); console.error(r.body.slice(0,2000)); process.exit(2); }
    const ow = json.filter(x => String((x.provider||'').toUpperCase()) === 'OWLET');
    const sample = ow.slice(0,10);
    console.log(JSON.stringify({ total: ow.length, sample }, null, 2));
  } catch (err) {
    console.error('ERR', err.message || err);
    process.exit(2);
  }
})();