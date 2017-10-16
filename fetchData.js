// to do
// demon hunter check rankings by an alt char since you miss guild info (dh's being freshly created lack all the past guild info)
// could potentially have same issue on other toons due to created date
// guildscan implement
// decide whether if prev bosses should be added back till ragnaros? (as hc first kills)
// search alts!
// dont send the character achievement request data billion times for every single boss lookup
// drop down realm list for eu/us
// implement kr
// swap var's with let
// async.await ??
// all the patchwerk solutions

// [[[[--------------------------------Achievement Codes Guild and Personal -------------------- ------]]]]

// var mistressGUild = 
// var mistressPersonal =
var ragnarosPersonal = 5803
var ragnarosGuild = 5984
var imperatorPersonal = 8965
var imperatorGuild = 9420
var blackhandPersonal = 8973
var blackhandGuild = 9421
var archimondePersonal = 10043
var archimondeGuild = 10176
var xaviusPersonal = 10827
var xaviusGuild = 11238
var helyaPersonal = 11398 
var helyaGuild = 11404
var guldanPersonal = 10850
var guldanGuild = 11239


// [[[[--------------------------------Initialize-------------------------------------------------------]]]]
var divClone;
var battleNetApiKey = "b7pycu6727tfgrnzawp6sn5bxeerh92z"; // Battle Net Api Key
var warcraftLogsApiKey = "bff965ef8c377f175a671dacdbdbc822"; // Warcraftlogs Api Key
var proxy = "https://cors-anywhere.herokuapp.com/"; // proxy alternates crossorigin.me

var clicked;

var submitAlts = document.getElementById("alts"); //why is this here?
var altsHtml = "Alts \n\n"
var playerGuilds = [];
var guildRequestList = [];
var altsArray = []
var fresh = [];
var callbackCount = 0

var callCount = 0;
var uniqueItems;
var uniqueRequest;
var stamps
// var killStamps = [ convert kill timestamps to JSON when pool gets bigger !! //discarded 
// using txt files instead could go back to json

$(document).ready(function(){
	submitAlts.innerHTML = "";
	clicked = false;
	divClone = $("#divid1").html();
	JFCustomWidget.subscribe("ready", function(){
		// fontSize = parseInt(JFCustomWidget.getWidgetSetting('fontSize'));
		// fontFamily = JFCustomWidget.getWidgetSetting('fontFamily');
		// fontColor = JFCustomWidget.getWidgetSetting('fontColor');
		});	
});

function buildArmoryLink(locale, realm, character){
	locale = localeTransform(locale);
	var armory = "https://worldofwarcraft.com/en-" + locale + "character/" + realm.replace(/\s+/g, '-') + "/" + character;
	return armory;
}

function buildTrackUrl(locale, realm, character){ 
	realm = realm.replace("-", "%20")
	var track = "https://wowtrack.org/characters" + "/" + locale + "/"	 + realm + "/" + character; 
	return track;
}

function toTitleCase(str){
	return str.replace(/\w\S*/g, function(txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

function upperCaseFirstL(word){
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function lowerCaseFirstL(word){
	return word.charAt(0).toLowerCase() + word.slice(1);
}

function localeTransform(locale){
	if(locale == "EU")
		return localeCode = "gb/";
	else
		return localeCode = "us/"; // handle kr??
}


function getClassColor(spec){
	switch(spec){
		case "priest":
			return "#FFFFFF";
			break;
		case "death knight":
			return "#C41F3B";
			break;
		case "demon hunter":
			return "#A330C9";
			break;
		case "hunter":
			return "#ABD473";
			break;
		case "druid":
			return "#FF7D0A";
			break;
		case "mage":
			return "#69CCF0";
			break;
		case "monk":
			return "#00FF96";
			break;
		case "paladin":
			return "#F58CBA";
			break;
		case "rogue":
			return "#FFF569";
			break;
		case "shaman":
			return "#0070DE";
			break;
		case "warlock":
			return "#9482C9";
			break;
		case "warrior":
			return "#C79C6E";
			break;
	}		
}


function getClassName(id){
	switch(id) {
		case 5:
			return "priest";
			break;
		case 6:
			return "death knight";
			break;
		case 12:
			return "demon hunter";
			break;
		case 3:
			return "hunter";
			break;
		case 11:
			return "druid";
			break;
		case 8:
			return "mage";
			break;
		case 10:
			return "monk";
			break;
		case 2:
			return "paladin";
			break;
		case 4:
			return "rogue";
			break;
		case 7:
			return "shaman";
			break;
		case 9:
			return "warlock";
			break;
		case 1:
			return "warrior";
			break;
	}		
}

function formatDate(string){ // convert to timestamp from Mar 06 2016 format
	var date = string.substring(string.lastIndexOf('s"')+3, string.lastIndexOf('</')).replace(",","");
	splitted = date.split(" ");
	formattedJoin = getMonth(splitted[0]) + "/" + splitted[1] + "/" + splitted[2]
	return (new Date(formattedJoin).getTime());
}

function getMonth(short){
	switch(short) {
		case "Jan":
			return 1;
			break;
		case "Feb":
			return 2;
			break;
		case "Mar":
			return 3;
			break;
		case "Apr":
			return 4;
			break;
		case "May":
			return 5;
			break;
		case "Jun":
			return 6;
			break;
		case "Jul":
			return 7;
			break;
		case "Aug":
			return 8;
			break;
		case "Sep":
			return 9;
			break;
		case "Oct":
			return 10;
			break;
		case "Nov":
			return 11;
			break;
		case "Dec":
			return 12;
			break;
	}		
}

function removeDiv(tag){
	var elem = document.getElementById(tag.id);
	elem.parentNode.parentNode.removeChild(tag.parentNode);
}


function getBossOrder(boss){
	let bossNo;

	switch(boss){
		case "guldan":
			bossNo = 6
			break;
		case "helya":
			bossNo = 5
			break;
		case "xavius":
			bossNo = 4
			break;
		case "archimonde":
			bossNo = 3
			break;	
		case "blackhand":
			bossNo = 2
			break;
		case "imperator":
			bossNo = 1
			break;
		default :
			console.log("unknown boss stamp?");
	}

	return bossNo;
}

function readToon(url){
	$.ajax({
	  url: url,
	  async: true,
	  success: function(data){
	  		let grab;
	  		let k = 0;
			let lines = data.split("\n");
			let lineLength = lines.length;
			for (i = 0; i < lineLength; i++){
				if (lines[i].indexOf("guilds") != -1 ){ //guilds
					k++;
					var d = new Date();
					var n = d.getTime();
					var guildGrab = lines[i].substring(lines[i].lastIndexOf("guilds")+7, lines[i].lastIndexOf('" '));
					guildGrab = guildGrab.split("/");
					var dateLeave = formatDate(lines[i+3]); //convert to stamp
					if (isNaN(dateLeave)){
						dateLeave = n
					}
					
					var tempGrab = guildGrab[2].split("%20");
					var tempSize = tempGrab.length;
					var gName = ""

					if (tempSize > 1){

						for (g = 0; g < tempSize-1; g++){
							gName = gName + tempGrab[g] + "%20"
						}

						gName = gName + tempGrab[tempSize-1];
					}
					else
						gName = guildGrab[2]

					guild = {
						guildLocale : guildGrab[0].toLowerCase(), // KR RU locales
						guildRealm : guildGrab[1].toLowerCase(),
						guildName : gName,
						dateJoin : formatDate(lines[i+2]), //converted to timestamps so it's easier to compare with blizz killstamps
						dateLeave : dateLeave
					}

					if (k != 1) //missread on first catch
						playerGuilds.push(guild); 
					//Apr 29, 2016
					// guildLeft = lines [i+3].substring(lines[i+3].lastIndexOf('s"')+3, lines[i+3].lastIndexOf('</'))							
				}
			}
	  } 	
		  
	});
}
function getBossText(boss) {
	let bossText;

	switch(boss){
		case "guldan": 
			bossText =  " Nighthold Mythic world rank "
			break;
		case "helya":
			bossText = "    Trial of Valor Mythic world rank "
			break;
		case "xavius":
			bossText =  "   Emerald Nightmare Mythic world rank ";
			break;
		case "archimonde":
			bossText = "   Hellfire Citadel Mythic world rank ";
			break;	
		case "blackhand":
			bossText = "   Blackrock Foundry Mythic world rank ";
			break;
		case "imperator":
			bossText = "   Highmaul Mythic world rank ";
			break;
		default :
			console.log("unknown boss text?");
	}

	return bossText;
}

function getBossName(boss){
	let bossName;

	switch(boss){
		case 6:
			bossName = "guldan"
			break;
		case 5:
			bossName = "helya"
			break;
		case 4:
			bossName = "xavius"
			break;
		case 3:
			bossName = "archimonde"
			break;	
		case 2:
			bossName = "blackhand"
			break;
		case 1:
			bossName = "imperator"
			break;
		default :
			console.log("unknown boss name?");
	}

	return bossName;
}
function spaceToBlizzspace(convertMe){
	return convertMe.replace(" ", "%20");
}


function blizzspaceToSpace(convertMe){
	return convertMe.replace("%20", " ");
}

function getItemLevel(locale, realm, name , func){ // getItemLevel(locale, grabRealm, name, addAltx) is sent from the mainPane

	var request;

	if (locale == "EU")
		request = "https://eu.api.battle.net/wow/character/" + realm + "/" + name + "?fields=items&locale=en_GB&apikey=" + battleNetApiKey;
	else if (locale == "US")
		request = "https://us.api.battle.net/wow/character/" + realm + "/" + name + "?fields=items&locale=en_US&apikey=" + battleNetApiKey;

	$.ajax({
		async: true,
		type: 'GET',
		url: request,
		success: function(data) {
			var averageilvl = data.items.averageItemLevelEquipped;
			var classnm = getClassName(data.class);
			var obj = { 
				characterClass: classnm,
				characterilvl: averageilvl
			}
			func(locale, realm, name, obj)   //call to addAlt 
		}	
	});
}

function addAltx(locale, realm, name, obj){ //, divid

	name = upperCaseFirstL(name);
	realm = toTitleCase(realm.toString());

	var alts = document.getElementById("alts");
	var link = document.createElement("a");
	var text = document.createElement('td1');
	var div = document.createElement("div"); 
	var button = document.createElement("img");

	button.style.border = "1.7px solid #000000"
	button.src = "images/remove2.png";
	button.id = "button";
	button.width = "11";
	button.height = "11";

	button.addEventListener("click", function(e){
		removeDiv(this);
	});	

	text.innerHTML = " " + obj.characterilvl + " item level                               	"; //ilvl api

	link.setAttribute('target', '_blank');
	link.href = buildArmoryLink(locale, realm, name);
	link.innerHTML = name
	link.style.color = getClassColor(obj.characterClass);
	div.appendChild(link);
	div.appendChild(text);
	altsHtml = altsHtml + div.outerHTML + "\n";
	submitAlts.appendChild(div);

	div.appendChild(button);  //button on submission 
	alts.appendChild(div);	

}


function temp(){
	var altDiv = document.getElementById("alts");
	var altName = document.getElementById('altName').value;
	altName = upperCaseFirstL(altName);
	var locale = document.getElementById('locale').value;
	var altRealm = toTitleCase(document.getElementById('altRealm').value);
	getItemLevel( locale, altRealm, altName, addAltx); //(altDiv)
}

function fixName(name){
	return upperCaseFirstL(name.toLowerCase()).trim();
}

function playerStamps(obj){

	stamps = {
		guldanStamp : getStamp(guldanPersonal, obj),
		helyaStamp : getStamp(helyaPersonal, obj),
		xaviusStamp : getStamp(xaviusPersonal, obj),
		archimondeStamp : getStamp(archimondePersonal, obj),
		blackhandStamp : getStamp(blackhandPersonal, obj),
		imperatorStamp : getStamp(imperatorPersonal, obj)
	}
}
function asyncGet(guildElement, index, callback){

	let request;

	if (fresh[index].guildLocale === "eu") //func
		request = "https://eu.api.battle.net/wow/guild/" +  guildElement.guildRealm + "/" +  guildElement.guildName + "?fields=achievements&locale=en_GB&apikey=" + battleNetApiKey;
	else if (fresh[index].guildLocale === "us")
		request = "https://us.api.battle.net/wow/guild/" +  guildElement.guildRealm + "/" +  guildElement.guildName + "?fields=achievements&locale=en_US&apikey=" + battleNetApiKey;

	$.ajax({
		async: true,
		type: 'GET',
		url: request,
		success: function(aData) {	

			let obj = {
				completedArray : aData.achievements.achievementsCompleted,
				timestamps : aData.achievements.achievementsCompletedTimestamp
			}

			fresh[index].guildData = obj;
			callback();

		},

		error: function() {
            console.log('error for ' + guildElement.name);
            callback();
        }
	});
}

function fill(){
	let size = fresh.length;
	fresh.forEach(function(ele, i){
		asyncGet(ele, i, function(){
			callbackCount++;
			if (callbackCount === size){
				loopThrough()
				return
			}
		});
		
	});
}

function guildEquals(obj1, obj2){
	if (obj1.guildName === obj2.guildName && obj1.guildLocale === obj2.guildLocale && obj1.guildRealm === obj2.guildRealm)
		return true
	else
		return false
}

function guildCode(boss){
	
	let code;

	switch(boss){
		case 6:
			code = guldanGuild
			break;
		case 5:
			code = helyaGuild
			break;
		case 4:
			code = xaviusGuild
			break;
		case 3:
			code = archimondeGuild
			break;	
		case 2:
			code = blackhandGuild
			break;
		case 1:
			code = imperatorGuild;
			break;
		default :
			console.log("unknown boss stamp?");
	}

	return code;

}



function getStamp(achievCode, obj){
	
	let stamp;
	let index;

	index = obj.completedArray.indexOf(achievCode);

	if (index == -1)
		stamp = -1;
	else
		stamp = obj.timestamps[index];

	return stamp // -1 if not found??
}	

function loopThrough(){
	let list = [1,2,3,4,5,6];
	guildRequestList.forEach(function(guild){
		let check = guild.boss;
		if (list.includes(check)){
			fresh.forEach(function(grab){
				if (list.includes(check)){
					if(guildEquals(guild, grab)){
						let boss = getBossName(guild.boss)
						let guildAch = eval(boss+'Guild'); //patchwerk
						let guildStamp = getStamp(guildAch,grab.guildData)

						let stamp = eval('stamps.'+boss+'Stamp')
						if (Math.abs(stamp - guildStamp) <= 150000){ // my first Kill is within 5 minutes of guilds kill 
							let deleteItem = list.indexOf(guild.boss) //patchwerk
							delete list[deleteItem]
							$.ajax({
								async: true,
								type: 'GET',
								guild : guild,
								url: "rankings/" + boss + ".txt",
								success: function(sData){
									let div = document.createElement("div");
									let img = document.createElement("img");	
									let text = document.createElement('td1');
									let lines = sData.split("\n");
									lineCount = lines.length;
									let rank;

									for (i=0 ; i < lineCount ; i++){
										if (lines[i].trim() === guild.guildLocale + guild.guildRealm + guild.guildName){ //temp fix??
											rank = i + 1
											img.src = "images/" + boss + ".jpg";
											img.alt = boss
											div.appendChild(img) //   
											text.innerHTML = getBossText(boss) + rank + " in guild " + blizzspaceToSpace(guild.guildName) + "-" + blizzspaceToSpace(guild.guildRealm);
											div.appendChild(text)
											let kills = document.getElementById("kills");	
											kills.appendChild(div)

										}
									}
								},
								error: function(){ 
									console.log("ff")
								} 
							});	
						}	
						else return;				
					} // Hellfire		
				}
			});
		}
		else return;
	});
}

	// Check if the player killed the given world of warcraft boss by blizz achievement api
	// If no return else get killtimestamp
	// search playerGuilds array and find which guild the player was in when he acquired the kill achievement (compare GuildJoin/Leave with killstamp)
	// if the player was in a guild on when he acquired the achievement request that guild's achievement list and get boss kill timestamp
	// compare player killstamp with guild's to see if player actually got the achievement within that guild (150k flex approx to 5 mins due to minimal delays on  possible playerstamps)
	// get the guilds ranking from the relevant boss.txt
					
	// 10.14.2017 usin async data load then loop from now on to do less requests overall

function guildRank(fdata, boss, personalAchiev){
	
	let index = fdata.achievements.achievementsCompleted.indexOf(personalAchiev);
	if (index != -1){   // make this a function to avoid bracket hell or use if == -1 return else do ur stuff (which could look way more elegant)
		var stamp = fdata.achievements.achievementsCompletedTimestamp[index]; //hoist the colors
		playerGuilds.forEach(function (guildIter, i){
			if (stamp < guildIter.dateLeave && stamp > guildIter.dateJoin){
				guildIter.boss = getBossOrder(boss);
				guildRequestList.push(JSON.parse(JSON.stringify(guildIter)))
				let temp = guildIter.dateJoin
				let temp2 = guildIter.dateLeave
				delete guildIter.dateJoin //patchwerk
				delete guildIter.dateLeave
				delete guildIter.boss
				uniqueRequest.push(JSON.parse(JSON.stringify(guildIter)))
				guildIter.dateJoin = temp
				guildIter.dateLeave = temp2
				
			}
		});

		fresh = uniqueRequest.map(function(e, index){
			let count = -1;
			uniqueRequest.forEach(function(ele, idx){
				if (JSON.stringify(ele) === JSON.stringify(e))
					count ++	
			});
			if (count == 0)
				return e;
			else
				uniqueRequest[index] = undefined		
		});

		fresh = fresh.filter(function( element ) { //shrink
		   return element !== undefined;
		});

	}
}

function mainPane(){

	fresh = []
	playerGuilds = [];
	altsArray = [];
	guildRequestList = [];
	uniqueItems = [];
	uniqueRequest = [];
	stamps = [];

	var kills = document.getElementById("kills").innerHTML = "First Kill Rankings\n"
	var charName = document.getElementById('char').value;
	charName = fixName(charName);
	var realm = toTitleCase(document.getElementById('realm').value).trim();
	var locale = document.getElementById('locale').value;
	var metric = document.getElementById('metric').value;
	var img = document.createElement("img");
	var url = proxy + buildTrackUrl(locale, toTitleCase(realm.replace("-", "%20")), charName);
	callCount = 0;
	callbackCount = 0;
	$.ajax({
	  url: url,
	  async: true,
	  success: function(data){

	  	clicked = true;
	  	var loc;
		var name;
		var grabRealm;
		var wClass;
		var grab;
		var ilvl;
		var lines = data.split("\n");
		var lineLength = lines.length;
		var merge = 0; // dont really use this anymore but could be needed when figuring out how to excludr merged character url request on alt character guild pushes
		var k = 0;
		document.getElementById("alts").innerHTML = "ALTS"; //Refresh on new submit
		
		for (i = 0; i < lineLength; i++){
			if (lines[i].indexOf("<a href=\"/characters") != -1 ) { // ALTS
				merge ++; 
				var grab = lines[i].split("/");

				ilvl=lines[i+1].substring(lines[i+1].lastIndexOf("<td>") + 4,lines[i+1].lastIndexOf("</td>"));

				var grabLength = grab.length;

				for (j = 0; j < grabLength; j++){

					if (j == 2) //Grab Locale
				 		loc = grab[j];

				 	else if (j == 3) //Grab Realm

				 		grabRealm = grab[j].replace(/%20/g, "-");

				 	else if (j == 4){ // Grab Class & Char Name

				 		//-----------------NAME----------------
				 		temp = grab[4];	
				 		temp = temp.split("\"");
				 		name = temp[3].replace(/['" ]+/g, '');
				 		name = name.replace("<", "");
				 		name = name.replace(">", "");
				 		//----------------CLASS--------------
				 		wClass = temp[2].replace("\"", "");
				 		wClass = wClass.substring(wClass.indexOf("-") + 1, wClass.length);
				 		wClass = wClass.replace("-"," ");
				 		getItemLevel(locale, grabRealm, name, addAltx);

				 		altObj = { 
							name: name,
							locale: locale,
							realm: grabRealm
						}
						altsArray.push(altObj);
				 	} 	
				}
			}
			else if (lines[i].indexOf("guilds") != -1 ){ //guilds
				k++;
				var d = new Date();
				var n = d.getTime();
				var guildGrab = lines[i].substring(lines[i].lastIndexOf("guilds")+7, lines[i].lastIndexOf('" '));
				guildGrab = guildGrab.split("/");
				var dateLeave = formatDate(lines[i+3]); //convert to stamp
				if (isNaN(dateLeave)){
					dateLeave = n
					}
				
				var tempGrab = guildGrab[2].split("%20");
				var tempSize = tempGrab.length;
				var gName = ""

				if (tempSize > 1){
					
					for (g = 0; g < tempSize-1; g++){
							gName = gName + tempGrab[g] + "%20";
					}

					gName = gName + tempGrab[tempSize-1];
				}
				else
					gName = guildGrab[2]

				guild = {
					guildLocale : guildGrab[0].toLowerCase(), // KR RU locales
					guildRealm : guildGrab[1].toLowerCase(),
					guildName : gName,
					dateJoin : formatDate(lines[i+2]), //converted to timestamps so it's easier to compare with blizz killstamps
					dateLeave : dateLeave
				}

				if (k != 1) //missread on first catch
					playerGuilds.push(guild); 
				//Apr 29, 2016
				// guildLeft = lines [i+3].substring(lines[i+3].lastIndexOf('s"')+3, lines[i+3].lastIndexOf('</'))
				
			}
			else{}//cnd
		}



		for (t = 0; t < altsArray.length ; t++){  //size = altsArray,length ? micromanage
			let url = proxy + buildTrackUrl(altsArray[t].locale, altsArray[t].realm, altsArray[t].name);
	 		readToon(url)
		}


		if (locale == "EU")
			request = "https://eu.api.battle.net/wow/character/" + realm + "/" + charName + "?fields=achievements&locale=en_GB&apikey=" + battleNetApiKey;
		else if (locale == "US")
			request = "https://us.api.battle.net/wow/character/" + realm + "/" + charName + "?fields=achievements&locale=en_US&apikey=" + battleNetApiKey;

		$.ajax({
			async: true,
			type: 'GET',
			url: request,
			success: function(data) { //dont send the data 6 times !! fix me

				let obj = {
					completedArray : data.achievements.achievementsCompleted,
					timestamps : data.achievements.achievementsCompletedTimestamp
				}

				playerStamps(obj)

				guildRank(data, "guldan", guldanPersonal)
				guildRank(data, "helya", helyaPersonal)
				guildRank(data, "xavius", xaviusPersonal)
				guildRank(data, "archimonde", archimondePersonal)
				guildRank(data, "blackhand", blackhandPersonal)
				guildRank(data, "imperator", imperatorPersonal)

				guildRequestList.sort(function(a, b){
					return b.boss - a.boss 
				});

				fill();

			}

		});
	  },
	  error: function (){ // Reset on fail
	  	clicked = false;
	  	$("#divid1").html(divClone); 
	  	alert("Invalid Character");
	  }
	});
	// ---------------------------------------------------------------------First Kil Block ----------------------------------------------------

	// ---------------------------------------------------------------------First Kil Block ----------------------------------------------------

	// ---------------------------------------------------------------------First Kil Block ----------------------------------------------------

	// ---------------------------------------------------------------------First Kil Block ----------------------------------------------------

	// ---------------------------------------------------------------------First Kil Block ----------------------------------------------------

	// var base = "https://wowtrack.org/characters/"; //WowTrack character url body

	// img.onclick = function() {
	// 	var image = (buildTrackUrl(locale, realm, charName));
	// 	window.open(image);

	// };
	// img.setAttribute('target', '_blank');
	// var response = "?response=signature&fields=progression,averageItemLevel,mythicDungeonLevel";
	// var realmNonSpace = realm.replace(" ", "%20");
	// img.src = base + locale + "/" + realmNonSpace + "/" + charName + response;

	// img.href = "https://wowtrack.org/characters/" + locale + "/" + realmNonSpace + "/" + charName;
	
	// img.alt = "Invalid Character";
	// var div = document.createElement("div");
	// div.appendChild(img);

	// document.getElementById("characterPane").innerHTML="";
	// document.getElementById("characterPane").appendChild(div);

	var artifactJSON = "https://raider.io/api/v1/characters/profile?region=" + locale + "&realm=" + realm + "&name=" + charName + "&fields=gear"; // <3

	$.ajax({
		async: true,
		type: 'GET',
		url: artifactJSON,
		success: function(data) {
			var art = document.getElementById("artifact");
			var artifactTraits = data.gear.artifact_traits;
			var artifactText = "Currently " + artifactTraits + " artifact points are allocated.";
			document.getElementById("artifact").innerHTML = "";
			art.innerHTML = art.innerHTML + "\n" + artifactText;
		}
	});

	var wlogsBody = "https://www.warcraftlogs.com/character/" + locale + "/" + realm.replace(/\s+/g, '-') + "/" + charName 
	document.getElementById("wlogs").href = wlogsBody;

	var wowProgressText = "https://www.wowprogress.com/character/" + locale + "/" + realm.replace(/\s+/g, '-') + "/" + charName;

	var armoryText = buildArmoryLink(locale, realm, charName); 
	
	document.getElementById("blizz").href = armoryText;
	document.getElementById("progress").href = wowProgressText;
	var blizzString = document.getElementById("blizz").children[0].text;
	JFCustomWidget.subscribe("submit", function(){

		document.body.style.backgroundColor = "black";
		var blizzString = document.getElementById("blizz").outerHTML;		
		// var pane = document.getElementById("characterPane").outerHTML
		var progressString = document.getElementById("progress").outerHTML;
		var wlogsString = document.getElementById("wlogs").outerHTML;
		var killsString = document.getElementById("kills").outerHTML;
			
		var result = {}
		result.valid = false;
		 
		if(clicked) /// this?  charName != "" && realm != "" && 
			result.valid = true;

		result.value = blizzString + progressString + wlogsString + killsString + altsHtml ;
		result.valid = false;
		JFCustomWidget.sendSubmit(result);

	});
	

}
	
