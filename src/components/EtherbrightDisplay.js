import React, { Component } from 'react';
import { Animate } from 'react-move';

export default class EtherbrightPixelDisplay extends Componet{
	constructor(props){
		super(props);
		this.state={
			pixels=props.pixels,
		}
	}

  getCircle(n,x,y,c){

    return(
      <circle key={n} id={this.state.id.toHexString()} pn={n} cx={x} cy={y} r='20' fill={c} strokeWidth='8' stroke='black' onClick  ={(e) => {this.props.testsvg(e);}}/>
    )
  }
  
	render(){
		<svg width='300' height='300'>
          {this.state.pixels.map(pix=>(this.getCircle(pix.id, pix.xpos, pix.ypos, pix.color) ))}
        </svg>
	}



}