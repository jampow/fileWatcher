const assert = require('chai').assert;
const fs = require('fs');

const watcher = require('../lib/watcher.js');
const dir = 'tempDir';
const file = '/file.txt';

describe('Watcher', function(){
	before(function(){
		fs.mkdirSync(dir);
		watcher.repeater(dir);
	});

	after(function(){
		fs.unlinkSync(dir + file);
		fs.rmdirSync(dir);

		//reset storage
		fs.unlinkSync('storage/' + (dir + file).replace('/', '%2F'));
		fs.rmdirSync('storage');
	});

	it('should fire createdFile event', function(done){
		watcher.on('createdFile', function(fileName){
			assert.equal(dir + file, fileName);
			done();
		});
		
		fs.writeFileSync(dir + file, 'created');
	});

	it('should fire updatedFile event', function(done){
		watcher.on('updatedFile', function(fileName){
			assert.equal(dir + file, fileName);
			done();
		});
		
		fs.writeFileSync(dir + file, 'updated');
	});
});
