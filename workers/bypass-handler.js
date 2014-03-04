/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * workers/bypass-handler.js ~ 2014/03/04 11:12:57
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 啥也不干，直接通过
 **/
var Deferred = require( '../base/Deferred' );
var base = require( '../base/base' );
var Worker = require( '../base/Worker' );

var util = require( 'util' );
var edp = require( 'edp-core' );

/**
 * @constructor
 * @extends Worker
 */
function BypassHandler( headers, body ) {
    Worker.call( this, headers, body );
}
util.inherits( BypassHandler, Worker );

/** @inheritdoc */
BypassHandler.prototype.info = function() {
    var event = this.headers[ 'x-github-event' ];
    return util.format( 'Process %s event by BypassHandler', event );
};

/** @inheritdoc */
BypassHandler.prototype.match = function() {
    return true;
};

/** @inheritdoc */
BypassHandler.prototype.start = function() {
    edp.log.info( this.info() );

    var d = new Deferred();
    process.nextTick(function(){
        d.resolve();
    });
    return d;
};

/**
 * @ignore
 */
module.exports = exports = BypassHandler;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
