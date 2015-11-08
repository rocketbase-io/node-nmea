var Helper = require('../Helper.js');

/*

 === MTW - Water Temperature ===

 ------------------------------------------------------------------------------
 *******1   2 3
 *******|   | |
 $--MTW,x.x,C*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:

 1. Degrees
 2. Unit of Measurement, Celcius
 3. Checksum
 */

exports.Decoder = function (talker) {
    this.talker = talker;
    this.talker_type_id = 'MTW';
    this.talker_type_desc = 'Water Temperature';
    this.parse = function (tokens) {
        var mtw;
        var i;
        if (tokens.length < 2) {
            throw new Error('MTW : not enough tokens');
        }

        // trim whitespace
        // some parsers may not want the tokens trimmed so the individual parser has to do it if applicable
        for (i = 0; i < tokens.length; ++i) {
            tokens[i] = tokens[i].trim();
        }


        mtw = {
            id: tokens[0].substr(1),
            degree: Helper.parseFloatX(tokens[1]),
            unit: tokens[2]
        }
        return mtw;
    };
};
