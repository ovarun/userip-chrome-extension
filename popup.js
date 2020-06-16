if (localStorage.getItem('lastchecks') == '')
	localStorage.setItem('lastchecks', JSON.stringify(new Array()));

String.prototype.between = function(a,b) {
  m1 = this.indexOf(a);
  m2 = this.indexOf(b, m1+a.length);
  if (m1 == -1)
    return false;
  if (m2 != -1)
    return this.substring(m1+a.length,m2);
  else
    return this.substring(m1+a.length);
}

function ThemeChanger() { 
	if(ge('theme_changer').checked){ 
		ge('PluginBody').classList.add("theme-mode-sync"); 
		chrome.storage.sync.set({'theme': 'Dark'}, function() { 
	      console.log('Theme settings saved');
	    });
	}else{
		ge('PluginBody').classList.remove('theme-mode-sync'); 
		chrome.storage.sync.set({'theme': 'Light'}, function() { 
	      console.log('Theme settings saved');
	    });
	} 
}

function DefaultTheme(){
	chrome.storage.sync.get(['theme'], function(result) { 
        if(result.theme == 'Dark'){ 
			ge('PluginBody').classList.add("theme-mode-sync"); 
			ge('theme_changer').checked = true;
		}else{
			ge('PluginBody').classList.remove('theme-mode-sync'); 
			ge('theme_changer').checked = false;
		}  
    });
}

function xchange() {
	if (x.readyState == 4) {
		if (x.status == 200) {
			var jsonobj = x.responseText;            
			parseJSON(jsonobj);
		} else {
			alert("Couldn't complete request, please report the bug to the developer:\n" + x.statusText);
		}
	}
}

function parseJSON(jsonobj) {
	var document = JSON.parse(jsonobj);   

	ge('loading').style.display = 'none';
	ge('header_container').style.display = '';
	ge('main_container').style.display = '';
	ge('lastcheck_container').style.display = '';
 
	var ip_inner   = document.geoplugin_request;
	var location   = document.geoplugin_city;
	var country    = document.geoplugin_countryName+'('+document.geoplugin_countryCode+')';
	var coordinate = document.geoplugin_latitude+','+document.geoplugin_longitude;
	 

	ge('ip_inner').innerHTML   = ip_inner;
	ge('location').innerHTML   = location;
	ge('country').innerHTML    = country;
	ge('coordinate').innerHTML = coordinate;
	
	lastChecks();
	pushCheck({ip_inner:ip_inner, location:location, country:country, coordinate:coordinate, date:new Date().toUTCString()});
}

function lastChecks() {
	checks = JSON.parse(localStorage.getItem('lastchecks'));
	h = '';
	
	if (checks) {
		for (var a = checks.length-1; a >= 0; a--) {
			ch = checks[a];
 			h += '<div class="detected"><div class="detected__apps"><span class="detected__app-name">'; 
			h += '<div class="lastcheck">'+ch.date+'<br /><strong>'+ch.ip_inner+'</strong>, '+ch.location+', '+ch.country+'</div>';
 			h += '</span></div></div><br/>'; 
		}
	} else {
		h += '<span class="lastips">No IPs checked before.</span><br />';
	}	
	ge('lastchecks').innerHTML = h;
}

function pushCheck(check) {
	checks = JSON.parse(localStorage.getItem('lastchecks'));
	
	if (checks == null)
		checks = new Array();
	if (checks.length >= 6)
		checks.shift();
	checks.push(check);
	localStorage.setItem('lastchecks', JSON.stringify(checks));
}

function ge(id) {
	return document.getElementById(id);
}

function loadit() {	
	x.open("GET", checkurl, true);
	x.onreadystatechange = xchange;
	x.send(null);

	ge('loading').style.display = 'block';
	ge('header_container').style.display = 'none';
	ge('main_container').style.display = 'none';
	ge('lastcheck_container').style.display = 'none';

	DefaultTheme();
}


var checkurl = 'http://www.geoplugin.net/json.gp';
var x = new XMLHttpRequest();


///////


setTimeout(function() {
	loadit();  
}, 10);
 

ge('reload-link').addEventListener('click', function() {
	loadit(); 
}, false);

ge('theme_changer').addEventListener('click', function() { 
	ThemeChanger();
}, false);