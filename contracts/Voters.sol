pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Voters is ERC721, ERC721Enumerable {
    address[] public voters;

    mapping(address => bool) _voterExists;

    constructor() ERC721("Voters", "VOTE") {}

    function mint(address voter) public {
        require(!_voterExists[voter]);
        voters.push(voter);
        _voterExists[voter] = true;
        uint256 _id = voters.length - 1;
        _mint(voter, _id);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
