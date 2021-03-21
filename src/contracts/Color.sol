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
  	uint256 public numberOfEtherbrights = 0;


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
	event EtherbrightMinted(uint256 seed, address mintedBy, uint256 nEtherbrights);
	event EtherbrightPixelChanged(uint256 tokenId, string from, string to, address indexed by);
	event EtherbrightSVGgenerated(uint _tokenId, string svg, address indexed by);
	
	
	constructor() ERC721("Color", "COLOR") public {
		buildLut();
		buildCanvas();
		paintCanvas();
		generateSVG();
		// geerateCanvasSVG();
  	}
  	function mintEtherbright(address to) public{
	  bytes32 idHash = keccak256(abi.encodePacked(block.timestamp, to));
      uint256 tokenId = uint(idHash);
      uint256 etherbrightSeed = tokenId & 4000;

	  Etherbright memory etherbright;
	  etherbright.seed=etherbrightSeed;
	  // etherbright.pallet=getPalletFromSeed(etherbrightSeed.seed);
	  allEtherbrights[tokenId]=etherbright;
	  buildEtherbright(tokenId);

	  _mint(msg.sender, tokenId);
	  numberOfEtherbrights+=1;
	  emit EtherbrightMinted(etherbrightSeed, to, numberOfEtherbrights);

	}
	function buildEtherbright (uint256 tokenId ) internal {
		// Etherbright memory ethb=allEtherbrights[tokenId];
		// ethb.pallet=getPalletFromSeed(tokenId, 1);
		setEthebrightPallet(tokenId);
		for(uint p=0; p<nPix; p++){
			allEtherbrights[tokenId].setPixels.push(allEtherbrights[tokenId].pallet[(p%3)+1]);
			allEtherbrights[tokenId].mintPixels.push(allEtherbrights[tokenId].pallet[(p%3)+1]);

		}
		// Etherbright memory ethb=allEtherbrights[tokenId];
		// // ethb.pallet=getPalletFromSeed(tokenId, 1);
		// setEthebrightPallet(tokenId);
		// for(uint p=0; p<nPix; p++){
		// 	ethb.setPixels.push(ethb.pallet[(p%3)+1]);
		// 	ethb.mintPixels.push(ethb.pallet[(p%3)+1]);

		// }

	}

	function setEthebrightPallet (uint256 tokenId)  internal {
		// Etherbright memory ethb=allEtherbrights[tokenId];
		uint8 selector=toUint8(abi.encodePacked(tokenId), 1);
		if(selector >= 0 && selector < 85 ){
			allEtherbrights[tokenId].pallet.push("#000000");
  			allEtherbrights[tokenId].pallet.push("#ff0000");
			allEtherbrights[tokenId].pallet.push("#00ff00");
			allEtherbrights[tokenId].pallet.push("#0000ff");
		}
		else if(selector >= 85 && selector < 170 ){
			allEtherbrights[tokenId].pallet.push("#000000");
  			allEtherbrights[tokenId].pallet.push("#ffff00");
			allEtherbrights[tokenId].pallet.push("#00ffff");
			allEtherbrights[tokenId].pallet.push("#ff00ff");

		}
		else{
			allEtherbrights[tokenId].pallet.push("#000000");
  			allEtherbrights[tokenId].pallet.push("#ffb300");
			allEtherbrights[tokenId].pallet.push("#7a0008a");
			allEtherbrights[tokenId].pallet.push("#02c0c7");
		}

	}
	
    function toUint8(bytes memory _bytes, uint256 _start) internal pure returns (uint8) {
        require(_start + 1 >= _start, "toUint8_overflow");
        require(_bytes.length >= _start + 1 , "toUint8_outOfBounds");
        uint8 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x1), _start))
        }

        return tempUint;
    }
	// function getPalletFromSeed (uint256  seed, uint anchor)  internal pure returns(string[] memory){
	// 	uint8 selector=toUint8(seed, anchor);
	// 	string[]  p;
	// 	if(selector >= 0 && selector < 85 ){
	// 		p.push("#000000");
 //  			p.push("#ff0000");
	// 		p.push("#00ff00");
	// 		p.push("#0000ff");
	// 	}
	// 	else if(selector >= 85 && selector < 170 ){
	// 		p.push("#000000");
 //  			p.push("#ffff00");
	// 		p.push("#00ffff");
	// 		p.push("#ff00ff");

	// 	}
	// 	else{
	// 		p.push("#000000");
 //  			p.push("#ffb300");
	// 		p.push("#7a0008a");
	// 		p.push("#02c0c7");
	// 	}
	// 	return p;
	// }
	

	function setEtherbrightPixel (uint256 _tokenId,uint  _pixn, uint  _palletN ) public {
		Etherbright storage ethb =allEtherbrights[_tokenId];
		string memory _priorColor=ethb.setPixels[_pixn];
		string memory _newColor=ethb.pallet[_palletN];
		ethb.setPixels[_pixn]=_newColor;
		emit EtherbrightPixelChanged(_tokenId, _priorColor, _newColor, msg.sender);
		
	}
	

  	function generateEtherbrightsSVG(uint256 _tokenId) public{
  		//returns the svg string of the canvas
  		    string memory svg = 
  		    string(
  		    	abi.encodePacked(
            					"<svg width='150' height='180'>", 
            					string(abi.encodePacked("<circle cx='30' cy='30' r='20' fill='",allEtherbrights[_tokenId].setPixels[0],"' stroke-width='9' stroke='black'/>")),
            					string(abi.encodePacked("<circle cx='60' cy='30' r='20' fill='",allEtherbrights[_tokenId].setPixels[1],"' stroke-width='9' stroke='black'/>")),
            					string(abi.encodePacked("<circle cx='90' cy='30' r='20' fill='",allEtherbrights[_tokenId].setPixels[2],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='30' cy='60' r='20' fill='",allEtherbrights[_tokenId].setPixels[3],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='60' cy='60' r='20' fill='",allEtherbrights[_tokenId].setPixels[4],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='90' cy='60' r='20' fill='",allEtherbrights[_tokenId].setPixels[5],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='30' cy='90' r='20' fill='",allEtherbrights[_tokenId].setPixels[6],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='60' cy='90' r='20' fill='",allEtherbrights[_tokenId].setPixels[7],"' stroke-width='9' stroke='black'/>")), 
            					string(abi.encodePacked("<circle cx='90' cy='90' r='20' fill='",allEtherbrights[_tokenId].setPixels[8],"' stroke-width='9' stroke='black'/>")),
            					"</svg>"
        						)
        	);
  		emit EtherbrightSVGgenerated(_tokenId,svg,msg.sender);

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
	




  	function buildLut() private   {
  		pallet.push("#000000");
  		pallet.push("#ff0000");
		pallet.push("#00ff00");
		pallet.push("#0000ff");
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
