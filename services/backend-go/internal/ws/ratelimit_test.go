package ws

import (
	"testing"
	"time"
)

func TestSlidingWindowLimiterAllowsUpToLimit(t *testing.T) {
	l := newSlidingWindowLimiter(3, time.Minute)
	now := time.Now()

	for i := 0; i < 3; i++ {
		if !l.Allow(now) {
			t.Fatalf("event %d should be allowed", i)
		}
	}
	if l.Allow(now) {
		t.Fatal("4th event within window should be rejected")
	}
}

func TestSlidingWindowLimiterRecoversAfterWindow(t *testing.T) {
	l := newSlidingWindowLimiter(2, time.Minute)
	start := time.Now()

	if !l.Allow(start) || !l.Allow(start) {
		t.Fatal("first two events should be allowed")
	}
	if l.Allow(start.Add(30 * time.Second)) {
		t.Fatal("event inside the window beyond limit should be rejected")
	}
	if !l.Allow(start.Add(61 * time.Second)) {
		t.Fatal("event after the window should be allowed again")
	}
}

func TestSlidingWindowLimiterDefensiveDefaults(t *testing.T) {
	l := newSlidingWindowLimiter(0, 0)
	now := time.Now()
	if !l.Allow(now) {
		t.Fatal("first event should be allowed with defensive defaults")
	}
	if l.Allow(now) {
		t.Fatal("limit should default to 1")
	}
}
