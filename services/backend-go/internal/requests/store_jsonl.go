package requests

import (
	"context"
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

type JSONLRequestStore struct {
	mu       sync.Mutex
	filePath string
}

func NewJSONLRequestStore(filePath string) *JSONLRequestStore {
	if dir := filepath.Dir(filePath); dir != "" {
		os.MkdirAll(dir, 0755)
	}
	return &JSONLRequestStore{
		filePath: filePath,
	}
}

func (s *JSONLRequestStore) Create(ctx context.Context, request DealRequest) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	f, err := os.OpenFile(s.filePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return err
	}
	defer f.Close()

	data, err := json.Marshal(request)
	if err != nil {
		return err
	}
	
	data = append(data, '\n')
	_, err = f.Write(data)
	return err
}
