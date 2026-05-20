-- European Portuguese word pairs for the Undercover pool — edgier edition.
-- Wipes any previously seeded rows so this is the canonical pool on first
-- deploy. Safe under the GitHub integration (runs once per project).

delete from public.word_pairs;

insert into public.word_pairs (word_civilian, word_undercover) values
  -- Frutas (clássicos de Undercover — parecidos mas distintos)
  ('Pera', 'Maçã'),
  ('Banana', 'Pepino'),
  ('Morango', 'Framboesa'),
  ('Limão', 'Lima'),
  ('Melancia', 'Melão'),
  ('Pêssego', 'Alperce'),
  ('Uva', 'Cereja'),
  ('Laranja', 'Tangerina'),
  ('Ananás', 'Manga'),

  -- Comida (com sabor a Portugal)
  ('Bifana', 'Prego'),
  ('Francesinha', 'Cachorro'),
  ('Pastel de nata', 'Bola de Berlim'),
  ('Chamuça', 'Rissol'),
  ('Croquete', 'Pastel de bacalhau'),
  ('Mexilhão', 'Amêijoa'),
  ('Polvo', 'Lula'),
  ('Camarão', 'Lagostim'),
  ('Sardinha', 'Carapau'),
  ('Tremoços', 'Amendoins'),
  ('Gomas', 'Chocolate'),

  -- Bebidas (etílicas, porque é jogo de grupo)
  ('Imperial', 'Caneca'),
  ('Vinho do Porto', 'Vinho da Madeira'),
  ('Ginjinha', 'Licor Beirão'),
  ('Whisky', 'Vodka'),
  ('Gin tónico', 'Caipirinha'),
  ('Shot', 'Cocktail'),
  ('Sumol', 'Compal'),

  -- Vida noturna
  ('Discoteca', 'Bar'),
  ('Ressaca', 'Bebedeira'),
  ('Bairro Alto', 'Pink Street'),

  -- Relacionamentos / namoro
  ('Ficar', 'Namorar'),
  ('Beijo', 'Linguado'),
  ('Crush', 'Match'),
  ('Tinder', 'Bumble'),
  ('Curte', 'Engata'),

  -- Internet / redes sociais
  ('TikTok', 'Instagram'),
  ('Story', 'Reel'),
  ('WhatsApp', 'Telegram'),
  ('Netflix', 'HBO'),
  ('Spotify', 'YouTube'),
  ('Emoji', 'Sticker'),
  ('Wifi', 'Dados móveis'),

  -- Marcas
  ('iPhone', 'Android'),
  ('McDonald''s', 'Burger King'),
  ('Coca-Cola', 'Pepsi'),
  ('Nike', 'Adidas'),
  ('TAP', 'Ryanair'),

  -- Corpo / vaidade
  ('Bigode', 'Barba'),
  ('Sobrancelha', 'Pestana'),
  ('Tatuagem', 'Piercing'),
  ('Botox', 'Preenchimento'),

  -- Animais (menos batidos)
  ('Furão', 'Hamster'),
  ('Tubarão', 'Golfinho'),

  -- Vida de estudante
  ('Sebenta', 'Manual'),
  ('Praxe', 'Caloiro'),
  ('Erasmus', 'Interrail'),

  -- Desporto / ginásio
  ('Crossfit', 'Ginásio'),
  ('Padel', 'Ténis'),
  ('Surf', 'Bodyboard'),

  -- Cultura PT
  ('Quim Barreiros', 'Tony Carreira'),
  ('Benfica', 'Sporting'),
  ('Cristiano Ronaldo', 'Messi')
on conflict do nothing;
