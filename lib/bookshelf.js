'use strict';

const assert = require('assert');
const path = require('path');
const knex = require('knex');
const bookshelf = require('bookshelf');
const awaitEvent = require('await-event');

let count = 0;

module.exports = app => {
  const { client, connection } = app.config.bookshelf;

  // TODO addSingleton support config[this.configName]?
  app.addSingleton('bookshelf', createOneClient);

  app.bookshelf.loadModel = () => loadModelToApp(app);

  if (loadModel) {
    app.beforeStart(() => {
      loadModelToApp(app);
    });
  }
};

function createOneClient(config, app) {
  const { client, connection } = config.bookshelf;

  assert(client, '[egg-bookshelf] client is required on config');
  assert(connection, '[egg-bookshelf] connection is required on config');

  app.coreLogger.info('[egg-bookshelf] connecting %s', connection.host);

  const db = knex(config.bookshelf);

  /* istanbul ignore next */
  db.on('error', err => {
    err.message = `[egg-bookshelf]${err.message}`;
    app.coreLogger.error(err);
  });

  /* istanbul ignore next */
  db.on('disconnected', () => {
    app.coreLogger.error(`[egg-bookshelf] ${connection.host} disconnected`);
  });

  db.on('connected', () => {
    app.coreLogger.info(`[egg-bookshelf] ${connection.host} connected successfully`);
  });

  /* istanbul ignore next */
  db.on('reconnected', () => {
    app.coreLogger.info(`[egg-bookshelf] ${connection.host} reconnected successfully`);
  });

  app.beforeStart(function* () {
    app.coreLogger.info('[egg-bookshelf] starting...');
    yield awaitEvent(db, 'connected');
    const index = count++;
    /*
     *remove heartbeat to avoid no authentication
      const serverStatus = yield db.db.command({
        serverStatus: 1,
      });

      assert(serverStatus.ok === 1, '[egg-mongoose] server status is not ok, please check mongodb service!');
    */
    app.coreLogger.info(`[egg-bookshelf] instance[${index}] start successfully`);
  });

  return db;
}

function loadModelToApp(app) {
  const dir = path.join(app.config.baseDir, 'app/model');
  app.loader.loadToApp(dir, 'model', {
    inject: app,
    caseStyle: 'upper',
    filter(model) {
      return typeof model === 'function' && model.prototype instanceof app.bookshelf.Model;
    },
  });
}
