import React, { Component } from 'react';
import { Animate } from 'react-move';
// import { SvgLoader, SvgProxy } from 'react-svgmt';
import { interpolate, interpolateTransformSvg } from 'd3-interpolate'

export default class EtherbrightPixelDisplay extends Component{
	constructor(props){
		super(props);
		this.state={
		pixels: props.pixels,
		pallet: props.pallet,
		id:props.id,
		c1:"#00ff00",
		c2:"#ff00ff",
		cnt:0,
		};
	}
	componentDidMount() {
    //Use React Move to animate the body
	    setInterval(() => {
	      this.setState(this.changecolor);
	    }, 1000);
	}
	changecolor(prevState){
		// console.log("JUMP ",this.state.c1);
		return{c1:this.state.pallet[this.state.cnt%6], cnt:prevState.cnt+1};

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
	 			// console.log("animate ",this.state.c1);
	 	// return(
	  //       <svg width="300" height="300">
	         
	  //            <circle cx="50" cy="50" r="20" fill={this.state.c1} strokeWidth='8' stroke='black' />}	          
	  //       </svg>
 		// )
	 	return(
	        <svg width="300" height="300">
	          <Animate
	            start={{ c: this.state.c1 }}
	            enter={{ c: this.state.c1 }}
	            update={{ c: this.state.c1 }}
	            // duration={0}
	            // delay={0}
            // easing="linear"
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

	render(){
		return(
			// this.getSVG()
			this.animatedSVG_TEST()
	    )
	}



}