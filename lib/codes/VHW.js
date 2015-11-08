
var Helper = require('../Helper.js');

/*
 === VHW – Water Speed and Heading ===
The compass heading to which the vessel is currently pointing, and the speed of the vessel through the water.
 ------------------------------------------------------------------------------
 *******1   2   3 4 5   6   7
 *******|   |   | | |   |   |
 $--VHW,x.x,M,x.x,T,x.x,x.x*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:

 1. Heading degrees true
 2. M = magnetic, T = true
 3. Heading degrees magnetic 
 4. M = magnetic, T = true
 5. Speed, Knots
 6. Speed KMH
 7. checksum
 */

exports.Decoder = function(talker) {
    this.talker = talker;
    this.talker_type_id = 'VHW';
    this.talker_type_desc = 'Water, Speed and Heading';
    this._reference = function(char){
        switch(char){
            case 'T' : return 'true'
            case 'M' : return 'magnetic'
        }  
    };

    this.parse = function (tokens) {
        if (tokens.length < 7) {
            throw new Error('VHW : not enough tokens');
        }

        return {
            id: tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            heading1: Helper.parseFloatX(tokens[1]),
            reference1:this._reference(tokens[2]),
            heading2: Helper.parseFloatX(tokens[3]),
            reference2:this._reference(tokens[4]),
            sow_knots: Helper.parseFloatX(tokens[5]),
            sow_kph: Helper.parseFloatX(tokens[6])
        }
    };
};
