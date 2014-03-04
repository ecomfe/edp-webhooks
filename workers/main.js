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
var edp = require( 'edp-core' );
var fs = require( 'fs' );
var path = require( 'path' );

var base = require( '../base/base' );
var Worker = require( '../base/Worker' );
var Deferred = require( '../base/Deferred' );

Worker.add( require( './create-tag-handler' ) );
Worker.add( require( './bypass-handler' ) );

var client = base.createRedisClient();
client.on( 'connect', function(){
    function next() {
        var key = base.getRedisKey( 'github_events' );
        client.rpop( key, function( err, reply ){
            if ( !reply ) {
                next();
                return;
            }

            var workers = Worker.create( reply );
            if ( workers.length <= 0 ) {
                next();
                return;
            }

            var defs = [];
            workers.forEach(function( w ){
                defs.push( w.start() );
            });

            Deferred.all( defs ).then( next, function( e ){
                edp.log.error( e.toString() );
                var log = require( 'util' ).format( '%s\t%s\t%s',
                    new Date(), reply, e.toString() );
                fs.appendFileSync( path.join( __dirname, '..', 'error.log' ), log );
                next();
            });
        });
    }
    next();
});
client.on( 'error', function( e ){
    console.log( e );
    console.error( 'Connect to redis-server failed' );
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
