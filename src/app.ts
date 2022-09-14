import * as web3 from '@solana/web3.js';

import * as dotenv from "dotenv";
dotenv.config();

async function main() {
    const senderKeypair = initializeKeypair(process.env.SENDER_PRIVATE_KEY);
    const reciverKeypair = initializeKeypair(process.env.RECEIVER_PRIVATE_KEY);
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    await connection.requestAirdrop(senderKeypair.publicKey, web3.LAMPORTS_PER_SOL*1);
    await tranferProgram(connection, senderKeypair, reciverKeypair, web3.LAMPORTS_PER_SOL*0.5);
}

function initializeKeypair(privKey: string|undefined): web3.Keypair {
    const secret = JSON.parse(privKey ?? "") as number[]
    const secretKey = Uint8Array.from(secret)
    const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey)
    return keypairFromSecretKey
}

async function tranferProgram(connection: web3.Connection, sender: web3.Keypair, receiver: web3.Keypair, lamports: number) {
    const transaction = new web3.Transaction();

    const tranferParams = {
        fromPubkey: sender.publicKey,
        toPubkey: receiver.publicKey,
        lamports
    }
    const instruction = web3.SystemProgram.transfer(tranferParams);

    transaction.add(instruction);

    const sig = await web3.sendAndConfirmTransaction(
        connection,
        transaction,
        [sender]
    )

    console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${sig}?cluster=devnet`)
}


main().then(() => {
    console.log("===Finished successfully===")
}).catch((error) => {
    console.error(error)
})