-- Football word pack — additive, no wipe.

insert into public.word_pairs (word_civilian, word_undercover) values
  -- Portugueses
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

  -- GOATs / Sul-América
  ('Messi', 'Maradona'),
  ('Pelé', 'Maradona'),
  ('Ronaldinho', 'Romário'),
  ('Kaká', 'Ronaldinho'),
  ('Ronaldo Nazário', 'Romário'),
  ('Roberto Carlos', 'Cafu'),
  ('Garrincha', 'Maradona'),

  -- Postes (tall strikers)
  ('Ibrahimovic', 'Peter Crouch'),
  ('Haaland', 'Lukaku'),

  -- Guarda-redes
  ('Buffon', 'Casillas'),
  ('Neuer', 'Courtois'),

  -- Defesas centrais
  ('Maldini', 'Cannavaro'),
  ('Van Dijk', 'Varane'),
  ('Puyol', 'Sergio Ramos'),
  ('Piqué', 'Sergio Ramos'),
  ('Rio Ferdinand', 'Vidic'),

  -- Médios
  ('Iniesta', 'Xavi'),
  ('Modric', 'Kroos'),
  ('Gerrard', 'Lampard'),
  ('Pirlo', 'Pogba'),
  ('Pirlo', 'Gattuso'),
  ('Beckham', 'Scholes'),

  -- Avançados / extremos
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

  -- Cult / doidos
  ('Balotelli', 'Cassano'),

  -- Treinadores
  ('Mourinho', 'Guardiola'),
  ('Klopp', 'Ancelotti'),
  ('Ferguson', 'Wenger'),
  ('Ancelotti', 'Zidane'),
  ('Conte', 'Allegri'),

  -- França
  ('Zidane', 'Platini'),

  -- Nova geração
  ('Mbappé', 'Haaland'),
  ('Bellingham', 'Pedri'),
  ('Lamine Yamal', 'Endrick'),
  ('Trent', 'Robertson')
on conflict do nothing;
