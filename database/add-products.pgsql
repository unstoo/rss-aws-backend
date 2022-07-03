
CREATE extension IF NOT EXISTS "uuid-ossp";


DROP TABLE IF EXISTS products;


CREATE TABLE products (id uuid primary key default uuid_generate_v4(),
                                                   title text not null,
                                                              description text, price integer);


INSERT INTO products (title, description, price)
VALUES ('Azalea',
        'Large double. Good grower, heavy bloomer. Early to mid-season, acid loving plants. Plant in moist well drained soil with pH of 4.0-5.5.',
        1599), ('Hibiscus',
                'Blooms in summer, 20-35 inches high. Fertilize regularly for best results. Full sun, drought tolerant.',
                1299), ('Plectranthus',
                        'Quick-growing, herbaceous, shrub reaching up to 30 inches in height, forming a rounded, dense bush.',
                        599), ('Camellia Japonica',
                               'Slow growing, upright to spreading shrub. Oval, glossy, leaves and profuse winter to spring blooming flowers.',
                               1599), ('Bougainvillea Spectabilis',
                                       'Thorny woody vine scrambles over other plants with their hooked thorns. Pest free.',
                                       1099), ('Rosa Burgundy',
                                               'Deep purple colored flowers bushy rounded growth habit to 3 feet tall. Plant in full sun. Water regularly.',
                                               2299), ('Rosa Iceberg',
                                                       'Deep purple colored flowers bushy rounded growth habit to 3 feet tall. Plant in full sun. Water regularly.',
                                                       2299), ('Bonsai Tree',
                                                               'They do not thrive indoors, where the light is too dim, and humidity too low, for them to grow properly.',
                                                               4599), ('Calibrachoa Noa',
                                                                       'Blooms continuously from early spring to first frost. Full sun or part shade, moist well-drained soil.',
                                                                       1299), ('Cymbidium Aestivum',
                                                                               'The flowers last about ten weeks. They have a waxy texture and reach a height of more than 20 inches.',
                                                                               1499), ('Brassica Oleracea',
                                                                                       'Creamy-white centers, medium green outer foliage with flattened outer foliage.',
                                                                                       499), ('Viola Penny Orange Jump Up',
                                                                                              'Compact mounds of colorful dainty flowers, good for window boxes. Fertile well drained soil.',
                                                                                              499), ('Cotula',
                                                                                                     'Cotula have very fragrant orange flowers that bloom in the middle of summer.',
                                                                                                     '599'), ('Pelargonium Peltatum',
                                                                                                              'Well drained neutral to slightly acid soil, bright light. Do not over-fertilize or these flowers will lose scent.',
                                                                                                              499), ('Pansy Yellow with Blotch',
                                                                                                                     'Compact mounds of colorful dainty flowers, good for window boxes. Fertile well drained soil.',
                                                                                                                     399), ('Phalaenopsis Purple',
                                                                                                                            'Choose the brightest windows in your house for your orchids, place on an humidity tray and spray regularly.',
                                                                                                                            2599), ('Dianthus',
                                                                                                                                    'They thrive in fertile, fast draining, slightly alkaline (pH 6.75) soil. Avoid overwatering.',
                                                                                                                                    599), ('Chrysanthemum',
                                                                                                                                           'Chrysanthemums respond to plenty of food and moisture, and prefer full sun.',
                                                                                                                                           999), ('Iris Sibirica',
                                                                                                                                                  'These plants are very hardy, easy to grow, and increase readily. Average flower size is 3-4 inches in diameter.',
                                                                                                                                                  599), ('Aloe Vera',
                                                                                                                                                         'Drought tolerant, well drained soil. Prefers full sun.',
                                                                                                                                                         3099), ('Schlumbergera',
                                                                                                                                                                 'Easy to care for, requiring watering only when they’re dry. They like bright but indirect light.',
                                                                                                                                                                 2099), ('Senecio Rowleyanus',
                                                                                                                                                                         'Locate it in a place where it is exposed to at least a few hours of direct sunlight.',
                                                                                                                                                                         1850), ('Lithops',
                                                                                                                                                                                 'These plants blend in among the stones as a means of protection. Grazing animals would otherwise eat them.',
                                                                                                                                                                                 1299), ('Pachycereus Marginatus',
                                                                                                                                                                                         'The Mexican Fence Post will eventually reach 20 feet tall. Protect the growing tips with Styrofoam cups on the tops.',
                                                                                                                                                                                         5599), ('Echinocactus Grusonii',
                                                                                                                                                                                                 'Growing as a large roughly spherical globe, it may eventually reach over a meter in height after many years.',
                                                                                                                                                                                                 2599)
DROP TABLE IF EXISTS stocks;


CREATE TABLE stocks (product_id uuid,
                     count int,
                     foreign key ("product_id") references "products" ("id"));


DROP FUNCTION IF EXISTS populate_stocks();


CREATE FUNCTION populate_stocks() RETURNS void AS $$
DECLARE
  pcount int := 1;
  pid uuid;
BEGIN
  FOR pid IN SELECT id::uuid FROM products
  LOOP
	INSERT INTO stocks (product_id, count) VALUES
   	(pid, pcount);
    pcount := pcount + 1;
    IF pcount > 8 THEN
    	pcount := 2;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;


SELECT populate_stocks();