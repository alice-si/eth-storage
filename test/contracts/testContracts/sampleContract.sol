pragma solidity ^0.4.18;

contract SimpleStorage {
    uint256 public sStorageInt; 
    bytes32 public sStorageByte;
    string public sStorageString; 

    function setStorageInt(uint256 _storage) public {
        sStorageInt = _storage;
    }
    
    function getStorageInt() public view returns(uint256) {
        return sStorageInt;
    }

    function setStorageByte(bytes32 _storage) public {
        sStorageByte = _storage;
    }
    
    function getStorageByte() public view returns(bytes32) {
        return sStorageByte;
    }

    function setStorageString(string _storage) public {
        sStorageString = _storage;
    }
    
    function getStorageString() public view returns(string) {
        return sStorageString;
    }
}