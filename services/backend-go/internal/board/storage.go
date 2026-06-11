package board

import (
	"bufio"
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

type Storage struct {
	mu       sync.Mutex
	filePath string
}

func NewStorage(filePath string) *Storage {
	// Ensure directory exists
	if dir := filepath.Dir(filePath); dir != "" {
		os.MkdirAll(dir, 0755)
	}
	return &Storage{
		filePath: filePath,
	}
}

func (s *Storage) AppendListing(listing BoardListing) error {
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

func (s *Storage) GetAllListings() ([]BoardListing, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	f, err := os.Open(s.filePath)
	if err != nil {
		if os.IsNotExist(err) {
			return []BoardListing{}, nil
		}
		return nil, err
	}
	defer f.Close()

	var listings []BoardListing
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}
		var l BoardListing
		if err := json.Unmarshal(line, &l); err == nil {
			listings = append(listings, l)
		}
	}

	return listings, scanner.Err()
}

func (s *Storage) GetListingByID(id string) (*BoardListing, error) {
	listings, err := s.GetAllListings()
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
