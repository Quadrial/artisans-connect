# Blockfrost Setup Guide - Fix "Invalid project token" Error

## 🚨 Current Issue
```
Error: BlockfrostServerError: Invalid project token.
Status: 403 Forbidden
```

This error occurs because the Blockfrost Project ID in your `.env` file is not valid.

## ✅ Solution: Get a Real Blockfrost Project ID

### **Step 1: Create Blockfrost Account**

1. **Visit Blockfrost**: https://blockfrost.io/
2. **Sign Up** or **Login** to your account
3. It's **FREE** for development and testing!

### **Step 2: Create a Preprod Project**

1. **Go to Dashboard**: After logging in, click "Dashboard"
2. **Add New Project**: Click the "+ Add Project" button
3. **Select Network**: Choose **"Cardano Preprod Testnet"**
4. **Name Your Project**: e.g., "CraftConnect Preprod"
5. **Create Project**: Click "Create"

### **Step 3: Copy Your Project ID**

1. **View Project Details**: Click on your newly created project
2. **Copy Project ID**: You'll see a string like:
   ```
   preprod1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0
   ```
3. **Keep it secure**: This is your API key!

### **Step 4: Update Your .env File**

Open `backend/.env` and replace the line:

```env
# BEFORE (INVALID):
BLOCKFROST_PROJECT_ID=preprodqnWuOt69v42rIes4punuD20FAsRuqnpDg4

# AFTER (YOUR REAL PROJECT ID):
BLOCKFROST_PROJECT_ID=preprod1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0
```

### **Step 5: Restart Your Server**

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd backend
npm start
```

## 🎯 What This Fixes

With a valid Blockfrost Project ID, your application will be able to:

✅ **Query the Cardano blockchain** for latest block information
✅ **Get wallet UTXOs** for transaction creation
✅ **Submit real transactions** to the Cardano network
✅ **Retrieve transaction details** and confirmations
✅ **Access protocol parameters** for fee calculation

## 📊 Blockfrost Free Tier Limits

The free tier includes:
- **50,000 requests per day**
- **10 requests per second**
- **Perfect for development and testing**

For production, you may need to upgrade based on your verification volume.

## 🔐 Security Note

**IMPORTANT**: Your Blockfrost Project ID is an API key that should be kept secure:

- ✅ Store in `.env` file (already done)
- ✅ Add `.env` to `.gitignore` (should already be there)
- ❌ Never commit to version control
- ❌ Never share publicly

## 🧪 Testing After Setup

Once you've updated the Project ID and restarted the server:

1. **Test Verification Approval**:
   - Go to Admin Dashboard
   - Approve a pending verification
   - Check the server logs

2. **Expected Output**:
   ```
   ✅ Wallet initialized successfully
   📍 Wallet Address: addr_test1qz...
   🔗 Creating real Cardano transaction...
   ✅ Real transaction submitted successfully!
   🔗 Transaction Hash: a1b2c3d4e5f6...
   🌐 Explorer URL: https://preprod.cardanoscan.io/transaction/a1b2c3d4e5f6...
   ```

3. **Verify on Explorer**:
   - Copy the transaction hash from logs
   - Visit: https://preprod.cardanoscan.io/
   - Search for your transaction hash
   - You should see your transaction with metadata!

## 🆘 Still Having Issues?

### **Issue: "No UTXOs available"**
**Solution**: Your wallet needs testnet ADA
- Get free testnet ADA from: https://docs.cardano.org/cardano-testnet/tools/faucet/
- Use your wallet address from the server logs

### **Issue: "Wallet not initialized"**
**Solution**: Check your private key in `.env`
- Ensure `CARDANO_ROOT_PRIVATE_KEY` is set correctly
- Restart the server after changes

### **Issue: "Transaction failed"**
**Solution**: Check wallet balance
- Ensure you have at least 2 ADA in your testnet wallet
- Transaction fees are ~0.2 ADA each

## 📞 Support Resources

- **Blockfrost Documentation**: https://docs.blockfrost.io/
- **Cardano Testnet Faucet**: https://docs.cardano.org/cardano-testnet/tools/faucet/
- **Cardano Explorer (Preprod)**: https://preprod.cardanoscan.io/
- **Blockfrost Support**: support@blockfrost.io

## ✅ Checklist

Before testing, make sure you have:

- [ ] Created Blockfrost account
- [ ] Created Preprod testnet project
- [ ] Copied Project ID to `.env` file
- [ ] Restarted backend server
- [ ] Funded wallet with testnet ADA (optional for now)
- [ ] Tested verification approval

Once all steps are complete, your real Cardano transactions will work! 🎉