insert into trips (traveler, departs_on, returns_on, order_cutoff, notes, published)
values ('juan_camilo', current_date + 30, current_date + 45, current_date + 20, 'Viaje de ejemplo', true);

insert into products (source, external_id, category, title, brand, image_url, price_usd, product_url, is_trending) values
('manual','seed-1','tecnologia','Apple AirPods Pro (2da gen)','Apple',null,189.99,'https://www.bestbuy.com',true),
('manual','seed-2','tecnologia','Nintendo Switch OLED','Nintendo',null,349.99,'https://www.bestbuy.com',true),
('manual','seed-3','ropa','Hoodie clásico','Nike',null,55.00,'https://www.nike.com',false),
('manual','seed-4','ropa','Jeans 501 Original','Levi''s',null,69.50,'https://www.levi.com',false);
