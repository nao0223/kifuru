var startLearn	= function(){
	var barChartData1 = {
		labels :appdata.graph1.labels,
		datasets : [
			{
				fillColor : "rgba(255,255,255,0.95)",
				strokeColor : "rgba(255,255,255,0.8)",
				highlightFill: "rgba(255,255,255,0.8)",
				highlightStroke: "rgba(255,255,255,1)",
				data : appdata.graph1.data
			}
		]
	};

	var barChartData2 = {
		data	:  [
			{
				value: appdata.graph2.value,
				color: "rgba(255,255,255,1)",
				highlight: "#fff",
				label: "残存"
			},
			{
				value: (100-appdata.graph2.value),
				color: "rgba(255,0,0,1)",
				highlight: "rgba(255,0,0,1)",
				label: "消滅"
			}
		]
	};

	var data = {
		powMax		:	appdata.graph2.value
		,powMax2		:	appdata.graph2.value2
		,msg1			:	appdata.learnMsg1
		,msg2			:	appdata.learnMsg2
	};
	var status = {
		pow				:	100
		,pow2				:	0
		,msg1			:	""
		,msg1start	:	false
		,msg2			:	""
		,msg2start	:	false
	};
	
	var showGraph = function(){
		var opts1 = {
	    scaleOverride : true,
		// Number - The number of steps in a hard coded scale
	    scaleSteps: 3,
	    // Number - The value jump in the hard coded scale
	    scaleStepWidth: 100,
	    // Number - The scale starting value
	    scaleStartValue: 0,
	    //Number - Pixel width of the bar stroke
	    barStrokeWidth : 4,
	    //Number - Spacing between each of the X value sets
	    barValueSpacing : 5,
	    //Number - Spacing between data sets within X values
	    barDatasetSpacing : 1,
	    // String - Colour of the scale line
	    scaleLineColor: "rgba(255,255,255,1)",
		//String - Colour of the grid lines
	    scaleGridLineColor :"rgba(255,255,255,0)",
	    // Number - Scale label font size in pixels
	    scaleFontSize: 20,
	    // String - Scale label font weight style
	    scaleFontStyle: "normal",
	    // String - Scale label font colour
	    scaleFontColor: "#fff",
		responsive : false
		};	
		
		var opts2 = {
		//Boolean - Whether we should show a stroke on each segment
	    segmentShowStroke : true,
	    //String - The colour of each segment stroke
	    segmentStrokeColor : "rgba(255,255,255,0)",
	    //Number - The width of each segment stroke
	    segmentStrokeWidth : 0,
	    //Number - The percentage of the chart that we cut out of the middle
	    percentageInnerCutout : 95, // This is 0 for Pie charts
	    //Number - Amount of animation steps
	    animationSteps : 100,
	    //String - Animation easing effect
	    animationEasing : "easeOutBounce",
	    //Boolean - Whether we animate the rotation of the Doughnut
	    animateRotate : true,
	    //Boolean - Whether we animate scaling the Doughnut from the centre
	    animateScale : false
		};
/*
		window.learnGraph1 = new Chart($("#learn-graph1")[0].getContext("2d")).Bar(barChartData1, opts1);
*/
		window.learnGraph2 = new Chart($("#learn-graph2")[0].getContext("2d")).Doughnut(barChartData2.data, opts2);
	};

	var showStage	= function(){
	
		var stage;
		var textUsedPer;
		var textUsedLabel;
		var textMsg1;
		var textMsg2;
	
		var initStage = function(){
			stage = new createjs.Stage($("#learn-stage")[0]);

			// 電力使用量
			textUsedPer = new createjs.Text("0", "40px Arial", "#fff"); 
			textUsedPer.x		= 100;
			textUsedPer.y		= 20;
			stage.addChild(textUsedPer);
			textUsedLabel = new createjs.Text(appdata.graph2.title, "22px Arial", "#fff"); 
			textUsedLabel.x		= 100;
			textUsedLabel.y		= 60;
			stage.addChild(textUsedLabel);
			
			textUsedPer2 = new createjs.Text("0", "40px Arial", "red"); 
			textUsedPer2.x		= 60;
			textUsedPer2.y		= 90;
			stage.addChild(textUsedPer2);
			textUsedLabel2 = new createjs.Text(appdata.graph2.title2, "22px Arial", "red"); 
			textUsedLabel2.x		= 60;
			textUsedLabel2.y		= 130;
			stage.addChild(textUsedLabel2);

			// メッセージ1
			textMsg1 = new createjs.Text("", "13px Arial", "#fff"); 
			textMsg1.x		= 20;
			textMsg1.y		= 210;
			textMsg1.width		= 200;
			textMsg1.lineHeight	= 18;
			stage.addChild(textMsg1);
			
			createjs.Tween.get(textMsg1)
			.wait(500)
			.call(function(){status.msg1start = true;})
			;
		
			// メッセージ2
			textMsg2 = new createjs.Text("", "20px Arial", "red"); 
			textMsg2.x		= 30;
			textMsg2.y		= 310;
			textMsg2.width		= 200;
			textMsg2.lineHeight	= 22;
			stage.addChild(textMsg2);
		
			createjs.Tween.get(textMsg2)
			.wait(5500)
			.call(function(){status.msg2start = true;})
			;
			
			createjs.Ticker.setFPS(30);
		};
		
		var updateStage = function(){
			//update pow
			if(status.pow > data.powMax){
				status.pow-=2;
				textUsedPer.text = Math.max(status.pow , data.powMax) + "%";
			}
			if(status.pow2 < data.powMax2){
				status.pow2+=2;
				textUsedPer2.text = Math.min(status.pow2 , data.powMax2) + "%";
			}
			
			//update msg1
			if(status.msg1start && status.msg1.length < data.msg1.length){
					//1文字追加
					status.msg1 = data.msg1.substring(0,status.msg1.length + 1);
					textMsg1.text = status.msg1;
					if(status.msg1 == data.msg1){
						status.msg1start = false;
					}
			}
			//update msg2
			if(status.msg2start && status.msg2.length <= data.msg2.length){
					//1文字追加
					status.msg2 = data.msg2.substring(0,status.msg2.length + 1);
					textMsg2.text = status.msg2;
					if(status.msg2 == data.msg2){
						status.msg2start = false;
					}				
			}		
		    stage.update();
		};		
		
		initStage();
		createjs.Ticker.addEventListener("tick", updateStage);
	};
	
	var hideGraph	= function(){
		
	}
	
	showStage();
	showGraph();
	
};

var appdata = {
	learnBg		:	"img/p_energy_l.jpg"
	,graph1			:	{
		labels		:	["原子力","火力","水力","揚水","地熱","太陽光"]
		,data		:	[150,240,80,1,2,20]
	}
	,graph2			:	{
		value	:	20
		,title		:	"残り"
		,value2	:	80
		,title2		:	"消滅"
	}
	,learnMsg1	:	
		[
		"WRI（世界資源研究所）の報告によると"
		,"世界の原生林8000年前に比べて、"
		,"その8割が消滅している。"
		,"だから今、俺は20％の現実しか"
		,"知らないかもしれない。それでも、 "
		].join("\n")
	,learnMsg2	:	
		[
		"俺はタマヒメが好きだ"
		].join("\n")

};
