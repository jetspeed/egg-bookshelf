'use strict';

const mock = require('egg-mock');

describe('test/bookshelf.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/bookshelf-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, bookshelf')
      .expect(200);
  });
});
