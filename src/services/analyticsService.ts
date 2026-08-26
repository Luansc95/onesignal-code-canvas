/**
 * Centralized Conversion & Marketing Analytics Service for OneSignal
 * Designed to track user interactions and business conversion events cleanly
 * without cluttering UI components. Compatible with GA4, GTM, Pixel, and internal telemetry.
 */

export type ConversionEventName =
  | 'page_view'
  | 'view_service'
  | 'view_project'
  | 'click_primary_cta'
  | 'click_secondary_cta'
  | 'click_consultative_cta'
  | 'click_budget'
  | 'click_contact'
  | 'click_whatsapp'
  | 'start_contact_form'
  | 'submit_contact_form'
  | 'contact_form_success'
  | 'portfolio_filter'
  | 'simulator_calculate'
  | 'privacy_policy_open'
  // Interactive Diagnostic & Funnel Events
  | 'diagnostic_started'
  | 'diagnostic_step_completed'
  | 'diagnostic_step_back'
  | 'diagnostic_completed'
  | 'diagnostic_result_viewed'
  | 'diagnostic_lead_started'
  | 'diagnostic_lead_submitted'
  | 'recommended_service_clicked'
  // Automation Opportunity Calculator Events
  | 'calculator_started'
  | 'calculator_completed'
  | 'calculator_cta_clicked';

export interface AnalyticsEventPayload {
  eventName: ConversionEventName;
  timestamp: string;
  metadata?: Record<string, string | number | boolean | undefined>;
  pageUrl: string;
}

class AnalyticsService {
  private eventsQueue: AnalyticsEventPayload[] = [];
  private isDevelopment = process.env.NODE_ENV !== 'production';

  /**
   * Tracks a conversion or interaction event
   */
  public track(
    eventName: ConversionEventName,
    metadata?: Record<string, string | number | boolean | undefined>
  ): void {
    const payload: AnalyticsEventPayload = {
      eventName,
      timestamp: new Date().toISOString(),
      metadata,
      pageUrl: typeof window !== 'undefined' ? window.location.href : ''
    };

    this.eventsQueue.push(payload);

    if (this.isDevelopment) {
      console.info(`[OneSignal Analytics] Event: ${eventName}`, metadata || {});
    }

    // Forward to standard browser dataLayer if Google Tag Manager is installed
    if (typeof window !== 'undefined' && (window as unknown as { dataLayer?: unknown[] }).dataLayer) {
      (window as unknown as { dataLayer: unknown[] }).dataLayer.push({
        event: eventName,
        ...metadata,
        event_time: payload.timestamp
      });
    }

    // Forward to gtag if present
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: Function }).gtag === 'function') {
      (window as unknown as { gtag: Function }).gtag('event', eventName, metadata);
    }
  }

  /**
   * Returns recent interaction events for diagnostics
   */
  public getRecentEvents(): AnalyticsEventPayload[] {
    return [...this.eventsQueue];
  }
}

export const analytics = new AnalyticsService();
