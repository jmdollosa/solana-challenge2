// Import Solana web3 functinalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");

const DEMO_FROM_SECRET_KEY = new Uint8Array(
    [
        236, 160, 170, 127,  67,  27,  46, 142, 166, 142, 192,
      144, 207, 239,  19, 123,  33, 208,  43, 178,  25, 206,
      127,  27, 120, 254,  24, 160, 148,  77,  98, 107,  67,
       91, 157, 188, 168, 224, 241,  99,  44, 153,  52,  45,
       87, 240, 161,  52, 201,  12, 211, 237, 228,   4,  30,
      101, 108,  51, 139,  89,   7, 162, 147, 108
    ]            
);

const getWalletBalance = async ( publicKey ) => {
    try {
        // Connect to the Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        
        const walletBalance = await connection.getBalance(
            new PublicKey(publicKey)
        );
       
        return walletBalance;
    } catch (err) {
        console.log(err);
    }
};

const transferSol = async() => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Get Keypair from Secret Key
    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    console.log(`Public key of sender wallet: ${from.publicKey.toString()}`);

    const senderBalance = await getWalletBalance(from.publicKey.toString());

    console.log(`Wallet balance of the sender wallet: ${parseInt(senderBalance) / LAMPORTS_PER_SOL} SOL`);

    // Get the 50% balance of the sender wallet
    const fiftyPercentBalance = senderBalance * 0.5;

    // Generate another Keypair (account we'll be sending to)
    const to = Keypair.generate();

    const receiverBalanceBefore = await getWalletBalance(to.publicKey.toString());
    console.log(`Wallet balance of the receiver wallet: ${parseInt(receiverBalanceBefore) / LAMPORTS_PER_SOL} SOL`);

    console.log(`----------------------------------------`)

    console.log(`Transferring ${fiftyPercentBalance/LAMPORTS_PER_SOL} SOL to receiver wallet...`);

    try{
        console.log(`----------------------------------------`)
        // Send money from "from" wallet and into "to" wallet
        var transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to.publicKey,
                lamports: fiftyPercentBalance
            })
        );

        // Sign transaction
        var signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from]
        );
        console.log('Transaction Signature is ', signature);

        const receiverBalance = await getWalletBalance(to.publicKey.toString());
        console.log(`Wallet balance of the receiver wallet: ${parseInt(receiverBalance) / LAMPORTS_PER_SOL} SOL`);
    }catch(e) {
        console.log('An error has occured, please restart the transaction by re-running the script.');   
    }
}

transferSol();
