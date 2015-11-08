var Helper = require('../Helper.js');

/*

 === DPT - Depth of water ===

 ------------------------------------------------------------------------------
 *******1   2   3
 *******|   |   |
 $--DPT,x.x,x.x*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:

 1. Depth, meters
 2. Offset from transducer,
 positive means distance from tansducer to water line
 negative means distance from transducer to keel
 3. Checksum
 */

exports.Decoder = function (talker) {
    this.talker = talker;
    this.talker_type_id = 'DPT';
    this.talker_type_desc = 'Depth of Water';
    this.parse = function (tokens) {
        var result;
        var i;
        if (tokens.length < 2) {
            throw new Error('MTW : not enough tokens');
        }

        // trim whitespace
        // some parsers may not want the tokens trimmed so the individual parser has to do it if applicable
        for (i = 0; i < tokens.length; ++i) {
            tokens[i] = tokens[i].trim();
        }


        result = {
            id: tokens[0].substr(1),
            depth: Helper.parseFloatX(tokens[1]),
            offset: Helper.parseFloatX(tokens[2])
        }
        return result;
    };
};
