'use strict';

const Hapi = require('hapi');
const Good = require('good');
const Hoek = require('hoek');

const server = new Hapi.Server();
var portt = ~~process.env.PORT || 3000;
server.connection({ port: portt, host: '0.0.0.0' });


/*-------------------------------------------------------------------------------*/
/* Static */
/*-------------------------------------------------------------------------------*/
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
      method: 'GET',
      path: '/',
      handler: function (request, reply) {
          reply.file('./public/index.html');
      }
    });
  
});


/*-------------------------------------------------------------------------------*/
/* Dinamic Contents */
/*-------------------------------------------------------------------------------*/
server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);
  
    server.route({
      method: 'GET',
      path: '/users',
      handler: function (request, reply) {
        reply.view('index', { people: [
          {firstName: "Hasan", lastName: "Palamut"},
          {firstName: "Cengiz", lastName: "Tastan"},
          {firstName: "Mustafa", lastName: "Yordan"}
          ]}, { layout: 'layout' });
        }
    });
  

    server.views({
      engines: {
        html: require('handlebars')
      },
      relativeTo: __dirname,
      path: './templates',
      layoutPath: './templates/layout'
    });
});



/*-------------------------------------------------------------------------------*/
/* Logging */
/*-------------------------------------------------------------------------------*/
server.register({
      register: Good,
      options: {
          reporters: {
              console: [{
                  module: 'good-squeeze',
                  name: 'Squeeze',
                  args: [{
                      response: '*',
                      log: '*'
                  }]
              }, {
                  module: 'good-console'
              }, 'stdout']
          }
      }
  }, (err) => {

      if (err) {
          throw err; // something bad happened loading the plugin
      }

      server.start((err) => {

          if (err) {
              throw err;
          }
          server.log('info', 'Server running at: ' + server.info.uri);
      });
  });  