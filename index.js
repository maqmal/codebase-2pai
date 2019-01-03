require('dotenv').config();
const cluster = require('cluster');
const server = require('./bin/app/server');
const logger = require('./bin/helper/util/logger');
const cpuCount = require('os').cpus().length;

if(cluster.isMaster){
  for (let i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }

}else{
  const AppServer = new server();

  const Port = process.env.SERVER_PORT || 1337;

  AppServer.server.listen(Port,() => {
    let ctx = 'app-server';
    logger.log(ctx,`The server is running on ${Port} workerid = ${cluster.worker.id}`,'init');
  });
}
cluster.on('exit', (worker) => {
  logger.log('server',`Worker %d died :( ${worker.id}`,'init');
  cluster.fork();

});

