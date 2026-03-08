const { Client } = require('../Calendarix/node_modules/ssh2');
const client = new Client();

const cmd = 'docker exec easypanel easypanel deploy conversia web || docker exec -it easypanel-easypanel-1 sh -c "easypanel deploy conversia web"';

client.on('ready', () => {
    client.exec(cmd, (err, stream) => {
        if (err) { console.error('Error executing command:', err); client.end(); return; }
        stream.on('data', (data) => process.stdout.write(data.toString()));
        stream.stderr.on('data', (data) => process.stderr.write(data.toString()));
        stream.on('close', () => {
            client.end();
        });
    });
}).connect({
    host: '148.230.76.217',
    port: 22,
    username: 'root',
    password: '2328061410LeAMM@',
    readyTimeout: 10000
});
