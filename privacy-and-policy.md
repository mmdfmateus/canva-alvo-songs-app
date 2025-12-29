# Privacy Policy

**Last Updated:** [Date]

## Introduction

This Privacy Policy describes how the Alvo Songs app ("we", "our", or "the app") handles information when you use our Canva app. We are committed to protecting your privacy and being transparent about our data practices.

## Information We Collect

### Information We Do NOT Collect

The Alvo Songs app is designed with privacy in mind. We do **not** collect, store, or transmit:

- Personal identification information (name, email, address, etc.)
- Canva account information
- Design content or data from your Canva designs
- Usage analytics or tracking data
- Any user-generated content

### Information Automatically Accessed

The app requires certain permissions to function within Canva:

- **Design Content Read Permission**: Required to read design metadata (such as page dimensions) to properly format slides. We do not store or transmit this information.
- **Design Content Write Permission**: Required to add slides to your Canva presentation. All content is created directly in your Canva design and remains under your control.

### External Data Sources

The app loads song lyrics from an external source:

- **S3 Bucket**: Song data is loaded from `https://alvo-songs.s3.sa-east-1.amazonaws.com/songs.json`
- This is a public, read-only data source containing song lyrics
- No personal information is transmitted to or from this source
- If the external source is unavailable, the app falls back to locally stored song data

## How We Use Information

Since we do not collect personal information, there is no personal data to use, share, or sell. The app operates entirely within your Canva session:

- Song lyrics are loaded and displayed in the app interface
- Selected songs are used to generate slides in your Canva design
- All processing happens locally in your browser session
- No data is sent to external servers (except loading the public songs.json file)

## Data Storage

- **No Server-Side Storage**: We do not maintain any servers or databases that store your information
- **Local Processing Only**: All app functionality runs in your browser
- **Canva Platform**: Any slides created by the app are stored in your Canva account according to Canva's privacy policy

## Third-Party Services

### Amazon S3

The app loads song data from an Amazon S3 bucket. This is a read-only operation that:
- Does not transmit any personal information
- Only retrieves publicly available song lyrics
- Is subject to Amazon's privacy policies for S3 services

### Canva Platform

The app operates within the Canva platform and is subject to:
- Canva's Terms of Service
- Canva's Privacy Policy
- Canva's API usage policies

## Children's Privacy

Our app does not knowingly collect information from children under 13. Since we do not collect personal information, this is not applicable, but we are committed to protecting children's privacy.

## Your Rights

Since we do not collect personal information, there is no personal data to access, modify, or delete. However, you have the right to:

- Stop using the app at any time
- Remove any slides created by the app from your Canva designs
- Contact us with privacy-related questions or concerns

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify users of any material changes by:

- Updating the "Last Updated" date at the top of this policy
- Posting the updated policy on the app's GitHub repository
- If required by Canva, updating the policy in the Developer Portal

## Contact Us

If you have questions about this Privacy Policy, please contact us through:

- **GitHub Repository**: [https://github.com/mmdfmateus/canva-alvo-songs-app](https://github.com/mmdfmateus/canva-alvo-songs-app)
- **Issues**: Open an issue on the GitHub repository

## Compliance

This Privacy Policy is designed to comply with:
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Canva's Developer Terms and Policies
- Industry best practices for privacy

## Consent

By using the Alvo Songs app, you consent to this Privacy Policy. If you do not agree with this policy, please do not use the app.

---

**Note**: This app operates entirely within the Canva platform. For information about how Canva handles your data, please review [Canva's Privacy Policy](https://www.canva.com/policies/privacy-policy/).

