-- Migration 003: Add wallet asset metadata and NFT support
-- All changes use ADD COLUMN IF NOT EXISTS to be idempotent.
-- No destructive SQL. Safe to re-run.

-- Fungible asset metadata on board_listings
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS offer_asset_type    VARCHAR(32)  DEFAULT 'fungible';
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS offer_asset_chain   VARCHAR(64);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS offer_asset_denom   VARCHAR(255);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS offer_asset_contract VARCHAR(255);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS offer_asset_token_id VARCHAR(255);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS offer_asset_decimals INTEGER;
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS offer_asset_amount   VARCHAR(64);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS offer_asset_metadata_hash VARCHAR(255);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS want_asset_type     VARCHAR(32)  DEFAULT 'fungible';
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS want_asset_chain    VARCHAR(64);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS want_asset_denom    VARCHAR(255);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS want_asset_contract  VARCHAR(255);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS want_asset_token_id  VARCHAR(255);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS want_asset_decimals  INTEGER;
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS want_asset_amount    VARCHAR(64);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS want_asset_metadata_hash VARCHAR(255);

-- Wallet provider / chain info on board_listings
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS wallet_provider  VARCHAR(64);
ALTER TABLE board_listings ADD COLUMN IF NOT EXISTS wallet_chain_id  VARCHAR(64);

-- Same fields on deal_requests
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS offer_asset_type    VARCHAR(32)  DEFAULT 'fungible';
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS offer_asset_chain   VARCHAR(64);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS offer_asset_denom   VARCHAR(255);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS offer_asset_contract VARCHAR(255);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS offer_asset_token_id VARCHAR(255);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS offer_asset_decimals INTEGER;
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS offer_asset_amount   VARCHAR(64);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS offer_asset_metadata_hash VARCHAR(255);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS want_asset_type     VARCHAR(32)  DEFAULT 'fungible';
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS want_asset_chain    VARCHAR(64);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS want_asset_denom    VARCHAR(255);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS want_asset_contract  VARCHAR(255);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS want_asset_token_id  VARCHAR(255);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS want_asset_decimals  INTEGER;
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS want_asset_amount    VARCHAR(64);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS want_asset_metadata_hash VARCHAR(255);

-- Wallet provider / chain info on deal_requests
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS wallet_provider  VARCHAR(64);
ALTER TABLE deal_requests ADD COLUMN IF NOT EXISTS wallet_chain_id  VARCHAR(64);

-- Indices for NFT / asset queries
CREATE INDEX IF NOT EXISTS board_listings_offer_asset_type_idx  ON board_listings(offer_asset_type);
CREATE INDEX IF NOT EXISTS board_listings_offer_asset_chain_idx ON board_listings(offer_asset_chain);
CREATE INDEX IF NOT EXISTS deal_requests_offer_asset_type_idx   ON deal_requests(offer_asset_type);
