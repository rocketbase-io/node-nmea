var Helper = require("../Helper.js");

/*
 ------------------------------------------------------------------------------
 *******1   2 3   4 5
 *******|   | |   | |
 $--MWV,x.x,a,x.x,a,a*hh<CR><LF>
 ------------------------------------------------------------------------------

 Field Number:

 1. Wind Angle, 0 to 360 degrees
 2. Reference, R = Relative, T = True
 3. Wind Speed
 4. Wind Speed Units, K/M/N
 5. Status, A = Data Valid
 6. Checksum
 */

exports.Decoder = function(talker) {
    this.talker = talker;
    this.talker_type_id = "MWV";
    this.talker_type_desc = "Wind Speed and Angle";
    this._unit = function(char){
          switch(char){
            case "N" : return "knots"
            case "M" : return "meters per second"
            case "K" : return "kilometers per hour"
        }
    };
    this._reference = function(char){
        switch(char){
            case "T" : return "true"
            case "R" : return "relative"
        }  
    };
    this._status = function(char){
        switch(char){
            case "A" : return "data valid"
            case "V" : return "data not valid"
        }
    };

    this.parse = function (tokens) {
        var i;
        if (tokens.length < 5) {
            throw new Error('MWV : not enough tokens');
        }

        // trim whitespace
        // some parsers may not want the tokens trimmed so the individual parser has to do it if applicable
        for (i = 0; i < tokens.length; ++i) {
            tokens[i] = tokens[i].trim();
        }

        return {
            id: tokens[0].substr(1),
            talker_type_id: this.talker_type_id,
            talker_type_desc: this.talker_type_desc,
            apparent_wind_angle: Helper.parseFloatX(tokens[1]),
            reference: this._reference(tokens[2]),
            apparent_wind_speed: Helper.parseFloatX(tokens[3]),
            units: this._unit(tokens[4]),
            status: this._status(tokens[5])
        }
    };
};
