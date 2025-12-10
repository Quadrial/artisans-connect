# Didit KYC Integration Plan for CraftConnect

## 🎯 Overview
Integrate Didit's decentralized KYC verification system into CraftConnect to enhance trust, security, and professionalism in the Nigerian artisan marketplace.

**Your Didit Workflow**: https://verify.didit.me/verify/7_vdRkScbyHpB6fuGz-thw

## 🔍 Integration Strategy

### Phase 1: Basic KYC Integration
**Timeline**: 2-3 weeks

#### Frontend Integration
1. **Verification Button Component**
   ```tsx
   // src/components/DiditVerification.tsx
   const DiditVerification = ({ userId, onVerificationComplete }) => {
     const handleVerify = () => {
       window.open('https://verify.didit.me/verify/7_vdRkScbyHpB6fuGz-thw', '_blank');
     };
     
     return (
       <button onClick={handleVerify} className="didit-verify-btn">
         🛡️ Verify with Didit
       </button>
     );
   };
   ```

2. **Profile Integration Points**
   - Artisan profile setup page
   - Profile settings page
   - Dashboard verification status

3. **Verification Status Display**
   - Verified badge on profiles
   - Verification level indicators
   - Trust score display

#### Backend Integration
1. **Didit Webhook Handler**
   ```javascript
   // backend/routes/diditRoutes.js
   app.post('/api/didit/webhook', async (req, res) => {
     const { userId, verificationStatus, credentials } = req.body;
     
     // Update user verification status
     await User.findByIdAndUpdate(userId, {
       'verification.didit': {
         status: verificationStatus,
         verifiedAt: new Date(),
         credentials: credentials
       }
     });
   });
   ```

2. **User Model Updates**
   ```javascript
   // Add to User schema
   verification: {
     didit: {
       status: { type: String, enum: ['pending', 'verified', 'rejected'] },
       verifiedAt: Date,
       credentials: [String],
       trustScore: Number
     }
   }
   ```

### Phase 2: Advanced Features
**Timeline**: 3-4 weeks

#### Skill Verification
- **Professional Certifications**: Verify trade licenses, certifications
- **Educational Credentials**: Verify training and education
- **Experience Verification**: Validate work history

#### Trust & Reputation System
- **Verification Levels**: Basic, Professional, Expert
- **Trust Scores**: Blockchain-based reputation
- **Verified Reviews**: Only verified users can leave reviews

#### Payment Integration
- **Escrow Requirements**: Higher verification for larger jobs
- **Insurance Eligibility**: Verified artisans get coverage options
- **Premium Features**: Advanced tools for verified users

## 🛠️ Technical Implementation

### 1. Frontend Components

#### Verification Status Component
```tsx
// src/components/VerificationStatus.tsx
interface VerificationStatusProps {
  user: User;
  showDetails?: boolean;
}

const VerificationStatus = ({ user, showDetails = false }) => {
  const { verification } = user;
  
  return (
    <div className="verification-status">
      {verification?.didit?.status === 'verified' ? (
        <div className="verified-badge">
          <Shield className="text-green-500" />
          <span>Didit Verified</span>
          {showDetails && (
            <div className="verification-details">
              <p>Trust Score: {verification.didit.trustScore}/100</p>
              <p>Verified: {verification.didit.verifiedAt}</p>
            </div>
          )}
        </div>
      ) : (
        <DiditVerification userId={user._id} />
      )}
    </div>
  );
};
```

#### Verification Flow Component
```tsx
// src/components/VerificationFlow.tsx
const VerificationFlow = () => {
  const [step, setStep] = useState(1);
  
  const steps = [
    { id: 1, title: "Identity Verification", description: "Verify your identity with government ID" },
    { id: 2, title: "Professional Credentials", description: "Upload trade licenses and certifications" },
    { id: 3, title: "Skill Assessment", description: "Complete skill verification tests" }
  ];
  
  return (
    <div className="verification-flow">
      {/* Multi-step verification process */}
    </div>
  );
};
```

### 2. Backend Services

#### Didit Service
```javascript
// backend/services/diditService.js
class DiditService {
  constructor() {
    this.workflowUrl = 'https://verify.didit.me/verify/7_vdRkScbyHpB6fuGz-thw';
    this.apiKey = process.env.DIDIT_API_KEY;
  }
  
  async initiateVerification(userId, verificationType = 'basic') {
    // Start verification process
    const verificationRequest = {
      userId,
      workflowId: '7_vdRkScbyHpB6fuGz-thw',
      type: verificationType,
      callbackUrl: `${process.env.API_URL}/api/didit/callback`
    };
    
    return this.sendToDidit(verificationRequest);
  }
  
  async handleCallback(verificationData) {
    // Process verification results
    const { userId, status, credentials, trustScore } = verificationData;
    
    await User.findByIdAndUpdate(userId, {
      'verification.didit': {
        status,
        credentials,
        trustScore,
        verifiedAt: new Date()
      }
    });
    
    // Trigger notifications, update search rankings, etc.
    this.postVerificationActions(userId, status);
  }
}
```

### 3. Database Schema Updates

```javascript
// backend/models/User.js - Add verification fields
const userSchema = new mongoose.Schema({
  // ... existing fields
  
  verification: {
    didit: {
      status: {
        type: String,
        enum: ['none', 'pending', 'verified', 'rejected'],
        default: 'none'
      },
      verifiedAt: Date,
      credentials: [{
        type: String,
        credentialId: String,
        issuedAt: Date,
        expiresAt: Date
      }],
      trustScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      verificationLevel: {
        type: String,
        enum: ['basic', 'professional', 'expert'],
        default: 'basic'
      }
    },
    
    // Additional verification types
    skillCertifications: [{
      skill: String,
      certificationBody: String,
      verifiedAt: Date,
      expiresAt: Date
    }],
    
    backgroundCheck: {
      status: String,
      completedAt: Date
    }
  }
});
```

## 🎨 UI/UX Integration Points

### 1. Artisan Profile Page
- **Verification Badge**: Prominent display of verification status
- **Trust Score**: Visual trust indicator
- **Credentials Display**: List of verified skills/certifications

### 2. Discovery Page
- **Verification Filters**: Filter by verification status
- **Trust Score Sorting**: Sort by trust score
- **Verified Badge**: Show verification in search results

### 3. Job Application Process
- **Verification Requirements**: Jobs can require certain verification levels
- **Trust-based Matching**: Prioritize verified artisans
- **Verification Incentives**: Encourage verification for better visibility

### 4. Dashboard
- **Verification Status Card**: Current verification progress
- **Action Items**: Steps to complete verification
- **Benefits Display**: Show advantages of verification

## 🔐 Security & Privacy Considerations

### Data Protection
- **Minimal Data Storage**: Store only verification status, not personal data
- **Encrypted Credentials**: Secure storage of verification tokens
- **User Consent**: Clear consent for verification process

### Privacy Controls
- **Selective Disclosure**: Users choose what to share
- **Verification Levels**: Different levels of disclosure
- **Data Retention**: Clear policies on data retention

## 📊 Business Benefits

### For Artisans
- **Higher Trust**: Verified profiles get more jobs
- **Premium Rates**: Verified artisans can charge more
- **Better Visibility**: Higher search rankings
- **Insurance Access**: Eligibility for coverage

### For Customers
- **Reduced Risk**: Hire verified professionals
- **Quality Assurance**: Verified skills and credentials
- **Dispute Resolution**: Easier conflict resolution
- **Peace of Mind**: Know who you're hiring

### For Platform
- **Reduced Fraud**: Verified users reduce fake profiles
- **Higher Quality**: Better service quality
- **Regulatory Compliance**: Meet KYC requirements
- **Premium Features**: Monetize verification services

## 🚀 Implementation Roadmap

### Week 1-2: Foundation
- [ ] Set up Didit API integration
- [ ] Create basic verification components
- [ ] Update user model with verification fields
- [ ] Implement webhook handlers

### Week 3-4: Core Features
- [ ] Build verification flow UI
- [ ] Implement verification status display
- [ ] Add verification filters to discovery
- [ ] Create verification dashboard

### Week 5-6: Advanced Features
- [ ] Skill-specific verification
- [ ] Trust score calculation
- [ ] Verification-based job matching
- [ ] Premium verification features

### Week 7-8: Polish & Testing
- [ ] UI/UX refinements
- [ ] Security testing
- [ ] Performance optimization
- [ ] Documentation and training

## 💰 Monetization Opportunities

1. **Verification Fees**: Charge for premium verification
2. **Verified Job Postings**: Premium rates for verified-only jobs
3. **Insurance Partnerships**: Commission on insurance products
4. **Certification Programs**: Partner with training providers
5. **Background Checks**: Additional verification services

## 🔄 Integration with Web3 Roadmap

### Cardano Integration
- **Verification NFTs**: Issue verification certificates as NFTs
- **Smart Contract Integration**: Verification requirements in contracts
- **Token Incentives**: Reward verification with platform tokens
- **Governance**: Verified users get voting rights

### Future Enhancements
- **Cross-Platform Verification**: Use across multiple dApps
- **Reputation Portability**: Take verification to other platforms
- **Decentralized Credentials**: Fully decentralized verification system

---

**Next Steps**: 
1. Set up Didit API credentials and test the workflow
2. Begin frontend component development
3. Implement basic verification status tracking
4. Plan user onboarding for verification process

This integration will significantly enhance CraftConnect's credibility and position it as a premium, trusted marketplace in the Nigerian artisan ecosystem.