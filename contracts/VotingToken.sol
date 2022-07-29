pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// This contract is used to award the voters in our election with our precious VTN.

contract votingToken is ERC20 {
    address public admin;

    constructor() ERC20("Voting Token", "VTN") {
        _mint(msg.sender, 10000 * 10**18);
        admin = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "Only admin can mint tokens");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
