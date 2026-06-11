create table if not exists board_listings (
  id text primary key,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  expires_at timestamptz not null,
  status text not null,

  title text not null,
  request_type text not null,
  offer_asset text not null,
  want_asset text not null,
  amount_range text,
  chain text not null,
  public_message text,
  public_contact text,
  contact_method text,

  private_email text not null,
  private_name text,

  consent_accepted boolean not null
);

create table if not exists deal_requests (
  id text primary key,
  created_at timestamptz not null,

  name text not null,
  email text not null,
  contact_handle text,
  preferred_contact text,

  request_type text not null,
  offer_asset text not null,
  want_asset text not null,
  amount_range text,
  chain text not null,

  message text,
  consent_accepted boolean not null,
  status text not null
);

create index if not exists board_listings_status_idx on board_listings(status);
create index if not exists board_listings_chain_idx on board_listings(chain);
create index if not exists board_listings_request_type_idx on board_listings(request_type);
create index if not exists board_listings_created_at_idx on board_listings(created_at desc);
create index if not exists deal_requests_created_at_idx on deal_requests(created_at desc);
