import React, {
  useEffect,
  useState
} from "react";

export default function Dashboard() {

  const [mounted, setMounted] =
    useState(false);

  const [wallet, setWallet] =
    useState("");

  /*
   PREVENT SSR ERRORS
  */
  useEffect(() => {

    setMounted(true);

  }, []);

  /*
   CONNECT WALLET
  */
  async function connectWallet() {

    try {

      if (
        typeof window ===
        "undefined"
      ) {

        return;
      }

      if (
        !window.ethereum
      ) {

        alert(
          "Please install MetaMask"
        );

        return;
      }

      const accounts =
        await window.ethereum.request({

          method:
            "eth_requestAccounts"

        });

      setWallet(accounts[0]);

    } catch (error) {

      console.error(error);

      alert(
        "Wallet connection failed"
      );
    }
  }

  /*
   WAIT FOR CLIENT LOAD
  */
  if (!mounted) {

    return null;
  }

  return (

    <div
      style={{
        marginTop: "100px",
        width: "100%",
        display: "flex",
        justifyContent: "center"
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "#090909",
          border:
            "1px solid rgba(255,255,255,0.08)",
          borderRadius: "30px",
          padding: "50px"
        }}
      >

        <h2
          style={{
            fontSize: "42px",
            marginBottom: "20px"
          }}
        >

          AmicBridge Dashboard

        </h2>

        <p
          style={{
            color: "#a1a1aa",
            marginBottom: "40px",
            lineHeight: 1.7
          }}
        >

          Blockchain escrow dashboard
          powered by AI fraud detection,
          Base smart contracts and USDC
          settlement infrastructure.

        </p>

        <button

          onClick={connectWallet}

          style={{

            background: "#facc15",

            color: "black",

            border: "none",

            padding: "18px 28px",

            borderRadius: "16px",

            fontSize: "18px",

            fontWeight: "bold",

            cursor: "pointer"
          }}
        >

          {wallet
            ? "Wallet Connected"
            : "Connect MetaMask"}

        </button>

        <div
          style={{
            marginTop: "30px",
            color: "#22c55e",
            fontSize: "18px"
          }}
        >

          {wallet
            ? `Connected: ${wallet}`
            : "Waiting for wallet connection..."}

        </div>

      </div>

    </div>
  );
}
