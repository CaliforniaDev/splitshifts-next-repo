# 📝 TODO List

## 🚀 Priority Tasks
- [ ] update all components to MODERN standards
- [ ] update toast component to a sonner
- [ ] change color of button for the Disable Two-Factor Auth button
- [ ] fix codebase on login so that each time user is logged into the database for last time they were logged in
- [ ] create a email-templates directory inside of a libs folder, and create templates for email verification processes

## ✅ Completed Tasks
- [x] send-password-reset-link ui/ux needs to be updated to match the send email verifications
- [x] add fade in animations to all form card contents
- [x] add button to the success card for Password Reset Link Sent
- [x] create reusable AnimatedTransition component for consistent animations
- [x] convert all auth forms to use AnimatedTransition component

## 🎨 UI/UX Improvements
- [ ] Update all toast notifications to use proper toast component (currently using alerts)
- [ ] Add loading spinners to form submission buttons
- [ ] Implement form validation feedback animations
- [ ] Add hover and focus animations to interactive elements
- [ ] Create consistent spacing and layout animations for dashboard components
- [ ] Add animation preferences/reduced motion support for accessibility

## 🔧 Code Organization & Quality
- [ ] Convert remaining manual animation classes throughout the app to use AnimatedTransition
- [ ] Create consistent prop interfaces for all form components
- [ ] Standardize error handling patterns across auth forms
- [ ] Extract common form logic into custom hooks
- [ ] Add TypeScript strict mode compliance checking
- [ ] Implement comprehensive error boundaries
- [ ] Document animation patterns and usage guidelines

## 📱 Performance & Accessibility
- [ ] Optimize animation performance for mobile devices
- [ ] Add proper ARIA labels and accessibility attributes
- [ ] Implement keyboard navigation improvements
- [ ] Add focus management for form flows

## 💡 Development Notes
- [ ] Use the named utility for clarity and to avoid ambiguity:
'[&_svg]:ease-emphasized'