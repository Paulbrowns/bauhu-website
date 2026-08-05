(() => {
  // Emergency no-op hotfix.
  // The previous implementation observed the entire document and mutated it
  // inside the observer callback, creating a self-triggering loop that could
  // make the site-fit page unresponsive. The summary panel will be rebuilt
  // with explicit, event-based updates in a follow-up change.
})();
