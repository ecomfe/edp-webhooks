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


/**
 * @param {string} reply github push过来的消息
 */
exports.create = function( reply ) {
    var def = new Deferred();

    var data = JSON.parse( reply );
    var headers = data.headers;
    var body = data.body;

    var event = headers[ 'X-GitHub-Event' ];
    if ( event === 'create' ) {
        if ( body.ref_type === 'tag' ) {
            return require( '../workers/create-tag-handler' );
        }
    }

    setTimeout(function(){
        def.resolve( headers, body );
    }, 100);

    return def;
}



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
