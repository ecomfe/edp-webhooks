/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * base/Worker.js ~ 2014/03/02 15:11:32
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var Deferred = require( './Deferred' );
var edp = require( 'edp-core' );

/**
 * @constructor
 * @param {Object} headers github请求的header信息.
 * @param {Object} body github请求的body信息.
 */
function Worker( headers, body ) {
    this.headers = headers;
    this.body = body;
};

/**
 * 如果符合Worker的需要，返回true，否则返回false.
 * @return {boolean}
 */
Worker.prototype.match = function() {
    return false;
};

/**
 * 开始启用Worker的运行，返回Deferred对象.
 * @return {Deferred}
 */
Worker.prototype.start = function() {
    throw new Error("Unimplemented method");
};

/**
 * @ignore
 */
var WorkerPool = [];

/**
 * 注册一个新的Worker
 * @param {Function} ctor worker的构造函数.
 */
Worker.add = function( ctor ) {
    WorkerPool.push( ctor );
};

/**
 * @static
 * @param {string} reply github push过来的消息
 * @return {Array.<Worker>}
 */
Worker.create = function( reply ) {
    var data = JSON.parse( reply );
    var headers = data.headers;
    var body = data.body;

    var workers = [];
    WorkerPool.forEach(function( ctor ) {
        var instance = new ctor( headers, body );
        if ( instance.match() ) {
            workers.push( instance );
        }
    });

    if ( workers.length <= 0 ) {
        var event = headers[ 'x-github-event' ];
        edp.log.warn( 'Ignore %s/%s event', event, body.ref_type );
    }

    return workers;
}

/**
 * @ignore
 */
module.exports = exports = Worker;



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
