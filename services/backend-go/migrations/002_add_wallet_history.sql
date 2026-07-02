-- Add creator wallet to board_listings
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS creator_wallet VARCHAR(255);

-- Add requester wallet to deal_requests
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS requester_wallet VARCHAR(255);

-- Add hashes to trade_rooms
ALTER TABLE trade_rooms ADD COLUMN IF NOT EXISTS terms_hash VARCHAR(255);
ALTER TABLE trade_rooms ADD COLUMN IF NOT EXISTS metadata_hash VARCHAR(255);
ALTER TABLE trade_rooms ADD COLUMN IF NOT EXISTS commitment_hash VARCHAR(255);
ALTER TABLE trade_rooms ADD COLUMN IF NOT EXISTS tx_hash VARCHAR(255);

-- Create indices for efficient querying by wallet
CREATE INDEX IF NOT EXISTS board_listings_creator_wallet_idx ON board_listings(creator_wallet);
CREATE INDEX IF NOT EXISTS deal_requests_requester_wallet_idx ON deal_requests(requester_wallet);
CREATE INDEX IF NOT EXISTS trade_rooms_party_a_idx ON trade_rooms(party_a);
CREATE INDEX IF NOT EXISTS trade_rooms_party_b_idx ON trade_rooms(party_b);
