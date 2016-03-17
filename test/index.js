var Logger = require('../lib/logger').Logger;

var logger = new Logger();
logger.getLogger('test').info('coucou');