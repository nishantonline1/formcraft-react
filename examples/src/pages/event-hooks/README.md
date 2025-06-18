# Event Hooks Example - Comprehensive Analytics Integration

This example demonstrates advanced event tracking and analytics capabilities with the Form Builder library, showcasing real-time user behavior monitoring, comprehensive form interaction tracking, and detailed analytics dashboards.

## 🎯 **Key Features**

### Core Analytics Capabilities

- **Comprehensive Event Tracking**: Monitor field changes, focus/blur events, form submissions
- **Real-time Analytics Dashboard**: Live metrics and statistics visualization
- **Custom Event Metadata**: Rich contextual information for each interaction
- **Field Interaction Counting**: Track user engagement per field
- **Validation Error Tracking**: Monitor and analyze form validation patterns
- **Form Completion Time**: Measure user journey duration and efficiency

### Advanced Analytics Features

- **Password Strength Analysis**: Real-time password security scoring
- **Email Domain Detection**: Track email provider patterns
- **Session Duration Tracking**: Monitor total form interaction time
- **Field-specific Analytics**: Detailed per-field interaction insights
- **User Behavior Insights**: Identify most active fields and interaction patterns
- **Event Streaming**: Real-time event logging and console output

## 🏗️ **Architecture Overview**

### **model.ts** - Form Configuration & Analytics Logic

```typescript
// Form model with comprehensive validation
export const eventsFormModel: FormModel = [
  // Username, email, password, terms fields with custom validation
];

// Analytics event tracking
export interface AnalyticsEvent {
  type: string;
  field?: string;
  value?: unknown;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Utility functions for analysis
export const analyzePasswordStrength = (password: string) => {
  /* ... */
};
export const extractEmailDomain = (email: string) => {
  /* ... */
};
```

### **hooks.ts** - Analytics State Management

```typescript
// Main form hook with analytics integration
export const useEventHooksForm = () => {
  // Enhanced form handlers with event tracking
  const handleFieldChange = (field, value) => {
    form.handleChange(field, value);
    trackEvent('field_change', field, value, metadata);
    // Special tracking for email domains and password strength
  };

  return { config, form, handleSubmit, analyticsEvents, ... };
};

// Analytics statistics calculation
export const useAnalyticsStats = (events) => {
  // Calculate metrics: interactions, changes, errors, duration
};

// Field-specific analytics
export const useFieldAnalytics = (events, focusCount) => {
  // Per-field statistics and most active field detection
};
```

### **components.tsx** - UI Components & Dashboard

```typescript
// Real-time analytics dashboard
export const AnalyticsDashboard = ({ analyticsEvents, fieldFocusCount }) => {
  // Live metrics display with field activity summary
};

// Development debug panel
export const EventTrackingDebug = ({ form, analyticsEvents }) => {
  // Form state and analytics summary for debugging
};

// Main form component with integrated analytics
export const EventHooksFormComponent = () => {
  // Complete form with analytics dashboard and debug info
};
```

## 📊 **Analytics Dashboard Features**

### Real-time Metrics

- **Total Interactions**: Complete count of all user interactions
- **Field Changes**: Number of field value modifications
- **Focus Events**: Field focus/blur interaction count
- **Validation Errors**: Error occurrence tracking
- **Session Duration**: Total time spent on form

### Field Activity Tracking

- **Focus Count per Field**: Individual field engagement metrics
- **Recent Events Timeline**: Last 5 interactions with timestamps
- **Field Activity Summary**: Changes, focuses, and errors per field
- **Most Active Field Detection**: Identify fields with highest engagement

### Validation Error Analysis

- **Error Count per Field**: Track validation failure patterns
- **Error Message Tracking**: Capture specific validation messages
- **Error Frequency Analysis**: Identify problematic form areas

## 🔧 **Event Types & Tracking**

### Core Events

```typescript
export const EVENT_TYPES = {
  FIELD_CHANGE: 'field_change', // Value modifications
  FIELD_FOCUS: 'field_focus', // Field focus events
  FIELD_BLUR: 'field_blur', // Field blur events
  VALIDATION_ERROR: 'validation_error', // Validation failures
  FORM_SUBMIT_ATTEMPT: 'form_submit_attempt', // Submit attempts
  FORM_SUBMIT_SUCCESS: 'form_submit_success', // Successful submissions
};
```

### Special Events

```typescript
EMAIL_DOMAIN_ENTERED: 'email_domain_entered',     // Email @ detection
PASSWORD_STRENGTH_CHECK: 'password_strength_check' // Password analysis
```

## 🚀 **Usage Examples**

### Basic Implementation

```typescript
import { EventHooksWrapper } from './pages/event-hooks';

// Use the complete component with analytics
<EventHooksWrapper />
```

### Custom Analytics Integration

```typescript
import {
  useEventHooksForm,
  useAnalyticsStats,
  AnalyticsDashboard
} from './pages/event-hooks';

const MyForm = () => {
  const { form, analyticsEvents, fieldFocusCount } = useEventHooksForm();
  const stats = useAnalyticsStats(analyticsEvents);

  return (
    <div>
      <AnalyticsDashboard
        analyticsEvents={analyticsEvents}
        fieldFocusCount={fieldFocusCount}
      />
      {/* Your custom form UI */}
    </div>
  );
};
```

### Event Tracking Integration

```typescript
import { createAnalyticsEvent, EVENT_TYPES } from './pages/event-hooks';

// Custom event tracking
const trackCustomEvent = (type, field, value, metadata) => {
  const event = createAnalyticsEvent(type, field, value, metadata);
  console.log('Custom Event:', event);
  // Send to your analytics service
};
```

## 📈 **Analytics Insights**

### User Behavior Analysis

- **Field Engagement Patterns**: Identify which fields users interact with most
- **Completion Time Analysis**: Measure form efficiency and user experience
- **Error Pattern Recognition**: Understand common validation issues
- **Session Flow Tracking**: Monitor user journey through the form

### Performance Metrics

- **Average Interaction Time**: Time spent per field interaction
- **Error Rate per Field**: Validation failure percentage
- **Completion Rate**: Successful form submission percentage
- **Field Abandonment**: Identify where users stop interacting

## 🛠️ **Development & Debugging**

### Debug Panel Features

- **Form Values Display**: Current form state visualization
- **Error State Tracking**: Real-time validation error monitoring
- **Analytics Summary**: Comprehensive metrics overview
- **Event Stream Logging**: Console output for all tracked events

### Custom Event Metadata

```typescript
// Example metadata for password strength
{
  length: 12,
  hasNumbers: true,
  hasUppercase: true,
  hasSpecialChars: false,
  score: 4
}

// Example metadata for email domain
{
  domain: 'gmail.com',
  isPopularProvider: true
}
```

## 🎨 **Styling & Customization**

The analytics dashboard uses semantic CSS classes for easy customization:

```css
.analytics-dashboard {
  /* Main dashboard container */
}
.analytics-stats {
  /* Metrics display grid */
}
.stat-item {
  /* Individual metric item */
}
.analytics-section {
  /* Dashboard sections */
}
.recent-events {
  /* Event timeline */
}
.field-activity {
  /* Field statistics */
}
```

## 🔮 **Advanced Use Cases**

### A/B Testing Integration

Use event tracking to measure form performance across different versions:

```typescript
const trackFormVariant = (variant, event) => {
  trackEvent(event.type, event.field, event.value, {
    ...event.metadata,
    formVariant: variant,
  });
};
```

### User Experience Optimization

Analyze field interaction patterns to optimize form layout and flow:

```typescript
const analyzeFieldFlow = (analyticsEvents) => {
  // Identify field interaction sequences
  // Measure time between field interactions
  // Detect user hesitation patterns
};
```

### Real-time Assistance

Trigger help or guidance based on user behavior:

```typescript
const checkForHelpTriggers = (fieldStats) => {
  // High error count → Show help tooltip
  // Long focus time → Offer assistance
  // Multiple focus events → Suggest auto-complete
};
```

This comprehensive analytics integration transforms form interactions into actionable insights, enabling data-driven form optimization and enhanced user experiences.
