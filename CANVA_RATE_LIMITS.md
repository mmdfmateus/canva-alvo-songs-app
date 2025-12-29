# Canva Apps SDK Rate Limits

This document summarizes all rate limits from Canva's official documentation that this app needs to account for.

## Error Codes Related to Rate Limiting

According to the [Canva Error Handling documentation](https://www.canva.dev/docs/apps/handling-errors.md), there are two error codes related to rate limiting:

### 1. `rate_limited`

- **Description**: The app has made too many requests within a certain time period
- **When it occurs**: The app tries to create too many elements/pages in a short period of time
- **Note**: The reference page for each API method includes a description of any rate limits. For example, the [rate limit for `requestExport`](https://www.canva.dev/docs/apps/api/latest/design-request-export#rate-limit)
- **Handling**: Apps should implement retry logic with appropriate delays

### 2. `quota_exceeded`

- **Description**: The app or user has exceeded their allocated quota for a resource or service
- **When it occurs**:
  - The app can't upload a file because the user is out of storage space
  - Maximum pages per design limit is reached
- **Handling**: Apps should provide clear error messages and guidance to users

## Known Rate Limits

### Page Creation (`addPage`)

- **Limit**: Maximum **3 pages per second** (sliding window)
- **Source**: Referenced in app code and error messages
- **Current Implementation**:
  - **Sliding Window Rate Limiter**: Tracks recent page creation timestamps
  - Ensures no more than 3 pages are created in any 1-second window
  - Minimum 400ms delay between pages (~2.5 pages/second)
  - Dynamically calculates delay based on recent activity
  - Automatic retry on rate limit errors with exponential backoff (1.2 seconds)
  - Resets rate limit window on retry to prevent cascading failures
- **Error Code**: `rate_limited`
- **Key Improvement**: Instead of fixed delays, uses intelligent sliding window tracking to minimize wait times while respecting limits

### Design Editing API (`openDesign` / `session.sync()`)

- **Best Practice**: Batch operations and sync once at the end rather than syncing after each individual change
- **Reason**:
  - More efficient and provides better performance
  - Prevents rate limiting
  - Each `sync` call creates a separate undo operation
- **Source**: [Design Editing API documentation](https://www.canva.dev/docs/apps/design-editing.md#syncing-best-practices)

### Export (`requestExport`)

- **Rate Limit**: Documented in the API reference (specific limit not detailed in general docs)
- **Source**: [requestExport API reference](https://www.canva.dev/docs/apps/api/latest/design-request-export.md)
- **Note**: Check the specific API reference page for exact limits

### Asset Upload (`upload`)

- **File Size Limits**:
  - **Images**: Maximum 50MB
  - **Videos**: Maximum 1000MB (1GB)
  - **Audio**: Maximum 250MB
  - **Data URLs**: Maximum 10MB (10 × 1024 × 1024 characters)
- **Source**: [Asset Upload API reference](https://www.canva.dev/docs/apps/api/latest/asset-upload.md)
- **Note**: These are size limits, not rate limits, but should be considered for quota management

## Design Editing API Session Limits

- **Session Expiry**: Sessions have a **1-minute expiry**
- **Best Practice**: Complete editing operations efficiently and avoid holding sessions for extended periods
- **Source**: [Design Editing API documentation](https://www.canva.dev/docs/apps/design-editing.md#sessions)

## Recommendations for This App

### Current Implementation Status

✅ **Already Implemented**:

- Rate limiting for `addPage` (3 pages/second with 400ms delays)
- Error handling for `rate_limited` errors with retry logic
- Error handling for `quota_exceeded` errors with user-friendly messages

### Additional Considerations

1. **Design Editing API**: If the app uses `openDesign` and `session.sync()`, ensure:
   - Batch all operations before syncing
   - Sync once at the end rather than after each change
   - Complete operations within 1 minute to avoid session expiry

2. **Export Operations**: If the app uses `requestExport`:
   - Check the specific rate limit in the API reference
   - Implement retry logic for rate limit errors

3. **Asset Uploads**: If the app uploads assets:
   - Respect file size limits
   - Handle quota exceeded errors gracefully
   - Consider upload queue management for multiple assets

4. **General Best Practices**:
   - Always wrap API calls in try/catch blocks
   - Check for `CanvaError` instances
   - Handle `rate_limited` errors with exponential backoff retry
   - Provide clear, actionable error messages for `quota_exceeded` errors
   - Monitor and log rate limit errors for debugging

## Error Handling Pattern

```typescript
import { CanvaError } from "@canva/error";

try {
  await someCanvaAPICall();
} catch (error) {
  if (error instanceof CanvaError) {
    switch (error.code) {
      case "rate_limited":
        // Wait and retry with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Retry logic here
        break;
      case "quota_exceeded":
        // Show user-friendly error message
        break;
      // Handle other error codes...
    }
  }
}
```

## References

- [Handling Errors](https://www.canva.dev/docs/apps/handling-errors.md)
- [Design Editing API](https://www.canva.dev/docs/apps/design-editing.md)
- [addPage API Reference](https://www.canva.dev/docs/apps/api/latest/design-add-page.md)
- [requestExport API Reference](https://www.canva.dev/docs/apps/api/latest/design-request-export.md)
- [Asset Upload API Reference](https://www.canva.dev/docs/apps/api/latest/asset-upload.md)
