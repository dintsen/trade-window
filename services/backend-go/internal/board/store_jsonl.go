package board

import (
	"bufio"
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

type JSONLBoardStore struct {
	mu       sync.Mutex
	filePath string
}

func NewJSONLBoardStore(filePath string) *JSONLBoardStore {
	if dir := filepath.Dir(filePath); dir != "" {
		os.MkdirAll(dir, 0755)
	}
	return &JSONLBoardStore{
		filePath: filePath,
	}
}

func (s *JSONLBoardStore) Create(ctx context.Context, listing BoardListing) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	f, err := os.OpenFile(s.filePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	data, err := json.Marshal(listing)
	if err != nil {
		return err
	}
	
	data = append(data, '\n')
	_, err = f.Write(data)
	return err
}

func (s *JSONLBoardStore) ListPublic(ctx context.Context) ([]PublicBoardListing, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	f, err := os.Open(s.filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return []PublicBoardListing{}, nil
		}
		return nil, err
	}
	defer f.Close()

	var listings []PublicBoardListing
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}
		var l BoardListing
		if err := json.Unmarshal(line, &l); err == nil {
			if l.Status == "open" {
				listings = append(listings, l.ToPublic())
			}
		}
	}

	return listings, scanner.Err()
}

func (s *JSONLBoardStore) GetPublic(ctx context.Context, id string) (*PublicBoardListing, error) {
	listings, err := s.ListPublic(ctx)
	if err != nil {
		return nil, err
	}
	for _, l := range listings {
		if l.ID == id {
			return &l, nil
		}
	}
	return nil, nil
}
