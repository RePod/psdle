		/*
	Home-grown. Not intended to be amazing.
*/

var repod = {}

repod.grid = {
	config: {},
	init: function() {
		var that = this;
		$("dl [id^=goto_]").click(function() {
			ga('send', 'event', 'features', 'click', $(this).text().trim());
			that.caro.goto_slide("#"+$(this).attr("id").split("goto_").pop());
		});
		this.caro.bind();
		this.caro.start();
	},
	caro: {
		start: function() {
			var that = this;
			clearInterval(repod.grid.config.carousel_id);
			repod.grid.config.carousel_id = setInterval(function() { that.next() },5000);
		},
		bind: function() {
			var that = this, p = 20,
				x1 = $("#caro").offset().left-($("#caro_slides").children().length-1)*800-p, 
				y1 = $("#caro_slides").offset.top,
				x2 = $("#caro").offset().left+p,
				y2 = y1+800;
			//http://stackoverflow.com/a/6404215
			$("#caro_slides").draggable({
				axis: "x",
				containment: [x1, y1, x2, y2],
				start: function() {
					repod.grid.config.start_slide = Math.abs(Number($("#caro_slides").css("left").replace("px",""))) / 800 + 1;
					clearInterval(repod.grid.config.carousel_id);
				},
				stop: function(e, ui) {
					var grid_x = 800;
					var grid_y = 0;
					var elem = $( this );
					var left = parseInt(elem.css('left'));
					var top = parseInt(elem.css('top'));
					var cx = (left % grid_x);
					var cy = (top % grid_y);

					var new_left = (Math.abs(cx)+0.5*grid_x >= grid_x) ? (left - cx + (left/Math.abs(left))*grid_x) : (left - cx);
					var new_top = (Math.abs(cy)+0.5*grid_y >= grid_y) ? (top - cy + (top/Math.abs(top))*grid_y) : (top - cy);

					ui.helper.stop(true).animate({
						left: new_left,
						top: new_top,
						opacity: 1,
					}, 200, function() {
						var out = "{start: "+repod.grid.config.start_slide+", stop: "+(Math.abs(Number($("#caro_slides").css("left").replace("px",""))) / 800 + 1)+"}"
						ga('send', 'event', 'slide', 'drag', out);
					});

					repod.grid.caro.start();
				},
			});
		},
		next: function() {
			var items = $("#caro_slides").children().length -1;
			if (parseInt($("#caro_slides").css("right")) >= 800*(items)) {
				$("#caro_slides").append($($("#caro_slides").children()[0]).clone());
				$("#caro_slides").animate({"left":"-=800"},function() {
					$("#caro_slides").css({"left":"0px"});
					$("#caro_slides > *").last().remove();
				});
			} else {
				$("#caro_slides").animate({"left":"-=800"});
			}
		},
		goto_slide: function(slide_in) {
			this.start();
			var target = ($(slide_in)) ? "id" : "index";
			if (target == "id") {
				$("#caro_slides").animate({"left":"-"+$(slide_in).index()*800});
				$("html, body").animate({scrollTop: $("#caro").offset().top - $("#header").height()*2});
			} else {
				/* index */
			}
		}
	}
};

$(document).ready(function() { repod.grid.init(); });