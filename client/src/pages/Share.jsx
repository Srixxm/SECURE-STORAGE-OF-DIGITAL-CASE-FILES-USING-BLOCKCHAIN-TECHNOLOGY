import React, { useState } from "react";
import { ethers } from "ethers";
import {abi} from "../../../artifacts/contracts/FileStorage.sol/FileStorage.json";
import './Share.css'

const contractAddress = "0xE3d649024391201197EC962FBf483787165515aa";

function Share() {
    const [ipfsHash, setIpfsHash] = useState("");
    const [receiver, setReceiver] = useState("");
    const [sharedUsers, setSharedUsers] = useState([]);

    const handleShare = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            await contract.shareFile(ipfsHash, receiver);
            alert("File shared successfully!");
        } catch (error) {
            console.error("Error sharing file:", error);
        }
    };

    const getSharedUsers = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const users = await contract.getSharedUsers(ipfsHash);
            setSharedUsers(users);
        } catch (error) {
            console.error("Error fetching shared users:", error);
        }
    };

    return (
        <div className="container">
            <h1>Share File</h1>
            <h4>Share your evidence among the users ambiguously</h4>
            <input type="text" placeholder="File IPFS Hash" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} />
            <input type="text" placeholder="Receiver Address" value={receiver} onChange={(e) => setReceiver(e.target.value)} />
            <button onClick={handleShare}>Share File</button>
            <button onClick={getSharedUsers}>Get Shared Users</button>
            <ul>
                {sharedUsers.map((user, index) => (
                    <li key={index}>{user}</li>
                ))}
            </ul>
        </div>
    );
}

export default Share;
