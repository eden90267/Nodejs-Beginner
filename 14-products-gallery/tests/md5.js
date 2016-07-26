var crypto = require('crypto');
var object = {
    name: 'jollen',
    date: new Date()
};
var data = JSON.stringify(object);
var key = crypto.createHash('md5').update(data).digest('hex');

console.log(data);
console.log(key);
