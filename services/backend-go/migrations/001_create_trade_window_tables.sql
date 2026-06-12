CREATE TABLE IF NOT EXISTS board_listings (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    request_type VARCHAR(50) NOT NULL,
    offer_asset VARCHAR(255) NOT NULL,
    want_asset VARCHAR(255) NOT NULL,
    amount_range VARCHAR(255),
    chain VARCHAR(50) NOT NULL,
    public_message TEXT,
    public_contact VARCHAR(255),
    contact_method VARCHAR(50),
    private_email VARCHAR(255) NOT NULL,
    private_name VARCHAR(255),
    consent_accepted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS deal_requests (
    id VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    contact_handle VARCHAR(255),
    preferred_contact VARCHAR(50),
    request_type VARCHAR(50) NOT NULL,
    offer_asset VARCHAR(255) NOT NULL,
    want_asset VARCHAR(255) NOT NULL,
    amount_range VARCHAR(255),
    chain VARCHAR(50) NOT NULL,
    message TEXT,
    consent_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS trade_rooms (
    id VARCHAR(255) PRIMARY KEY,
    party_a VARCHAR(255) NOT NULL,
    party_b VARCHAR(255),
    state VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trade_events (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(255) NOT NULL REFERENCES trade_rooms(id),
    type VARCHAR(50) NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
