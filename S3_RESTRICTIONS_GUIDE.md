# 🔒 S3 Link Restrictions & Requirements for Canva Apps

Based on [Canva's official documentation](https://www.canva.dev/docs/apps), here are the key restrictions and requirements for using S3 links in your Canva app.

## ✅ What's Allowed

### 1. HTTPS URLs
- ✅ **S3 HTTPS URLs are allowed** - Your app can fetch from `https://*.s3.*.amazonaws.com` URLs
- ✅ Canva's Content Security Policy allows `connect-src https:` which includes S3
- ✅ Your current URL format is correct: `https://alvo-songs.s3.sa-east-1.amazonaws.com/songs.json`

### 2. Fetch API
- ✅ Using `fetch()` API is the standard way to load external data
- ✅ Your implementation in `songsLoader.ts` is correct

## ⚠️ Critical Requirements

### 1. CORS Configuration (MANDATORY)

**This is the most important requirement!** Your S3 bucket **MUST** be configured with proper CORS headers.

#### Why CORS is Required

Canva apps run in an iframe with origin: `https://app-${APP_ID}.canva-apps.com`

When your app makes a `fetch()` request to S3, the browser enforces CORS. Without proper CORS headers, the request will fail with:

```
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

#### Required S3 CORS Configuration

Configure your S3 bucket CORS policy with:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://app-*.canva-apps.com",
      "https://*.canva.com"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

**Important Notes:**
- Use wildcard `*` for `AllowedOrigins` if you want to allow all Canva apps
- For production, consider restricting to specific app IDs for better security
- `AllowedMethods` should include at least `GET` (and `HEAD` for preflight requests)

#### How to Configure S3 CORS

**Via AWS Console:**
1. Go to your S3 bucket → **Permissions** tab
2. Scroll to **Cross-origin resource sharing (CORS)**
3. Click **Edit** and paste the JSON configuration above
4. Save changes

**Via AWS CLI:**
```bash
# Create cors.json file with the configuration above
aws s3api put-bucket-cors \
  --bucket alvo-songs \
  --cors-configuration file://cors.json
```

### 2. HTTPS Only

- ✅ **HTTPS is required** - HTTP URLs will be blocked
- ✅ Your S3 URL uses HTTPS: ✅ `https://alvo-songs.s3.sa-east-1.amazonaws.com/songs.json`
- ❌ HTTP URLs like `http://...` will NOT work

### 3. Public Read Access

Your S3 object must be publicly readable (or use signed URLs):

**Option A: Public Read (Simpler)**
```bash
aws s3 cp songs.json s3://alvo-songs/songs.json \
  --acl public-read \
  --content-type "application/json"
```

**Option B: Signed URLs (More Secure)**
- Generate signed URLs with expiration
- Rotate URLs periodically
- More complex but more secure

### 4. Content-Type Header

Ensure your S3 object has the correct `Content-Type`:

```bash
aws s3 cp songs.json s3://alvo-songs/songs.json \
  --content-type "application/json" \
  --acl public-read
```

## 🚫 What's NOT Allowed

### 1. HTTP (Non-HTTPS) URLs
- ❌ `http://alvo-songs.s3.amazonaws.com/...` - Will be blocked
- ✅ `https://alvo-songs.s3.amazonaws.com/...` - Allowed

### 2. Loading JavaScript from External Sources
- ❌ Cannot load `.js` files from S3 (CSP restriction)
- ✅ Can load JSON, images, fonts, audio, video

### 3. Loading CSS Stylesheets
- ❌ Cannot load `.css` files from S3
- ✅ Inline CSS is allowed

### 4. Frames and Web Workers
- ❌ Cannot use iframes pointing to S3
- ❌ Cannot use Web Workers from S3

## 📋 Checklist for S3 Setup

Before submitting your app, verify:

- [ ] **S3 bucket has CORS configured** with Canva origins
- [ ] **S3 object is publicly readable** (or using signed URLs)
- [ ] **HTTPS URL is used** (not HTTP)
- [ ] **Content-Type is set correctly** (`application/json`)
- [ ] **Test the CORS configuration** using browser dev tools
- [ ] **Fallback mechanism works** if S3 is unavailable

## 🧪 Testing CORS Configuration

### Method 1: Browser Dev Tools

1. Open your app in Canva editor
2. Open browser DevTools → Network tab
3. Trigger the fetch request
4. Check the response headers:
   - Should see `Access-Control-Allow-Origin: https://app-*.canva-apps.com`
   - Status should be `200 OK`

### Method 2: curl Test

```bash
curl -I -H "Origin: https://app-abc123.canva-apps.com" \
  https://alvo-songs.s3.sa-east-1.amazonaws.com/songs.json
```

Look for:
```
Access-Control-Allow-Origin: https://app-abc123.canva-apps.com
```

### Method 3: CORS Testing Tool

Use online tools like:
- https://www.test-cors.org/
- https://cors-test.codehappy.dev/

## 🔐 Security Best Practices

### 1. Restrict CORS Origins (Recommended)

Instead of allowing all origins, restrict to specific Canva app IDs:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": [
      "https://app-YOUR_APP_ID.canva-apps.com"
    ],
    "ExposeHeaders": [],
    "MaxAgeSeconds": 3000
  }
]
```

### 2. Use Signed URLs (Optional but Recommended)

For better security, use S3 signed URLs with expiration:

```typescript
// Generate signed URL on backend
const signedUrl = generateSignedS3Url('songs.json', {
  expiresIn: 3600 // 1 hour
});
```

### 3. Validate Response Data

Your code already does this ✅:

```typescript
// Validate that data is an array
if (!Array.isArray(data)) {
  throw new Error("Invalid songs data format: expected an array");
}
```

### 4. Implement Fallback

Your code already implements fallback ✅:

```typescript
// Falls back to local songs if S3 fetch fails
const localSongs = await loadLocalSongs();
```

## 📚 Official Canva Documentation References

- [Cross-Origin Resource Sharing (CORS)](https://www.canva.dev/docs/apps/cross-origin-resource-sharing)
- [Content Security Policy](https://www.canva.dev/docs/apps/content-security-policy)
- [Security Guidelines](https://www.canva.dev/docs/apps/security-guidelines)
- [Fetch API Example](https://www.canva.dev/docs/apps/examples/fetch)

## ⚠️ Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `No 'Access-Control-Allow-Origin' header is present`

**Solution:** Configure CORS on your S3 bucket (see above)

### Issue 2: 403 Forbidden
**Error:** `403 Forbidden` when fetching from S3

**Solution:** 
- Make object publicly readable, OR
- Use signed URLs with proper permissions

### Issue 3: Wrong Content-Type
**Error:** Browser doesn't parse JSON correctly

**Solution:** Set `Content-Type: application/json` when uploading to S3

### Issue 4: Preflight Request Fails
**Error:** OPTIONS request fails before GET request

**Solution:** Ensure CORS allows `OPTIONS` method (or `HEAD` method)

## ✅ Your Current Implementation Status

Based on your code:

- ✅ **HTTPS URL**: Using `https://alvo-songs.s3.sa-east-1.amazonaws.com/songs.json`
- ✅ **Fetch API**: Correctly using `fetch()` with proper error handling
- ✅ **Fallback**: Local fallback implemented
- ✅ **Validation**: Response data is validated
- ✅ **Caching**: Smart caching implemented
- ⚠️ **CORS**: **MUST verify S3 bucket has CORS configured** (most critical!)

## 🎯 Action Items Before Submission

1. **Verify S3 CORS Configuration**
   ```bash
   aws s3api get-bucket-cors --bucket alvo-songs
   ```

2. **Test CORS in Browser**
   - Open app in Canva editor
   - Check Network tab for CORS headers

3. **Test Fallback**
   - Temporarily break S3 URL
   - Verify app falls back to local songs

4. **Document in Testing Instructions**
   - If reviewers need to test, provide S3 URL
   - Explain that S3 is optional (fallback exists)

---

**Bottom Line:** S3 links are allowed in Canva apps, but **CORS configuration is mandatory**. Make sure your S3 bucket allows requests from Canva's app origins!

