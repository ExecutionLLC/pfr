pragma solidity ^0.4.15;

contract Pfr {
    public address owner;

    struct PersonInfo {
        string snils;
        address npf;
        uint16 tariff;
    }

    struct NpfInfo {
        string name;
        bool isActive;
    }

    struct BankInfo {
        string name;
        bool isActive;
    }

    mapping (string => address) snilsMapping;
    mapping (address => PersonInfo) personMapping;
    mapping (address => NpfInfo) npfMapping;
    mapping (address => BankInfo) bankMapping;


    function Pfr(address _owner) {
        owner = _owner;
    }
    
    function () {
        revert();
    }

    event EventNewPerson(address indexed _owner, string _snils);
    event EventNewNpf(address indexed _owner, string _name, bool _isActive);
    event EventNewBank(address indexed _owner, string _name, bool _isActive);
    event EventNpfStateChanged(address indexed _owner, bool _isActive);
    event EventBankStateChanged(address indexed _owner, bool _isActive);
    event EventOperation(
        address indexed _owner, 
        address indexed _npf, 
        uint _timestamp, 
        uint _amount, 
        string _comment
    );
    
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }

    function isEmptyString(string _v) internal constant returns (bool) {
        bytes memory v = bytes(_v);
        return v.length == 0;
    }
    
    function isValidTariff(uint16 _tariff) constant returns (bool) {
        return _tariff <= 600;
    }
    
    function isRegisteredPerson(address _person) constant returns (bool) {
        string memory snils = personMapping[_person].snils;
        return !isEmptyString(snils);
    }

    function isRegisteredSnils(string _snils) constant returns (bool) {
        return snilsMapping[_snils] != 0;
    }
    
    function isRegisteredNpf(address _npf) constant returns (bool) {
        return !isEmptyString(npfMapping[_npf].name);
    }

    function isRegisteredBank(address _bank) constant returns (bool) {
        return !isEmptyString(bankMapping[_bank].name);
    }
    
    function createPerson(
        address _owner, 
        string _snils, 
        address _npf, 
        uint16 _tariff
    ) ownerOnly {
        require(_owner != 0);
        require(snilsMapping[_snils] == 0);
        require(isActiveNpf(_npf));
        require(isValidTariff(_tariff));
        
        snilsMapping[_snils] = _owner;
        personMapping[_owner].snils = _snils;
        personMapping[_owner].npf = _npf;
        personMapping[_owner].tariff = _tariff;
        EventNewPerson(_owner, _snils);
    }

    function createNpf(address _owner, string _name, bool _isActive) ownerOnly {
        require(_owner != 0 && !isEmptyString(_name));
        require(!isRegisteredNpf(_owner));

        npfMapping[_owner].name = _name;
        npfMapping[_owner].isActive = _isActive;
        EventNewNpf(_owner, _name, _isActive);
    }

    function createBank(address _owner, string _name, bool _isActive) ownerOnly {
        require(_owner != 0 && !isEmptyString(_name));
        require(!isRegisteredBank(_owner));
        
        bankMapping[_owner].name = _name;
        bankMapping[_owner].isActive = _isActive;
        EventNewBank(_owner, _name, _isActive);
    }
    
    function personInfo(string _snils) constant returns (address npf, uint16 tariff) {
        address _snilsOwner = snilsMapping[_snils];
        npf = personMapping[_snilsOwner].npf;
        tariff = personMapping[_snilsOwner].tariff;
    }
    
    function changeNpf(address _newNpf) {
        require(isActiveNpf(_newNpf));
        require(isRegisteredPerson(msg.sender));
        
        personMapping[msg.sender].npf = _newNpf;
    }
    
    function changeTariff(uint16 _newTariff) {
        require(isValidTariff(_newTariff));
        require(isRegisteredPerson(msg.sender));

        personMapping[msg.sender].tariff = _newTariff;
    }
    
    function npfName(address _npf) constant returns (string) {
        return npfMapping[_npf].name;
    }
        
    function isActiveNpf(address _npf) constant returns (bool) {
        return npfMapping[_npf].isActive;
    }

    function changeNpfState(address _npf, bool _isActive) ownerOnly {
        require(isRegisteredNpf(_npf));
        
        if (npfMapping[_npf].isActive != _isActive) {
            npfMapping[_npf].isActive = _isActive;
            EventNpfStateChanged(_npf, _isActive);
        }
    }
    
    function bankName(address _bank) constant returns (string) {
        return bankMapping[_bank].name;
    }
    
    function isActiveBank(address _bank) constant returns (bool) {
        return bankMapping[_bank].isActive;
    }
    
    function changeBankState(address _bank, bool _isActive) ownerOnly {
        require(isRegisteredBank(_bank));
        
        if (bankMapping[_bank].isActive != _isActive) {
            bankMapping[_bank].isActive = _isActive;
            EventBankStateChanged(_bank, _isActive);
        }
    }
    
    function addOperationHistory(string _snils, uint _amount, string _operationComment) {
        address personAddress = snilsMapping[_snils];
        require(personMapping[personAddress].npf == msg.sender);
        
        EventOperation(personAddress, msg.sender, now, _amount, _operationComment);
    }
}
