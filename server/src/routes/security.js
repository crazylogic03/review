import { Router } from 'express';
import argon2 from 'argon2';

const router = Router();

/**
 * Security Demonstration Endpoint
 * Uses ONLY synthetic test data — never real credentials.
 * Demonstrates why plaintext password storage is insecure.
 */
router.post('/demo', async (_req, res) => {
  try {
    const syntheticPasswords = [
      'DemoPass_2024!',
      'TestUser#Secure99',
      'SampleCred_Alpha7',
    ];

    const results = await Promise.all(
      syntheticPasswords.map(async (plaintext) => {
        const hashed = await argon2.hash(plaintext);
        const verified = await argon2.verify(hashed, plaintext);
        return {
          plaintext,
          storedPlaintext: plaintext,
          storedHashed: hashed,
          verificationPassed: verified,
        };
      })
    );

    res.json({
      title: 'Password Storage Security Demonstration',
      disclaimer:
        'This demonstration uses only synthetic test data. No real user passwords are stored or transmitted in plaintext. Never store real passwords in plaintext.',
      explanation: {
        plaintextRisk: [
          'Plaintext storage exposes every password if the database is compromised.',
          'Attackers gain immediate access to all accounts.',
          'Users who reuse passwords across services are further endangered.',
        ],
        argon2Benefits: [
          'Argon2 is the winner of the Password Hashing Competition (PHC).',
          'It is resistant to GPU and ASIC brute-force attacks.',
          'Each hash includes a unique salt, preventing rainbow-table lookups.',
          'The computational cost can be tuned to stay ahead of hardware improvements.',
        ],
      },
      comparisons: results.map((r) => ({
        syntheticPassword: r.plaintext,
        plaintextStorage: `"${r.storedPlaintext}" — visible to anyone with DB access ❌`,
        argon2Storage: `"${r.storedHashed}" — unreadable, salted, secure ✅`,
        verificationWorks: r.verificationPassed,
      })),
      recommendation:
        'Always use Argon2 (or bcrypt/scrypt) for password hashing. Never store passwords in plaintext.',
    });
  } catch (err) {
    console.error('Security demo error:', err);
    res.status(500).json({ error: 'Security demonstration failed' });
  }
});

export default router;
