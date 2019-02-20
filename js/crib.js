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

document.getElementById("ciphertext1").addEventListener('input', function (evt) {
  updateXORTable();
  updateXORResultText();
});

document.getElementById("ciphertext2").addEventListener('input', function (evt) {
  updateXORTable();
  updateXORResultText();
});

document.getElementById("cribword").addEventListener('input', function (evt) {
  updateCribTable();
  updateResultTable();
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
  console.log("RESULT");
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

function correctSegment() {
  maxlength = document.getElementById("ciphertextxorresult").value.length / 2;
  var segment = document.getElementById("crib-result").textContent;
  if(document.getElementById("message1").value == "Message 1 Results"){
    var emptystr = "";
    var message1 = "";
    for(var i = 0; i < maxlength; i++) {
      emptystr = emptystr.concat("_");
    }
    message1 = emptystr;
  }
  else
  {
    var message1 = document.getElementById("message1").value;
  }
  message1 = message1.substring(0, sliderIndex) + segment + message1.substring(sliderIndex + segment.length, maxlength);
  document.getElementById("message1").value = " ";

  document.getElementById("message1").value = message1;
  console.log("HEY " + message1);
}

function setSliderIndex(){
  var xPos = $(".box").offset().left;
  sliderIndex = (xPos - ((41+screenSize)*.2))/grid_size;
}

function setResult() {

}

$(".box")
  .draggable({ drag: function(){
            updateSliderPos();

            setSliderIndex();
            console.log("index: " + sliderIndex);
            console.log("this: " + sliderIndex*grid_size);


            updateResultTable();
        }, containment: [(screenSize*.2) + 20, 0, (rightBound + screenSize*.2) + 20, 0], axis: "x", grid: [ grid_size, grid_size ] })
	.on("mouseover", function(){
  	$( this ).addClass("move-cursor")
	})
	.on("mousedown", function(){
  	$( this )
      .removeClass("move-cursor")
      .addClass("grab-cursor")
      .addClass("opac");

  	$(" .text ").hide();

	})

	.on("mouseup", function(){
  	$( this )
      .removeClass("grab-cursor")
      .removeClass("opac")
      .addClass("move-cursor");
	});

  function setup() {
    resetMessage1();
    updateXORTable();
    updateCribTable();
    updateSliderPos();
    setSliderIndex();
    updateResultTable();
  }

  setup();
