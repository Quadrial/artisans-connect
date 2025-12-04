# Design Document: Dashboard Posts Integration

## Overview

This design integrates the existing backend post API with the frontend dashboard to replace mock data with real posts from the database. The solution leverages the existing `postService` and backend endpoints, adding state management, error handling, and pagination to the dashboard component.

The integration will maintain the current UI/UX while connecting to real data, ensuring users can view, interact with, and filter posts seamlessly.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   Dashboard     │
│   Component     │
└────────┬────────┘
         │
         │ uses
         ▼
┌─────────────────┐      HTTP/REST      ┌──────────────────┐
│  Post Service   │◄────────────────────►│  Backend API     │
│  (Frontend)     │                      │  /api/posts      │
└─────────────────┘                      └────────┬─────────┘
                                                  │
                                                  │ queries
                                                  ▼
                                         ┌──────────────────┐
                                         │   MongoDB        │
                                         │   Post Model     │
                                         └──────────────────┘
```

### Component Responsibilities

1. **Dashboard Component**: Manages UI state, fetches posts, handles user interactions
2. **Post Service**: Provides API methods for post operations (already exists)
3. **Backend API**: Handles business logic, data validation, and database operations (already exists)
4. **Post Model**: Defines data schema and relationships (already exists)

## Components and Interfaces

### Frontend Types

We need to define TypeScript interfaces that match the backend Post model:

```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  role: 'artisan' | 'customer';
  profile: {
    profilePicture?: string;
    fullName?: string;
    state?: string;
    city?: string;
    phone?: string;
  };
}

interface Comment {
  _id: string;
  user: User;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  user: User;
  type: 'work' | 'job';
  title: string;
  description: string;
  images: string[];
  skills: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  budget?: {
    min: number;
    max: number;
  };
  location?: {
    state: string;
    city: string;
    address?: string;
  };
  deadline?: string;
  jobType?: 'one-time' | 'ongoing' | 'contract';
  likes: string[];
  comments: Comment[];
  saves: string[];
  views: number;
  status: 'active' | 'closed' | 'draft';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
}

interface PostsResponse {
  success: boolean;
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
```

### Dashboard State Management

The Dashboard component will manage the following state:

```typescript
interface DashboardState {
  // Posts data
  posts: Post[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  
  // Filters
  activeTab: 'feed' | 'browse' | 'following' | 'trending';
  feedFilter: 'forYou' | 'recent' | 'local';
  postType?: 'work' | 'job';
  
  // UI state
  loadingMore: boolean;
}
```

### API Integration Points

The dashboard will use these existing `postService` methods:

1. **getPosts(params)**: Fetch posts with filters and pagination
2. **toggleLike(id)**: Like/unlike a post
3. **addComment(id, text)**: Add a comment to a post
4. **toggleSave(id)**: Save/unsave a post

## Data Models

### Post Data Transformation

The backend returns posts with populated user data. The frontend needs to transform this data to match the UI requirements:

**Backend Response:**
```json
{
  "_id": "123",
  "user": {
    "_id": "456",
    "username": "maria_rodriguez",
    "profile": {
      "fullName": "Maria Rodriguez",
      "profilePicture": "/images/maria.png",
      "state": "Texas",
      "city": "Austin"
    },
    "role": "artisan"
  },
  "title": "Custom Dining Table",
  "description": "Just finished this custom dining table...",
  "images": ["/uploads/table1.jpg"],
  "skills": ["Woodworking", "Custom Furniture"],
  "priceRange": { "min": 1200, "max": 2500 },
  "likes": ["user1", "user2"],
  "comments": [],
  "createdAt": "2025-12-04T10:00:00Z",
  "likeCount": 2,
  "commentCount": 0
}
```

**UI Display Format:**
```typescript
{
  id: "123",
  user: {
    name: "Maria Rodriguez",
    role: "Carpenter",
    location: "Austin, TX",
    avatar: "/images/maria.png",
    verified: true
  },
  content: "Just finished this custom dining table...",
  images: ["/uploads/table1.jpg"],
  skills: ["Woodworking", "Custom Furniture"],
  likes: 2,
  comments: 0,
  timeAgo: "2 hours ago",
  price: "$1,200 - $2,500"
}
```

### Data Transformation Utilities

We'll need utility functions to:

1. **formatPost(post: Post)**: Transform backend post to UI format
2. **formatTimeAgo(date: string)**: Convert ISO date to relative time
3. **formatPriceRange(range)**: Format price/budget to display string
4. **formatLocation(location)**: Format location object to display string



## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Loading state visibility
*For any* fetch operation in progress (initial load or pagination), a loading indicator should be visible to the user
**Validates: Requirements 1.5, 4.5**

### Property 2: Successful fetch displays posts
*For any* successful API response containing posts, all posts in the response should be rendered in the feed
**Validates: Requirements 1.2**

### Property 3: Required post data display
*For any* post displayed in the feed, the author's name, role, profile picture, post title, description, and engagement metrics (likes, comments) must be visible
**Validates: Requirements 2.1, 2.2, 2.4**

### Property 4: Optional post data display
*For any* post with optional fields (images, skills, location), if those fields are present and non-empty, they should be displayed in the UI
**Validates: Requirements 2.3, 2.5, 2.6**

### Property 5: Like toggle consistency
*For any* post, clicking like then unlike should return the post to its original like state, and the displayed like count should always match the backend state after successful operations
**Validates: Requirements 3.2, 3.3, 3.4**

### Property 6: Failed operation state reversion
*For any* failed post interaction (like, comment, save), the UI state should revert to its previous state before the operation was attempted
**Validates: Requirements 3.5**

### Property 7: Pagination appends posts
*For any* successful "load more" operation, the new posts should be appended to the existing posts list without removing or modifying existing posts
**Validates: Requirements 4.3**

### Property 8: Pagination boundary handling
*For any* pagination state where currentPage >= totalPages, the "Load More" button should be hidden or disabled
**Validates: Requirements 4.4**

### Property 9: Filter application correctness
*For any* active filter (tab, type, location), the API request should include the correct filter parameters matching the user's selection
**Validates: Requirements 5.1**

### Property 10: Filter change clears posts
*For any* filter change operation, the existing posts list should be cleared before new filtered posts are loaded
**Validates: Requirements 5.2**

### Property 11: Error message display
*For any* failed API operation, an appropriate error message should be displayed to the user indicating what went wrong
**Validates: Requirements 1.3, 6.1, 6.3**

### Property 12: Authentication error redirect
*For any* API response with 401 or 403 status code, the user should be redirected to the login page
**Validates: Requirements 6.2**

### Property 13: Error resilience
*For any* error that occurs, the UI should remain functional and not crash, maintaining the current state
**Validates: Requirements 6.4**

### Property 14: Error recovery mechanism
*For any* error state displayed, a retry mechanism (button or action) should be available to the user
**Validates: Requirements 6.5**



## Error Handling

### Error Categories

1. **Network Errors**: API unreachable, timeout, connection issues
2. **Authentication Errors**: Invalid token, expired session (401/403)
3. **Validation Errors**: Invalid request parameters (400)
4. **Server Errors**: Internal server errors (500)
5. **Not Found Errors**: Resource doesn't exist (404)

### Error Handling Strategy

```typescript
interface ErrorState {
  type: 'network' | 'auth' | 'validation' | 'server' | 'notfound';
  message: string;
  action?: 'retry' | 'login' | 'refresh';
}
```

**Error Handling Flow:**

1. **Catch errors** in try-catch blocks around API calls
2. **Classify error** based on response status or error type
3. **Update UI state** with appropriate error message
4. **Provide recovery action** (retry button, login redirect, etc.)
5. **Log errors** for debugging (console.error in development)

**Authentication Error Handling:**
```typescript
if (error.status === 401 || error.status === 403) {
  localStorage.removeItem('craft_connect_token');
  navigate('/login');
}
```

**Network Error Handling:**
```typescript
if (!navigator.onLine || error.message.includes('Network')) {
  setError({
    type: 'network',
    message: 'Unable to connect. Please check your internet connection.',
    action: 'retry'
  });
}
```

### Optimistic UI Updates

For like/unlike operations, we'll use optimistic updates:

1. **Immediately update UI** (increment/decrement like count)
2. **Send API request** in background
3. **If request fails**, revert UI to previous state and show error
4. **If request succeeds**, keep the updated UI state

This provides instant feedback while maintaining data consistency.

## Testing Strategy

### Unit Testing

We'll write unit tests for:

1. **Utility Functions**:
   - `formatTimeAgo()`: Test with various date inputs
   - `formatPriceRange()`: Test with different price objects
   - `formatLocation()`: Test with complete and partial location data
   - `formatPost()`: Test post transformation with various post structures

2. **Component Behavior**:
   - Initial render and data fetching
   - Error state rendering
   - Empty state rendering
   - Loading state rendering

3. **User Interactions**:
   - Like button click
   - Load more button click
   - Tab switching
   - Filter changes

### Property-Based Testing

We'll use **fast-check** (for TypeScript/JavaScript) as our property-based testing library. Each property-based test will run a minimum of 100 iterations.

Property-based tests will be written for:

1. **Property 2: Successful fetch displays posts**
   - Generate random arrays of posts
   - Verify all posts are rendered

2. **Property 3: Required post data display**
   - Generate random posts with required fields
   - Verify all required fields are present in rendered output

3. **Property 4: Optional post data display**
   - Generate posts with various combinations of optional fields
   - Verify optional fields are displayed when present

4. **Property 5: Like toggle consistency**
   - Generate random posts with different like counts
   - Perform like/unlike operations
   - Verify state consistency

5. **Property 7: Pagination appends posts**
   - Generate multiple pages of posts
   - Verify pagination maintains existing posts

6. **Property 10: Filter change clears posts**
   - Generate various filter combinations
   - Verify posts are cleared on filter change

Each property-based test will be tagged with:
```typescript
// Feature: dashboard-posts-integration, Property X: [property description]
```

### Integration Testing

Integration tests will verify:

1. **API Integration**: Mock API responses and verify component behavior
2. **State Management**: Verify state updates correctly across operations
3. **Error Scenarios**: Test various error conditions and recovery
4. **Pagination Flow**: Test complete pagination cycle
5. **Filter Flow**: Test filter application and post updates

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage of utility functions and component logic
- **Property Tests**: Cover all universal properties (14 properties)
- **Integration Tests**: Cover critical user flows (fetch, like, paginate, filter)

## Implementation Notes

### Performance Considerations

1. **Memoization**: Use `useMemo` for expensive computations (post formatting)
2. **Debouncing**: Debounce filter changes to avoid excessive API calls
3. **Lazy Loading**: Load images lazily to improve initial render time
4. **Virtual Scrolling**: Consider for large post lists (future enhancement)

### Accessibility

1. **Loading States**: Use `aria-busy` and `aria-live` for screen readers
2. **Error Messages**: Use `role="alert"` for error announcements
3. **Interactive Elements**: Ensure all buttons have proper labels
4. **Keyboard Navigation**: Support keyboard interaction for all actions

### State Management

We'll use React hooks for state management:

- `useState` for component-local state
- `useEffect` for side effects (API calls)
- `useCallback` for memoized callbacks
- `useMemo` for memoized values

No external state management library is needed for this feature as the state is localized to the dashboard component.

### API Request Optimization

1. **Request Cancellation**: Cancel pending requests when component unmounts
2. **Request Deduplication**: Avoid duplicate requests for same data
3. **Caching**: Consider caching recent posts (future enhancement)
4. **Pagination**: Use cursor-based pagination for better performance (future enhancement)

## Migration Strategy

### Phase 1: Type Definitions
- Create TypeScript interfaces for Post and related types
- Add types to `src/types/index.ts`

### Phase 2: Utility Functions
- Create utility functions for data transformation
- Add to `src/utils/postUtils.ts`

### Phase 3: Dashboard Integration
- Replace mock data with API calls
- Implement state management
- Add error handling
- Implement pagination

### Phase 4: Testing
- Write unit tests for utilities
- Write property-based tests for correctness properties
- Write integration tests for user flows

### Phase 5: Polish
- Add loading states
- Improve error messages
- Optimize performance
- Ensure accessibility

## Future Enhancements

1. **Real-time Updates**: Use WebSockets for live post updates
2. **Infinite Scroll**: Replace "Load More" with infinite scroll
3. **Advanced Filters**: Add more filter options (price range, date range)
4. **Post Caching**: Cache posts to reduce API calls
5. **Optimistic Rendering**: Render posts before images load
6. **Image Optimization**: Compress and resize images on upload
