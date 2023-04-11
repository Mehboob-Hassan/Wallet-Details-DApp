const Moralis = require("moralis").default;

const express = require("express");
// const cors = require("cors");
const path = require("path");
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
const port = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: true,
//     // origin: "http://localhost:3000",
//     credentials: true,
//   })
// );
app.use(express.json());

// allow access to React app domain

const MORALIS_API_KEY = "3Tq2sz8cAC1PwpHHBvPg1thKEcQZTtWFHFZhF1ouY14r8lSbfUt9Zhugf8E6kMMV";
// const address = "0x54C4b929e93fF55FB93c93D43777C373f5131c1D";
// chain = EvmChain.ETHEREUM
// console.log(chain)


app.post("/balances", async(req, res) => {
    const address = req.body.address;
    // const chain = req.body.chain;
    const chain = EvmChain[req.body.chain]
  try {
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
        address,
        chain,
    })
    
    const tokenBalance = await Moralis.EvmApi.token.getWalletTokenBalances({
        address, chain
    })
    
    const nftBalances = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain,
        limit : 10,
    })

    const nfts = nftBalances.result.map((nft)=>({
        name : nft.result.name,
        amount : nft.result.amount,
        metadata : nft.result.metadata,
    }))

    const native = nativeBalance.result.balance.ether;
    const tokens = tokenBalance.result.map((token)=> token.display());

    
    res.status(200).json({
      // formatting the output
      address,
      nativeBalance: native,
      tokenBalances: tokens,
    });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }
});


app.post("/nfts", async(req, res)=>{
    const contract_addr = req.body.contract_addr;
    const chain = EvmChain[req.body._chain];
    try {
        const ownedNFTs = await Moralis.Web3API.nft.getNFTsForContract({
            chain: 'eth', // Replace with the chain you want to use
            address: contract_addr,
            owner_address: req.user.get('ethAddress'), // Assumes user is authenticated with Moralis and has an Ethereum address
          });

          const nfts = ownedNFTs.result.map((nft)=>({
            name : nft.result.name,
            amount : nft.result.amount,
            metadata : nft.result.metadata,
          }))
    res.status(200).json({
        nfts
    })
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json({ error: error.message });
    }
})



// if( process.env.NODE_ENV == "production"){
//   app.use(express.static("client/build"));
//   const path = require("path");
//   app.get("*", (req, res) => {
//       res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   })
// }

if (process.env.PRODUCTION === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build/index.html"));
  });
} else {
  app.get("/", (req, res, next) => {
    res.status(200).json({
      success: true,
      message: "app is running",
    });
  });
}


const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startServer();