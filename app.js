var express = require('express')
    , app = express.createServer()
    , io = require('socket.io').listen(app)
    , port = process.env.PORT || 3000;