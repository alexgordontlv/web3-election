pragma solidity ^0.8.7;

import "./Voters.sol";

contract Elections {
    //This will be stored eventually in a public mapping, so one can verify if one voted or not, but not know who is that one.

    Voters private _votersContract;

    struct voter {
        uint256 voterNumber;
        bool exists;
        bool voted;
    }

    struct VotingDateTime {
        uint256 startDateTicks;
        uint256 endDateTicks;
    }

    struct Candidate {
        uint256 candidateCount;
        string firstName;
        string lastName;
        uint256 voteCount;
        string politicalView;
    }

    VotingDateTime public votingDateTime;
    uint256 public totalVoter = 0; //Number of Voters added to the system
    uint256 public totalVotesCount = 0; //Number of voters that actually came to vote
    address public ballotOfficialAddress;
    string public ballotOfficialName;
    uint256 public candidateCount;
    mapping(uint256 => Candidate) public candidates;
    mapping(address => voter) public voterRegister; //Public mapping of voters, with their wallet address only.

    //creates a new ballot/elections contract
    constructor() public {
        ballotOfficialAddress = msg.sender; //Sets the wallet address of the contract's creator as "admin".
        ballotOfficialName = "Israel Elections 2022"; //ballotOfficialName - '' for example
        _votersContract = new Voters();
    }

    modifier onlyOfficial() {
        require(msg.sender == ballotOfficialAddress);
        _;
    }

    modifier electionTime(uint256 _curentTicksTime) {
        require(
            _curentTicksTime >= votingDateTime.startDateTicks &&
                _curentTicksTime <= votingDateTime.endDateTicks
        );
        _;
    }

    event voterAdded(address voter);
    event voteStarted();
    event voteEnded(uint256 totalVotesCount);
    event voteDone(address voter);

    function setVotingDate(uint256 _startDateTicks, uint256 _endDateTicks)
        public
        onlyOfficial
    {
        votingDateTime = VotingDateTime(_startDateTicks, _endDateTicks);
    }

    function getVotingDate() public view returns (VotingDateTime memory) {
        return votingDateTime;
    }

    //Creates a candidate for the elections. Call addCandidate to add it to the mapping.
    //(id, firstName, lastName, politicalView)
    function createCandidate(
        string memory _firstName,
        string memory _lastName,
        string memory _politicalView
    ) public onlyOfficial {
        addCandidate(_firstName, _lastName, _politicalView);
    }

    //Adds a candidate to the elections.
    //(CandidateCount, id, firstName, lastName, voteCount, politicalView)
    function addCandidate(
        string memory _firstName,
        string memory _lastName,
        string memory _politicalView
    ) private {
        candidates[candidateCount] = Candidate(
            candidateCount,
            _firstName,
            _lastName,
            0,
            _politicalView
        );
        candidateCount++;
    }

    //Returns candidate struct by its candidateCount value
    //(CandidateCount, id, firstName, lastName, voteCount, politicalView)
    function getCandidateByCount(uint256 _candidateCount)
        public
        view
        returns (Candidate memory)
    {
        return candidates[_candidateCount];
    }

    //Returns uint candidate vote count by its candidateCount value.
    function getCandidateVoteCount(uint256 _candidateCount)
        public
        view
        returns (uint256)
    {
        return candidates[_candidateCount].voteCount;
    }

    //Returns voter struct by voter address
    function getVoterStructByAddress(address _voterAddress)
        public
        view
        returns (voter memory)
    {
        return voterRegister[_voterAddress];
    }

    //Returns bool if a voter voted or not by voter address
    function getVoterVotedByAddress(address _voterAddress)
        public
        view
        returns (bool)
    {
        return voterRegister[_voterAddress].voted;
    }

    //Returns uint voter number by voter address
    function getVoterNumberByAddress(address _voterAddress)
        public
        view
        returns (uint256)
    {
        return voterRegister[_voterAddress].voterNumber;
    }

    function getVoters() public view returns (uint256 supplyCount) {
        return _votersContract.totalSupply();
    }

    function getOwnerOf(uint256 _id)
        public
        view
        returns (address ownerAddress)
    {
        return _votersContract.ownerOf(_id);
    }

    //add voter
    function addVoter(
        address _voterAddress /*, string memory _voterName*/
    ) public onlyOfficial {
        _votersContract.mint(_voterAddress);
        voter memory newVoter;
        newVoter.exists = true;
        newVoter.voted = false;
        newVoter.voterNumber = totalVoter++;
        voterRegister[_voterAddress] = newVoter;
        emit voterAdded(_voterAddress);
    }

    //voters vote by indicating their choice (true/false)
    function voteNow(uint256 _candidateid, uint256 _curentTicksTime)
        public
        electionTime(_curentTicksTime)
        returns (bool voted)
    {
        bool found = false;
        if (
            voterRegister[msg.sender].voterNumber > 0 &&
            !voterRegister[msg.sender].voted
        ) {
            voterRegister[msg.sender].voted = true;
            candidates[_candidateid].voteCount++;
            totalVotesCount++; //Number of total voters in the elections
            found = true;
        }
        emit voteDone(msg.sender);
        return found;
    }
}
