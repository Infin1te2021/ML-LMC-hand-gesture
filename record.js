const { count } = require('console');
var Cylon = require('cylon');
var fs = require('fs');
var lastGesture = '';
var lastGestureTime = Date.now();
var handPresent = false;
var timer = null;
var handStartPosition = [];
var direction = 'no motion';
var distance = 0;
previous_time=0


function vectorToString(vector, digits) {
    if (typeof digits === "undefined") {
        digits = 1;
    }
    return "(" + vector[0].toFixed(digits) + ", "
                + vector[1].toFixed(digits) + ", "
                + vector[2].toFixed(digits) + ")";
}

function saveCSV(data) {
    fs.appendFile("fingerRec.csv", data, function (err) {
        if (err) {
            console.log(err)
        }
//        else {
//            console.log(data)
//        }
    });
}

function readCSV() {
    fs.readFile("fingerRec.csv", "utf8", function (err, data) {
        var lines = data.trim().split('\n');
        var lastLine = lines.slice(-1)[0];
        console.log(lastLine.slice(0, -1));
    });
}


Cylon.robot({
    connections: {
        leapmotion: {
        adaptor: 'leapmotion'
        }
    },

    devices: {
        leapmotion: {
        driver: 'leapmotion'
        }
    },

    work: function(device) {
        device.leapmotion.on('hand', function(hand) {
        var handOpen = !!hand.fingers.filter(function(f) {
            return f.extended;
        }).length;

        if (handOpen) {
            direction = 'no motion';
            distance = 0;

            clearTimeout(timer);
            timer = setTimeout(function() {
                handPresent = false;
                lastGesture = 'hand_gone';
                handStartPosition = [];
                direction = 'no motion';
                distance = 0;

            }, 1500);

            var correctDirection = function(direction) {
                var orientation = {
                    forward: {
                        left: 'left',
                        right: 'right',
                        down: 'forward',
                        up: 'back',
                        forward: 'up',
                        back: 'down'
                        },
                    up: {
                        left: 'left',
                        right: 'right',
                        down: 'down',
                        up: 'up',
                        forward: 'forward',
                        back: 'back'
                        }
                };
                return orientation[config.orientation][direction];
                }

                if (!handPresent) {
                    handPresent = true;
                    lastGesture = 'hand_present';
                    handStartPosition = hand.palmPosition;
                    direction = 'no motion';
                    distance = 0;
                }

/*
                var palmX = hand.palmPosition[0].toString()
                var palmY = hand.palmPosition[1].toString()
                var palmZ = hand.palmPosition[2].toString()
                palmString = palmX + ',' + palmY + ',' + palmZ + ','
                var stabilized = hand.stabilizedPalmPosition;
                var speed = hand.palmVelocity;

                var finger = hand.fingers[0];
                var position = finger.pipPosition;
                delta = (stabilized)
                console.log(stabilized);
                
                saveCSV([palmString] + '\n')
*/
            }
        });

        var count = 100
        device.leapmotion.on('hand', function(frame) {
            var timestamp = frame.timestamp
            var pointableString = "";
            current_time=frame.timestamp
            time_delta=current_time-previous_time
            var fingerTypeMap = ["Thumb", "Index finger", "Middle finger", "Ring finger", "Pinky finger"];
            if (count > 0){
                for (var i = 0; i < frame.pointables.length; i++) {
                    var pointable = frame.pointables[i];
                    pointableString += pointable.tipPosition[0] + ',' + pointable.tipPosition[1] + ',' + pointable.tipPosition[2] + ',' 
                    var speed =  pointable.tipVelocity + ','
                    pointableString += speed
                }
                count = count - 1
                console.log(count);
                saveCSV([pointableString.slice(0, -1)] + '\n')
            }else{
                console.log('record complete, please restart the program');
                return
            }



            //numOfFloatNum = (pointableString.match(/,/g) || []).length - 1
            //var splitPointableArray = pointableString.split(",")
            // 

        })
    }
}).start();
