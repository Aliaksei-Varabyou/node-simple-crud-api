import http from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';
import dotenv from 'dotenv';

import { handleRequest } from './routes/userRoutes';

dotenv.config();

const host = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const numCPUs: number = os.cpus().length - 1;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Creating of working processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({ PORT: port + i + 1 });
  }

  // Current working process
  let cur: number = 0;

  // creating load balancer server
  const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    if (cluster.workers) {
      const workers = Object.values(cluster.workers);
      const worker = workers[cur];
      if (worker) {
        const { method, url, headers } = req;
        const buffers: Buffer[] = [];
        req.on('data', (chunk: Buffer) => {
          buffers.push(chunk);
        }).on('end', () => {
          const body = Buffer.concat(buffers).toString();
          worker.send({ method, url, headers, body });
    
          worker.once('message', (response) => {
            res.writeHead(200);
            res.end(response.responseData);
          });
    
          cur = (cur + 1) % numCPUs;
        });
      } else {
        res.writeHead(500);
        res.end('No worker available');
      }
      res.end();
    }
  });

  server.listen(port, host, () => console.log(`Load balancer running on port ${port}`));

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const workerPort = parseInt(process.env.PORT || '3000', 10);

  const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    handleRequest(req, res);
  });

  server.listen(workerPort, 'localhost', () => {
    console.log(`Worker started at http://localhost:${workerPort}`);
  });

  process.on('message', (msg: any) => {
    const { method, url, headers, body } = msg;
    console.log(222, method, url, headers, body );
    const requestOptions = {
      hostname: 'localhost',
      port: workerPort,
      path: url,
      method: method,
      headers: headers,
    };

    const req = http.request(requestOptions, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.log(`Response from worker ${process.pid} on port ${workerPort}: ${responseData}`);
        if (process.send) {
          process.send({ responseData, workerPort });
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error in worker ${process.pid}: ${error.message}`);
    });

    if (body) {
      req.write(body);
    }
    req.end();
  });
}
