const { Client } = require('../Calendarix/node_modules/ssh2');
const client = new Client();

const project = 'conversia';
const service = 'web';

const config = {
    type: "app",
    source: {
        type: "github",
        githubEndpoint: "https://api.github.com",
        owner: "nuviamarketing7-agentes",
        repo: "conversia",
        ref: "master",
        path: "/",
        autoDeploy: true
    },
    domains: [
        {
            host: "agenciaconversia.com",
            https: true,
            port: 80,
            path: "/"
        },
        {
            host: "www.agenciaconversia.com",
            https: true,
            port: 80,
            path: "/"
        }
    ],
    ports: [],
    mounts: [],
    env: ""
};

const cmd = `
ls -l /etc/easypanel/projects/${project}/${service}.json
docker ps --format "{{.Names}}"
`;

client.on('ready', () => {
    console.log('SSH connection established');
    client.exec(cmd, (err, stream) => {
        if (err) { console.error('Error executing command:', err); client.end(); return; }
        stream.on('data', (data) => process.stdout.write(data.toString()));
        stream.stderr.on('data', (data) => process.stderr.write(data.toString()));
        stream.on('close', () => {
            console.log('Command execution finished');
            client.end();
        });
    });
}).on('error', (err) => {
    console.error('Error SSH:', err.message);
}).connect({
    host: '148.230.76.217',
    port: 22,
    username: 'root',
    password: '2328061410LeAMM@',
    readyTimeout: 10000
});
