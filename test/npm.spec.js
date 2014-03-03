/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * npm.spec.js ~ 2014/03/03 10:49:10
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 测试一下发布和查询的功能
 **/
var base = require( '../base/base' );
var npm = require( 'npm' );
var path = require( 'path' );

describe("npm", function(){
    xit("search", function(){
        var flag = false;
        waitsFor(function(){ return flag; });

        npm.load( base.getNpmConfig(), function( er ) {
            if ( er ) throw er;
            var dir = path.join( __dirname, '..', 'data', 'github.com', 'leeight', 'node.hi', '0.0.6', 'node.hi-0.0.6' );
            npm.commands.publish( [ dir ], function( er, data ) {
                // 失败了
                // er == { [Error: publish fail] code: 'EPUBLISHCONFLICT', pkgid: 'my-test@0.0.1' }
                if ( er ) {
                    console.log( 'code = %s, pkgid = %s', er.code, er.pkgid );
                }
                flag = true;
                runs(function(){
                });
            });
        });
    });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
