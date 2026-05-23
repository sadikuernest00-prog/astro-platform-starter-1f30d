/*
 AMICBRIDGE AI FRAUD DETECTION ENGINE
*/

const BLACKLISTED_WALLETS = [

  "0x0000000000000000000000000000000000000000",

  "0x1111111111111111111111111111111111111111"

];

/*
 MEMORY STORAGE
*/
const walletActivity = {};

/*
 MAIN FRAUD CHECK
*/
export async function analyzeEscrowRisk({

  buyer,

  seller,

  amount,

  escrowCount

}) {

  let riskScore = 0;

  const warnings = [];

  /*
   INVALID WALLET CHECK
  */
  if (
    !buyer ||
    !seller
  ) {

    riskScore += 50;

    warnings.push(
      "Missing wallet address"
    );
  }

  /*
   BLACKLIST CHECK
  */
  if (
    BLACKLISTED_WALLETS.includes(
      buyer
    )
  ) {

    riskScore += 100;

    warnings.push(
      "Buyer wallet blacklisted"
    );
  }

  if (
    BLACKLISTED_WALLETS.includes(
      seller
    )
  ) {

    riskScore += 100;

    warnings.push(
      "Seller wallet blacklisted"
    );
  }

  /*
   LARGE AMOUNT CHECK
  */
  if (amount > 10000) {

    riskScore += 30;

    warnings.push(
      "Large transaction detected"
    );
  }

  /*
   EXTREME AMOUNT CHECK
  */
  if (amount > 50000) {

    riskScore += 70;

    warnings.push(
      "Extremely large escrow"
    );
  }

  /*
   RAPID ESCROW CREATION
  */
  if (!walletActivity[buyer]) {

    walletActivity[buyer] = {
      count: 0,
      lastActivity: Date.now()
    };
  }

  const now = Date.now();

  const diff =
    now -
    walletActivity[buyer]
      .lastActivity;

  /*
   LESS THAN 1 MINUTE
  */
  if (diff < 60000) {

    walletActivity[buyer]
      .count += 1;

  } else {

    walletActivity[buyer]
      .count = 1;
  }

  walletActivity[buyer]
    .lastActivity = now;

  /*
   TOO MANY ESCROWS FAST
  */
  if (
    walletActivity[buyer]
      .count > 5
  ) {

    riskScore += 40;

    warnings.push(
      "Too many escrows created quickly"
    );
  }

  /*
   SAME BUYER + SELLER
  */
  if (
    buyer.toLowerCase() ===
    seller.toLowerCase()
  ) {

    riskScore += 80;

    warnings.push(
      "Buyer and seller identical"
    );
  }

  /*
   ESCROW FARMING DETECTION
  */
  if (escrowCount > 100) {

    riskScore += 25;

    warnings.push(
      "High escrow activity detected"
    );
  }

  /*
   FINAL RISK LEVEL
  */
  let riskLevel = "LOW";

  if (riskScore >= 30) {

    riskLevel = "MEDIUM";
  }

  if (riskScore >= 70) {

    riskLevel = "HIGH";
  }

  if (riskScore >= 100) {

    riskLevel = "BLOCKED";
  }

  return {

    approved:
      riskLevel !== "BLOCKED",

    riskScore,

    riskLevel,

    warnings
  };
}
