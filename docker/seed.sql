INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Mechanical Keyboard', 'RGB mechanical keyboard with Cherry MX switches', 129.99, 30, 'Electronics', null),
('Wireless Headphones', 'Premium noise-cancelling headphones 30hr battery', 89.99, 50, 'Electronics', null),
('Python Programming Book', 'Complete guide to Python for beginners and pros', 39.99, 100, 'Books', null),
('USB-C Hub 7-in-1', 'Multiport adapter with HDMI USB 3.0 and SD card', 49.99, 75, 'Electronics', null),
('DevOps Handbook', 'The definitive guide to DevOps practices', 44.99, 60, 'Books', null),
('Standing Desk Mat', 'Anti-fatigue mat for standing desks 32x20 inch', 34.99, 40, 'Office', null),
('Webcam 1080p', 'Full HD webcam with built-in microphone', 69.99, 25, 'Electronics', null),
('Laptop Stand', 'Adjustable aluminium laptop stand foldable', 29.99, 80, 'Office', null)
ON CONFLICT DO NOTHING;
