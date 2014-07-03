try { repod; } catch(e) { repod = {}; }
repod.muh_games = {
	gamelist: [],
    init: function() {
		this.config = {
			totalgames: parseInt(/(\d+) Matches$/.exec($(".statsText").text())[1]),
			past: "",
            timerID: 0,
            delay: 3000
		}
		this.genDisplay();
        this.startTimer();
        return 1;
	},
	parsePage: function() {
		if ($(".gridViewportPaneWrapper").html() !== this.config.past) {
            this.config.past = $(".gridViewportPaneWrapper").html();
			$("#sub_container").html("Parsing page "+(this.gamelist.length/24+1)+" out of "+Math.ceil(this.config.totalgames/24)+". ("+Math.round((repod.muh_games.gamelist.length / repod.muh_games.config.totalgames) * 100)+"%)");
			$("li.cellDlItemGame").each(function() {
				var info = $(this).find(".mediaInfo");
				var gametitle = info.find(".gameTitle").text();
				var size = info.find(".size").text().replace("|","");
				var platform = [];
				var date = info.find(".purchaseDate").text().replace("|","");
				var icon = $(this).find(".thumbPane").find("img").attr("src");
				var url = $(this).find(".thumbPane").parent().attr("href");
				info.find(".playableOn").children("a").each(function() { platform.push($(this).text()) });
				repod.muh_games.gamelist.push({title:gametitle,size:size,platform:platform,date:date,url:url,icon:icon});
			});
			if (this.gamelist.length >= this.config.totalgames) {
				clearInterval(this.config.timerID);
				this.genTable();
			} else {
				 this.nextPage();
			}
		}
        return 1;
	},
	startTimer: function(delay) {
        var delay = (delay) ? delay : this.config.delay;
        this.config.timerID = setInterval(function(){repod.muh_games.parsePage();},delay);
	},
	nextPage: function() {
		$(".navLinkNext").trigger("click"); //Anonymous functions, please.
        return 1;
	},
	genDisplay:function() {
		$("body").append("<div id='muh_games_container' style='position:absolute;top:0px;bottom:0px;right:0px;left:0px;color:#000;z-index:9001;text-align:center' />");
		$("#muh_games_container").append("<div id='sub_container' style='background-color:#fff'/>");
		return 1;
	},
	genTable: function() {
		$("<style type='text/css'>table,th,td{border:1px solid #999;border-collapse:collapse;} th {padding:5px;}td a {display:block;width:100%;height:100%;color:#000 !important;padding:2px;} td a:hover{background-color:#ccc;}</style>").appendTo("head");
		$("#sub_container").slideUp('slow').html("<table id='muh_table' style='display:inline-block;text-align:left'><tr><th>Icon</th><th style='min-width:600px'>Name</th><th>Platform(s)</th><th>Size</th><th>Date</th></tr></table>");
		var temp = "";
		$.each(repod.muh_games.gamelist,function(index,val) {
			var plats = []; $.each(val['platform'],function(i,v) { plats.push("<span class='sys'>"+v+"</span>"); });
			temp += "<tr><td style='max-width:31px;max-height:31px;'><img src='"+val['icon']+"' style='height:100%;width:100%;vertical-align:text-top'/></td><td><a target='_blank' href='"+val['url']+"'>"+val['title']+"</a></td><td>"+plats.join(" ")+"</td><td>"+val['size']+"</td><td>"+val['date']+"</td></tr>";
		});
		$("#muh_table > tbody").append(temp);
		$("#sub_container").slideDown('slow');
		return 1;
	}
}
repod.muh_games.init();