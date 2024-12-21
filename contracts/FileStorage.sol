// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string ipfsHash;
        string title;
        string description;
        address[] sharedWith;
    }

    mapping(address => File[]) private userFiles;
    mapping(address => mapping(string => address[])) private fileShares;

    event FileUploaded(address indexed user, string ipfsHash);
    event FileShared(address indexed owner, address indexed receiver, string ipfsHash);
    event AccessRevoked(address indexed owner, address indexed receiver, string ipfsHash);

    function uploadFile(string memory ipfsHash, string memory title, string memory description) external {
        File memory newFile = File(ipfsHash, title, description, new address[](0));
        userFiles[msg.sender].push(newFile);
        emit FileUploaded(msg.sender, ipfsHash);
    }

    function getMyFiles() external view returns (File[] memory) {
        return userFiles[msg.sender];
    }

    function shareFile(string memory ipfsHash, address receiver) external {
        for (uint i = 0; i < userFiles[msg.sender].length; i++) {
            if (keccak256(abi.encodePacked(userFiles[msg.sender][i].ipfsHash)) == keccak256(abi.encodePacked(ipfsHash))) {
                userFiles[msg.sender][i].sharedWith.push(receiver);
                fileShares[msg.sender][ipfsHash].push(receiver);
                emit FileShared(msg.sender, receiver, ipfsHash);
                return;
            }
        }
        revert("File not found");
    }

    function getSharedUsers(string memory ipfsHash) external view returns (address[] memory) {
        return fileShares[msg.sender][ipfsHash];
    }

    function revokeAccess(string memory ipfsHash, address receiver) external {
        address[] storage sharedUsers = fileShares[msg.sender][ipfsHash];
        for (uint i = 0; i < sharedUsers.length; i++) {
            if (sharedUsers[i] == receiver) {
                sharedUsers[i] = sharedUsers[sharedUsers.length - 1];
                sharedUsers.pop();
                emit AccessRevoked(msg.sender, receiver, ipfsHash);
                return;
            }
        }
        revert("Access not found");
    }
}