pragma solidity ^0.7.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
contract Color is ERC721 {

	string[] public colors;
  uint junk = 10;
	mapping(string => bool) _colorExists;

	constructor() ERC721("Color", "COLOR") public {
  	
  	}

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