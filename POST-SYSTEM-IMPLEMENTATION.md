# Post/Job System Implementation

## Overview
A comprehensive post and job system has been implemented for both artisans and customers.

## Backend Implementation

### Models
**Post Model** (`backend/models/Post.js`)
- Supports two types: `work` (artisan posts) and `job` (customer posts)
- Fields:
  - Basic: title, description, images, skills
  - Pricing: priceRange (artisans), budget (customers)
  - Location: state, city, address
  - Job-specific: deadline, jobType (one-time/ongoing/contract)
  - Engagement: likes, comments, saves, views
  - Status: active, closed, draft

### Controllers
**Post Controller** (`backend/controllers/postController.js`)
- `createPost` - Create new work/job post
- `getPosts` - Get all posts with filters (type, skills, location, pagination)
- `getPost` - Get single post with view tracking
- `getUserPosts` - Get posts by specific user
- `updatePost` - Update own post
- `deletePost` - Soft delete post
- `toggleLike` - Like/unlike post
- `addComment` - Add comment to post
- `toggleSave` - Save/unsave post
- `getSavedPosts` - Get user's saved posts

### Routes
**Post Routes** (`backend/routes/postRoutes.js`)
```
POST   /api/posts              - Create post
GET    /api/posts              - Get all posts (with filters)
GET    /api/posts/saved        - Get saved posts
GET    /api/posts/user/:userId - Get user's posts
GET    /api/posts/:id          - Get single post
PUT    /api/posts/:id          - Update post
DELETE /api/posts/:id          - Delete post
POST   /api/posts/:id/like     - Toggle like
POST   /api/posts/:id/comment  - Add comment
POST   /api/posts/:id/save     - Toggle save
```

## Frontend Implementation

### Services
**Post Service** (`src/services/postService.ts`)
- Complete API integration for all post operations
- Type-safe interfaces for PostData and QueryParams
- Error handling and authentication

### Components
**CreatePostModal** (`src/components/CreatePostModal.tsx`)
- Modal form for creating posts
- Role-aware fields:
  - **Artisans**: Share work with price range
  - **Customers**: Post jobs with budget and deadline
- Features:
  - Image upload with preview
  - Skills/tags management
  - Location input
  - Job type selection (customers)
  - Form validation

**DashboardHeader** (Updated)
- "Share Work" button for artisans
- "Post Job" button for customers
- Opens CreatePostModal on click

## Features

### For Artisans (Share Work)
- Title and description of work
- Upload work images
- Add skills/tags
- Set price range
- Specify location
- Track likes, comments, saves

### For Customers (Post Job)
- Job title and description
- Upload reference images
- Required skills
- Budget range
- Location
- Deadline
- Job type (one-time, ongoing, contract)

### Engagement Features
- ❤️ Like posts
- 💬 Comment on posts
- 🔖 Save posts for later
- 👁️ View tracking
- 📊 Engagement metrics

## Database Indexes
Optimized queries with indexes on:
- user + createdAt
- type + status + createdAt
- skills
- location (state, city)

## Security
- All routes protected with authentication
- Role-based validation (artisans can only post work, customers can only post jobs)
- Ownership verification for updates/deletes
- Image size limits (2MB)

## Next Steps
1. Update dashboard to display posts from the API
2. Add post detail view
3. Implement real-time updates
4. Add image gallery support
5. Implement search and filters
6. Add notifications for likes/comments
