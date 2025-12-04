# Implementation Plan

- [ ] 1. Set up TypeScript types and interfaces


  - Create Post, User, Comment, and related type definitions
  - Add types to `src/types/index.ts`
  - Ensure types match backend Post model structure
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 2. Create utility functions for data transformation
  - [ ] 2.1 Implement `formatTimeAgo()` function
    - Convert ISO date strings to relative time (e.g., "2 hours ago")
    - Handle edge cases (just now, minutes, hours, days, weeks, months)
    - _Requirements: 2.1_

  - [ ] 2.2 Write property test for `formatTimeAgo()`
    - **Property: Time formatting consistency**
    - **Validates: Requirements 2.1**

  - [ ] 2.3 Implement `formatPriceRange()` function
    - Format price/budget objects to display strings (e.g., "$1,200 - $2,500")
    - Handle both priceRange and budget fields
    - _Requirements: 2.1_

  - [ ] 2.4 Write property test for `formatPriceRange()`
    - **Property: Price formatting consistency**
    - **Validates: Requirements 2.1**

  - [ ] 2.5 Implement `formatLocation()` function
    - Format location object to display string (e.g., "Austin, TX")
    - Handle partial location data
    - _Requirements: 2.6_

  - [ ] 2.6 Write property test for `formatLocation()`
    - **Property: Location formatting consistency**
    - **Validates: Requirements 2.6**

  - [ ] 2.7 Implement `formatPost()` function
    - Transform backend Post to UI display format
    - Apply all formatting utilities
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 2.8 Write property test for `formatPost()`
    - **Property 3: Required post data display**
    - **Validates: Requirements 2.1, 2.2, 2.4**

  - [ ] 2.9 Write property test for optional post fields
    - **Property 4: Optional post data display**
    - **Validates: Requirements 2.3, 2.5, 2.6**

- [ ] 3. Implement dashboard state management
  - [ ] 3.1 Add state variables for posts, loading, error, and pagination
    - Define state interface matching design document
    - Initialize state with appropriate default values
    - _Requirements: 1.1, 1.5, 4.1_

  - [ ] 3.2 Create `fetchPosts()` function
    - Call `postService.getPosts()` with current filters and pagination
    - Handle loading state (set loading to true before fetch, false after)
    - Handle success (update posts state with fetched data)
    - Handle errors (set error state with appropriate message)
    - Update pagination state (currentPage, totalPages, hasMore)
    - _Requirements: 1.1, 1.2, 1.3, 1.5, 4.1_

  - [ ] 3.3 Write property test for loading state
    - **Property 1: Loading state visibility**
    - **Validates: Requirements 1.5, 4.5**

  - [ ] 3.4 Write property test for successful fetch
    - **Property 2: Successful fetch displays posts**
    - **Validates: Requirements 1.2**

  - [ ] 3.5 Implement `useEffect` for initial data fetch
    - Fetch posts when component mounts
    - Fetch posts when filters change
    - Cancel pending requests on unmount
    - _Requirements: 1.1, 5.1, 5.2_

  - [ ] 3.6 Write property test for filter application
    - **Property 9: Filter application correctness**
    - **Validates: Requirements 5.1**

  - [ ] 3.7 Write property test for filter change behavior
    - **Property 10: Filter change clears posts**
    - **Validates: Requirements 5.2**

- [ ] 4. Implement post interaction handlers
  - [ ] 4.1 Create `handleLike()` function
    - Implement optimistic UI update (immediately update like count)
    - Call `postService.toggleLike(postId)`
    - On success: keep optimistic update
    - On failure: revert UI state and show error
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 4.2 Write property test for like toggle consistency
    - **Property 5: Like toggle consistency**
    - **Validates: Requirements 3.2, 3.3, 3.4**

  - [ ] 4.3 Write property test for failed operation reversion
    - **Property 6: Failed operation state reversion**
    - **Validates: Requirements 3.5**

  - [ ] 4.4 Create `handleLoadMore()` function
    - Increment currentPage
    - Set loadingMore to true
    - Fetch next page of posts
    - Append new posts to existing posts array
    - Update pagination state
    - Handle errors
    - _Requirements: 4.2, 4.3, 4.5_

  - [ ] 4.5 Write property test for pagination append
    - **Property 7: Pagination appends posts**
    - **Validates: Requirements 4.3**

  - [ ] 4.6 Write property test for pagination boundary
    - **Property 8: Pagination boundary handling**
    - **Validates: Requirements 4.4**

- [ ] 5. Implement error handling
  - [ ] 5.1 Create error classification utility
    - Classify errors by type (network, auth, validation, server)
    - Return appropriate error messages
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 5.2 Add authentication error handling
    - Check for 401/403 status codes
    - Clear token from localStorage
    - Redirect to login page
    - _Requirements: 6.2_

  - [ ] 5.3 Write property test for auth error redirect
    - **Property 12: Authentication error redirect**
    - **Validates: Requirements 6.2**

  - [ ] 5.4 Add error display UI
    - Show error messages in appropriate locations
    - Add retry buttons for recoverable errors
    - Ensure UI remains functional during errors
    - _Requirements: 6.3, 6.4, 6.5_

  - [ ] 5.5 Write property test for error message display
    - **Property 11: Error message display**
    - **Validates: Requirements 1.3, 6.1, 6.3**

  - [ ] 5.6 Write property test for error resilience
    - **Property 13: Error resilience**
    - **Validates: Requirements 6.4**

  - [ ] 5.7 Write property test for error recovery
    - **Property 14: Error recovery mechanism**
    - **Validates: Requirements 6.5**

- [ ] 6. Update dashboard UI components
  - [ ] 6.1 Replace mock data with real posts state
    - Remove mockPosts constant
    - Use posts from state in PostCard mapping
    - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

  - [ ] 6.2 Add loading indicators
    - Show spinner during initial load
    - Show loading state on "Load More" button
    - Add aria-busy attributes for accessibility
    - _Requirements: 1.5, 4.5_

  - [ ] 6.3 Add empty state UI
    - Display message when no posts are available
    - Display message when filter returns no results
    - _Requirements: 1.4, 5.4_

  - [ ] 6.4 Update PostCard component
    - Use formatted post data from utility functions
    - Wire up like button to handleLike function
    - Display actual like counts from backend
    - Show user's like status (liked or not)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2_

  - [ ] 6.5 Update "Load More" button
    - Wire up to handleLoadMore function
    - Show loading state when fetching more posts
    - Hide/disable when no more posts available
    - _Requirements: 4.2, 4.4, 4.5_

  - [ ] 6.6 Add error display components
    - Show error messages when API calls fail
    - Add retry buttons for failed operations
    - Style error states appropriately
    - _Requirements: 1.3, 6.1, 6.3, 6.5_

- [ ] 7. Implement filter functionality
  - [ ] 7.1 Wire up tab switching
    - Update activeTab state on tab click
    - Trigger fetchPosts with new filters
    - Clear existing posts before fetching
    - _Requirements: 5.1, 5.2_

  - [ ] 7.2 Implement feed filter (For You, Recent, Local)
    - Map filter selection to API parameters
    - Update feedFilter state
    - Trigger fetchPosts with new sort/filter
    - _Requirements: 5.1, 5.3_

  - [ ] 7.3 Add post type filtering
    - Allow filtering by 'work' or 'job' type
    - Update postType state
    - Trigger fetchPosts with type filter
    - _Requirements: 5.1, 5.3_

- [ ] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Polish and optimization
  - [ ] 9.1 Add request cancellation
    - Cancel pending API requests on component unmount
    - Cancel previous requests when new filters applied
    - _Requirements: 1.1_

  - [ ] 9.2 Optimize re-renders
    - Use useMemo for expensive computations
    - Use useCallback for event handlers
    - Prevent unnecessary re-renders
    - _Requirements: 1.2_

  - [ ] 9.3 Improve accessibility
    - Add aria-labels to interactive elements
    - Add aria-live regions for dynamic content
    - Ensure keyboard navigation works
    - _Requirements: 1.2, 1.3, 1.5_

  - [ ] 9.4 Write integration tests
    - Test complete user flows (fetch, like, paginate, filter)
    - Test error scenarios and recovery
    - Test accessibility features

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
