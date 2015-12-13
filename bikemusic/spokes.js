$('#reaperfile').change(function() {
  console.log(this.files);
  console.log(this.files[0].name);
  
  var f = new FileReader();
  f.onload = function(e) {
    var contents = e.target.result;
    var events = parseFile(contents);
    var ao = (new ArduinoOutput).init();
    $('#arduinooutput').val(ao.render(events));
    
    //console.log(contents);
  };
  f.readAsText(this.files[0]);
});

function parseFile(filedata) {
  var lines = filedata.split('\n');
  var columns = lines.shift().replace(/"/g,'').split(/[:;]/);
  console.log(columns);

  var events = [];
  for (var i=0,l=lines.length; i<l; i++) {
    var fields = lines[i].split(';');
    if (fields.length < 12) continue;
    var v = {
      id: fields[0],
      track: Number(fields[1]),
      start: Number(fields[2]),
      duration: Number(fields[3]),
      file: fields[11],
      repeating: (fields[11].match(/repeated/i) == null)
    };
    events.push([v.start, 'start', v]);
    events.push([v.start + v.duration, 'end', v]);
  }
  events.sort(function(a,b) {
    //ascending on time, ends, before begins
    return (a[0] - b[0]) || (a[1] != 'end');
  });
  window.revents = events;
  return events;
}

function ArduinoOutput() {}
ArduinoOutput.prototype = {
  init: function() {
    for (var k in this.emit) {
      this.emit[k] = this.emit[k].bind(this);
    }
    return this;
  },
  render: function(events) {
    var result = [];
    var repeating = {};
    result.push(this.emit.beginning());
    //last event is guaranteed to be an end, so easier to assume a next
    for (var i=0,l=events.length; i<l-1; i++) {
      var e = events[i];
      var next = events[i+1];
      result.push(this.emit.log(e));
      if (e[1] == 'start') {
        if (e[2].repeating) {
          repeating[e[2].track] = true;
        } else {
          result.push(this.emit.on(e[2].track));
        }
      } else if (e[1] == 'end') {
        result.push(this.emit.off(e[2].track));
        if (e[2].repeating) {
          delete repeating[e[2].track];
        }
      }
      //dur.dur is state, which gets modified by repeating()
      var dur = {dur: next[0] - e[0]};
      if (dur.dur > 0 && !jQuery.isEmptyObject(repeating)) {
        result.push(this.emit.repeating(repeating, dur));
      }
      if (dur.dur > 0) { //dur.dur might have changed
        result.push(this.emit.delay(dur.dur));
      }
    }
    result.push(this.emit.ending());
    return result.join('');
  },
  led: [
    ["led10"],
    ["led10"],
    ["led9"],
    ["led9"],
    ["led8"],
    ["led8"],
    ["led7"],
    ["led7"],
    ["led6"],
    ["led6"],
    ["led10","led9","led8","led7","led6",]
  ],
  emit: {
    log: function(ee) {
      var v = ee[2];
      return ("\n//line id:" + v.id
              + " event:" + ee[1]
              + " track:" + v.track
              + " start:" + v.start
              + " duration:" + v.duration
              + " rep:" + v.repeating
              + "\n"
             );
    },
    on: function(tr) {
      return this.led[tr].map(function(t) {
        return ("digitalWrite("+t+", HIGH);\n");
      }).join('');
    },
    off: function(tr) {
      return this.led[parseInt(tr)].map(function(t) {
        return ("digitalWrite("+t+", LOW);\n");
      }).join('');
    },
    delay: function(delay) {
      return "delay(" + delay + ");\n";
    },
    repeating: function(repeating, dur) {
      var self = this;
      var count = parseInt(dur.dur / 400);
      //STATE change
      dur.dur = dur.dur - (count * 400);
      return (
        "\n//blink tracks: " + Object.keys(repeating).join(',') + "\n"
        + "for (float f = 0; f < " + count + "; f++) {\n"
        + Object.keys(repeating).map(function(r) {
          return self.emit.on(r);
        }).join('')
        + self.emit.delay(200)
        + Object.keys(repeating).map(function(r) {
          return self.emit.off(r);
        }).join('')
        + self.emit.delay(200)
        + "}\n"
      );
    },
    ending: function() {
      return "\nbreak;\n}}";
    },
    beginning: function() {
      return (""
              + "\n// constants won't change. They're used here to"
              + "\n// set pin numbers:"
              + "\nconst int switchPin0 = 31;     // the number of the switch0 pin"
              + "\nconst int switchPin1 = 33;    // the number of the switch1 pin"
              + "\nconst int switchPin2 = 35;"
              + "\nconst int switchPin3 = 37;"
              + "\n"
              + "\n// numbers of the LEDs"
              + "\nint led10 = 7;"
              + "\nint led9 = 6;"
              + "\nint led8 = 5;"
              + "\nint led7 = 4;"
              + "\nint led6 = 3;"
              + "\n"
              + "\n"
              + "\n"
              + "\nvoid setup() {"

              + "\n  // put your setup code here, to run once:"
              + "\n  // initialize the LED pins as output:"
              + "\n  pinMode(7, OUTPUT);"
              + "\n  pinMode(6, OUTPUT);"
              + "\n  pinMode(5, OUTPUT);"
              + "\n  pinMode(4, OUTPUT);"
              + "\n  pinMode(3, OUTPUT);"
              + "\n"
              + "\n  // initialize the switch pins as input:"
              + "\n  pinMode(switchPin0, INPUT);"
              + "\n  pinMode(switchPin1, INPUT);"
              + "\n  pinMode(switchPin2, INPUT);"
              + "\n  pinMode(switchPin3, INPUT);"
              + "\n}"
              + "\n"
              + "\nvoid loop() {"
              + "\n  // put your main code here, to run repeatedly:"
              + "\n"
              + "\n// compute a number for the switch"
              + "\n"
              + "\nint switchPosition = 0;"
              + "\n"
              + "\nif (digitalRead(switchPin0) == HIGH) switchPosition = 1;"
              + "\nif (digitalRead(switchPin1) == HIGH) switchPosition = 2;"
              + "\nif (digitalRead(switchPin2) == HIGH) switchPosition = 3;"
              + "\nif (digitalRead(switchPin3) == HIGH) switchPosition = 4;"
              + "\n"
              + "\nswitch (switchPosition)"
              + "\n"
              + "\n{"
              + "\n"
              + "\ncase 0:"
              + "\n"
              + "\ndigitalWrite(led10, LOW);"
              + "\ndigitalWrite(led9, LOW);"
              + "\ndigitalWrite(led8, LOW);"
              + "\ndigitalWrite(led7, LOW);"
              + "\ndigitalWrite(led6, LOW);"
              + "\nbreak;"
              + "\n"
              + "\ncase 1:"
              + "\n//null"
              + "\ndigitalWrite(led10, HIGH);"
              + "\ndigitalWrite(led9, HIGH);"
              + "\ndigitalWrite(led8, HIGH);"
              + "\ndigitalWrite(led7, HIGH);"
              + "\ndigitalWrite(led6, HIGH);"
              + "\nbreak;"
              + "\n"
              + "\n"
              + "\ncase 2:"
              );
      }/*beginning*/
  }/*emit*/
};
