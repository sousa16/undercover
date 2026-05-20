-- European Portuguese word pairs for the Undercover pool.
-- Run this in the Supabase SQL editor after 001_init.sql.

insert into public.word_pairs (word_civilian, word_undercover) values
  -- Comida e bebida
  ('Bifana', 'Prego'),
  ('Pastel de nata', 'Pastel de feijão'),
  ('Bacalhau', 'Sardinha'),
  ('Francesinha', 'Cachorro'),
  ('Caldo verde', 'Açorda'),
  ('Vinho tinto', 'Vinho verde'),
  ('Cerveja', 'Sangria'),
  ('Sumol', 'Compal'),
  ('Café', 'Chá'),
  ('Galão', 'Meia de leite'),
  ('Bola de Berlim', 'Donut'),
  ('Queijo', 'Fiambre'),

  -- Lugares
  ('Praia', 'Piscina'),
  ('Lisboa', 'Porto'),
  ('Algarve', 'Madeira'),
  ('Aldeia', 'Cidade'),
  ('Pastelaria', 'Padaria'),
  ('Tasca', 'Restaurante'),
  ('Mercado', 'Supermercado'),
  ('Esplanada', 'Café'),

  -- Tecnologia e casa
  ('Telemóvel', 'Tablet'),
  ('Portátil', 'Computador'),
  ('Auscultadores', 'Colunas'),
  ('Frigorífico', 'Congelador'),
  ('Fogão', 'Forno'),

  -- Desporto
  ('Futebol', 'Futsal'),
  ('Padel', 'Ténis'),
  ('Surf', 'Bodyboard'),
  ('Corrida', 'Caminhada'),
  ('Natação', 'Mergulho'),

  -- Transportes
  ('Carro', 'Mota'),
  ('Comboio', 'Metro'),
  ('Autocarro', 'Camioneta'),
  ('Avião', 'Helicóptero'),
  ('Barco', 'Iate'),

  -- Roupa
  ('Camisola', 'Camisa'),
  ('Calças', 'Calções'),
  ('Sapatos', 'Sapatilhas'),
  ('Casaco', 'Blusão'),
  ('Chapéu', 'Boné'),

  -- Animais
  ('Cão', 'Gato'),
  ('Galinha', 'Pato'),
  ('Tubarão', 'Golfinho'),
  ('Cavalo', 'Burro'),

  -- Cultura e entretenimento
  ('Cinema', 'Teatro'),
  ('Livro', 'Revista'),
  ('Festa', 'Arraial'),
  ('Casamento', 'Batizado'),
  ('Fado', 'Pimba'),
  ('Santo António', 'São João'),
  ('Benfica', 'Sporting'),

  -- Estações e datas
  ('Natal', 'Páscoa'),
  ('Verão', 'Primavera'),
  ('Carnaval', 'Halloween'),

  -- Natureza
  ('Sol', 'Lua'),
  ('Chuva', 'Nevoeiro'),
  ('Pinheiro', 'Sobreiro'),

  -- Profissões
  ('Médico', 'Enfermeiro'),
  ('Polícia', 'Bombeiro'),
  ('Professor', 'Explicador')
on conflict do nothing;
