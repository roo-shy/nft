pragma solidity ^0.7.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract Color is ERC721 {

	string[] public colors;
  	uint junk = 10;
  	uint nPixX=3;
  	uint nPixY=1;
  	uint nPix=nPixX*nPixY;


	mapping(string => bool) _colorExists;
	mapping(unit )
	constructor() ERC721("Color", "COLOR") public {
		// colors.push("#ff0000");
		// colors.push("#00ff00");
		// colors.push("#0000ff");
		buildLut();
		paintCanvas();
  	}

  	function generateSVG() public view returns (string memory){
  		//returns the svg string of the canvas
  	}
  	function setPixelTick(uint memory _tick) public payable 

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