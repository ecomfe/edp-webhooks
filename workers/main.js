/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * workers/main.js ~ 2014/03/02 15:01:38
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 读取redis里面的内容，然后依次处理
 **/
var base = require( '../base/base' );
var edp = require( 'edp-core' );
var Worker = require( '../base/Worker' );

var client = base.createRedisClient();
client.on( 'connect', function(){
    function next() {
        var key = base.getRedisKey( 'github_events' );
        client.rpop( key, function( err, reply ){
            if ( !reply ) {
                next();
                return;
            }
            var worker = Worker.create( reply );
            worker.then( next, function( e ) {
                edp.log.error( e.toString() );
                next();
            } );
        });
    }
    next();
});
client.on( 'error', function( e ){
    console.log( e );
    console.error( 'Connect to redis-server failed' );
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
