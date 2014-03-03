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
    it("publish", function(){
        var flag = false;
        waitsFor(function(){ return flag; });

        npm.load( base.getNpmConfig(), function( er ) {
            if ( er ) throw er;
            var dir = path.join( __dirname, '..', 'data', 'github.com', 'leeight', 'node.hi', '0.0.6', 'node.hi-0.0.6' );

            var d = base.publish( dir );
            d.fail(function( er ){
                console.log( er );
            }).ensure(function(){
                flag = true;
            });

            runs(function(){
                expect( d.state ).not.toBe( 'pending' );
            });
        });
    });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
