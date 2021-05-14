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
				//console.log(data.centers[0].sessions[1].available_capacity = 10);
				var found = false;
				data.centers.forEach((c) => {
					c.sessions.forEach((s) => {
						if(s.available_capacity > 0 && s.vaccine == "COVAXIN"){
							found = true;
							console.log(c);
							beep(3, 1000);
						}
					});
				});
				if(!found){
					console.log("No slots found");
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
