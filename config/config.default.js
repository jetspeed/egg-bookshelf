'use strict';

/**
 * egg-bookshelf default config
 * @member Config#bookshelf
 * @property {String} SOME_KEY - some description
 */
exports.bookshelf = {
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'loan',
    password : 'loan',
    database : 'qlc',
    charset  : 'utf8'
  }
};
