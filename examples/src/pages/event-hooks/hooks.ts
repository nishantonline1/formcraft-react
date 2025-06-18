import React, { useMemo, useState, useCallback } from 'react';
import { useEnhancedForm } from '../../enhanced-hooks';
import { 
  eventsFormModel, 
  initialEventValues, 
  handleEventSubmit,
  createAnalyticsEvent,
  EVENT_TYPES,
  analyzePasswordStrength,
  extractEmailDomain,
  type AnalyticsEvent 
} from './model';

/**
 * Main hook for the event hooks form, refactored for a cleaner, more robust implementation.
 */
export const useEventHooksForm = () => {
  const [analyticsEvents, setAnalyticsEvents] = useState<AnalyticsEvent[]>([]);

  const trackEvent = useCallback((type: string, field?: string, value?: unknown, metadata?: Record<string, unknown>) => {
    const event = createAnalyticsEvent(type, field, value, metadata);
    setAnalyticsEvents(prev => [...prev, event]);
    console.log('📊 Analytics Event:', event);
  }, []);

  const form = useEnhancedForm(eventsFormModel, {
    initialValues: initialEventValues,
    formId: 'event-hooks-form',
    enableAnalytics: true,
    eventHooks: {
      onFieldChange: (path, value) => {
        trackEvent(EVENT_TYPES.FIELD_CHANGE, path, value);
        if (path === 'email' && String(value).includes('@')) {
          const domain = extractEmailDomain(String(value));
          trackEvent(EVENT_TYPES.EMAIL_DOMAIN_ENTERED, path, value, { domain });
        }
        if (path === 'password') {
          const strength = analyzePasswordStrength(String(value));
          trackEvent(EVENT_TYPES.PASSWORD_STRENGTH_CHECK, path, undefined, strength);
        }
      },
      onFieldFocus: (path) => {
        trackEvent(EVENT_TYPES.FIELD_FOCUS, path);
      },
      onFieldBlur: (path) => {
        trackEvent(EVENT_TYPES.FIELD_BLUR, path, form.values[path]);
      },
      onFormSubmit: (values) => {
        trackEvent(EVENT_TYPES.FORM_SUBMIT_ATTEMPT, undefined, values);
      }
    }
  });
  
  const prevErrorsRef = React.useRef(form.errors);
  React.useEffect(() => {
    Object.keys(form.errors).forEach(field => {
      const currentErrors = form.errors[field] || [];
      const previousErrors = prevErrorsRef.current[field] || [];
      if (currentErrors.length > previousErrors.length) {
        trackEvent(EVENT_TYPES.VALIDATION_ERROR, field, undefined, {
          errorCount: currentErrors.length,
          errorMessages: currentErrors,
        });
      }
    });
    prevErrorsRef.current = form.errors;
  }, [form.errors, trackEvent]);


  const handleSubmit = useCallback(async (values: any) => {
    const result = await handleEventSubmit(values, analyticsEvents);
    if (result.analyticsEvent) {
      setAnalyticsEvents(prev => [...prev, result.analyticsEvent]);
    }
    return result;
  }, [analyticsEvents]);
  
  const analyticsStats = useMemo(() => {
    const totalInteractions = analyticsEvents.length;
    const fieldChanges = analyticsEvents.filter(e => e.type === EVENT_TYPES.FIELD_CHANGE).length;
    const focusEvents = analyticsEvents.filter(e => e.type === EVENT_TYPES.FIELD_FOCUS).length;
    const errorEvents = analyticsEvents.filter(e => e.type === EVENT_TYPES.VALIDATION_ERROR).length;
    const recentEvents = analyticsEvents.slice(-5).reverse();

    const firstEvent = analyticsEvents[0];
    const lastEvent = analyticsEvents[analyticsEvents.length - 1];
    const sessionDuration = firstEvent && lastEvent 
      ? lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime()
      : 0;

    return {
      totalInteractions,
      fieldChanges,
      focusEvents,
      errorEvents,
      recentEvents,
      sessionDuration,
      averageTimePerInteraction: totalInteractions > 0 ? sessionDuration / totalInteractions : 0
    };
  }, [analyticsEvents]);

  return {
    form,
    handleSubmit,
    analyticsEvents,
    analyticsStats,
  };
}; 