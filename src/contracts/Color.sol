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
  	string[] public canvasSVG;


	mapping(string => bool) _colorExists;
	mapping (uint256 => Etherbright) allEtherbrights;

	struct Etherbright {
		string[] setPixels;
		string[] pallet;
		string[] mintPixels;
		uint256 seed;
	}
	
	
	event PixelChanged(uint indexed changedPixel, string from, string to, address indexed by);
	event ClearCanvas(address indexed by);
	event ResetCanvas(address indexed by);
	event SVGgenerated(string SVG, address indexed by);
	event EtherbrightMinted(uint256 seed, string mintedBy);
	
	
	constructor() ERC721("Color", "COLOR") public {
		buildLut();
		buildCanvas();
		paintCanvas();
		generateSVG();
		// geerateCanvasSVG();
  	}
  	function mintEtherbright(address to) public{
	  bytes32 idHash = keccak256(abi.encodePacked(block.timestamp, to));
      uint256 tokenId = uint(hashed);
      uint256 etherbrightSeed = tokenId & 4000;

	  Etherbright etherbright;
	  etherbright.seed=etherbrightSeed;
	  allEtherbrights[tokenId]=etherbright;
	  emit EtherbrightMinted(etherbrightSeed, to);
	  _mint(msg.sender, tokenId);
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

			setPixel(p,pallet[(p%3)+1]);
			// setPixel(p,"dick");

		}	

	}


	function setPixel(uint  _pixn, string memory _pixcolor) public {
		string memory  _priorColor=pixels[_pixn];
		// string memory  _priorColor=pixels[0];
		pixels[_pixn]=_pixcolor;
		emit PixelChanged(_pixn,_priorColor,_pixcolor, msg.sender);
		generateSVG();
		
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

  // 	function geerateCanvasSVG () public returns(string memory)  {
  // 		string[] memory pixelholder;
  // 		string memory canvasSVGheader="<svg width='100' height='100'>";
  // 		string memory canvasSVGfooter="</svg>";
  // 		 //attache header
  // 		//iterate over the pixels and add generate individual strings
  // 		//attach footer
  // 		//pack and send
  // 		canvasSVG.push(canvasSVGheader);
  // 		for(uint p=0; p<nPix; p++){
  // 			string pixSring=string()
  // 			canvasSVG.push(pixels[p]);
		// }	
		// canvasSVG.push(canvasSVGfooter);
		// return string(abi.encodePacked(canvasSVG));
  		
  // 	}
  	
  	// function concat (string memory array) returns(string memory) view internal {
  		
  	// }
  	




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
