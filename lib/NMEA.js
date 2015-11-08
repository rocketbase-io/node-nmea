/** NMEA-0183 Parser-Encoder */

var RMC = require('./codes/RMC.js');
var GLL = require('./codes/GLL.js');
var GGA = require('./codes/GGA.js');
var GSV = require('./codes/GSV.js');
var GSA = require('./codes/GSA.js');
var VTG = require('./codes/VTG.js');
var MWV = require('./codes/MWV.js');
var DBT = require('./codes/DBT.js');
var HDG = require('./codes/HDG.js');
var VHW = require('./codes/VHW.js');
var DPT = require('./codes/DPT.js');
var MTW = require('./codes/MTW.js');


var Helper = require('./Helper.js');

/** NMEA module */
var NMEA = ( function () {

    'use strict';

    /** NMEA public API */
    var nmea = {};

    /** private module variables */
    var m_parserList = [];
    var m_encoderList = [];
    var m_errorHandler = null;

    // =============================================
    // public API functions
    // =============================================

    // function to add parsers
    nmea.addParser = function (sentenceParser) {
        if (sentenceParser === null) {
            this.error('invalid sentence parser : null');
            return;
        }
        m_parserList.push(sentenceParser);
    };

    /** function to add encoders */
    nmea.addEncoder = function (sentenceEncoder) {
        if (sentenceEncoder === null) {
            this.error('invalid  sentence encoder : null');
            return;
        }
        m_encoderList.push(sentenceEncoder);
    };

    /** master parser function
     * handle string tokenizing, find the associated parser and call it if there is one
     */
    nmea.parse = function (sentence) {
        var i;
        var tokens;
        var id;
        var talker;
        var result;
        var checksum;
        var status;
        if (( typeof sentence) !== 'string') {
            this.error('sentence is not a string');
            return null;
        }

        // find the checksum and remove it prior to tokenizing
        checksum = sentence.split('*');
        if (checksum.length === 2) {
            // there is a checksum
            sentence = checksum[0];
            checksum = checksum[1];
        } else {
            checksum = null;
        }

        tokens = sentence.split(',');
        if (tokens.length < 1) {
            this.error('must at least have a header');
            return null;
        }

        // design decision: the 5 character header field determines the sentence type
        // this field could be handled in two different ways
        // 1. split it into the 2 character 'talker id' + 3 character 'sentence id' e.g. $GPGGA : talker=GP id=GGA
        //    this would leave more room for customization of proprietary talkers that give standard sentences,
        //    but it would be more complex to deal with
        // 2. handle it as a single 5 character id string
        //    much simpler.  for a proprietary talker + standard string, just instantiate the parser twice
        // This version implements approach #1 was approach #2 before
        talker = tokens[0].substring(1, 3);
        id = tokens[0].substring(3);
        if (talker.length !== 2) {
            this.error('talker must be exactly 2 characters');
            return null;
        }
        if (id.length !== 3) {
            this.error('id must be exactly 3 characters');
            return null;
        }

        // checksum format = *HH where HH are hex digits that convert to a 1 byte value
        if (checksum !== null) {
            // there is a checksum, replace the last token and verify the checksum
            status = Helper.verifyChecksum(sentence, checksum);
            if (status === false) {
                this.error('checksum mismatch');
                return null;
            }
        }

        // try all id's until one matches
        result = null;

        var parse = function (tokens) {
            try {
                return m_parserList[i].parse(tokens);
            } catch (err) {
                nmea.error(err.message);
            }
        }
        var foundSpecific = false;

        for (i = 0; i < m_parserList.length; ++i) {
            if (talker === m_parserList[i].talker && id === m_parserList[i].talker_type_id) {
                result = parse(tokens);
                foundSpecific = true;
                break;
            }
        }
        if (!foundSpecific) {
            for (i = 0; i < m_parserList.length; ++i) {
                if (id === m_parserList[i].talker_type_id) {
                    result = parse(tokens);
                    break;
                }
            }
        }
        if (result === null) {
            this.error('sentence id not found');
        }
        return result;
    };

    /** master encoder
     * find the specified id encoder and give it the data to encode. return the result;
     */
    nmea.encode = function (id, data) {
        var i;
        var result;
        var cks;
        result = null;
        for (i = 0; i < m_encoderList.length; ++i) {
            if (id === m_encoderList[i].id) {
                try {
                    result = m_encoderList[i].encode(id, data);
                } catch (err) {
                    nmea.error(err.message);
                }
            }
        }
        if (result === null) {
            this.error('sentence id not found');
            return null;
        }

        // add the checksum
        cks = Helper.computeChecksum(result);
        result = result + cks;

        return result;
    };

    /** public function to print/handle errors */
    nmea.error = function (msg) {
        if (m_errorHandler !== null) {
            // call the existing handler
            m_errorHandler(msg);
        }
    };

    /** public function to  set error handler */
    nmea.setErrorHandler = function (e) {
        m_errorHandler = e;
    };

    // =======================================================
    // initialize the handlers
    // =======================================================

    // add the standard error handler
    nmea.setErrorHandler(function (e) {
        throw new Error('ERROR:' + e);
    });

    // add the standard decoders
    nmea.addParser(new GGA.Decoder());
    nmea.addParser(new RMC.Decoder());
    nmea.addParser(new GSV.Decoder());
    nmea.addParser(new GSA.Decoder());
    nmea.addParser(new VTG.Decoder());
    nmea.addParser(new MWV.Decoder());
    nmea.addParser(new DBT.Decoder());
    nmea.addParser(new GLL.Decoder());
    nmea.addParser(new HDG.Decoder());
    nmea.addParser(new VHW.Decoder());
    nmea.addParser(new DPT.Decoder());
    nmea.addParser(new MTW.Decoder());
    // add the standard encoders
    nmea.addEncoder(new GGA.Encoder('GP'));
    nmea.addEncoder(new RMC.Encoder('GP'));
    nmea.addEncoder(new DBT.Encoder('CM'));
    nmea.addEncoder(new MWV.Encoder('CM'));

    // return the module object
    return nmea;
}());

module.exports = NMEA;
