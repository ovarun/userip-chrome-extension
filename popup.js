
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

function HTMLParser(aHTMLString){
  var html = document.implementation.createHTMLDocument("some title");
  html.documentElement.innerHTML = aHTMLString;

  return html;
}

function getNode(document, element, xpath) {
	var itemNodes = document.evaluate(xpath, element, null,XPathResult.ANY_TYPE, null);
	var itemNode = itemNodes.iterateNext();
	while (itemNode) {
		return itemNode;
	}
	return null;
}

function getNodes(document, element, xpath) {
	var itemNodes = document.evaluate(xpath, element, null,XPathResult.ANY_TYPE, null);
	var itemNode = itemNodes.iterateNext();
	var nodes = [];
	while (itemNode) {
		nodes.push(itemNode);
		itemNodes.iterateNext();
	}
	return nodes;
}

function xchange() {
	if (x.readyState == 4) {
		if (x.status == 200) {
			var html = x.responseText;            
			parseHTML(html);
		} else {
			alert("Couldn't complete request, please report the bug to the developer:\n" + x.statusText);
		}
	}
}

function parseHTML(h) {
	var document = HTMLParser(h);
	ge('loading').style.display = 'none';
	ge('main').style.display = 'block';
	var info = getNode(document, document.getElementsByTagName('body')[0], "//main");
	var ip = getNode(document, info, "//h1/strong").innerHTML;
	
	//var locationwrap = info.innerHTML.between('Your IP Address Location: ', '</h3>');
	//locationwrap = locationwrap.replace('src="/flags', 'src="http://ip-adress.com/flags');
	var locationwrap = getNode(document, info, "//p[1]/em[1]").innerHTML;
	var ispwrap = getNode(document, info, "//p[1]/em[2]").innerHTML;

	ge('ip_inner').innerHTML = ip;
	ge('location').innerHTML = locationwrap;
	ge('isp').innerHTML = ispwrap;
	
	lastChecks();
	pushCheck({ip:ip, lc:locationwrap, isp:ispwrap, date:new Date().toUTCString()});
}

function lastChecks() {
	checks = JSON.parse(localStorage.getItem('lastchecks'));
	h = '';
	
	if (checks) {
		h += '<span class="lastips">Last IPs:</span><br />';
		for (var a = checks.length-1; a >= 0; a--) {
			ch = checks[a];
			h += '<div class="lastcheck">'+ch.date+'<br /><strong>'+ch.ip+'</strong>, '+ch.lc+', '+ch.isp+'</div>';
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
	if (checks.length >= 5)
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
	ge('main').style.display = 'none';
}


var checkurl = 'https://www.ip-adress.com/';
var x = new XMLHttpRequest();


///////


setTimeout(function() {
	loadit();
}, 10);

ge('ip').addEventListener('click',
	function selectText() {
		var range = document.createRange();
		range.selectNode(ge('ip_inner'));
		window.getSelection().addRange(range);
	
    }
);

ge('reload-link').addEventListener('click', function() {
	loadit();
}, false);