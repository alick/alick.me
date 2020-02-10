// REF: http://clock.co.uk/tech-blogs/a-simple-website-in-nodejs-with-express-jade-and-stylus
/*
 * Module dependencies
 */
var http = require('http');
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var path = require('path');
var cookieParser = require('cookie-parser');
var i18n = require('i18n-2');

var favicon = require('serve-favicon');
var logger = require('morgan');

var app = express()
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

// AWS Elastic Beanstalk sets PORT env for containers.
// cf. https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_nodejs.container.html#nodejs-platform-configfiles
app.set('port', process.env.PORT || 2460);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
if ('development' == app.get('env')) {
  app.use(logger('dev'));
}
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

i18n.expressBind(app, {
    // Setup locales - other locales default to en.
    locales    : ['en', 'zh'],
    // Change the cookie name from 'lang' to 'locale'.
    cookieName : 'locale',
    // Set indentation in locales/*.js files.
    indent     : 2
});

// This is how you'd set a locale from req.cookies.
// Don't forget to set the cookie either on the client or in your Express app.
app.use(function(req, res, next) {
    req.i18n.setLocaleFromQuery();
    req.i18n.setLocaleFromCookie();
    next();
});

app.get('/', function (req, res) {
  res.render('index',
  {
    title : req.i18n.__("Homepage"),
    rel_url : ''
  }
  )
})
app.get('/about', function (req, res) {
  res.render('about',
  {
    title : req.i18n.__("About"),
    rel_url : 'about'
  }
  )
})
app.get('/:lang', function (req, res, next) {
  if (/\w{2}(_\w+)?/.test(req.params.lang)) {
    req.i18n.setLocale(req.params.lang)
    res.render('index',
    {
      title : req.i18n.__("Homepage"),
      rel_url : ''
    }
    )
  } else {
    next()
  }
})
app.get('/:lang/about', function (req, res, next) {
  if (/\w{2}(_\w+)?/.test(req.params.lang)) {
    req.i18n.setLocale(req.params.lang)
    res.render('about',
    {
      title : req.i18n.__("About"),
      rel_url : 'about'
    }
    )
  } else {
    next()
  }
})

// cf. http://www.digidad.me.uk/2017/03/using-ssl-with-nodejs-and-openshift.html
// Lets encrypt response
var letsEncryptUrl = process.env.LETS_ENCRYPT;
var letsEncryptResponse = process.env.LETS_ENCRYPT_RESPONSE;

if(letsEncryptResponse != undefined && letsEncryptResponse != undefined) {
  app.get('/.well-known/acme-challenge/' + letsEncryptUrl, function (req, res) {
    res.send(letsEncryptResponse)
    res.end()
  })
}

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

// Express 4: error handling middleware should be loaded after routes.

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

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// vim: set sw=2 et:
