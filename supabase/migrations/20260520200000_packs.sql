-- Add pack column to word_pairs and backfill the football pack.
-- Packs are plain text (no FK / enum) so future packs can be added
-- without a schema change — just specify pack in the INSERT.

alter table public.word_pairs
  add column if not exists pack text not null default 'geral';

create index if not exists word_pairs_pack_idx on public.word_pairs (pack);

-- Tag the football pack rows.
update public.word_pairs
set pack = 'futebol'
where (word_civilian, word_undercover) in (
  ('Cristiano Ronaldo', 'Eusébio'),
  ('Cristiano Ronaldo', 'Figo'),
  ('Bruno Fernandes', 'João Félix'),
  ('Bernardo Silva', 'Rúben Neves'),
  ('Pepe', 'Rúben Dias'),
  ('Nani', 'Quaresma'),
  ('Pauleta', 'Hugo Almeida'),
  ('Rui Patrício', 'Vítor Baía'),
  ('Rui Costa', 'Deco'),
  ('Renato Sanches', 'Bernardo Silva'),
  ('Bernardo Silva', 'Bruno Fernandes'),
  ('Nuno Mendes', 'João Cancelo'),
  ('Messi', 'Maradona'),
  ('Pelé', 'Maradona'),
  ('Ronaldinho', 'Romário'),
  ('Kaká', 'Ronaldinho'),
  ('Ronaldo Nazário', 'Romário'),
  ('Roberto Carlos', 'Cafu'),
  ('Garrincha', 'Maradona'),
  ('Ibrahimovic', 'Peter Crouch'),
  ('Haaland', 'Lukaku'),
  ('Buffon', 'Casillas'),
  ('Neuer', 'Courtois'),
  ('Maldini', 'Cannavaro'),
  ('Van Dijk', 'Varane'),
  ('Puyol', 'Sergio Ramos'),
  ('Piqué', 'Sergio Ramos'),
  ('Rio Ferdinand', 'Vidic'),
  ('Iniesta', 'Xavi'),
  ('Modric', 'Kroos'),
  ('Gerrard', 'Lampard'),
  ('Pirlo', 'Pogba'),
  ('Pirlo', 'Gattuso'),
  ('Beckham', 'Scholes'),
  ('Henry', 'Drogba'),
  ('Suárez', 'Cavani'),
  ('Robben', 'Ribéry'),
  ('Salah', 'Mané'),
  ('Neymar', 'Vinicius'),
  ('Rooney', 'Owen'),
  ('Henry', 'Trezeguet'),
  ('Eto''o', 'Drogba'),
  ('Raúl', 'Torres'),
  ('Torres', 'Villa'),
  ('Inzaghi', 'Bobo Vieri'),
  ('Totti', 'Del Piero'),
  ('Klose', 'Podolski'),
  ('Müller', 'Lewandowski'),
  ('Balotelli', 'Cassano'),
  ('Mourinho', 'Guardiola'),
  ('Klopp', 'Ancelotti'),
  ('Ferguson', 'Wenger'),
  ('Ancelotti', 'Zidane'),
  ('Conte', 'Allegri'),
  ('Zidane', 'Platini'),
  ('Mbappé', 'Haaland'),
  ('Bellingham', 'Pedri'),
  ('Lamine Yamal', 'Endrick'),
  ('Trent', 'Robertson')
);
