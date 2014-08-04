// REF: http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')

var app = express()
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
if ('dev' == app.settings.env) {
  app.use(express.logger('dev'))
}
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(express.static(__dirname + '/public'))

// REF: https://github.com/visionmedia/express/blob/master/examples/error-pages/index.js
app.use(app.router);

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// error-handling middleware, take the same form
// as regular middleware, however they require an
// arity of 4, aka the signature (err, req, res, next).
// when connect has an error, it will invoke ONLY error-handling
// middleware.

// If we were to next() here any remaining non-error-handling
// middleware would then be executed, or if we next(err) to
// continue passing the error, only error-handling middleware
// would remain being executed, however here
// we simply respond with an error page.

app.use(function(err, req, res, next){
  // we may use properties of the error object
  // here and next(err) appropriately, or if
  // we possibly recovered from the error, simply next().
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.get('/', function (req, res) {
  res.render('index',
  { title : "首页" }
  )
})
app.get('/index', function (req, res) {
  res.render('index',
  { title : "首页" }
  )
})
app.get('/surf', function (req, res) {
  res.render('surf',
  { title : "导航页" }
  )
})
app.get('/about', function (req, res) {
  res.render('about',
  { title : "关于" }
  )
})

app.get('/404', function (req, res, next) {
  next();
});
app.get('/403', function (req, res, next) {
  var err = Error('Forbidden!');
  err.status = 403;
  next(err);
});
app.get('/500', function (req, res, next) {
  next(new Error('Unknown. Pray for peace.'));
});

app.listen(2460)

// vim: set sw=2 et:
