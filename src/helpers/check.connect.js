"use strict";

const mongoose = require("mongoose");
const _SECONDS = 5000;
const os = require("os");
const process = require("process");

//check countConnections
const countConnect = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of Connections: ${numConnections}`);
  }, _SECONDS);
};

const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const cpuUsage = os.loadavg()[0];
    const memoryUsage = process.memoryUsage().rss;
    const cpuCores = os.cpus().length;

    console.log(`Memory Usage: ${memoryUsage / 1024 / 1024}MB`);
    console.log(`CPU Usage: ${cpuUsage}`);

    //if one process is include 5connect
    const maximumConnections = cpuCores * 5;

    //nen de du ra
    if (numConnections > maximumConnections) {
      console.log(`Maximum Connections: ${maximumConnections}`);
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverload,
};
