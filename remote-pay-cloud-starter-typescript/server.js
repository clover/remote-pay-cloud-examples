var path = require('path');
var express = require('express');
var app = express();

/*
Serve static content from the 'public' directory.
 */
var contentDir = path.join(__dirname, 'public');
app.use('/', express.static(contentDir));

/*
log all request bodies.
 */
app.use(function (req, res, next) {
    // console.log(req.body); // populated!
    next()
});

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});