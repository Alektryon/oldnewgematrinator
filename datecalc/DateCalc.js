var wDate = []
var dNum = []
var dSum = []
var numStr = []
var sumStr = []
var u_inp = []
var CountDates = 2
var inpTypes = ["Year", "Month", "Week", "Day"] //, "Hour", "Min", "Sec"]
var yearDiff, monthDiff, dayDiff, hourDiff, minDiff, secDiff, yearDays
var mDiff = []
var weekDiff = []
var oArr = {}
var combArr = []

//Called when the page loads
function Page_Launch() {
	//Header_Load()
	BuildTable()
	Set_Options()
	AddDefaults()
	Build_Num()
	Pop_DateStrings()
	Write_DateStrings()
	Set_Durations()
	DurationTable()
}

function leapYear(year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

//This gets called any time the user changes a date field
function Set_Dates(impVal, impNum) {
	Verify_Dates(impVal, impNum)
	PopDates()
	Pop_DateStrings()
	Write_DateStrings()
	Set_Durations()
	DurationTable()
}

function Verify_Dates(impVal, impNum) {
	var yBox, mBox, dBox, yVal, mVal, dVal

	yBox = document.getElementById("Year" + impVal)
	mBox = document.getElementById("Month" + impVal)
	dBox = document.getElementById("Day" + impVal)
	yVal = Number(yBox.value)
	mVal = Number(mBox.value)
	dVal = Number(dBox.value)

	switch (impNum) {
		case "d":
			if (dBox.value !== "") {
				if (dVal == 0) {
					if (mVal == 1) {
						if (yVal == 1) {
							dVal = 1
						} else {
							yVal--; mVal = 12; dVal = 31
						}
					} else {
						mVal--; dVal = MonthMax(mVal, yVal)
					}
				} else {
					if (dVal > MonthMax(mVal, yVal)) {
						if (mVal == 12) {
							if (yVal == 9999) {
								dVal = 31
							} else {
								yVal++; mVal = 1; dVal = 1
							}
						} else {
							mVal++; dVal = 1
						}
					}
				}
			} else {
				dVal == 1
			}
			break;
		case "m":
			if (mBox.value !== "") {
				if (mVal == 13) {
					if (yVal == 9999) {
						mVal = 12
					} else {
						yVal++; mVal = 1
					}
				} else {
					if (mVal == 0) {
						if (yVal == 1) {
							mVal == 1
						} else {
							yVal--; mVal = 12
						}
					} else {
						if (dVal > MonthMax(mVal, yVal)) {dVal = MonthMax(mVal, yVal)}
					}
				}
			} else {
				mVal == 1
			}
			break;
		case "y":
			if (yBox.value !== "") {
				if (yVal == 0) {yVal = 1}
				if (yVal == 10000) {yVal = 9999}
				if (dVal > MonthMax(mVal, yVal)) {dVal = MonthMax(mVal, yVal)}
				break;
			} else {
				yVal == 1
			}
	}

	if (yBox.value !== "") {yBox.value = yVal}
	if (mBox.value !== "") {mBox.value = mVal}
	if (dBox.value !== "") {dBox.value = dVal}
}
function MonthMax(mn, yr) {
	switch (mn) {
		case 1:
			return 31
			break;
		case 2:
			if (((yr % 4 == 0) && (yr % 100 != 0)) || (yr % 400 == 0)) {
				return 29
			} else {
				return 28
			}
			break;
		case 3:
			return 31
			break;
		case 4:
			return 30
			break;
		case 5:
			return 31
			break;
		case 6:
			return 30
			break;
		case 7:
			return 31
			break;
		case 8:
			return 31
			break;
		case 9:
			return 30
			break;
		case 10:
			return 31
			break;
		case 11:
			return 30
			break;
		case 12:
			return 31
			break;
	}
}

//This gets called any time the user clicks a checkbox
function Change_Options() {
	Set_Options()
	Set_Durations()
	DurationTable()
}

//Set user options based on checkboxes
function Set_Options() {
	oArr.Year = document.getElementById("Check_Year").checked
	oArr.Month = document.getElementById("Check_Month").checked
	oArr.Week = document.getElementById("Check_Week").checked
	oArr.Day = document.getElementById("Check_Day").checked
	/*oArr.Hour = document.getElementById("Check_Hour").checked
	oArr.Min = document.getElementById("Check_Min").checked
	oArr.Sec = document.getElementById("Check_Sec").checked
	*/
	oArr.EndInc = document.getElementById("Check_End").checked
}

//Add default values to the Input boxes
function AddDefaults() {
	var x
	var xDate = new Date()
	wDate[1] = new Date(xDate.getFullYear() - 1, xDate.getMonth(), xDate.getDate(), 0, 0, 0)
	wDate[2] = new Date(xDate.getFullYear(), xDate.getMonth(), xDate.getDate(), 0, 0, 0)

	for (x = 1; x < wDate.length; x++) {
		document.getElementById("Month" + x).value = wDate[x].getMonth() + 1
		document.getElementById("Day" + x).value = wDate[x].getDate()
		document.getElementById("Year" + x).value = wDate[x].getFullYear()	
	}
}

//Export HTML code to build the main numerology table
function BuildTable() {
	var q, z
	var tableStr = ""
	var CBoxSpot = document.getElementById("CheckBoxSpot")
	var DurSpot = document.getElementById("DurationSpot")
	var NumSpot = document.getElementById("NumerologySpot")

	for (z = 0; z < inpTypes.length; z++) {
		p = inpTypes[z]
		tableStr += '<input tabindex=' + (z + 14) + ' type="checkbox" id="Check_' + p + '" value="' + p + '" onclick="Change_Options()" checked>' + p + '</input><BR>'
	}
	CBoxSpot.innerHTML = tableStr

	tableStr = '<table><tr><td colspan="2" class="FullDateString"><div id="FDS3"></div></td><td class="Filler"></td><td colspan="2" class="FullDateString"><div id="FDS4"></div></td></tr>'

	for (z = 1; z < 14; z++) {
		tableStr += '<tr>'
		for (q = 1; q < CountDates + 1; q++) {
			tableStr += '<td id="Date' + q + 'Spot' + z + '" class="NumString"></td>'
			tableStr += '<td id="Date' + q + 'Sum' + z + '" class="SumString"></td>'
			if (CountDates > q) {tableStr += '<td class="Filler"></td>'}
		}
		tableStr += '</tr>'
	}

	NumSpot.innerHTML = tableStr + "</table>"
	document.getElementById("Check_Week").checked = false
}

//Assign values to wDate variable
function PopDates() {
	var x, y

	for (y = 1; y < CountDates + 1; y++) {
		for (x = 0; x < inpTypes.length; x++) {
			if (inpTypes[x] !== "Week") {
				if (document.getElementById(inpTypes[x] + y).value !== "") {
					u_inp[x] = document.getElementById(inpTypes[x] + y).value
				} else {
					u_inp[x] = 1
				}
			}
		}
		wDate[y] = new Date(u_inp[0], u_inp[1] - 1, u_inp[3]) //, u_inp[4], u_inp[5], u_inp[6])
	}
}

//Function for pulling a single digit from a date
function DateDigit(impDate, impType, impDigit) {
	var dStr

	switch (impType.toLowerCase()) {
		case "m":
			dStr = String(impDate.getMonth() + 1)
			break;
		case "d":
			dStr = String(impDate.getDate())
			break;
		case "y":
			dStr = String(impDate.getFullYear())
			break;
	}

	if (dStr.length == 1) {
		dStr = "0" + dStr
	}

	if (impDigit > dStr.length) {
		return 0
	} else {
		return Number(dStr.substr(impDigit, 1))
	}
}

//Function for pulling a two-digit number from either half of a year
function YearHalf(impDate, impHalf) {
	var yh = String(impDate.getFullYear())
	if (impHalf == 1) {
		return Number(yh.substr(0, 2))
	} else {
		return Number(yh.substr(2, 2))
	}
}

//Assign document elements to variable arrays
function Build_Num() {
	var x, y

	for (y = 1; y < CountDates + 1; y++) {
			dNum[y] = new Array()
			dSum[y] = new Array()
		for (x = 1; x < 14; x++) {
			dNum[y][x] = document.getElementById("Date" + y + "Spot" + x)
			dSum[y][x] = document.getElementById("Date" + y + "Sum" + x)
		}
	}
}

//Populate arrays with date numerologies and equation sums
function Pop_DateStrings(){
	var y
	var tDate, qDate1, qDate2, dayStart, dayEnd, sColor, eColor
	var rC = "yellow"; lC = "orange"

	for (y = 1; y < CountDates + 1; y++) {
		tDate = wDate[y]
		qDate1 = new Date(tDate.getFullYear() - 1, 11, 31)
		qDate2 = new Date(tDate.getFullYear(), 11, 31)
		numStr[y] = new Array()
		sumStr[y] = new Array()

		dayStart = Math.round((tDate - qDate1) / 86400000)
		dayEnd = Math.round((qDate2 - tDate) / 86400000)

		if (leapYear(tDate.getFullYear()) == true) {
			if (dayStart < 60) {
				sColor = rC; eColor = lC
			} else if (dayStart > 60) {
				sColor = lC; eColor = rC
			} else {
				sColor = rC; eColor = rC
			}
		} else {
			sColor = rC; eColor = rC
		}

		numStr[y][1] = addStr(tDate, "m", 2) + " + " + addStr(tDate, "d", 2) + " + " + addStr(tDate, "y", 2)
		numStr[y][2] = addStr(tDate, "m", 2) + " + " + addStr(tDate, "d", 2) + " + " + addStr(tDate, "y", 1)
		numStr[y][3] = addStr(tDate, "m", 1) + " + " + addStr(tDate, "d", 1) + " + " + addStr(tDate, "y", 1)
		numStr[y][4] = addStr(tDate, "m", 2) + " + " + addStr(tDate, "d", 2) + " + " + addStr(tDate, "y", 2, false)
		numStr[y][5] = addStr(tDate, "m", 1) + " + " + addStr(tDate, "d", 1) + " + " + addStr(tDate, "y", 1, false)
		numStr[y][6] = "Day of Year: (" + monthNames(tDate.getMonth()) + "-" + tDate.getDate() + ")"
		numStr[y][7] = "Days Left in Year: (" + monthNames(tDate.getMonth()) + "-" + tDate.getDate() + ")"
		numStr[y][8] = addStr(tDate, "m", 2) + " + " + addStr(tDate, "d", 2)
		numStr[y][9] = addStr(tDate, "m", 1) + " + " + addStr(tDate, "d", 1) + " + " + addStr(tDate, "y", 2)
		numStr[y][10] = addStr(tDate, "m", 2) + " + " + addStr(tDate, "d", 2) + " + " + addStr(tDate, "y", 1, false)
		numStr[y][11] = addStr(tDate, "m", 1) + " + " + addStr(tDate, "d", 1) + " + " + addStr(tDate, "y", 2, false)
		numStr[y][12] = multiStr(tDate, true, 1)
		numStr[y][13] = multiStr(tDate, false, 1)

		sumStr[y][1] = tDate.getDate() + tDate.getMonth() + 1 + YearHalf(tDate, 1) + YearHalf(tDate, 2)
		sumStr[y][2] = tDate.getDate() + tDate.getMonth() + 1 + DateDigit(tDate, "y", 0) + DateDigit(tDate, "y", 1) + DateDigit(tDate, "y", 2) + DateDigit(tDate, "y", 3)
		sumStr[y][3] = DateDigit(tDate, "m", 0) + DateDigit(tDate, "m", 1) + DateDigit(tDate, "d", 0) + DateDigit(tDate, "d", 1) + DateDigit(tDate, "y", 0) + DateDigit(tDate, "y", 1) + DateDigit(tDate, "y", 2) + DateDigit(tDate, "y", 3)
		sumStr[y][4] = tDate.getDate() + tDate.getMonth() + 1 + YearHalf(tDate, 2)
		sumStr[y][5] = DateDigit(tDate, "m", 0) + DateDigit(tDate, "m", 1) + DateDigit(tDate, "d", 0) + DateDigit(tDate, "d", 1) + DateDigit(tDate, "y", 2) + DateDigit(tDate, "y", 3)
		sumStr[y][6] = '<font style="color: ' + sColor + '">' + dayStart + '</font>'
		sumStr[y][7] = '<font style="color: ' + eColor + '">' + dayEnd + '</font>'
		sumStr[y][8] = tDate.getDate() + tDate.getMonth() + 1
		sumStr[y][9] = DateDigit(tDate, "m", 0) + DateDigit(tDate, "m", 1) + DateDigit(tDate, "d", 0) + DateDigit(tDate, "d", 1) + YearHalf(tDate, 1) + YearHalf(tDate, 2)
		sumStr[y][10] = tDate.getDate() + tDate.getMonth() + 1 + DateDigit(tDate, "y", 2) + DateDigit(tDate, "y", 3)
		sumStr[y][11] = DateDigit(tDate, "m", 0) + DateDigit(tDate, "m", 1) + DateDigit(tDate, "d", 0) + DateDigit(tDate, "d", 1) + YearHalf(tDate, 2)
		sumStr[y][12] = '<font style="color:RGB(179,218,255)">' + multiStr(tDate, true, 2) + '</font>'
		sumStr[y][13] = '<font style="color:RGB(179,218,255)">' + multiStr(tDate, false, 2) + '</font>'
	}
}

//Populate the table with array variables containing equation strings and sums
function Write_DateStrings() {
	var x, y, z
	var fArr = []
	for (z = 1; z < 5; z++) {
		fArr[z] = document.getElementById("FDS" + z)
	}

	for (y = 1; y < CountDates + 1; y++) {
		for (x = 1; x < 14; x++) {
			dNum[y][x].innerHTML = numStr[y][x]
			dSum[y][x].innerHTML = sumStr[y][x]
		}
	}

	fArr[1].innerHTML = showDate(wDate[1])
	fArr[3].innerHTML = showDate(wDate[1], 2)
	fArr[2].innerHTML = showDate(wDate[2])
	fArr[4].innerHTML = showDate(wDate[2], 2)
}

function showDate(impDate, impType = 1) {
	if (impDate.getHours() > 0 || impDate.getMinutes() > 0 || impDate.getSeconds() > 0) {
		if (impType == 1) {return impDate.toLocaleString()} else {return impDate.toDateString().substr(3, 100)}
	} else {
		if (impType == 1) {return impDate.toDateString()} else {return impDate.toDateString().substr(3, 100)}
	}
}

//Function of getting the string for an equation from part of a date
function addStr(impDate, impDMY, impType, FullYear = true) {
	var dStr

	switch (impDMY.toLowerCase()) {
		case "d":
			dStr = String(impDate.getDate())
			break;
		case "m":
			dStr = String(impDate.getMonth() + 1)
			break;
		case "y":
			dStr = String(impDate.getFullYear())
			break;
	}

	switch (impType) {
		case 1:
			if (FullYear == true && impDMY.toLowerCase() == "y") {
				return dStr.substr(0, 1) + "+" + dStr.substr(1, 1) + "+" + dStr.substr(2, 1) + "+" + dStr.substr(3, 1)
			} else {
				if (dStr.length == 1) {
					return dStr.substr(0, 1)
				} else if (impDMY == "y") {
					return dStr.substr(2, 1) + "+" + dStr.substr(3, 1)
				} else {
					return dStr.substr(0, 1) + "+" + dStr.substr(1, 1)
				}
			}
			break;
		case 2:
			if (FullYear == true && impDMY.toLowerCase() == "y") {
				return "(" + dStr.substr(0, 1) + dStr.substr(1, 1) + ") + (" + dStr.substr(2, 1) + dStr.substr(3, 1) + ")"
			} else {
				if (impDMY == "y") {
					return "(" + dStr.substr(2, 2) + ")"
				} else {
					return "(" + dStr + ")"
				}
			}
			break;
	}
}
function multiStr(impDate, impBool, impType) {
	var dateStr, x
	var dArr = []; dProduct = 1
	dateStr = impDate.getMonth() + 1
	dateStr += String(impDate.getDate())

	switch (impBool) {
		case true:
			dateStr += String(impDate.getFullYear())
			break;
		case false:
			if (String(impDate.getFullYear()).length > 3) {
				dateStr += String(impDate.getFullYear()).substr(2, 2)
			} else {
				dateStr += String(impDate.getFullYear()).substr(1, 2)
			}
			break;
	}
	for (x = 0; x < dateStr.length; x++) {
		if (dateStr.substr(x, 1) !== "0") {
			dArr[dArr.length] = dateStr.substr(x, 1)
		}
	}

	if (impType == 1) {
		return dArr.join(" &times; ")
	} else if (impType == 2) {
		for (x = 0; x < dArr.length; x++) {
			dProduct *= dArr[x]
		}
		return dProduct
	}
}

//Export HTML to create the table with date duration information
function DurationTable() {
	var z, durStr, timeDur, p
	var durY, durM, durD, durH, durMin, durS
	var DurTableSpot = document.getElementById("DurationSpot")

	if (wDate[1] > wDate[2]) {
		timeDur = wDate[1] - wDate[2]
	} else {
		timeDur = wDate[2] - wDate[1]
	}

	durStr = '<table id="DurTable"><tr>'
	durStr += '<td style="background: rgb(25,25,25); width: 100px">' + get_DurString() + '</td>'
	durStr += '<th class="TotalHead">Total in Each</th></tr><tr>'
	durStr += '<td valign="top" style="background: rgb(25,25,25); width: 380px"><font style="font-size: 115%">' + get_Durations() + '</font></td>'
	durStr += '<td valign="top" style="width: 220px"><font style="color: RGB(222, 222, 222)">' + duration_length(timeDur)
	durStr += '</tr></table></td></tr></table>'

	DurTableSpot.innerHTML = durStr

	//durStr += '<font style="font-size: 90%; color: RGB(222, 222, 222)">' + duration_length(timeDur)
	//DurTableSpot2.innerHTML = durStr
}

//Builds a string to help populate the duration table
function duration_length() {
	var retStr = ""
	var durArr = ["y", "m", "w", "d"] //, "h", "min", "s"]
	var x, n, p, m

	for (x = 0; x < durArr.length; x++) {
		retStr += '<font class="">'
		switch (durArr[x]) {
			case "y":
				p = yearDiff
				if (p !== 1) {n = "Years"} else {n = "Year"}
				if (yearDays !== 1) {m = "Days"} else {m = "Day"}
				break;
			case "m":
				p = mDiff[0]
				if (p !== 1) {n = "Months"} else {n = "Month"}
				if (mDiff[1] !==1) {m = "Days"} else {m = "Day"}
				break;
			case "w":
				p = weekDiff[0]
				if (p !== 1) {n = "Weeks"} else {n = "Week"}
				if (weekDiff[1] !== 1) {m = "Days"} else {m = "Day"}
				break;
			case "d":
				p = dayDiff
				if (p !== 1) {n = "Days"} else {n = "Day"}
				break;
			case "h":
				p = hourDiff
				if (p !== 1) {n = "Hours"} else {n = "Hour"}
				break;
			case "min":
				p = minDiff
				if (p !== 1) {n = "Minutes"} else {n = "Minute"}	
				break;
			case "s":
				p = secDiff
				if (p !== 1) {n = "Seconds"} else {n = "Second"}
				break;
		}
		if (durArr[x] == "w") {
			retStr += p + '</font> ' + n + ', <font class="">' + weekDiff[1] + '</font> ' + m + '<BR>'
		} else if (durArr[x] == "m") {
			retStr += p + '</font> ' + n + ', <font class="">' + mDiff[1] + '</font> ' + m + '<BR>'
		} else if (durArr[x] == "y") {
			retStr += p + '</font> ' + n + ', <font class="">' + yearDays + '</font> ' + m + '<BR>'
		} else {
			retStr += p + '</font> ' + n + '<BR>'
		}
	}

	return retStr
}

//Build the variables that define the duration between the two dates
function Set_Durations() {
	var x, p, n, k, w
	var cutDate, holdMonth, holdDay
	var bigDate, littleDate, tempDate

	if (wDate[1] > wDate[2]) {
		bigDate = new Date(wDate[1])
		littleDate = new Date(wDate[2])
	} else {
		bigDate = new Date(wDate[2])
		littleDate = new Date(wDate[1])
	}

	tempDate = new Date(littleDate)
	if (oArr.EndInc == true) {tempDate.setDate(tempDate.getDate() - 1)}

	yearDiff = bigDate.getFullYear() - littleDate.getFullYear()
	tempDate.setFullYear(littleDate.getFullYear() + yearDiff)

	if (tempDate > bigDate) {
		yearDiff--
		tempDate.setFullYear(tempDate.getFullYear() - 1)
	}

	yearDays = Math.round((Date.parse(bigDate) - Date.parse(tempDate)) / 86400000)

	monthDiff = 0
	holdDay = tempDate.getDate()
	while (bigDate > tempDate) {
		holdMonth = tempDate.getMonth()
		tempDate.setMonth(tempDate.getMonth() + 1)
		if (tempDate.getMonth() == holdMonth + 1 || tempDate.getMonth() == 0 && holdMonth == 11) {
		} else {
			tempDate.setMonth(tempDate.getMonth() - 1)
			tempDate.setDate(MonthMax(tempDate.getMonth() + 1, tempDate.getYear()))
		}
		if (holdDay > tempDate.getDate()) {
		    if (holdDay > MonthMax(tempDate.getMonth() + 1, tempDate.getYear())) {
		        tempDate.setDate(MonthMax(tempDate.getMonth() + 1, tempDate.getYear()))
		    } else {
		        tempDate.setDate(holdDay)
		    }
		}
		if (bigDate >= tempDate) {monthDiff++}
	}
	monthDiff += (yearDiff * 12)
	if (tempDate > bigDate) {tempDate.setMonth(tempDate.getMonth() - 1)}
	mDiff[0] = monthDiff
	mDiff[1] = Math.round((Date.parse(bigDate) - Date.parse(tempDate)) / 86400000)
	//if (oArr.EndInc == true) {mDiff[1] += 1}

	tempDate = Date.parse(bigDate) - Date.parse(littleDate)
	if (oArr.EndInc == true) {tempDate = tempDate + 86400000}

	w = Math.round(tempDate / 86400000)
	weekDiff[0] = Math.floor(w / 7)
	weekDiff[1] = Math.round(w % 7)
	dayDiff = Math.round(tempDate / 86400000)
	hourDiff = Math.floor(tempDate / 3600000)
	minDiff = Math.floor(tempDate / 60000)
	secDiff = Math.floor(tempDate / 1000)

	for (x = 0; x < inpTypes.length; x++) {
		p = inpTypes[x]
		if (x == 2) {
			cutDate = Date.parse(bigDate) - Date.parse(littleDate)
			if (oArr.EndInc == true) {cutDate = cutDate + 86400000}
		}
		if (oArr[p] == true) {
			switch (p) {
				case "Year":
					combArr[x] = yearDiff
					littleDate.setFullYear(littleDate.getFullYear() + combArr[x])
					break;
				case "Month":
					if (oArr.Year == true) {
						combArr[x] = monthDiff - (yearDiff * 12)
					} else {
						combArr[x] = monthDiff
					}
					holdMonth = littleDate.getDate()
					littleDate.setMonth(littleDate.getMonth() + combArr[x])
					if (holdMonth !== littleDate.getDate()) {
						littleDate.setMonth(littleDate.getMonth() - 1)
						littleDate.setDate(MonthMax(littleDate.getMonth() + 1, littleDate.getYear()))
					}
					mDiff[1] = Math.round((Date.parse(bigDate) - Date.parse(littleDate)) / 86400000)
					if (oArr.EndInc == true) {mDiff[1] += 1}
					break;
				case "Week":
					if (cutDate == 0) {combArr[x] = 0}
					else {
						k = Math.round(cutDate / 86400000)
						combArr[x] = Math.floor(k / 7)
						cutDate -= (combArr[x] * 604800000)
					}
					break;
				case "Day":
					if (cutDate == 0) {combArr[x] = 0}
					else {
						combArr[x] = Math.round(cutDate / 86400000)
						cutDate -= (combArr[x] * 86400000)
					}
					if (combArr[x] < 0) {combArr[x] = 1}
					break;
				case "Hour":
					if (cutDate == 0) {combArr[x] = 0}
					else {
						combArr[x] = Math.floor(cutDate / 3600000)
						cutDate -= (combArr[x] * 3600000)
					}
					break;
				case "Min":
					if (cutDate == 0) {combArr[x] = 0}
					else {
						combArr[x] = Math.floor(cutDate / 60000)
						cutDate -= (combArr[x] * 60000)
					}
					break;
				case "Sec":
					if (cutDate == 0) {combArr[x] = 0}
					else {
						combArr[x] = Math.floor(cutDate / 1000)
						cutDate -= (combArr[x] * 1000)
					}
					break;
			}
		} else {
			combArr[x] = ""
		}
	}
}

//Retrieve a string for the variables
function get_Durations() {
	var x, p, n
	var dStr = ""

	for (x = 0; x < inpTypes.length; x++) {
		p = inpTypes[x]
		if (oArr[p] == true) {
			switch (p) {
				case "Year":
					if (combArr[x] !== 1) {n = "Years,"} else {n = "Year,"}
					break;
				case "Month":
					if (combArr[x] !== 1) {n = "Months,"} else {n = "Month,"}
					break;
				case "Week":
					if (combArr[x] !== 1) {n = "Weeks,"} else {n = "Week,"}
					break;
				case "Day":
					if (combArr[x] !== 1) {n = "Days,"} else {n = "Day,"}
					break;
				case "Hour":
					if (combArr[x] !== 1) {n = "Hours,"} else {n = "Hour,"}
					break;
				case "Min":
					if (combArr[x] !== 1) {n = "Minutes,"} else {n = "Minute,"}
					break;
				case "Sec":
					if (combArr[x] !== 1) {n = "Seconds,"} else {n = "Second,"}
					break;
			}

			dStr += '<font class="DurNum">' + combArr[x] + '</font> ' + n + '<BR>'

		}
	}
	return dStr.substr(0, dStr.length - 5)
}

function get_DurString() {
	var retStr = 'From <font class="DurationString">'
	var bigDate, littleDate

	if (wDate[1] > wDate[2]) {
		bigDate = wDate[1]
		littleDate = wDate[2]
	} else {
		littleDate = wDate[1]
		bigDate = wDate[2]
	}

	retStr += showDate(littleDate) + '</font><BR>to <font class="DurationString">'
	retStr += showDate(bigDate) + '</font> is:'

	return retStr
}

function monthNames(impMonth) {
	var mNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	return mNames[impMonth]
}
