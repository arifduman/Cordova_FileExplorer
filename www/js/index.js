/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	// Application Constructor
	initialize : function () {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents : function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady : function () {
		app.receivedEvent('deviceready');
		document.getElementById("createFile").addEventListener("click", createFile);
		document.getElementById("writeFile").addEventListener("click", writeFile);
		document.getElementById("readFile").addEventListener("click", readFile);
		document.getElementById("removeFile").addEventListener("click", removeFile);
		document.getElementById("console").addEventListener("click", console);
		document.getElementById("createFile_SdCard").addEventListener("click", createFile_SdCard);

	},

	// Update DOM on a Received Event
	receivedEvent : function (id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');

		console.log('Received Event: ' + id);
	}
};


function copy() {
	Entry.prototype.copyTo = function(parent, newName, successCallback, errorCallback) {
    argscheck.checkArgs('oSFF', 'Entry.copyTo', arguments);
    var fail = errorCallback && function(code) {
        errorCallback(new FileError(code));
    };
    var srcURL = this.toInternalURL(),
        // entry name
        name = newName || this.name,
        // success callback
        success = function(entry) {
            if (entry) {
                if (successCallback) {
                    // create appropriate Entry object
                    var newFSName = entry.filesystemName || (entry.filesystem && entry.filesystem.name);
                    var fs = newFSName ? new FileSystem(newFSName, { name: "", fullPath: "/" }) : new FileSystem(parent.filesystem.name, { name: "", fullPath: "/" });
                    var result = (entry.isDirectory) ? new (require('./DirectoryEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL) : new (require('cordova-plugin-file.FileEntry'))(entry.name, entry.fullPath, fs, entry.nativeURL);
                    successCallback(result);
                }
            }
            else {
                // no Entry object returned
                if (fail) {
                    fail(FileError.NOT_FOUND_ERR);
                }
            }
        };

    // copy
    exec(success, fail, "File", "copyTo", [srcURL, parent.toInternalURL(), name]);
};

}

function createFile_SdCard(dosyaAdi)
{
	var type = window.TEMPORARY;
	var size = 5 * 1024 * 1024;
	dosyaAdi = document.getElementById('dosya_adi').value;
	if (dosyaAdi == "") {
		dosyaAdi = "isimsiz1.txt";
	}

	window.requestFileSystem(type, size, successCallback, errorCallback)

	function successCallback(fs) {
		//fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
		var txtArea2 = document.getElementById('textarea2');
		//var dosya_path = 'file:///storage/extSdCard';
		var dosya_path = txtArea2.value;
		alert(dosya_path);
		window.resolveLocalFileSystemURL(dosya_path, function (fileEntry) {

			// Retrieve an existing directory, or create it if it does not already exist
			fileEntry.getDirectory("newDir", {
				create : true,
				exclusive : false
			}, function (fileEntry) {
				fileEntry.getFile(dosyaAdi, {
					create : true,
					exclusive : true
				}, function (fileEntry) {
					alert('Dosya olusturuldu!')
				}, errorCallback);
			}, errorCallback);

		}, errorCallback);

	}

	function errorCallback(error) {
		alert("ERROR: " + error.code)
	}
}
function createFile(dosyaAdi) {
	var type = window.TEMPORARY;
	var size = 5 * 1024 * 1024;
	dosyaAdi = document.getElementById('dosya_adi').value;
	if (dosyaAdi == "") {
		dosyaAdi = "isimsiz1.txt";
	}

	window.requestFileSystem(type, size, successCallback, errorCallback)

	function successCallback(fs) {
		//fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
		var dosya_path = cordova.file.externalRootDirectory;
		alert(dosya_path);
		window.resolveLocalFileSystemURL(dosya_path, function (fileEntry) {
			// Retrieve an existing directory, or create it if it does not already exist
			fileEntry.getDirectory("newDir", {
				create : true,
				exclusive : false
			}, function (fileEntry) {
				fileEntry.getFile(dosyaAdi, {
					create : true,
					exclusive : true
				}, function (fileEntry) {
					alert('Dosya olusturuldu!')
				}, errorCallback);
			}, errorCallback);

		}, errorCallback);

	}

	function errorCallback(error) {
		alert("ERROR: " + error.code)
	}

}

function writeFile(dosyaAdi) {
	var type = window.TEMPORARY;
	var size = 5 * 1024 * 1024;
	dosyaAdi = document.getElementById('dosya_adi').value;
	// var txtArea = document.getElementById('textarea');
	if (dosyaAdi == "") {
		dosyaAdi = "isimsiz1.txt";
	}
	window.requestFileSystem(type, size, successCallback, errorCallback)

	function successCallback(fs) {
		//fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
		var dosya_path = cordova.file.externalRootDirectory;

		window.resolveLocalFileSystemURL(dosya_path, function (fileEntry) {
			// Retrieve an existing directory, or create it if it does not already exist
			fileEntry.getDirectory("newDir", {
				create : true,
				exclusive : false
			}, function (fileEntry) {
				fileEntry.getFile(dosyaAdi, {
					create : true,
					exclusive : false
				}, function (fileEntry) {
					fileEntry.createWriter(function (fileWriter) {

						fileWriter.onwriteend = function (e) {
							alert('Write completed.');
						};

						fileWriter.onerror = function (e) {
							alert('Write failed: ');
						};

						var txtArea = document.getElementById('textarea');
						//var blob = new Blob(['lorem adsa'], {type: 'text/plain'});
						fileWriter.write(txtArea.value);
						txtArea.value = "";
					}, errorCallback);
				}, errorCallback);
			}, errorCallback);

		}, errorCallback);

	}
	function errorCallback(error) {
		alert("ERROR: " + error.code)
	}
}
function readFile(dosyaAdi) {
	var type = window.TEMPORARY;
	var size = 5 * 1024 * 1024;
	dosyaAdi = document.getElementById('dosya_adi').value;
	window.requestFileSystem(type, size, successCallback, errorCallback)

	function successCallback(fs) {

		var dosya_path = cordova.file.externalRootDirectory;

		window.resolveLocalFileSystemURL(dosya_path, function (fileEntry) {
			// Retrieve an existing directory, or create it if it does not already exist
			fileEntry.getDirectory("newDir", {
				create : true,
				exclusive : false
			}, function (fileEntry) {
				fileEntry.getFile(dosyaAdi, {
					create : false
				}, function (fileEntry) {
					fileEntry.file(function (file) {
						var reader = new FileReader();

						reader.onloadend = function (e) {
							var txtArea = document.getElementById('textarea');
							txtArea.value = this.result;
						};

						reader.readAsText(file);
					}, errorCallback);
				}, errorCallback);
			}, errorCallback);

		}, errorCallback);

	}

	function errorCallback(error) {
		alert("ERROR: " + error.code)
	}

}
function removeFile(dosyaAdi) {
	var type = window.TEMPORARY;
	var size = 5 * 1024 * 1024;
	dosyaAdi = document.getElementById('dosya_adi').value;
	window.requestFileSystem(type, size, successCallback, errorCallback)

	function successCallback(fs) {

		var dosya_path = cordova.file.externalRootDirectory;

		window.resolveLocalFileSystemURL(dosya_path, function (fileEntry) {
			// Retrieve an existing directory, or create it if it does not already exist
			fileEntry.getDirectory("newDir", {
				create : true,
				exclusive : false
			}, function (fileEntry) {
				fileEntry.getFile(dosyaAdi, {}, function (fileEntry) {
					fileEntry.file(function (file) {
						fileEntry.remove(function () {
							alert('File removed.');
						}, errorCallback);
					}, errorCallback);
				}, errorCallback);
			}, errorCallback);

		}, errorCallback);

	}

	function errorCallback(error) {
		alert("ERROR: " + error.code)
	}

}

app.initialize();
