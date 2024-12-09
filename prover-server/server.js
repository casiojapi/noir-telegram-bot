import express from 'express';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';

import { Noir } from '@noir-lang/noir_js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import circuit from '../circuit/target/circuit.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

const backend = new BarretenbergBackend(circuit);
const noir = new Noir(circuit);

async function verifyProof(proofData) {
    console.log('Verifying proof with public inputs:', proofData);

    try {
        // Convert the proof to a Uint8Array
        const proofArray = new Uint8Array(Object.values(proofData.proof));

        console.log('Formatted proof array:', proofArray);

        // Pass the formatted proof and public inputs to the backend
        return await backend.verifyProof({
            proof: proofArray,
            publicInputs: proofData.publicInputs,
        });
    } catch (error) {
        console.error('Error verifying proof:', error);
        throw error;
    }
}

async function generateProof(input) {
    try {
        const { member, expected_member } = input;

        const inputs = {
            member, // Public input
            expected_member // Private input
        };

        const { witness } = await noir.execute(inputs);

        const proof = await backend.generateProof(witness);

        console.log('Generated raw proof:', proof);

        return { proof };

    } catch (error) {
        console.error('Error generating proof:', error);
        throw error;
    }
}
app.post('/generate-proof', async (req, res) => {
    const { member, expected_member } = req.body;

    if (!member || !expected_member) {
        return res.status(400).json({ error: 'Missing required inputs' });
    }

    try {
        const input = { member, expected_member };
        const result = await generateProof(input);
        console.log('Generated proof and public inputs:', result);
        res.json(result); // Returning both proof and publicInputs
    } catch (error) {
        console.error('Failed to generate proof:', error);
        res.status(500).json({ error: 'Failed to generate proof' });
    }
});

app.post('/verify-proof', async (req, res) => {
    const { proof } = req.body;
    const proofData = proof;
    console.log('Received proof and public inputs for verification:', { proofData });
    try {
        const isValid = await verifyProof(proof);
        console.log("verify:? ", isValid);
        res.json({ valid: isValid });
    } catch (error) {
        console.error('Error verifying proof:', error);
        res.status(500).json({ error: 'Failed to verify proof' });
    }
});

app.listen(port, () => {
    console.log("Server running at http://localhost:8080}");
});
