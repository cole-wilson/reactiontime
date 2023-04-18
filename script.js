var max_delay = 10;

function randomTime() {
	let time = Math.random() * max_delay * 1000;
	return time;
}

var last = -1;
var type = "_";
let ins = document.getElementById("instructions")
let topi = document.getElementById("top")
let bottomi = document.getElementById("bottom")
let div = document.getElementsByTagName("div")[0]
let audio = new Audio("./beep.ogg")
var timeoutID = ""
let table = document.getElementsByTagName("table")[0]

var data = {light:[], sound:[]}

function light() {
	type = "light"
	document.body.style.background = "white";
	div.style.color = "black";
	ins.innerHTML = "click!"
	last = performance.now();
}
function sound() {
	type = "sound"
	audio.currentTime = 0.5;
	audio.play()
	last = performance.now();
	setTimeout(()=>audio.pause(),1000)
}
function go() {
	timeoutID = setTimeout([light, sound][Math.floor(Math.random()*2)], randomTime())
}

function interaction(e) {
	if (e instanceof KeyboardEvent && e.code != 'Space')
		return
	if (e.target.closest('[noclick]') !== null)
		return
	let now = performance.now()
	if (last == -1) {
		document.body.style.background = "black"
		ins.innerHTML = "wait for light or sound..."
		topi.innerHTML = ""
		bottomi.innerHTML = ""
		div.style.color = "white";
		last = 0;
		go()
	}
	else if (last == 0) {
		document.body.style.background = "red"
		ins.innerHTML = "too soon!";
		topi.innerHTML = ""
		bottomi.innerHTML = "click to try again"
		div.style.color = "white";
		clearTimeout(timeoutID)
		last = -1;
	}
	else {
		let diff = (now-last).toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2})
		data[type].push(diff);
		last = -1;

		var temp = ""
		temp += "<tr><th>#</th><th>light (ms)</th><th>sound (ms)</th></tr>"
		for (var i=0;i<Math.max(data.sound.length, data.light.length);i++) {
			temp += `<tr><td>${i+1}</td><td>${data.light[i]||' '}</td><td>${data.sound[i]||' '}</td></tr>`
		}
		table.innerHTML = temp

		document.body.style.background = "green"
		ins.innerHTML = diff + " ms";
		topi.innerHTML = type + " trial " + data[type].length;
		bottomi.innerHTML = "click to go again"
		div.style.color = "white";
	}
}

window.onload = () => {
	window.onclick = interaction
	window.onkeydown = interaction
}
