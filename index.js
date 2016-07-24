const fs = require('fs');
const path = require('path');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./storage');

const pause = 1000; //miliseconds

const blackList = ['.git', '.swp'];

var files = [];

function mapDir(dir){
	var files = fs.readdirSync(dir);

	console.log('dir', dir);
	console.log('files', files);
	console.log('-----------------------');

	files
		.filter(function(item){
			return blackList.indexOf(item) == -1;
		})
		.forEach(function(item){
			var fullPath = path.join(dir, item);
			if(isDir(fullPath))
				mapDir(fullPath);
			else
				checkFile(fullPath);
		});
}

function isDir(file){
	return fs.statSync(file).isDirectory();
}

function repeater(startPoint){
	mapDir(startPoint);
	console.log('=======================');
	setTimeout(function(){ repeater(startPoint); }, pause);
}

function checkFile(file){
	var oldTimestamp = localStorage.getItem(file);
	var newTimestamp = fs.statSync(file).mtime.toString();

	console.log('old', oldTimestamp);
	console.log('new', newTimestamp);
	if(!oldTimestamp) {
		// Novo arquivo
		newFile(file, newTimestamp);
	} else if(oldTimestamp !== newTimestamp) {
		// arquivo atualizado
		updatedFile(file, newTimestamp);
	}

}

function newFile(file, timestamp) {
	console.log('cretedFile');
	storeFile(file, timestamp);
}

function updatedFile(file, timestamp) {
	console.log('updatedFile');
	storeFile(file, timestamp);
}

function storeFile(file, timestamp) {
	localStorage.setItem(file, timestamp);
}

repeater('dir');






