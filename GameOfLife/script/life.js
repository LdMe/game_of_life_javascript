const MAX_NEIGHBORS = 3;
const MIN_NEIGHBORS = 2;
var ALIVE_NEIGHBORS= [];
var REVIVE_NEIGHBORS = [];
class Cell{
	constructor(){

		this.alive=false;
		this.keep_alive=false;
	}
	setNeighbors(neighbors){
		this.neighbors=neighbors;
	}
	revive(){
		this.alive=true;
		this.keep_alive=true;
	}
	die(){
		this.alive=false;
		this.keep_alive=false;
	}
	changeState(){
		this.alive= !this.alive;
	}
	change(){
		if(this.keep_alive){
			this.revive();
		}
		else{
			this.die();
		}
	}
	checkAlive(){
		let neighbors= 0;
		for (var i = this.neighbors.length - 1; i >= 0; i--) {
			if(this.neighbors[i].isAlive()){
				neighbors+=1;
			}
		}
		neighbors= neighbors.toString();
		if(this.alive){
			if(ALIVE_NEIGHBORS.includes(neighbors)){
				this.keep_alive=true;
				return true;
			}
			else{
				this.keep_alive=false;
				return false;
			
			}
		}
		else{
			if(REVIVE_NEIGHBORS.includes(neighbors)){
				this.keep_alive=true;
				return true;
			}
			else{
				this.keep_alive=false;
				return false;
			
			}
		}
	}
	checkAlive_v0(){
		let neighbors= 0;
		for (var i = this.neighbors.length - 1; i >= 0; i--) {
			if(this.neighbors[i].isAlive()){
				neighbors+=1;
			}
		}
		if(neighbors<= MAX_NEIGHBORS && neighbors >= MIN_NEIGHBORS){
			if(this.alive || neighbors ==MAX_NEIGHBORS){
				this.keep_alive=true;
				return true;
			}
			else{
				this.keep_alive=false;
				return false;
			}
		}
		this.keep_alive=false;
		return false;
	}
	isAlive(){
		return this.alive;
	}
	nextAlive(){
		return this.keep_alive;
	}
}
class Board{
	constructor(size){
		this.size=size;
		this.cells=[];
		for (var i = 0;i < this.size ; i++) {
			this.cells[i]=[];
			for (var j = 0;j < this.size ; j++) {
				this.cells[i][j]=new Cell();
			}
		}
		for (var i = 0;i < this.size ; i++) {			
			for (var j = 0;j < this.size ; j++) {
				this.setNeighbors(i,j);

			}
		}
		this.setParameters(["2","3"],["3"]);
	}
	setParameters(var1,var2){
		ALIVE_NEIGHBORS=var1;
		REVIVE_NEIGHBORS=var2;
	}
	setNeighbors(i,j){
		let cells=[];
		if(i>1){
			cells.push(this.cells[i-1][j]);
			if(j>1){
				cells.push(this.cells[i-1][j-1]);
			}
			if(j<this.size - 1){
				cells.push(this.cells[i-1][j+1]);
			}
		}
		if(i<this.size - 1){
			cells.push(this.cells[i+1][j]);
			if(j>1){
				cells.push(this.cells[i+1][j-1]);
			}
			if(j<this.size - 1){
				cells.push(this.cells[i+1][j+1]);
			}
		}
		if(j>1){
			cells.push(this.cells[i][j-1]);					
		}
		if(j<this.size - 1){
			cells.push(this.cells[i][j+1]);
		}
		this.cells[i][j].setNeighbors(cells);
	}
	randomize(value=1){
		for (var i =0; i < this.size; i++) {
			for (var j =0; j < this.size; j++) {
				if(Math.random()<value){
					this.cells[i][j].revive();
				}
				else{
					this.cells[i][j].die();
				}
			}
		}
	}
	clear(){
		for (var i =0; i < this.size; i++) {
			for (var j =0; j < this.size; j++) {
				this.cells[i][j].die();	
			}
		}
	}
	checkCells(){
		for (var i =0; i < this.size; i++) {
			for (var j =0; j < this.size; j++) {
				this.cells[i][j].checkAlive();
			}
		}
	}
	changeCells()
	{
		for (var i =0; i < this.size; i++) {
			
			for (var j =0; j < this.size; j++) {
				this.cells[i][j].change();
			}
		}
	}
	step(){
		this.checkCells();
		this.changeCells();
		this.checkCells();
	}
	act(){
		this.step();
	}
	getCells(){
		let cells=[];
		let next=[];
		for (var i =0; i < this.size; i++) {
			cells[i]=[];
			next[i]=[];
			for (var j =0; j < this.size; j++) {
				cells[i][j]=this.cells[i][j].isAlive();
				next[i][j]=this.cells[i][j].nextAlive();
			}
		}
		return [cells,next];
	}
}
