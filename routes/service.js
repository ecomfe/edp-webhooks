/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * routes/service.js ~ 2014/03/01 20:03:48
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * webhook接口
 **/
var base = require( '../base/base' );
var path = require( 'path' );

/**
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 */
exports.payload = function(req, res){
    // 把 headers 和 body 存储下来，然后定时任务自动去处理
    var client = base.createRedisClient();
    client.on( 'connect', function(){
        var key = base.getRedisKey( 'github_events' );
        client.lpush( key, JSON.stringify({
            headers: req.headers,
            body: req.body
        }), function( err, reply ){
            if ( err ) {
                res.send( 500, err.toString() );
            }
            else {
                res.send( 'OK:' + reply );
            }
            client.end();
        });
    });
    client.on( 'error', function(){
        res.send( 500, 'Connect to redis-server failed');
    });
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
