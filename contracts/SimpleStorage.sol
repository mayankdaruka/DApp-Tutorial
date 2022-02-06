// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract SimpleStorage {
  uint storedData;

  function set(uint x) public returns (bool success) {
    storedData = x;
    return true;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
