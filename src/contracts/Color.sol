pragma solidity ^0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// import "./TestColor.sol";


contract Color is ERC721, Ownable {

  	uint256 public numberOfEtherbrights = 0;
  	uint nPixX=5;
  	uint nPixY=5;
  	uint nPix=nPixX*nPixY;

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
	// event SVGgenerated(string SVG, address indexed by);
	// event EtherbrightMinted(uint256 tokenId, string svg, address mintedBy, uint256 nEtherbrights);
	event EtherbrightMinted(uint256 tokenId, address mintedBy, uint256 nEtherbrights);
	event EtherbrightPixelChanged(uint256 tokenId, uint pn, string from, string to, address indexed by);
	// event EtherbrightSVGgenerated(uint _tokenId, string svg, address indexed by);
	event Selector(uint8 selector);
	
	constructor() ERC721("Color", "COLOR") public {

  	}

  	function mintEtherbright(address to) public{
	  bytes32 idHash = keccak256(abi.encodePacked(block.timestamp, to));
      uint256 tokenId = uint(idHash);
      uint256 etherbrightSeed = tokenId % 4000;

	  Etherbright memory etherbright;
	  etherbright.seed=etherbrightSeed;
	  // etherbright.seriesNumber=numberOfEtherbrights;
	  // etherbright.pallet=getPalletFromSeed(etherbrightSeed.seed);
	  allEtherbrights[tokenId]=etherbright;
	  buildEtherbright(tokenId);

	  _mint(msg.sender, tokenId);
	  numberOfEtherbrights+=1;
	  // string memory tmpsvg=generateEtherbrightsSVG(tokenId);
	  emit EtherbrightMinted(tokenId, to, numberOfEtherbrights);

	  // emit EtherbrightMinted(tokenId, tmpsvg, to, numberOfEtherbrights);
	// event EtherbrightMinted(uint256 tokenId, address mintedBy, uint256 nEtherbrights, string svg);

	}
	function buildEtherbright (uint256 tokenId ) internal {

		setEtherbrightPallet(tokenId);
		setAllEtherbrightPixels(tokenId);


	}
	function setAllEtherbrightPixels (uint256 tokenId) internal {
		// uint8 selector=toUint8(abi.encodePacked(tokenId), 2);
		uint8 start=selectorTo16Range(toUint8(abi.encodePacked(tokenId), 2));
		uint8 mod=selectorTo5Range(toUint8(abi.encodePacked(tokenId), 4));
		uint8 len=uint8(allEtherbrights[tokenId].pallet.length);
        emit Selector(start);
        emit Selector(mod);
        emit Selector(len-1);
		uint8 c=(start)%(len-1);
		uint cnt=0;
		for(uint8 p=0; p<nPix; p++){
			// uint c=((start+p)%mod)+1;
			// uint8 c=(start+mod+p)%(len-1);
			emit Selector(c);
			cnt++;

			allEtherbrights[tokenId].setPixels.push(allEtherbrights[tokenId].pallet[c]);
			allEtherbrights[tokenId].mintPixels.push(allEtherbrights[tokenId].pallet[c]);
			c=(c+mod)%(len-1);
			if((cnt%mod)==0){
				c=start%(len-1);
				cnt=0;
			}

		}
	}
	
	function selectorTo5Range(uint a) internal pure returns (uint8) {
		if(a>= 0 && a <51){
			return 3;
		}else if(a>=51 && a< 102){
			return 4;
		}else if(a>=102 && a< 153){
			return 5;			
		}else if(a>=153 && a< 204){
			return 6;			
		}else if(a>=204){
			return 7;			
		}
	}
	function selectorTo16Range(uint a) internal pure returns (uint8) {
		if(a>= 0 && a <16){
			return 0;
		}else if(a>=16 && a< 32){
			return 1;
		}else if(a>=32 && a< 48){
			return 2;			
		}else if(a>=48 && a< 64){
			return 3;			
		}else if(a>=64 && a< 80){
			return 4;			
		}else if(a>=80 && a< 96){
			return 5;			
		}else if(a>=96 && a< 112){
			return 6;			
		}else if(a>=112 && a< 128){
			return 7;		
		}else if(a>=128 && a< 144){
			return 8;			
		}else if(a>=144 && a< 160){
			return 9;
		}else if(a>=160 && a< 178){
			return 10;			
		}else if(a>=178 && a< 192){
			return 11;			
		}else if(a>=192 && a< 208){
			return 12;			
		}else if(a>=208 && a< 224){
			return 13;			
		}else if(a>=224 && a< 240){
			return 14;			
		}else if(a>=240 && a< 256){
			return 15;		
		}

	}

	function setEtherbrightPallet (uint256 tokenId)  internal {
		// Etherbright memory ethb=allEtherbrights[tokenId];
		uint8 selector=toUint8(abi.encodePacked(tokenId), 1);
		if(selector >= 0 && selector < 54 ){
			allEtherbrights[tokenId].pallet.push("#000000");
  			allEtherbrights[tokenId].pallet.push("#ff0000");
			allEtherbrights[tokenId].pallet.push("#ff7700");
			allEtherbrights[tokenId].pallet.push("#ffdd00");

						allEtherbrights[tokenId].pallet.push("#eaff00");
  			allEtherbrights[tokenId].pallet.push("#a2ff00");
			allEtherbrights[tokenId].pallet.push("#26ff00");
			allEtherbrights[tokenId].pallet.push("#00ff4c");
						allEtherbrights[tokenId].pallet.push("#00ffa6");
  			allEtherbrights[tokenId].pallet.push("#00ffdd");
			allEtherbrights[tokenId].pallet.push("#00d0ff");
			allEtherbrights[tokenId].pallet.push("#0055ff");
									allEtherbrights[tokenId].pallet.push("#1500ff");
  			allEtherbrights[tokenId].pallet.push("#6f00ff");
			allEtherbrights[tokenId].pallet.push("#bb00ff");
			allEtherbrights[tokenId].pallet.push("#ff00f7");

		}
		else if(selector >= 54 && selector < 65 ){
			allEtherbrights[tokenId].pallet.push("#000000");
  			allEtherbrights[tokenId].pallet.push("#ff7575");
			allEtherbrights[tokenId].pallet.push("#ff75cf");
			allEtherbrights[tokenId].pallet.push("#f675ff");
						allEtherbrights[tokenId].pallet.push("#bf75ff");
  			allEtherbrights[tokenId].pallet.push("#7577ff");
			allEtherbrights[tokenId].pallet.push("#75c6ff");
			allEtherbrights[tokenId].pallet.push("#75fdff");
									allEtherbrights[tokenId].pallet.push("#75ffcc");
  			allEtherbrights[tokenId].pallet.push("#75ff7a");
			allEtherbrights[tokenId].pallet.push("#acff75");
			allEtherbrights[tokenId].pallet.push("#e8ff75");

									allEtherbrights[tokenId].pallet.push("#fff175");
  			allEtherbrights[tokenId].pallet.push("#ffd375");
			allEtherbrights[tokenId].pallet.push("#00ff00");
			allEtherbrights[tokenId].pallet.push("#ff9575");

		}
		else if(selector >=65 && selector< 200){
			allEtherbrights[tokenId].pallet.push("#000000");
			allEtherbrights[tokenId].pallet.push("#fffb00");
			allEtherbrights[tokenId].pallet.push("#04ff00");
			allEtherbrights[tokenId].pallet.push("#0800ff");

			allEtherbrights[tokenId].pallet.push("#ff00f7");
						allEtherbrights[tokenId].pallet.push("#ffffff");

		}
		else{
			allEtherbrights[tokenId].pallet.push("#000000");
  			allEtherbrights[tokenId].pallet.push("#ad1c1c");
			allEtherbrights[tokenId].pallet.push("#ad581c");
			allEtherbrights[tokenId].pallet.push("#ad921c");
						allEtherbrights[tokenId].pallet.push("#8ead1c");
  			allEtherbrights[tokenId].pallet.push("#1cad39");
			allEtherbrights[tokenId].pallet.push("#1cad62");
			allEtherbrights[tokenId].pallet.push("#1cadab");
									allEtherbrights[tokenId].pallet.push("#1c6ead");
  			allEtherbrights[tokenId].pallet.push("#1c2dad");
			allEtherbrights[tokenId].pallet.push("#481cad");
			allEtherbrights[tokenId].pallet.push("#711cad");

									allEtherbrights[tokenId].pallet.push("#a81cad");
  			allEtherbrights[tokenId].pallet.push("#ad1c84");
			allEtherbrights[tokenId].pallet.push("#00ff00");
			allEtherbrights[tokenId].pallet.push("#0000ff");

		}

	}
	

    function toUint8(bytes memory _bytes, uint256 _start) internal  returns (uint8) {
    	//set this back to pure at some point
        require(_start + 1 >= _start, "toUint8_overflow");
        require(_bytes.length >= _start + 1 , "toUint8_outOfBounds");
        uint8 tempUint;

        assembly {
            tempUint := mload(add(add(_bytes, 0x1), _start))
        }

        return tempUint;
    }

	function setEtherbrightPixel (uint256 _tokenId,uint  _pixn, uint  _palletN ) public {
		// Etherbright storage ethb =allEtherbrights[_tokenId];
		string memory _priorColor=allEtherbrights[_tokenId].setPixels[_pixn];
		string memory _newColor=allEtherbrights[_tokenId].pallet[_palletN];
		allEtherbrights[_tokenId].setPixels[_pixn]=_newColor;
		// string memory _newSVG=generateEtherbrightsSVG(_tokenId);	
		emit EtherbrightPixelChanged(_tokenId, _pixn, _priorColor, _newColor, msg.sender);
		
	}
	function getEtherbrightPixelColor (uint256 _tokenId,uint pn) public returns(string memory) {
		return allEtherbrights[_tokenId].setPixels[pn];
	}
	 function getEtherbrightPallet(uint256 _tokenId) public returns(string[] memory)  {
	 	return allEtherbrights[_tokenId].pallet;
	 	
	 }
		 function getEtherbrightPixels(uint256 _tokenId) public returns(string[] memory)  {
	 	return allEtherbrights[_tokenId].setPixels;
	 	
	 } 


  	// function generateEtherbrightsSVG(uint256 _tokenId) public returns (string memory){
  	// 	//returns the svg string of the canvas
  	// 	    string memory ethbsvg = 
  	// 	    string(
  	// 	    	abi.encodePacked(
   //          					"<svg width='150' height='180'>", 
   //          					string(abi.encodePacked("<circle cx='30' cy='30' r='20' fill='",allEtherbrights[_tokenId].setPixels[0],"' stroke-width='9' stroke='black'/>")),
   //          					string(abi.encodePacked("<circle cx='60' cy='30' r='20' fill='",allEtherbrights[_tokenId].setPixels[1],"' stroke-width='9' stroke='black'/>")),
   //          					string(abi.encodePacked("<circle cx='90' cy='30' r='20' fill='",allEtherbrights[_tokenId].setPixels[2],"' stroke-width='9' stroke='black'/>")), 
   //          					string(abi.encodePacked("<circle cx='30' cy='60' r='20' fill='",allEtherbrights[_tokenId].setPixels[3],"' stroke-width='9' stroke='black'/>")), 
   //          					string(abi.encodePacked("<circle cx='60' cy='60' r='20' fill='",allEtherbrights[_tokenId].setPixels[4],"' stroke-width='9' stroke='black'/>")), 
   //          					string(abi.encodePacked("<circle cx='90' cy='60' r='20' fill='",allEtherbrights[_tokenId].setPixels[5],"' stroke-width='9' stroke='black'/>")), 
   //          					string(abi.encodePacked("<circle cx='30' cy='90' r='20' fill='",allEtherbrights[_tokenId].setPixels[6],"' stroke-width='9' stroke='black'/>")), 
   //          					string(abi.encodePacked("<circle cx='60' cy='90' r='20' fill='",allEtherbrights[_tokenId].setPixels[7],"' stroke-width='9' stroke='black'/>")), 
   //          					string(abi.encodePacked("<circle cx='90' cy='90' r='20' fill='",allEtherbrights[_tokenId].setPixels[8],"' stroke-width='9' stroke='black'/>")),
   //          					"</svg>"
   //      						)
   //      	);
  	// 	emit EtherbrightSVGgenerated(_tokenId,ethbsvg,msg.sender);
  	// 	return ethbsvg;

  	// }


}
