/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * workers.spec.js ~ 2014/03/04 11:17:05
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var Worker = require( '../base/Worker' );

Worker.add( require( '../workers/create-tag-handler' ) );
Worker.add( require( '../workers/bypass-handler' ) );

describe('workers', function(){
    it('default', function(){
        var reply = JSON.stringify( {
            headers: {
                'x-github-event': 'create'
            },
            body: {
                'ref_type': 'tag'
            }
        } );

        var workers = Worker.create( reply );

        expect( workers.length ).toBe( 2 );
    });
});



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
