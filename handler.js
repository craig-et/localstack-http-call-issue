const http = require('http');

const logger = (...args) =>
  console.log(new Date().toISOString(), JSON.stringify(args));

const httpGet = (url) =>
  new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      const bodyChunks = [];
      res
        .on('data', (chunk) => bodyChunks.push(chunk))
        .on('end', () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(bodyChunks),
          })
        );
    });
    req.on('error', (e) => reject(e));
  });

const handler = async (event) => {
  logger('Handling event', event);
  logger('Handling body', event.Records[0].body);
  const request = JSON.parse(event.Records[0].body);
  logger('Handling Request', request);

  const results = [];
  let timer;
  for (let i = 0; i < request.urls.length; i++) {
    timer = Date.now();

    const result = await httpGet(request.urls[i]).then(
      ({ status }) => `success [${status}]`,
      (e) => `failure [${e}]`
    );

    results.push(`[${request.urls[i]}]: ${Date.now() - timer} ms, ${result}`);
  }

  console.log(new Date().toISOString(), '[results]', JSON.stringify(results));
  return results;
};

exports.handler = handler;
