/*
    Author: SuperSuRaccoon
    Date:   2013/8/5
    Name:   Cocos2d + $1 Unistroke Recognizer Demo
	Desc:	xxxxxx
*/
var DemoLayer = cc.Layer.extend({
    init:function () {
        this._super();
		
		// close fps display
        cc.Director.getInstance().setDisplayStats(false);
		
		// data init
		this._winSize = cc.Director.getInstance().getWinSize();
		this._r = new DollarRecognizer();
		this._points = new Array();
		this._thresholdScore = 0.8;
		
		// title label
		var titleLabel = cc.LabelTTF.create("$1 Unistroke Recognizer Demo", "Arial Black", 26);
		titleLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height * 12 / 13));
		this.addChild(titleLabel); 
		
		// info label
		this._resultLabel = cc.LabelTTF.create("", "Arial", 16);
		this._resultLabel.setPosition(cc.p(this._winSize.width / 2, this._winSize.height * 11 / 13));
		this.addChild(this._resultLabel);
		this._resultLabel.setString("Gestures loaded, on click to draw, on more click to release (Gestures loaded: V, Z, W, Square)");
		
		// enable mouse
		if( 'mouse' in sys.capabilities ) {
			this._mouseDown = false;
            this.setMouseEnabled(true);
        }
		
		// preload gestures
		this._r.AddGesture("z", jsonDictFromFile("gesture/z.json")[0]);
		this._r.AddGesture("V", jsonDictFromFile("gesture/V.json")[0]);
		this._r.AddGesture("square", jsonDictFromFile("gesture/square.json")[0]);
		this._r.AddGesture("W", jsonDictFromFile("gesture/W.json")[0]);

        return true;
    },
	// mouse
    onMouseDown:function (event) {
		if (this._mouseDown) {
			// draw over
			this._mouseDown = false
			var result = this._r.Recognize(this._points, false);
			this.showResult(result);
			this._points.length = 0;
		}
		else {
			// start draw
			this._mouseDown = true;
			var loc = event.getLocation();
			this.removeChildByTag(99, true);
			var streak = cc.MotionStreak.create(99, 2, 4, cc.GREEN, s_streak);
			this.addChild(streak, 99, 99);
			streak.setPosition(loc);
			this._points.push(new Point(loc.x, this._winSize.height - loc.y));
		}
    },
    onMouseMoved:function (event) {
		if (!this._mouseDown) return;
		var loc = event.getLocation();
		var streak = this.getChildByTag(99);
		streak.setPosition(loc);
		this._points.push(new Point(loc.x, this._winSize.height - loc.y));
    },
	onMouseUp:function (event) {
    },
	showResult:function (result) {
		cc.log(result);
		if (result.Score < this._thresholdScore)
			result.Name = "score too low"
		this._resultLabel.setString("Last gesture: " + result.Name + ", on click to draw, on more click to release");
	}
});

var DemoScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new DemoLayer();
        layer.init();
        this.addChild(layer);
    }
});

var jsonDictFromFile = function (fileName) {
	var jsonData = cc.FileUtils.getInstance().getByteArrayFromFile(fileName, 0, 0);
	var jsonString = "";
	for(i = 0; i < jsonData.length; i++) 
		jsonString += String.fromCharCode(jsonData[i]);
	return JSON.parse(jsonString);
};