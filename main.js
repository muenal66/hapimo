'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
var portt = ~~process.env.PORT || 3000;
server.connection({ port: portt, host: '0.0.0.0' });

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/hello',
        handler: function (request, reply) {
            reply.file('./public/hello.html');
        }
    });
});


server.start((err) => {

    if (err) {
        throw err;
    }
		
    console.log(`Server running at: ${server.info.uri}`);
});