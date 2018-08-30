pragma solidity ^0.4.18;

contract Contract6Var {

    uint256 public int1;
    uint256 public int2;
    uint256 public int3;
    string public string1;
    string public string2;
    string public string3;

    function setInt1(uint256 _storage) public {
        int1 = _storage;
    }

    function setInt2(uint256 _storage) public {
        int2 = _storage;
    }

    function setInt3(uint256 _storage) public {
        int3 = _storage;
    }

    function setString1(string _storage) public {
        string1 = _storage;
    }

    function setString2(string _storage) public {
        string2 = _storage;
    }

    function setString3(string _storage) public {
        string3 = _storage;
    }

    function getInt1() public view returns(uint256) {
        return int1;
    }

    function getInt2() public view returns(uint256) {
        return int2;
    }

    function getInt3() public view returns(uint256) {
        return int3;
    }

    function getString1() public view returns(string) {
        return string1;
    }

    function getString2() public view returns(string) {
        return string2;
    }

    function getString3() public view returns(string) {
        return string3;
    }
}