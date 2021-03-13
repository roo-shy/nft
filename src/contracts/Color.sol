pragma solidity ^0.7.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Color is ERC721,Ownable {

	string[] public colors;
  	uint junk = 10;
  	uint nPixX=3;
  	uint nPixY=3;
  	uint nPix=nPixX*nPixY;
  	string[] public pixels;
  	string[] public pallet; 


	mapping(string => bool) _colorExists;
	event PixelChanged(uint indexed changedPixel, string from, string to, address indexed by);
	
	constructor() ERC721("Color", "COLOR") public {
		buildLut();
		buildCanvas();
		paintCanvas();
  	}

  	function buildLut() private   {
  		pallet.push("#000000");
  		pallet.push("#ff0000");
		pallet.push("#00ff00");
		pallet.push("#0000ff");
  	}

  	function buildCanvas () private {
  		for(uint p=0; p<nPix; p++){

			// pixels[p]=pallet[0];
			// pixels[0]="ack";
			pixels.push(pallet[0]);

		}	
  	}
  	

	function paintCanvas () private   {
		// uint i=0;
		for(uint p=0; p<nPix; p++){

			setPixel(p,pallet[p%3]);
			// setPixel(p,"dick");

		}	

	}

	function setPixel(uint  _pixn, string memory _pixcolor) public onlyOwner {
		string memory  _priorColor=pixels[_pixn];
		// string memory  _priorColor=pixels[0];
		pixels[_pixn]=_pixcolor;
		emit PixelChanged(_pixn,_priorColor,_pixcolor, msg.sender);
		
	}
	
  	



  	function generateSVG() public view returns (string memory){
  		//returns the svg string of the canvas
  	}
  	// function setPixelTick(uint memory _tick) public payable 

    // function totalSupply
    function getjunk() public view returns(uint){
      return junk;
    }
  
	function testReturn(string memory _color) public returns(string memory) {
	    // _mint(msg.sender, 1);
	    return _color;
	}

	function mint(string memory _color) public {
	  require(!_colorExists[_color]);
	  colors.push(_color);
	  uint _id = colors.length-1;
	  _mint(msg.sender, _id);
	  _colorExists[_color] = true;
	}

}
