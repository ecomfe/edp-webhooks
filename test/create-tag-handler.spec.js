/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * test/create-tag-handler.spec.js ~ 2014/03/02 21:07:24
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 测试create-tag-handler.js的功能
 **/
var fs = require( 'fs' );
var path = require( 'path' );

var CreateTagHandler = require( '../workers/create-tag-handler' );

describe('create-tag-handler', function(){
    xit('default', function(){
        var headers = {
            'x-github-event': 'create'
        };
        var body = {
            ref: '0.0.20',
            ref_type: 'tag',
            repository: {
                name: 'node.hi',
                full_name: 'leeight/node.hi'
            }
        };

        var worker = new CreateTagHandler( headers, body );
        var def = worker.start();

        waitsFor(function(){ return def.state !== 'pending' }, 'x', 10 * 1000);

        runs(function(){
            var parentDir = path.join( __dirname, '..', 'data', 'github.com', body.repository.full_name );
            var zipfile = path.join( parentDir, body.ref + '.zip' );
            var dirname = path.join( parentDir, body.ref, 'node.hi-' + body.ref );

            expect( fs.existsSync( zipfile ) ).toBe( true );
            expect( fs.existsSync( dirname ) ).toBe( true );
        });
    });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
