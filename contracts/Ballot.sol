
pragma solidity ^0.8.7;

contract Elections {


     //This will be stored eventually in a public mapping, so one can verify if one voted or not, but not know who is that one.
    struct voter{ 
        uint voterNumber;
        bool voted;
    }

    struct Candidate{
        uint candidateCount;
        uint id;
        string firstName;
        string lastName;
        uint voteCount;
        string politicalView;
    }


    uint public totalVoter = 0; //Number of Voters added to the system
    uint public totalVotesCount = 0; //Number of voters that actually came to vote
    address public ballotOfficialAddress;      
    string public ballotOfficialName;   
    uint public candidateCount; 
    mapping (uint => Candidate) public candidates;
    mapping(address => voter) public voterRegister; //Public mapping of voters, with their wallet address only. 
    enum State { Created, Voting, Ended }
	State public state;
	
	//creates a new ballot/elections contract
	constructor(
        string memory _ballotOfficialName  
) public {
        ballotOfficialAddress = msg.sender; //Sets the wallet address of the contract's creator as "admin".
        ballotOfficialName = _ballotOfficialName; //ballotOfficialName - 'Israel Elections 2022' for example
        addCandidate(310155595, "Shlomi", "Nagar", "Rightist");
        addCandidate(322844415, "Neta", "Bachar","Centrist"); //(id, firstName, lastName, politicalView)
        state = State.Created;
    }
    
    
	modifier condition(bool _condition) {
		require(_condition);
		_;
	}

	modifier onlyOfficial() {
		require(msg.sender ==ballotOfficialAddress);
		_;
	}

	modifier inState(State _state) {
		require(state == _state);
		_;
	}

    event voterAdded(address voter);
    event voteStarted();
    event voteEnded(uint totalVotesCount);
    event voteDone(address voter);
    


    //Creates a candidate for the elections. Call addCandidate to add it to the mapping.
    //(id, firstName, lastName, politicalView) 
    function createCandidate(uint _id, string memory _firstName,string memory _lastName, string memory _politicalView) public 
        inState(State.Created)
        onlyOfficial
        {
        addCandidate(_id,_firstName, _lastName, _politicalView);
    }
    //Adds a candidate to the elections.
    //(CandidateCount, id, firstName, lastName, voteCount, politicalView) 
    function addCandidate(uint _id, string memory _firstName,string memory _lastName, string memory _politicalView) private{
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _id, _firstName, _lastName, 0, _politicalView);
    }

    //Returns candidate struct by its candidateCount value 
    //(CandidateCount, id, firstName, lastName, voteCount, politicalView) 
    function getCandidateByCount(uint _candidateCount) public view returns(Candidate memory){
        return candidates[_candidateCount];
    }
    
    //Returns uint candidate vote count by its candidateCount value.
    function getCandidateVoteCount(uint _candidateCount) public view returns(uint){
        return candidates[_candidateCount].voteCount;
    }

    //Returns voter struct by voter address
    function getVoterStructByAddress(address _voterAddress) public view returns(voter memory){
        return voterRegister[_voterAddress];
    }

    //Returns bool if a voter voted or not by voter address
    function getVoterVotedByAddress(address _voterAddress) public view returns(bool){
        return voterRegister[_voterAddress].voted;
    }

    //Returns uint voter number by voter address
    function getVoterNumberByAddress(address _voterAddress) public view returns(uint){
        return voterRegister[_voterAddress].voterNumber;
    }

    //add voter
    function addVoter(address _voterAddress/*, string memory _voterName*/)
        public 
        inState(State.Created)
        onlyOfficial
    {
        voter memory v;
        totalVoter++;
        v.voted = false;
        v.voterNumber=totalVoter;
        voterRegister[_voterAddress] = v;
        emit voterAdded(_voterAddress);
    }

    //declare voting starts now
    function startVote()
        public
        inState(State.Created)
        onlyOfficial
    {
        state = State.Voting;     
        emit voteStarted();
    }

    //voters vote by indicating their choice (true/false)
    function voteNow(uint _candidateid)
        public
        inState(State.Voting)
        returns (bool voted)
    {
        bool found = false;
        require (_candidateid > 0 && _candidateid <= candidateCount);
        if (voterRegister[msg.sender].voterNumber>0 && !voterRegister[msg.sender].voted)
        {
            voterRegister[msg.sender].voted = true;
            candidates[_candidateid].voteCount++;
            totalVotesCount++; //Number of total voters in the elections
            found = true;
        }
        emit voteDone(msg.sender);
        return found;
    }
    //end votes
    function endVote()
        public
        inState(State.Voting)
        onlyOfficial
    {
        state = State.Ended;
        emit voteEnded(totalVotesCount);
    }
}
