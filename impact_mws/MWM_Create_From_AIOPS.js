Log("-> MWM_Create_From_AIOPS...");

log(3, "full json is " + full_json_input);
JsonObject = ParseJSON(full_json_input);
resource = JsonObject.resource;

Log("startTime: " + startTime);
Log("endTime: " + endTime);
Log("resource: " + resource);

// Logging initial values
Log(3, "\n\n\n\n\n");

@onetstart = startTime;
@onetend = endTime; 

@timezone = "CET";
 
Log(3, "Current epoch time is: " + GetDate());
Log(3, "Values from Browser: ");

Log(3, "Window start: " + @onetstart);
Log(3, "t1: " + @t1);

// 2009-08-10 09:38:05

Log(3, "Window end: " + @onetend);
//2009-08-13 09:38:11

Log(3, "timezone is: " + @timezone);
//CST
//Log(3, "dst is: " + @dst); // 0 (not checked) or 1 (checked)
//onetstart = @onetstart;
/*
dstString = "";
If (@dst = 1) {
    dstString = "Daylight Savings";
}
*/

// Tweaking times

// FUNCTIONS:

function escapeUserName(escapedUserName) {
  escapedUserName= Replace(escapedUserName, "\'", "''" ); 
  Log(3, "Escaping username=" + escapedUserName); 
}

function getDSTOffset(TZ, calendar, offset) {

    myTZ=TZ; 
    if (TZ = "MST") {
        myTZ="US/Mountain";
    } elseif (TZ="EST") {
        myTZ="US/Eastern";
    } elseif (TZ="CST") {
        myTZ="US/Central";
    } elseif (TZ="PST") {
        myTZ="US/Pacific";
    } elseif (TZ="PRT") {
        myTZ="America/Goose_Bay";
    } elseif (TZ="MIT") {
        myTZ="Pacific/Midway";
    }  
    
    timeZone=javacall("java.util.TimeZone", null, "getTimeZone",{myTZ}); 
    log(3, "getDSTOffset: timezone = " + timeZone); 
    date = javacall(null, calendar, "getTime", {});
    log(3, "getDSTOffset: date = " + date);
    
    isDST=javacall(null, timeZone, "inDaylightTime", {date});
    log(3, "getDSTOffset: isDST = " + isDST);

    if (isDST) {
      offset = javacall(null, timeZone, "getDSTSavings", {}) / 1000;
    } else {
      offset = 0;
    }      
}

function getCalendarInt(calendarField, calendarFieldInt, calendar) {
    Log(3, "Determining CalendarInt for string " + calendarField);
    calendarFieldInt = GetFieldValue(null, calendar, calendarField);
    // working example
    // DOWInt = GetFieldValue(null, calendar, "DAY_OF_WEEK");
    Log(3, "Int for calendar field: " + calendarField + " " + calendarFieldInt);
}

function setCalendarField(calendarField, calendarFieldValue, calendar) {
    Log(3, "Setting value of field: " + calendarField + " to: " + calendarFieldValue);
    getCalendarInt(calendarField, calendarFieldInt, calendar);
    JavaCall(null, calendar, "set", {calendarFieldInt, calendarFieldValue});
    // Confirmation
    newValue = JavaCall(null, calendar, "get", { calendarFieldInt });
    Log(3, "Value of: " + calendarField + " changed to: " + newValue);
}

function setCalendarFields(fieldsArray, valuesArray, calendar) {
    Log(2, "Function setCalendarFields");
    Log(3, "Setting value of fields: " + fieldsArray + " to: " + valuesArray);
    n = Length(fieldsArray)-1;
    While (n >= 0) {
        setCalendarField(fieldsArray[n], valuesArray[n], calendar);
        /***
        Log(3, "After setting " + fieldsArray[n] + ".........................");
        xCalendar = JavaCall(null, calendar, "toString", {});
        Log(3, "Calendar is " + xCalendar);
        ***/
        n = n - 1;
    }
}

function toInt(stringArray, intArray) {
    intArray = {};
    n = 0;
    While (n < Length(stringArray)) {
        intArray = intArray + Int(stringArray[n]);
        n = n + 1;
    }
}

function breakUpTimeString(timeString, valuesArray) {
    // example: 2009-08-10 09:38:05
    split1 = Split(timeString, " ");
    yyyymmdd = Split(split1[0], "-");
    hhmmss = Split(split1[1], ":");
    toInt(yyyymmdd, yyyymmddINT);
    toInt(hhmmss, hhmmssINT);

    // JANUARY IS 0 so MM = MM - 1
    yyyymmddINT[1] = yyyymmddINT[1] - 1;
    valuesArray = yyyymmddINT + hhmmssINT;
    Log(3, "Date values broken into array are: " + valuesArray);
}

function getEpoch(timeString, calendar, epoch) {
    // Fields for calendar
    calendarFields = {"YEAR", "MONTH", "DAY_OF_MONTH", "HOUR_OF_DAY", "MINUTE", "SECOND"};
    breakUpTimeString(timeString, timeValuesArray);
    setCalendarFields(calendarFields, timeValuesArray, calendar);
    epoch = JavaCall(null, calendar, "getTimeInMillis", {});
    epoch = Int(epoch / 1000);
    Log(3, "epoch time for " + timeString + " is " + epoch);
    getCalendarInt("DST_OFFSET", calendarFieldInt, calendar);
    javacall(null, calendar, "set", {calendarFieldInt, 0});
    log(3, "calendar = " + calendar);
    epoch = javacall(null, calendar, "getTimeInMillis", {});
    epoch = int(epoch / 1000);
 log(3, "epoch time for " + timeString + " is " + epoch);
}

function jMadrox (windowObj, boo) {
    // Checks for duplicate windows
    Log(2, "Checking for duplicate windows");
    Log(3, "Window Object: " + windowObj);
    boo = false;
    If (windowObj.wintype = 1) {
        longFilter = "WINTYPE = 1";
        longFilter = longFilter + " AND FILTERSTAT = '" + windowObj.filterstat + "'";
        longFilter = longFilter + " AND EOT_STARTTIME = " +  windowObj.eot_starttime;
        longFilter = longFilter + " AND EOT_ENDTIME = " + windowObj.eot_endtime;
        longFilter = longFilter + " AND TIMEZONE = '" + windowObj.timezone + "'";
        dup = GetByFilter('mm_windows', longFilter, false);
        If (Length(dup) > 0) {
            boo = true;
        }
    }
    If (windowObj.wintype = 2) {
        longFilter = "WINTYPE = 2";
        longFilter = longFilter + " AND FILTERSTAT = '" + windowObj.filterstat + "'";
        longFilter = longFilter + " AND R_STARTTIME = '" +  windowObj.r_starttime + "'";
        longFilter = longFilter + " AND R_ENDTIME =  '" + windowObj.r_endtime + "'";
        longFilter = longFilter + " AND TIMEZONE = '" + windowObj.timezone + "'";
        longFilter = longFilter + " AND DAYSOFWEEK = '" + windowObj.daysofweek + "'";
        dup = GetByFilter('mm_windows', longFilter, false);
        If (Length(dup) > 0) {
            boo = true;
        }
    }
    If (windowObj.wintype = 3) {
        longFilter = "WINTYPE = 3";
        longFilter = longFilter + " AND FILTERSTAT = '" + windowObj.filterstat + "'";
        longFilter = longFilter + " AND R_STARTTIME = '" +  windowObj.r_starttime + "'";
        longFilter = longFilter + " AND R_ENDTIME = '" + windowObj.r_endtime + "'";
        longFilter = longFilter + " AND TIMEZONE = '" + windowObj.timezone + "'";
        longFilter = longFilter + " AND DAYSOFMONTH = '" + windowObj.daysofmonth + "'";
        dup = GetByFilter('mm_windows', longFilter, false);
        If (Length(dup) > 0) {
            boo = true;
        }
    }
    If (windowObj.wintype = 4) {
        longFilter = "WINTYPE = 4";
        longFilter = longFilter + " AND FILTERSTAT = '" + windowObj.filterstat + "'";
        longFilter = longFilter + " AND R_STARTTIME = '" +  windowObj.r_starttime + "'";
        longFilter = longFilter + " AND R_ENDTIME = '" + windowObj.r_endtime + "'";
        longFilter = longFilter + " AND TIMEZONE = '" + windowObj.timezone + "'";
        longFilter = longFilter + " AND NWEEKDAYOFMONTH = '" + windowObj.nweekdayofmonth + "'";
        dup = GetByFilter('mm_windows', longFilter, false);
        If (Length(dup) > 0) {
            boo = true;
        }
    }
}

// Convert start and end times to gmt Epoch time:
// ==============================================
// Create a calendar
Log(3, "Creating a calendar for time zone: " + @timezone);

// Create a time zone object
if (@timezone = "MIT"){
  timeZone = JavaCall("java.util.TimeZone", null, "getTimeZone", {"Pacific/Midway"});
} else {
  timeZone = JavaCall("java.util.TimeZone", null, "getTimeZone", {@timezone});
}

// Create a calendar object
calendar = JavaCall("java.util.Calendar", null, "getInstance", {});
/***
newCalendar = JavaCall(null, calendar, "toString", {});
Log(3, "New calendar is " + newCalendar);
***/

// Tweak calendar to reflect given time zone
JavaCall(null, calendar, "setTimeZone", { timeZone });
/***
TZCalendar = JavaCall(null, calendar, "toString", {});
Log(3, "After changing time zone, calendar is " + TZCalendar);
***/

// Start time
/***
Replace this:
onetime_start = @onetstart + " " + @timezone;
onetime_start = ParseDate(onetime_start, "yyyy-MM-dd HH:mm:ss z");
***/

getEpoch(@onetstart, calendar, onetime_start);
getDSTOffset(@timezone, calendar, offset);

Log(3, "Timezone = " + @timezone + " offset = " + offset);

onetime_start = onetime_start - offset;

/***
If (@dst == 1) {
    // Subtracting an hour if dst
    Log(3, "Subtracting an hour for DST");
    onetime_start = onetime_start - (1 * 60 * 60); // Convert hour to seconds
}
***/

startCalendar = JavaCall(null, calendar, "toString", {});
Log(3, "Start time calendar is " + startCalendar);
Log(3, "Epoch start time from browser: [" + onetime_start + "]");

// End time

/*** replace this
onetime_end = @onetend + " " + @timezone;
onetime_end = ParseDate(onetime_end, "yyyy-MM-dd HH:mm:ss z");
***/

calendar = JavaCall("java.util.Calendar", null, "getInstance", {});

// Tweak calendar to reflect given time zone
JavaCall(null, calendar, "setTimeZone", { timeZone });

getEpoch(@onetend, calendar, onetime_end);
getDSTOffset(@timezone, calendar, offset); 

Log(3, "Timezone = " + @timezone + " offset = " + offset);

onetime_end = onetime_end - offset;

/***
If (@dst == 1) {
    // Subtracting an hour if dst
    Log(3, "Subtracting an hour for DST");
    onetime_end = onetime_end - (1 * 60 * 60); // Convert hour to seconds
}
***/

endCalendar = JavaCall(null, calendar, "toString", {});
Log(3, "End time calendar is " + endCalendar);

Log(3, "Epoch end time from browser: [" + onetime_end + "]");

// Convert start and end times to strings for storage
onetime_start = String(onetime_start);
onetime_end = String(onetime_end);


// Now build the filter statement
// ==============================

myfilter = '(Identifier="' + resource + '")';
Log(3, "myfilter: " + myfilter);

// Now build the descriptions statement
// ====================================

 
request = "SELECT COUNT(*) AS ROWCOUNT FROM IMPACT.MM_WINDOWS WHERE (WINTYPE = 1)";
result = DirectSQL('ImpactDB', request, false);
count = Replace(result[0], "ROWCOUNT = ", "");
mwm_desc = "MW" + count;
 
// Now Perform insert
// ===================

// Check for dups
window = NewObject();
window.wintype = 1;
window.filterstat = myfilter;
window.eot_starttime = onetime_start;
window.eot_endtime = onetime_end;
window.timezone = @timezone;
window.mwm_descriptions = mwm_desc;
mwIdToEdit = JsonObject.mwIdToEdit;
Log(3, "MwIdToEdit is " + mwIdToEdit); 
bool = false; 
if (mwIdToEdit = NULL) { 
 MWM_Util.jMadrox(window, bool); 
}
Log(3, "bool is " + bool); 
If (bool == false) {
    // Perform insert
    myinsert = "INSERT INTO IMPACT.MM_WINDOWS (FILTERSTAT, WINTYPE, OT_STARTTIME, EOT_STARTTIME, OT_ENDTIME, EOT_ENDTIME, TIMEZONE, MWM_DESCRIPTIONS)";
    myinsert = myinsert + " VALUES ('" + myfilter + "', 1, '" + @onetstart + "', " + onetime_start + ", '" + @onetend + "', " + onetime_end + ", '";
    myinsert = myinsert + @timezone + "', '" + mwm_desc + "')";
    if (mwIdToEdit <> NULL) {
      rowToEditSelect = "Select * from IMPACT.MM_WINDOWS where MWID = " + mwIdToEdit;
      rowToEdit = DirectSQL('ImpactDB', rowToEditSelect, false);
      myinsert = "UPDATE IMPACT.MM_WINDOWS set FILTERSTAT = '" + myfilter + "', WINTYPE = 1 , OT_STARTTIME = '" + @onetstart + "', EOT_STARTTIME = " + onetime_start + ", OT_ENDTIME = '" + @onetend + "', EOT_ENDTIME = " + onetime_end + ", TIMEZONE = '" + @timezone + "', MWM_DESCRIPTIONS = '" + mwm_desc + "' where MWID = " + mwIdToEdit;
    }
    Log(3, "Insert/update is " + myinsert);
    DirectSQL('ImpactDB', myinsert, false); 
    if (mwIdToEdit <> NULL) {
       // clear SuppressEscl in all events for the old filter
       Log(2, "Original filter was " + rowToEdit[0].FILTERSTAT); 
        overlap = false;  
       MWM_Util.checkForActiveMWMWithFilter(rowToEdit[0].FILTERSTAT, overlap);  
       if (! overlap) {
         Log(2, "Clearing fields in Objectserver with filter " + rowToEdit[0].FILTERSTAT); 
         sq_filter = Replace(rowToEdit[0].FILTERSTAT, "\"", "'"); 
         updateSql = "UPDATE alerts.status set SuppressEscl = 0 where SuppressEscl = 6 AND " + sq_filter;
         Log(3, "UpdateSql is " + updateSql); 
         DirectSQL('defaultobjectserver', updateSql, false);
       } else {
         Log(2, "Not Clearing fields in Objectserver");
       }
    } else {
       // Inserting a new MWM so insert username info in mm_extrainfo table  
       maxIdQuery = "SELECT MAX(MWID) AS MAXID FROM IMPACT.MM_WINDOWS";
       Result = DirectSQL('ImpactDB', maxIdQuery, false);
       Log(3, "Result is " + Result); 
       ResultString = "" + Result; 
       maxId = rextract(String(ResultString), '.*= (\d+)');
       Log(3, "MaxId is " + maxId + " and userName is " + JsonObject.userName);
       escapedUserName = JsonObject.userName;
       escapeUserName(escapedUserName);
       userNameInsert = "INSERT INTO IMPACT.MM_EXTRAINFO (MWID, USERNAME) values (" + maxId + ", '" +  escapedUserName + "')";
       Log(3, "userNameInsert is " + userNameInsert); 
       DirectSQL('ImpactDB', userNameInsert, false); 
    } 
 
}

Log("<- MWM_Create_From_AIOPS...");