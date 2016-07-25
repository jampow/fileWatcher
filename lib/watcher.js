const fs = require('fs');
const path = require('path');
const util = require('util');
const EventEmitter = require('events').EventEmitter;

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./storage');

const pause = 1000; //miliseconds

const blackList = ['.git', '.swp'];

const Watcher = function(){
	var self = this;

	this.mapDir = function(dir){
		var files = fs.readdirSync(dir);

		files
			.filter(function(item){
				return blackList.indexOf(item) == -1;
			})
			.forEach(function(item){
				var fullPath = path.join(dir, item);
				if(self.isDir(fullPath))
					self.mapDir(fullPath);
				else
					self.checkFile(fullPath);
			});
	};

	this.isDir = function(file){
		return fs.statSync(file).isDirectory();
	};

	this.repeater = function(startPoint){
		this.mapDir(startPoint);
		setTimeout(function(){ self.repeater(startPoint); }, pause);
	};

	this.checkFile = function(file){
		var oldTimestamp = localStorage.getItem(file);
		var newTimestamp = fs.statSync(file).mtime.toString();

		if(!oldTimestamp) {
			// Novo arquivo
			this.newFile(file, newTimestamp);
		} else if(oldTimestamp !== newTimestamp) {
			// arquivo atualizado
			this.updatedFile(file, newTimestamp);
		}

	};

	this.newFile = function(file, timestamp) {
		this.emit('createdFile', file);
		this.storeFile(file, timestamp);
	};

	this.updatedFile = function(file, timestamp) {
		this.emit('updatedFile', file);
		this.storeFile(file, timestamp);
	};

	this.storeFile = function(file, timestamp) {
		localStorage.setItem(file, timestamp);
	};
};

util.inherits(Watcher, EventEmitter);

module.exports = new Watcher();

