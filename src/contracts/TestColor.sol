pragma solidity ^0.7.4;

/**
 * The contractName contract does this and that...
 */
contract TestColor {

	  	string[] public pixels;
  	string[] public pallet; 
  	string[] public canvasSVG;

  	  	uint junk = 10;
  	uint nPixX=3;
  	uint nPixY=3;
  	uint nPix=nPixX*nPixY;
  constructor() public {
    
  }
  	event PixelChanged(uint indexed changedPixel, string from, string to, address indexed by);
  		event SVGgenerated(string SVG, address indexed by);


	function setPixel(uint  _pixn, string memory _pixcolor) public {
		string memory  _priorColor=pixels[_pixn];
		// string memory  _priorColor=pixels[0];
		pixels[_pixn]=_pixcolor;
		emit PixelChanged(_pixn,_priorColor,_pixcolor, msg.sender);
		generateSVG();
		
	}
    	function buildLut() internal   {
  		pallet.push("#000000");
  		pallet.push("#ff0000");
		pallet.push("#00ff00");
		pallet.push("#0000ff");
  	}

  		function buildCanvas () internal {
  		for(uint p=0; p<nPix; p++){

			// pixels[p]=pallet[0];
			// pixels[0]="ack";
			pixels.push(pallet[0]);

		}	
  	}

  		function paintCanvas () internal   {
		// uint i=0;
		for(uint p=0; p<nPix; p++){

			setPixel(p,pallet[(p%3)+1]);
			// setPixel(p,"dick");

		}	

	}

	  	function generateSVG() public returns (string memory){
  		//returns the svg string of the canvas
  		    string memory svg = 
  		    string(
  		    	abi.encodePacked(
            					"<svg width='150' height='180'>", 
            					string(abi.encodePacked("<circle cx='30' cy='30' r='20' fill='",pixels[0],"' stroke-width='9' stroke='black'/>")),
            					string(abi.encodePacked("<circle cx='60' cy='30' r='20' fill='",pixels[1],"' stroke-width='9' stroke='black'/>")),
            					string(abi.encodePacked("<circle cx='90' cy='30' r='20' fill='",pixels[2],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='30' cy='60' r='20' fill='",pixels[3],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='60' cy='60' r='20' fill='",pixels[4],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='90' cy='60' r='20' fill='",pixels[5],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='30' cy='90' r='20' fill='",pixels[6],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='60' cy='90' r='20' fill='",pixels[7],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='90' cy='90' r='20' fill='",pixels[8],"' stroke-width='9' stroke='black'/>")),
            					"</svg>"
        						)
        	);
  		emit SVGgenerated(svg,msg.sender);

        return svg;
  	}
}
