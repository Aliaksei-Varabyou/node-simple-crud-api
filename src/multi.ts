import http from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';
import dotenv from 'dotenv';

dotenv.config();

const host = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const numCPUs: number = os.cpus().length - 1;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  // Creating of working processes
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({PORT: port + i + 1});
  }

  // Current working process
  let cur: number = 0;

  // creating load balancer server
  const server: http.Server = http.createServer(() => {
    if (cluster.workers) {
      const workers = Object.values(cluster.workers);
      const worker = workers[cur];
      if (worker) {
        worker.send('proxy', server);
        cur = (cur + 1) % numCPUs;
      }
    }
  });

  server.listen(port, host, () => console.log(`Load balancer running on port ${port}`));

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const server: http.Server = http.createServer((_, res: http.ServerResponse) => {
    res.writeHead(200);
    res.end(`Hello from worker ${process.pid}`);
  });

  server.listen(0, 'localhost', () => {
    console.log(`Worker started at http://localhost:${port}`);
  });

  process.on('message', (msg: string, server: http.Server) => {
    if (msg === 'proxy') {
      server.on('connection', (socket: any) => {
        server.emit('connection', socket);
      });
    }
  });
}
