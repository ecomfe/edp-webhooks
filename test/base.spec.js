/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test/base.spec.js ~ 2014/03/02 13:31:42
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 测试base的功能
 **/
var base = require( '../base/base' );
var path = require( 'path' );
var fs = require( 'fs' );

describe('base', function(){
    it('download', function(){
        // 302是不支持的...
        var url = 'https://codeload.github.com/leeight/node.hi/zip/0.0.6';
        var file = path.join( __dirname, path.basename( url ) );
        var def = base.download( url, file );

        waitsFor(function(){ return def.state !== 'pending' });

        runs(function(){
            expect( fs.existsSync( file ) ).toBe( true );
            expect( base.md5( fs.readFileSync( file ) ) ).toBe( 'cff2b5b643e972a5c60aada9ea96f7c0' );
            fs.unlinkSync( file );
        });
    });

    it('unzip', function(){
        var zipfile = path.join( __dirname, 'test.zip' );
        var target = path.join( __dirname, 'tmp', 'test' );
        base.unzip( zipfile, target );

        expect( fs.existsSync( path.join( target ) ) ).toBe( true );
        expect( fs.existsSync( path.join( target, 'Makefile' ) ) ).toBe( true );
        expect( fs.existsSync( path.join( target, 'curl.sh' ) ) ).toBe( true );
    });
});





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
