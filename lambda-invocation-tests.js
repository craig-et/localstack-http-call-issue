const { Lambda } = require('@aws-sdk/client-lambda');
const util = require('util');

const lambda = new Lambda({
  apiVersion: '2015-03-31',
  region: 'ap-southeast-2',
  endpoint: 'http://localhost:4566',
});

const marshallPayload = (body) =>
  new util.TextEncoder().encode(
    JSON.stringify({
      Records: [{ body: JSON.stringify(body) }],
    })
  );
const unmarshallPayload = (payload) =>
  JSON.parse(new util.TextDecoder().decode(payload));

let counter = 0;
const invoke = async (body) => {
  const timer = Date.now();
  counter++;
  console.log('invoke started at', new Date().toISOString());
  const { Payload } = await lambda.invoke({
    FunctionName: 'http-call-issue-local-worker',
    Payload: marshallPayload(body),
  });
  const results = unmarshallPayload(Payload);
  console.log(
    `[invocation ${counter}] took ${Date.now() - timer} ms`,
    JSON.stringify(results, null, 2)
  );
};

(async () => {
  await invoke({
    urls: [
      'http://host-one/health',
      'http://host-one/health',
      'http://host-one/2health2furious',
      'http://host-two/health',
      'http://host-three/health',
      'http://host-two/health',
      'http://host-two/2health2furious',
      'http://host-two/health',
      'http://host-one/health',
    ],
  });
  await invoke({
    urls: [
      'http://host-one/health',
      'http://host-one/health',
      'http://host-two/health',
      'http://host-three/health',

      'http://host-one/health',
      'http://host-one/health',
      'http://host-two/health',
      'http://host-three/health',

      'http://host-one/health',
      'http://host-one/health',
      'http://host-two/health',
      'http://host-three/health',
    ],
  });
})();
