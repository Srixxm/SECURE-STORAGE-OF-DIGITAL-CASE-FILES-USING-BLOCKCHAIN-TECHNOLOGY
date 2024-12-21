import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import {abi} from "../../../artifacts/contracts/FileStorage.sol/FileStorage.json";
import './Upload.css'

const contractAddress = "0xE3d649024391201197EC962FBf483787165515aa";

function Upload() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleFileUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    pinata_api_key: 'd64f12be37ca967119be',
                    pinata_secret_api_key: '76002ce11ed27f9b76293f275e7101fbe4b271b68e85d5ed252db8ecfd7115d8'
                }
            });

            const ipfsHash = res.data.IpfsHash;
            console.log("Uploaded file IPFS Hash:", ipfsHash);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const gasEstimate = await contract.estimateGas.uploadFile(ipfsHash, title, description);
            const gasPrice = await provider.getGasPrice();

            const tx = await contract.uploadFile(ipfsHash, title, description, {
                gasLimit: gasEstimate.mul(2), // Use twice the estimated gas as a buffer
                gasPrice: gasPrice.mul(2),   // Set a higher gas price
            });

            console.log("Transaction submitted:", tx.hash);
            await tx.wait();

            // await contract.uploadFile(ipfsHash, title, description);
            // alert("File uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const getUploadedFiles = async () => {
        try {
            // Connect to Ethereum provider
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            // Call getMyFiles function
            console.log("Fetching files from contract...");
            const files = await contract.getMyFiles();
            console.log("Files retrieved:", files);

            // Format the files for display
            const formattedFiles = files.map((file) => ({
                ipfsHash: file.ipfsHash,
                title: file.title,
                description: file.description,
            }));

            setUploadedFiles(formattedFiles);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    return (
        <div className="container">
            <h1>Upload Case File</h1>
            <h3>Upload the case files using sepolia testnet for efficient transaction and security</h3>
            <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleFileUpload}>Upload</button>
            <h3>Uploaded Files</h3>
            <button onClick={getUploadedFiles}>Get My Files</button>
            <ul>
                {uploadedFiles.map((file, index) => (
                    <li key={index}>
                        <p>Title: {file.title}</p>
                        <p>Description: {file.description}</p>
                        <a
                            href={`https://gateway.pinata.cloud/ipfs/${file.ipfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View File
                        </a>
                        <p>File Hash : {file.ipfsHash}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Upload;
