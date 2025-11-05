Log("-> MWM_Query...");

var request = "SELECT * FROM IMPACT.MM_WINDOWS WHERE (WINTYPE = 1)";
var mws = DirectSQL('ImpactDB', request, false);

for (var i = 0; i < mws.length; i++) {
    var mw = mws[i];

    var encodedString = mw.MWM_DESCRIPTIONS;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = '';
    for (var j = 0; j < encodedString.length; j += 4) {
        var encoded1 = chars.indexOf(encodedString.charAt(j));
        var encoded2 = chars.indexOf(encodedString.charAt(j + 1));
        var encoded3 = chars.indexOf(encodedString.charAt(j + 2));
        var encoded4 = chars.indexOf(encodedString.charAt(j + 3));
        var decoded1 = (encoded1 << 2) | (encoded2 >> 4);
        var decoded2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        var decoded3 = ((encoded3 & 3) << 6) | encoded4;
        if (encoded2 != 64) output += String.fromCharCode(decoded1);
        if (encoded3 != 64) output += String.fromCharCode(decoded2);
        if (encoded4 != 64) output += String.fromCharCode(decoded3);
    }

    var description = JSON.parse(decodeURIComponent(output)).description;
    var startTime = new Date(mw.EOT_STARTTIME * 1000).toISOString();
    var endTime = new Date(mw.EOT_ENDTIME * 1000).toISOString();
    var resource = mw.FILTERSTAT;
    var match = resource.match(/Identifier\s*=\s*"([^"]+)"/);
    if (match) {
       resource = match[1];
    }

    var summary = "MW " + description + " from " + startTime + " to " + endTime + " on " + resource + " created";
    Log("-- MWM_Query " + summary);
}

Log("<- QMWM_Query.");