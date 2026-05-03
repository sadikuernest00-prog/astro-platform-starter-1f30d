// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AmicFormulaBet {

    struct Bet {
        address player;
        uint256 amount;
        uint256 odds;
        bool resolved;
        bool win;
    }

    Bet[] public bets;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Place a bet (send ETH)
    function placeBet(uint256 odds) external payable {
        require(msg.value > 0, "Send ETH to bet");
        require(odds > 1, "Invalid odds");

        bets.push(Bet({
            player: msg.sender,
            amount: msg.value,
            odds: odds,
            resolved: false,
            win: false
        }));
    }

    // Resolve bet (ONLY OWNER - temporary until oracle is added)
    function resolveBet(uint256 index, bool _win) external onlyOwner {
        Bet storage bet = bets[index];

        require(!bet.resolved, "Already resolved");

        bet.resolved = true;
        bet.win = _win;

        if (_win) {
            uint256 payout = bet.amount * bet.odds;

            require(address(this).balance >= payout, "Not enough contract balance");

            payable(bet.player).transfer(payout);
        }
    }

    // View total bets
    function getBetsCount() external view returns (uint256) {
        return bets.length;
    }

    // Deposit liquidity (so contract can pay winners)
    function deposit() external payable {}

    // Withdraw profits (owner only)
    function withdraw(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }
}
