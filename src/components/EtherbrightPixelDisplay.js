import React, { Component } from 'react';
import { Animate } from 'react-move';
// import { SvgLoader, SvgProxy } from 'react-svgmt';
import { interpolate, interpolateTransformSvg } from 'd3-interpolate'
import {Pixel} from './App.js'

export default class EtherbrightPixelDisplay extends Component{
	constructor(props){
		super(props);
		this.state={
		pixels: props.pixels,
		pallet: props.pallet,
		movie: props.movie,
		id:props.id,
		movieFrame:props.movie[props.movie.length],
		frameNumber:props.movie.length-1,
		playing:props.playing,
		c1:"#00ff00",
		c2:"#ff00ff",
		cnt:0,
		};
				console.log("PLAYING ",this.state.playing)

	}
	componentDidMount() {
    //Use React Move to animate the body
    	 		// this.setState({playing:0})

	    setInterval(() => {
	      this.setState(this.changecolor);
	    }, 1000);

	   	setInterval(() => {
	      this.setState(this.updateMovieFrame);
	    }, 1000);
	}
	changecolor(prevState){
		// console.log("JUMP ",this.state.c1);
		return{c1:this.state.pallet[this.state.cnt%6], cnt:prevState.cnt+1};

	}
	updateMovieFrame(prevState){
		// console.log(this.state.frameNumber)
		if(this.state.playing){
			return{
				movieFrame:this.state.movie[this.state.frameNumber],
				frameNumber:(prevState.frameNumber+1)%this.state.movie.length
			}
		}else{
					return{
				movieFrame:this.state.movie[this.state.frameNumber],
				frameNumber:(prevState.frameNumber+0)%this.state.movie.length
			}	
		}

	}
	pixelClickHandler=(e,id)=>{
		console.log("Pix N ",e.target.getAttributeNS(null,"pn"))
  		console.log("Color ",e.target.getAttributeNS(null,"fill"))
  		console.log("ID ",e.target.getAttributeNS(null,"id"))
	}

	getCircle(n,x,y,c){

	    return(
	      <circle key={n} id={this.state.id.toHexString()} pn={n} cx={x} cy={y} r='20' fill={c} strokeWidth='8' stroke='black' onClick  ={(e) => {this.pixelClickHandler(e,this.state.id);}} />
	    )
	}
	 getSVG(){
  		return(
			<svg width='300' height='300'>
	          {this.state.pixels.map(pix=>(this.getCircle(pix.id, pix.xpos, pix.ypos, pix.color) ))}
	        </svg>
        )
	 }


	 animatedSVG_TEST(){
	 	return(
	        <svg width="300" height="300">
	          <Animate
	            start={{ c: this.state.c1 }}
	            enter={{ c: this.state.c1 }}
	            update={{ c: this.state.c1 }}
	          >
	            {(data) => {
	            	{/*console.log("DATA ",data.c);*/}
	            	return(
	            		<circle cx="50" cy="50" r="20" fill={data.c} strokeWidth='8' stroke='black' />
	            	)
	            	}
	        	}

	          </Animate>
	        </svg>
 		)
	 }

	 animatedPxielDisplay(){
                   var xoff=50;
        var yoff=50;
        var p=0;
        var pixels=[];
        for(var x=1; x<=5; x++){
          for(var y=1; y<=5; y++){
            pixels.push(new Pixel(p,xoff*x,yoff*y,this.state.movie[this.state.frameNumber][p]))
            p++;
          }
        }
	 	return(

	        <svg width='300' height='300'>
	          {pixels.map(pix=>(this.getCircle(pix.id, pix.xpos, pix.ypos, pix.color) ))}
	        </svg>
	 	)
	 }

	 getPlayButton(){
	 	return(
            <button onClick={this.togglePlay}>PLAY</button>

	 		)
	 }
	 togglePlay=()=>{
	 	// return{
	 		// playing:prevState.playing ? 0:1
	 		var play=this.state.playing ? 0:1
	 		this.setState({playing:play})
	 	// }
	 	// this.setState
	 }

	render(){
		return(
			// this.getSVG()
			<div >
			{this.animatedPxielDisplay()}
			<div >
			{this.getPlayButton()}
			</div>
			</div>

	    )

	}



}