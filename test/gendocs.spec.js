/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * gendocs.spec.js ~ 2014/03/03 18:02:46
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 测试base.gendocs的接口
 **/
var base = require( '../base/base' );
var path = require( 'path' );
var fs = require( 'fs' );

describe('base', function(){
    xit('gendocs', function(){
        var pkgloc = '/Users/leeight/local/leeight.github.com/esui';
        var body = {
            ref: '3.1.2-dev',
            repository: {
                name: 'esui'
            }
        }

        var d = base.gendocs( pkgloc, body );

        waitsFor(function(){ return d.state !== 'pending' }, 'x', 60 * 1000);

        runs(function(){
            expect( d.state ).toBe( 'resolved' );
        });
    });
});
 





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
