/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * config.spec.js ~ 2014/03/03 20:26:32
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var yaml = require( 'js-yaml' );
var path = require( 'path' );
var fs = require( 'fs' );

var base = require( '../base/base' );

describe('yaml', function(){
    it('default', function(){
        var content = fs.readFileSync( path.join( __dirname, '..', 'config.yml'), 'utf-8' );
        var config = yaml.safeLoad( content );

        expect( config.redis ).not.toBe( undefined );
        expect( config.repos ).not.toBe( undefined );
        expect( config.npm['https-proxy'] ).not.toBe( undefined );

        var port = base.getConfig( 'redis.port' );
        var host = base.getConfig( 'redis.host' );
        expect( port ).toBeGreaterThan( 10 );
        expect( host ).toBe( '127.0.0.1' );
    });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
