const fs = require('fs');
const path = require('path');

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
			//else
				//console.log(item);
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

repeater('.');






