var Helper = require("../Helper.js");

/*
 === HDG - Heading, Deviation and Variation ===

 ------------------------------------------------------------------------------
 ******* 1   2  3 4   5  6  
 ******* |   |  | |   |  |  
 $--HDG,x.x,x.x,x,x*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:

1. Magnetic sensor heading, degrees, to the nearest 0.1 degree.
2. Magnetic deviation, degrees east or west, to the nearest 0.1 degree.
3. E if field 2 is degrees East W if field 2 is degrees West
4. Magnetic variation, degrees east or west, to the nearest 0.1 degree.
5. E if field 4 is degrees East W if field 4 is degrees West
6. Checksum

*/

exports.Decoder = function(talker) {
    this.talker = talker;
    this.talker_type_id = "HDG";
    this.talker_type_desc = "Heading, Deviation and Variation";

    this.parse = function (tokens) {
        if (tokens.length < 6) {
            throw new Error('DBT : not enough tokens');
        }
        return {
            id: tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            heading: Helper.parseFloatX(tokens[1]),
            deviation: Helper.parseFloatX(tokens[2]),
            deviation_direction: tokens[3],
            variation: Helper.parseFloatX(tokens[4]),
            variation_direction: tokens[5]
        }
    };
};