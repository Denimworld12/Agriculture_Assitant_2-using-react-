-- Insert sample users (passwords in plain text)
INSERT INTO users (name, email, password, phone, role, address, city, state, pincode)
VALUES 
('Admin User', 'admin@example.com', 'admin123', '9876543210', 'admin', '123 Admin Street', 'Delhi', 'Delhi', '110001'),
('Consumer User', 'user@example.com', 'user123', '9876543211', 'consumer', '456 User Avenue', 'Mumbai', 'Maharashtra', '400001'),
('Farmer User', 'farmer@example.com', 'farmer123', '9876543212', 'farmer', '789 Farm Road', 'Pune', 'Maharashtra', '411001');

-- Insert a sample farmer profile for the farmer user
INSERT INTO farmers (user_id, farm_name, farm_size, farm_location, farm_description, verification_status, government_id, farming_experience)
VALUES 
(3, 'Green Acres Farm', 25.5, 'Pune, Maharashtra', 'Organic vegetable farm. Primary crops: Tomatoes, Potatoes, Onions.', 'verified', 'FARM12345', 8);

-- Insert sample categories 