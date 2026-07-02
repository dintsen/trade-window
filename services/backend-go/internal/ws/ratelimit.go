package ws

import (
	"sync"
	"time"
)

// slidingWindowLimiter is a simple per-connection message rate limiter.
// It allows at most `limit` events per rolling window.
type slidingWindowLimiter struct {
	mu     sync.Mutex
	limit  int
	window time.Duration
	events []time.Time
}

func newSlidingWindowLimiter(limit int, window time.Duration) *slidingWindowLimiter {
	if limit <= 0 {
		limit = 1
	}
	if window <= 0 {
		window = time.Minute
	}
	return &slidingWindowLimiter{
		limit:  limit,
		window: window,
	}
}

// Allow records an event at time `now` and reports whether it is within the
// configured rate. Old events outside the window are discarded.
func (l *slidingWindowLimiter) Allow(now time.Time) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	cutoff := now.Add(-l.window)
	kept := l.events[:0]
	for _, t := range l.events {
		if t.After(cutoff) {
			kept = append(kept, t)
		}
	}
	l.events = kept

	if len(l.events) >= l.limit {
		return false
	}
	l.events = append(l.events, now)
	return true
}
