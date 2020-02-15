
var CELL_COUNT = 50;
var DENSITY = 0.3;
let width = $(".game").width();
let cell_width= width / CELL_COUNT;
let height = $(".game").height();
let cell_height= height / CELL_COUNT;
var game= null;
class Game{
	constructor(){
		this.stopped= true;
		this.initialize();
		this.timeout=null;
		this.showTimeout=null;
		game=this;
		$(".quantity").on("change",function(){
			CELL_COUNT= $(".quantity").val();
			game.initialize();
		});
		$(".density").on("change",function(){
			DENSITY= $(".density").val() / 100.0;
			console.log(DENSITY);
		});


		$(".resetButton").on("click",function(){
			if(game.timeout){
				clearTimeout(game.timeout);
				game.timeout=null;
				clearTimeout(game.showTimeout);
				game.showTimeout=null;
			}

			game.board.randomize(DENSITY);
			game.show();
		});
		$(".clearButton").on("click",function(){
			if(game.timeout){
				clearTimeout(game.timeout);
				game.timeout=null;
				clearTimeout(game.showTimeout);
				game.showTimeout=null;
			}

			game.board.clear();
			game.show();
		});
		$(".playButton").on("click",function(){
			game.stopped= !game.stopped;
			if(!game.stopped){
				$(this).html("stop");
				game.show();
			}
			else{
				if(game.timeout){
					clearTimeout(game.timeout);
					game.timeout=null;
					clearTimeout(game.showTimeout);
					game.showTimeout=null;
				}
				$(this).html("start");
			}

			$(this).toggleClass("btn-success");
			$(this).toggleClass("btn-danger");
		});
		$(".param").change(function(){
			game.setParameters();
		});
	}
	setParameters(){
		let revive= $(".revive").val();
		let stayAlive=$(".stayAlive").val();
		let reviveArray= revive.toString().split("");
		let aliveArray= stayAlive.toString().split("");
		this.board.setParameters(aliveArray,reviveArray);
	}
	initialize(){
		width = $(".game").width();
		cell_width= width / CELL_COUNT;
		height = $(".game").height();
		cell_height= height / CELL_COUNT;
		$(".game").empty();
		for(let i = 0; i <  CELL_COUNT; i++){
			let row= $(".game").append("<div  style='height:"+cell_height+"px'class='row row"+i.toString()+"'/>");
			for(let j = 0; j <  CELL_COUNT; j++){
				let status="alive"
				if(Math.random() > 0.5){
					status="dead";
				}
				$(".row"+i.toString()).append("<div class='col'><div class='cell cell"+i.toString()+"-"+j.toString()+" "+status+"' i="+i+" j="+j+"></div></div>");	
			}   
		}
		let game= this;
		$(".cell").on("click",function(){
			let i = $(this).attr("i");
			let j = $(this).attr("j");
			console.log("i:"+i);
			console.log("j:"+j);
			game.board.cells[i][j].changeState();
			$(this).toggleClass("alive");
			$(this).toggleClass("dead");
		});

		if(this.timeout){
			clearTimeout(this.timeout);
			this.timeout=null;
		}
		this.board= new Board(CELL_COUNT);
		this.board.randomize(DENSITY);
		this.setParameters();
		this.show();
		
		
	}
	show(){
		let values= this.board.getCells();
		let cells= values[0];
		let next = values[1];
		let area1=0;
		let area2= 0;
		let perimeter=0;
		for(let i = 0; i < this.board.size;i++){
			for(let j = 0; j < this.board.size;j++){
				let alive= cells[i][j];
				let nextAlive= next[i][j];
				let cell =$(".cell"+i.toString()+"-"+j.toString());
				if(cell.hasClass("special")){
					cell.removeClass("special");
				}
				if(alive){
					if(cell.hasClass("dead")){
						
						cell.removeClass("dead");
					}
					if(!cell.hasClass("alive")){
						cell.addClass("alive");
					}
					if($(".colorCheck").is(":checked")){

						if(!nextAlive){
							if(!cell.hasClass("special")){
								cell.addClass("special");
							}
						}
						else{
							area1+=1;
							if(cell.hasClass("special")){
								cell.removeClass("special");
							}
						}
					}
				}
				else{
					if(cell.hasClass("alive")){
						
						cell.removeClass("alive");
					}
					if(!cell.hasClass("dead")){
						cell.addClass("dead");
					}
					if($(".colorCheck").is(":checked")){
						
						if(nextAlive){
							area2+=1;
							if(!cell.hasClass("special")){
								cell.addClass("special");
							}
						}
						else{
							if(cell.hasClass("special")){
								cell.removeClass("special");
							}
							perimeter+=1;
						}
					}

				}
			}
		}
		if(!this.stopped){
			const board= this;
			if(!this.timeout){

				this.timeout=setTimeout(function(){board.play()},1000 - $(".speed").val());
			}
			this.showTimeout=setTimeout(function(){board.show()},50);
		}
	}
	play(){
		console.log("let's play!");
		this.board.act();
		if(!this.stopped){
			const board= this;
			this.timeout=setTimeout(function(){board.play()},1000 - $(".speed").val());
		}
	}

}

game= new Game();