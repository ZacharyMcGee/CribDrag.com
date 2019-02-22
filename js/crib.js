var grid_size = (26);
var ciphersize = 50;
var cribsize = 5;
var screenSize = $(window).width();
var sliderIndex = 0;
var currentX = 0;
var rightBound = document.getElementById('xor-ciphers-table').offsetWidth - document.getElementById('text-table').offsetWidth;


function cribdrag() {
  //var cribword = ascii_to_hex(document.getElementById("cribword").value);
  console.log(xor_hex("3b101c091d53320c000910", "071d154502010a04000419"));
  //console.log(cribword);
}

function copyMessage1(){
  var copyText = document.getElementById("pwd_spn");
  var textArea = document.createElement("textarea");
  textArea.value = copyText.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
}

function copyMessage2(){
  var copyText = document.getElementById("message1");
  copyText.select();
  document.execCommand("copy");
}

document.getElementById("ciphertext1").addEventListener('input', function (evt) {
  updateXORTable();
  updateXORResultText();
  updateBruteForce();
});

document.getElementById("ciphertext2").addEventListener('input', function (evt) {
  updateXORTable();
  updateXORResultText();
  updateBruteForce();
});

document.getElementById("cribword").addEventListener('input', function (evt) {
  updateCribTable();
  updateResultTable();
  updateBruteForce();
});

function hex_to_ascii(str) {
    var hex = str.toString();//force conversion
    var result = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        result += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return result;
}

function ascii_to_hex(str)
  {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++)
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
   }

function xor_hex(cipher1, cipher2) {
  var result = "",
  i = cipher1.length,
  j = cipher2.length;
  while (i-->0 && j-->0) {
    result = (parseInt(cipher1.charAt(i), 16) ^ parseInt(cipher2.charAt(j), 16)).toString(16) + result;
  }
  return result;
}

function updateXORResultText() {
  var cipher1 = document.getElementById("ciphertext1").value
  var cipher2 = document.getElementById("ciphertext2").value
  var inputHex = xor_hex(cipher1, cipher2);
  document.getElementById("ciphertextxorresult").value = inputHex;
}

function updateXORTable() {
  document.getElementById("xor-ciphers").innerHTML = "";
  var cipher1 = document.getElementById("ciphertext1").value;
  var cipher2 = document.getElementById("ciphertext2").value;
  var inputHex = xor_hex(cipher1, cipher2);
  console.log(inputHex);
  for(var i = 0; i < inputHex.length / 2; i++){
    var row = document.getElementById("xor-ciphers");
    var x = row.insertCell(i);
    x.innerHTML = inputHex.substring(i * 2, (i * 2) + 2);
  }
}

function updateCribTable() {
  document.getElementById("crib-hex-table").innerHTML = "";
  var cribword = document.getElementById("cribword").value;
  var inputHex = ascii_to_hex(cribword);
  for(var i = 0; i < inputHex.length / 2; i++){
    var row = document.getElementById("crib-hex-table");
    var x = row.insertCell(i);
    x.innerHTML = inputHex.substring(i * 2, (i * 2) + 2);
  }
}

function updateResultTable() {
  document.getElementById('box').style.width = "auto";
  var cribhex = ascii_to_hex(document.getElementById("cribword").value);
  var cipherhex = "";
  for(var i = 0; i < document.getElementById("xor-ciphers-table").getElementsByTagName("td").length; i++){
    cipherhex = cipherhex.concat(document.getElementById("xor-ciphers-table").getElementsByTagName("td")[i].innerHTML);
  }
  result = xor_hex(cipherhex.substring(((sliderIndex) * 2), ((sliderIndex) * 2) + cribhex.length), cribhex);
  document.getElementById("crib-result").innerHTML = hex_to_ascii(result);

  document.getElementById("result-hex-table").innerHTML = "";
  var cribword = result;
  for(var i = 0; i < cribword.length / 2; i++){
    var row = document.getElementById("result-hex-table");
    var x = row.insertCell(i);
    x.innerHTML = cribword.substring(i * 2, (i * 2) + 2);
  }
}

function updateBruteForce(){
  var table = document.getElementById("brute-results-table");
  var maxlength = document.getElementById("xor-ciphers-table").getElementsByTagName("td").length;
  var cribhex = ascii_to_hex(document.getElementById("cribword").value);
  var cipherhex = document.getElementById("ciphertextxorresult").value;

  table.innerHTML = "";
  for(var i = 0; i < maxlength - (cribhex.length / 2) + 1; i++){
    result = xor_hex(cipherhex.substring(((i) * 2), ((i) * 2) + cribhex.length), cribhex);
    var spacing = "";
    for(var j = 0; j < (cribhex.length / 2) * i * 2; j++){
      spacing = spacing.concat("&nbsp;");
    }
    var bruteResults = "Position [" + (i + 1) + "]: " + spacing + hex_to_ascii(result);
    var row = table.insertRow(i);
    var cell1 = row.insertCell(0);
    cell1.innerHTML = bruteResults;
  }
}

function selectBruteRow(index) {
  var row = document.getElementById("brute-results-table").getElementsByTagName("td");
  if(!row[index].classList.contains("highlight-td")) {
    for(var i = 0; i < row.length; i++){
      row[i].classList.remove('highlight-td');
    }
    row[index].classList.toggle("highlight-td");
  }
}

$(window).resize(function(){
  updateSliderPos();
});

function updateSliderPos(){
  rightBound = document.getElementById('xor-ciphers-table').offsetWidth - document.getElementById('text-table').offsetWidth;
  screenSize = $(window).width();
  $(".box").draggable({ containment: [(screenSize*.2) + 20, 0, (rightBound + screenSize*.2) + 20, 0] });
}

function resetMessage1() {
  document.getElementById("message1").value = "Message 1 Results";
}

function resetMessage2() {
  document.getElementById("message2").value = "Message 2 Results";
}

function correctSegment() {
  maxlength = document.getElementById("ciphertextxorresult").value.length / 2;
  cribsegment = document.getElementById("cribword").value;

  var segment = document.getElementById("crib-result").textContent;
  if(document.getElementById("message1").value == "Message 1 Results"){
    var emptystr = "";
    var message1 = "";
    var message2 = "";
    for(var i = 0; i < maxlength; i++) {
      emptystr = emptystr.concat("_");
    }
    message1 = emptystr;
    message2 = emptystr;
  }
  else
  {
    var message1 = document.getElementById("message1").value;
    var message2 = document.getElementById("message2").value;
  }
  message1 = message1.substring(0, sliderIndex) + segment + message1.substring(sliderIndex + segment.length, maxlength);
  message2 = message2.substring(0, sliderIndex) + cribsegment + message2.substring(sliderIndex + segment.length, maxlength);

  document.getElementById("message1").value = " ";
  document.getElementById("message2").value = " ";

  document.getElementById("message1").value = message1;
  document.getElementById("message2").value = message2;
}

function setSliderIndex(){
  var xPos = $(".box").offset().left;
  sliderIndex = Math.floor((xPos - ((41+screenSize)*.2))/grid_size);
}

function setResult() {

}

$(".box")
  .draggable({ drag: function(){
            updateSliderPos();
            setSliderIndex();
            updateResultTable();
            selectBruteRow(sliderIndex);
        }, containment: [(screenSize*.2) + 20, 0, (rightBound + screenSize*.2) + 20, 0], axis: "x", grid: [ grid_size, grid_size ] })
	.on("mouseover", function(){
  	$( this ).addClass("move-cursor")
	})
	.on("mousedown", function(){
  	$( this )
      .removeClass("move-cursor")
      .addClass("grab-cursor")
      .addClass("opac");
  	$(".text").hide();
	})
	.on("mouseup", function(){
  	$( this )
      .removeClass("grab-cursor")
      .removeClass("opac")
      .addClass("move-cursor");
	});

  function setup() {
    resetMessage1();
    resetMessage2();
    updateXORTable();
    updateCribTable();
    updateSliderPos();
    setSliderIndex();
    updateResultTable();
    updateBruteForce();
    selectBruteRow(0);
  }

  setup();
  new ClipboardJS('.copy-image');
