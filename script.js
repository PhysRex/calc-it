var calculate = {
	sigfigs: function() {
		return;
	},
	evaluate: function() {		
		var result;
		if (display.checkNums()) {
			try {
				result = eval( display.inputElem.value );	
			}
			catch(err) {
				result = "";
			}		
			
			// update ticker & input 
			display.ticker(result);
			display.inputElem.value = result;
		}
	}
};

var display = {
	inputElem: document.getElementById("input"),
	previous: ["0"],
	write: function (input) {
	// Add input to input field
		
		// don't allow repeated operator button clicks
		handlers.btnCheck(input);
		if (handlers.rptBtnClick > 1) {
			return;
		}
		// eliminate leading zero
		if (this.previous.length === 1 && /\d/gi.test(input)) {
			this.inputElem.value = "";
		}
		
		// save previous input
		this.previous.push(this.inputElem.value);
		
		//set new input
		this.inputElem.value = this.inputElem.value + input;
	},
	backspace: function () {
		this.inputElem.value = this.inputElem.value.slice(0,-1);
		this.previous.pop();
	},
	clearPrevious: function() {
		this.inputElem.value = this.previous[this.previous.length-1];
	},
	allClear: function() {
		this.inputElem.value = "0";
		this.previous = ["0"];
	},
	checkNums: function () {
		// check input entered into input field
		var str = this.inputElem.value;
		
		// reject if not numbers or operators
		var testStr = str.match(/(\(|\)|\*|\/|\-|\+|\.|\d)/gi);
		if (testStr.length !== str.length) {
			// write "input error" to ticker
			
			return false;
		}
		
		// reject if any consecutive operators FIXME#####################
		testStr = str.match(/(\+)\1+|(\-)\2+|(\*)\3+|(\/)\4+|(\.)\5+/gi);
		if (testStr > 0) {
			// write "input error" to ticker
			
			return false;
		}
		
		// Send str to Evaluate		
		return true;
		
	},
	ticker: function (result) {
	// display input and output to ticker on the side
		var tickerElem = document.querySelector(".printOut");
    var calcElem = elems.create("div", "", "calcDiv");
    
		calcElem.appendChild(elems.create("div", this.inputElem.value + "=", "calcIn"));
    calcElem.appendChild(elems.create("div", result, "calcOut"));
    // calcElem.appendChild(elems.create("div", "", "lineBreak"));
		tickerElem.appendChild(calcElem);
		
		// scroll to lastest position
		tickerElem.scrollTop = tickerElem.scrollHeight;
	}
};

var elems = {
	create: function(tag, tagText, tagClass) {
	// create HTML element with tag, tagClass, tagText
		var newElement = document.createElement(tag);
		newElement.className = tagClass;
		newElement.textContent = tagText;		
		return newElement;
	}	
};

var handlers = {
	rptBtnClick: 0,
	previouBtn: "",
	decimalCounter: 0,
	listeners: function() {
	// Event listeners for buttons clicked
		
		["click", "keydown"].forEach( function(val) {
			window.addEventListener( val, this.btnPress );
		}, this);
		
	},
	btnPress: function() {
	// get element that was clicked on as an event
		
		var elementClicked = event.target;		
		var elementPressed = event.keyCode;
		
		// check if previous element clicked was "=", then reset previous
		// check if operator pressed
		if ( /(\+)|(\-)|(\*)|(\/)/gi.test(display.inputElem.value.slice(-1)) ) {
			handlers.decimalCounter = 0;
		}
		if (this.previousBtn === "equal" || this.previousBtn === 13) {
			display.previous = ["0"];
			display.inputElem.value = "0";
		}
		
		// check for multiple decimals in a number
		// console.log("this decimal:",this.decimalCounter);
		if (elementClicked.id === "period" || elementPressed === 110 || elementPressed === 190 ) {
			// console.log("PERIOD", handlers.decimalCounter);
			// console.log("this:",this);
			handlers.decimalCounter += 1;
			// console.log("          times:", this.decimalCounter);

			if (handlers.decimalCounter > 1) {
				return;
			}
		}
		

		
		// console.log("event.target:",event.target);
		// chose which event info to pass along to switch statement
		var inputCheck = (event.type === "click") ? elementClicked.id : elementPressed ;
		// console.log("      keycode:",inputCheck);

		// Button press if/thens
		switch (inputCheck) {
			case "ac":
			case 46:
				display.allClear();
				break;
			case "ce":
				display.clearPrevious();
				break;
			case "back":
			case 8:
				display.backspace();
				break;
			case "plus":
			case 107:
				display.write("+");
				break;
			case "minus":
			case 109:
			case 189:
				display.write("-");
				break;
			case "times":
			case 106:
				display.write("*");
				break;
			case "division":
			case 111:
			case 191:
				display.write("/");
				break;
			case "plusmn":
				handlers.plusMinus();
				break;
			case "point":
			case 110:
			case 190:
				this.decimalCounter += 1;
				display.write(".");
				break;
			case "equal":
			case 13:				
				calculate.evaluate();
				break;
			case "input":
				break;
			case "0":
			case 48:
			case 96:
				display.write("0");
				break;
			case "1":
			case 49:
			case 97:
				display.write("1");
				break;
			case "2":
			case 50:
			case 98:
				display.write("2");
				break;
			case "3":
			case 51:
			case 99:
				display.write("3");
				break;
			case "4":
			case 52:
			case 100:
				display.write("4");
				break;
			case "5":
			case 53:
			case 101:
				display.write("5");
				break;
			case "6":
			case 54:
			case 102:
				display.write("6");
				break;
			case "7":
			case 55:
			case 103:
				display.write("7");
				break;
			case "8":
			case 56:
			case 104:
				display.write("8");
				break;
			case "9":
			case 57:
			case 105:
				display.write("9");
				break;
			default:
				// display.write(inputCheck);
				break;
											}
		
		// Show button depressed with keypress
		// elementClicked.classlist.add("active");
		// var fakeBtnClick = setTimeout( function() {
		// 	elementClicked.classlist.remove("active");
		// }, 500);
		
		elementClicked.blur();
		this.previousBtn = inputCheck;
	},
	plusMinus: function() {
		// FIXME ##################################
		// var len = display.inputElem.value.length;
		// display.inputElem.value = ( /\d/gi.test(display.inputElem.value[len-1]) ||  ) ? display.inputElem.value : display.inputElem.value ;
		var temp = display.inputElem.value.slice(0);
		// var signChg = temp.replace(/(\d+)$/g,"("+sign+"$1)");
		try {
			var sign = temp.match(/(\+|\-)\d+$/g)[0][0];
			var nums = temp.match(/\d+$/g)[0];			
		}
		catch(err) {}
		if (sign==="+") {
			temp = temp.replace(/((\+|\-)\d+)$/g,"-"+nums);
		} else if (sign === "-") {
			temp = temp.replace(/((\+|\-)\d+)$/g,"+"+nums);
		} else if ( !/\D/g.test(temp) ) {
			temp = temp.replace(/(\d+)/g, "-$1");
		}
		display.inputElem.value = temp.slice(0);
		
	},
	typeInput: function() {
		// Event listeners for typed input to be recognized by calculator
		
	},
	btnCheck: function(input) {
		// stop repeated operators pushed
		if ( /(\(|\)|\*|\/|\-|\+|\.)/gi.test(input) ) {
			this.rptBtnClick += 1;
		} else {
			this.rptBtnClick = 0;
		}
	}
};

handlers.listeners();