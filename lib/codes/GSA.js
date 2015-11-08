var Helper = require('../Helper.js');
/*
 === GSA - GPS DOP and active satellites ===

 ------------------------------------------------------------------------------
 *******1 2 3 4                      14 15  16  17  18
 *******| | | |                       |  |   |   |  |
 $--GSA,a,a,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x.x,x.x,x.x*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:

 1. Selection mode
 2. Mode
 3. ID of 1st satellite used for fix
 4. ID of 2nd satellite used for fix
 ...
 14. ID of 12th satellite used for fix
 15. PDOP
 16. HDOP
 17. VDOP
 18. Checksum
 */
exports.Decoder = function (talker) {
    this.talker = talker;
    this.talker_type_id = 'GSA';
    this.talker_type_desc = 'Global Navigation Satellite Systems, Dilution of Precision, and Active Satellites';

    this.parse = function (tokens) {
        var gsa;
        var i;
        if (tokens.length < 17) {
            throw new Error('GSA : not enough tokens');
        }

        // trim whitespace
        // some parsers may not want the tokens trimmed so the individual parser has to do it if applicable
        for (i = 0; i < tokens.length; ++i) {
            tokens[i] = tokens[i].trim();
        }


        gsa = {
            id: tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            mode: tokens[1],
            fix: tokens[2],
            sat: [],
            pdop: Helper.parseFloatX(tokens[15]),
            hdop: Helper.parseFloatX(tokens[16]),
            vdop: Helper.parseFloatX(tokens[17])
        };

        // extract up to 4 sets of sat data
        for (i = 3; i < 15; i += 1) {
            if (tokens[i] !== '') {
                gsa.sat.push(tokens[i]);
            }
        }
        return gsa;
    };
};