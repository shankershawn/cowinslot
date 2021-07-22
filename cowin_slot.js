const https = require("https");
var beep = require("beepbeep");
var interval = setInterval(function(){
	let date = new Date();
	date = date.getDate() + "-" + (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + "-" + date.getFullYear();
	https.get("https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=725&date=" + date, (resp) => {
		let data = "";
		resp.on('data', (chunk) => {
			data += chunk;
		});
		resp.on('end', () => {
			try{
				data = JSON.parse(data);
				//console.log(data.centers[91].sessions[0].available_capacity = 10);
				var found = false;
				data.centers.forEach((c) => {
					c.sessions.forEach((s) => {
						if(s.available_capacity_dose2  > 0 && s.min_age_limit < 45){
							found = true;
							console.log(c.name + " -- " + s.vaccine + " -- " + s.date + " -- " + s.available_capacity_dose1 + " -- " + s.slots.join(","));
							beep(1);
						}
					});
				});
				if(!found){
					console.log("No slots found");
				}else{
					console.log("*******************************************************************************************");
				}
			}catch(err){
				console.log(err);
			}
		});
		resp
	}).on('error', (e) => {
		console.error(e);
	});
},5000);
