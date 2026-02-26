# UI/UX Review & Recommendations

## 1. Visual Hierarchy & Consistency
- **Issue:** Font sizes and weights vary across pages (e.g., headers in `Dashboard` vs `Announcements`).
- **Recommendation:** Standardize page headers (H1), section titles (H2), and card titles (H3). Use consistent padding.
- **Fix:** Create a reusable `PageHeader` component or apply consistent classes.

## 2. Navigation & Interactions
- **Issue:** `BottomNav` might obscure content on some mobile screens if padding isn't sufficient.
- **Recommendation:** Ensure `pb-24` or similar padding is applied to all main content containers to prevent overlap.
- **Fix:** Verify `pb` classes in all main layouts.

## 3. Touch Targets & Accessibility
- **Issue:** Small buttons (e.g., edit/delete icons) might be hard to tap.
- **Recommendation:** Ensure minimum touch target size (44x44px).
- **Fix:** Increase padding/size of icon buttons.

## 4. Feedback & Empty States
- **Issue:** Empty lists might look broken or discouraging.
- **Recommendation:** Use friendly illustrations or clear text for empty states.
- **Fix:** Enhance `EmptyState` component or usage.

## 5. Loading Experience
- **Issue:** Skeletons are good, but transitions can be jarring.
- **Recommendation:** Ensure smooth fade-ins for content after loading.
- **Fix:** Add simple fade-in animations to main content wrappers.

## 6. Detail Views (`ActivityDetail`, `AnnouncementDetail`)
- **Issue:** Text can be dense and hard to read.
- **Recommendation:** Improve line-height, spacing between paragraphs, and visual separation of metadata.
- **Fix:** Refine typography classes in detail pages.

## 7. Dashboard Information Density
- **Issue:** Dashboard can feel cluttered.
- **Recommendation:** Ensure sufficient whitespace between sections.
- **Fix:** Adjust gap/margin classes in `Dashboard.jsx`.
