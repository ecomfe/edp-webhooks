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
 * @param {string} reply github push过来的消息
 */
exports.create = function( reply ) {
    var def = new Deferred();

    var data = JSON.parse( reply );
    var headers = data.headers;
    var body = data.body;

    var event = headers[ 'x-github-event' ];
    if ( event === 'create' ) {
        if ( body.ref_type === 'tag' ) {
            edp.log.info( 'Process %s/%s event', event, body.ref_type );
            var handler = require( '../workers/create-tag-handler' );
            return handler( headers, body );
        }
        else {
            edp.log.warn( 'Ignore %s/%s event', event, body.ref_type );
        }
    }
    else {
        edp.log.warn( 'Ignore %s event', event );
    }

    process.nextTick(function(){
        def.resolve();
    });

    return def;
}



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
