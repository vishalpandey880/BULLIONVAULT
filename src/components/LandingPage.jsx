import React, { useState } from 'react';
import { Shield, Lock, Activity, Server, Fingerprint, ChevronRight } from 'lucide-react';

export default function LandingPage({ onEnter }) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleTouchID = async () => {
    setIsAuthenticating(true);
    setAuthError('');
    try {
      // Simulate checking for WebAuthn capability
      if (!window.PublicKeyCredential) {
        throw new Error("WebAuthn not supported by this browser.");
      }

      // WebAuthn API Call to trigger Macbook Touch ID
      const publicKeyCredentialCreationOptions = {
        challenge: Uint8Array.from("randomStringFromServer" + Date.now(), c => c.charCodeAt(0)),
        rp: {
          name: "BullionVault Enterprise",
          // id is typically the domain, omitted for localhost/IP flexibility in demo
        },
        user: {
          id: Uint8Array.from("OPERATOR_A77", c => c.charCodeAt(0)),
          name: "operator@bullionvault.com",
          displayName: "Authorized Operator",
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
          authenticatorAttachment: "platform", // forces TouchID / Windows Hello
          userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      });

      if (credential) {
        setAccessGranted(true);
        setTimeout(() => {
          if (onEnter) onEnter();
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      setIsAuthenticating(false);
      setAccessGranted(false);
      setAuthError('Authentication failed or cancelled. Please try again.');
    }
  };

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      overflowY: 'auto',
      overflowX: 'hidden',
      background: 'hsl(var(--bg-primary))',
      color: 'hsl(var(--text-primary))',
      position: 'relative'
    }}>
      {/* Premium Background Graphics */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: 'radial-gradient(circle at 15% 50%, hsl(var(--gold-primary) / 0.05), transparent 40%), radial-gradient(circle at 85% 30%, hsl(var(--accent-blue) / 0.03), transparent 40%)'
      }} />

      {/* Navbar */}
      <nav style={{ 
        position: 'absolute', 
        top: 0, left: 0, right: 0, 
        padding: '1.5rem 3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={28} style={{ color: 'hsl(var(--gold-primary))' }} />
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'hsl(var(--text-primary))' }}>
            BullionVault <span style={{ color: 'hsl(var(--gold-primary))' }}>Enterprise</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', fontWeight: 600, color: 'hsl(var(--text-secondary))' }}>
          <span style={{ cursor: 'pointer' }}>Global Logistics</span>
          <span style={{ cursor: 'pointer' }}>Asset Integrity</span>
          <span style={{ cursor: 'pointer' }}>Compliance</span>
        </div>
      </nav>

      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1,
        padding: '2rem'
      }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '4rem' }}>
          <div className="badge badge-gold" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
            SYSTEM SECURE • ENCRYPTED NODE
          </div>
          <h2 style={{ fontSize: '3.8rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'hsl(var(--text-primary))' }}>
            Institutional Gold Management, <br/>
            <span style={{ background: 'linear-gradient(135deg, hsl(var(--gold-primary)), hsl(var(--gold-secondary)))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Secured by Biometrics.
            </span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'hsl(var(--text-secondary))', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            Command real-time inventory ledgers, tactical transport logistics, and deep-storage 
            compliance integrations across our global vault network.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="glass-panel" style={{ 
          width: '100%', 
          maxWidth: '440px', 
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: accessGranted ? '1px solid hsl(var(--success))' : '1px solid hsl(var(--border-color))'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem' }}>Terminal Authentication</h3>
            <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>
              Authorized operators only. Connect via secure hardware token.
            </p>
          </div>

          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: accessGranted ? 'hsl(var(--success) / 0.1)' : isAuthenticating ? 'hsl(var(--accent-blue) / 0.1)' : 'hsl(var(--bg-tertiary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${accessGranted ? 'hsl(var(--success))' : isAuthenticating ? 'hsl(var(--accent-blue))' : 'hsl(var(--border-color))'}`,
            transition: 'all 0.4s ease',
            position: 'relative'
          }}>
            <Fingerprint 
              size={48} 
              style={{ 
                color: accessGranted ? 'hsl(var(--success))' : isAuthenticating ? 'hsl(var(--accent-blue))' : 'hsl(var(--text-secondary))',
                transition: 'all 0.4s ease'
              }} 
            />
            {isAuthenticating && !accessGranted && (
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: 'hsl(var(--accent-blue))',
                animation: 'radar-spin 1s linear infinite'
              }} />
            )}
          </div>

          {authError && (
            <div style={{ fontSize: '0.85rem', color: 'hsl(var(--danger))', textAlign: 'center', fontWeight: 500 }}>
              {authError}
            </div>
          )}

          <button 
            onClick={handleTouchID}
            disabled={isAuthenticating}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              background: accessGranted ? 'hsl(var(--success))' : '',
              pointerEvents: accessGranted ? 'none' : 'auto'
            }}
          >
            {accessGranted ? (
              <>Identity Verified</>
            ) : isAuthenticating ? (
              <>Awaiting Touch ID...</>
            ) : (
              <>
                Login with Touch ID <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Feature Grid Below Fold */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
            <div style={{ padding: '0.5rem', background: 'hsl(var(--bg-tertiary))', borderRadius: '8px' }}><Lock size={20} /></div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>End-to-End Encrypted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
            <div style={{ padding: '0.5rem', background: 'hsl(var(--bg-tertiary))', borderRadius: '8px' }}><Activity size={20} /></div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Real-time Ledger Sync</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
            <div style={{ padding: '0.5rem', background: 'hsl(var(--bg-tertiary))', borderRadius: '8px' }}><Server size={20} /></div>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Decentralized Vaults</span>
          </div>
        </div>

      </div>
    </div>
  );
}
