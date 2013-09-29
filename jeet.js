#!/usr/bin/env node
// Generated by CoffeeScript 1.5.0
(function() {
  var clog, cltags, compile, http, isPortTaken, net, startLiveReload, tags, tinylr, watcher;

  watcher = require("./lib/watcher.js");

  compile = require("./lib/compiler.js");

  tinylr = require("tiny-lr");

  cltags = require("cltags");

  http = require("http");

  net = require("net");

  tags = cltags.parse(process.argv, {}, {
    h: "help"
  });

  clog = console.log;

  console.log = function(object) {
    if (object.toString().substr(0, 10) !== "... Reload") {
      return clog(object);
    }
  };

  isPortTaken = function(PORT, callback) {
    var tester;
    tester = net.createServer();
    tester.once('error', function(err) {
      if (err.code === 'EADDRINUSE') {
        return callback(null, true);
      } else {
        return callback(err);
      }
    });
    tester.once('listening', function() {
      tester.once('close', function() {
        return callback(null, false);
      });
      return tester.close();
    });
    return tester.listen(PORT);
  };

  startLiveReload = function() {
    return isPortTaken(35729, function(err, taken) {
      if (!err && !taken) {
        tinylr().listen(35729, function() {});
        tags.livereload = true;
        return console.log("\x1B[0;32mLive Reload is listening on port 35729!!!\x1B[0;0m\n");
      } else if (!err && taken) {
        tags.livereload = false;
        return console.log("\x1B[0;31mThe livereload port seems to be in use by another app, so live-reload will be turned off\x1B[0;0m\n");
      } else {
        console.log("\x1B[0;31m" + err + "\x1B[0;0m\n");
        return process.kill();
      }
    });
  };

  if (tags.command === "watch") {
    startLiveReload();
    watcher.watch(function(file) {
      if (file.substr(-5) === ".styl") {
        return compile(watcher.stylFile);
      } else if (tags.livereload) {
        http.get("http://localhost:35729/changed?files=" + file);
        return console.log("\x1B[0;32m" + file.split("/").pop() + " modified & reloaded!!!\x1B[0;0m");
      } else {
        return console.log("\x1B[0;32m" + file.split("/").pop() + " modified!!!\x1B[0;0m");
      }
    });
  } else if (tags.command === "help" || tags.help === true) {
    console.log("Usage: jeet watch");
  }

}).call(this);
