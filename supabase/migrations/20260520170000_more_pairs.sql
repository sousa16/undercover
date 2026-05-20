-- More word pairs — additive, no wipe. Layered on top of the seed pool.

insert into public.word_pairs (word_civilian, word_undercover) values
  -- Trabalho
  ('Excel', 'PowerPoint'),
  ('Chefe', 'Estagiário'),
  ('Email', 'DM'),

  -- Gaming
  ('Playstation', 'Xbox'),
  ('FIFA', 'PES'),
  ('Fortnite', 'Minecraft'),
  ('Mario', 'Sonic'),
  ('Call of Duty', 'Battlefield'),
  ('GTA', 'Red Dead'),
  ('Among Us', 'Fall Guys'),

  -- Música
  ('Rap', 'Trap'),
  ('Festival', 'Concerto'),
  ('NOS Alive', 'Rock in Rio'),
  ('Wet Bed Gang', 'Plutónio'),
  ('Slow J', 'Richie Campbell'),
  ('ProfJam', 'Bispo'),

  -- TV PT
  ('Big Brother', 'Casa dos Segredos'),
  ('Pesadelo na Cozinha', 'Masterchef'),
  ('Got Talent', 'The Voice'),

  -- Lisboa de noite
  ('Lux', 'Plateau'),
  ('Bairro Alto', 'Cais do Sodré'),

  -- Apps / serviços
  ('Uber', 'Bolt'),
  ('Revolut', 'MBWay'),

  -- Café / lanche PT
  ('Galão', 'Meia de leite'),
  ('Tosta mista', 'Sandes mista'),

  -- Comida PT (prato cheio)
  ('Bacalhau à Brás', 'Bacalhau com natas'),

  -- Cerveja PT (a rivalidade)
  ('Super Bock', 'Heineken'),

  -- Verão / praia
  ('Costa da Caparica', 'Carcavelos'),

  -- Consumo PT
  ('Pingo Doce', 'Continente'),
  ('Worten', 'Fnac'),

  -- Vícios / mobilidade
  ('Cigarro', 'Vape'),
  ('Trotinete', 'Bicicleta')
on conflict do nothing;
