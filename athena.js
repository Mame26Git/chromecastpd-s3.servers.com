// @license  magnet:?xt=urn:btih:0b31508aeb0634b347b8270c7bee4d411b5d4109&dn=agpl-3.0.txt AGPL-v3.0
/* eslint-disable no-var, semi, prefer-arrow-callback, prefer-template */

/**
 * Collection of methods for sending analytics events to Archive.org's analytics server.
 *
 * These events are used for internal stats and sent (in anonymized form) to Google Analytics.
 *
 * @see analytics.md
 *
 * @type {Object}
 */
window.archive_analytics = (function defineArchiveAnalytics() {
  // keep orignal Date object so as not to be affected by wayback's
  // hijacking global Date object
  var Date = window.Date;
  var sendBeacon = window.navigator && window.navigator.sendBeacon ? window.navigator.sendBeacon.bind(window.navigator) : null;
  var ARCHIVE_ANALYTICS_VERSION = 2;
  var DEFAULT_SERVICE = 'ao_2';
  var NO_SAMPLING_SERVICE = 'ao_no_sampling'; // sends every event instead of a percentage

  var startTime = new Date();

  /**
   * @return {Boolean}
   */
  function isPerformanceTimingApiSupported() {
    return 'performance' in window && 'timing' in window.performance;
  }

  /**
   * Determines how many milliseconds elapsed between the browser starting to parse the DOM and
   * the current time.
   *
   * Uses the Performance API or a fallback value if it's not available.
   *
