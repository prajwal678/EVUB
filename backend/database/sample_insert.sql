-- Insert sample data into the `student` table
INSERT INTO student (SRN, email, pwd, phone_no, firstName, lastName) 
VALUES 
('SRN001', 'john.doe@example.com', 'hashed_password1', 1234567890, 'John', 'Doe'),
('SRN002', 'jane.smith@example.com', 'hashed_password2', 9876543210, 'Jane', 'Smith');

-- Insert sample data into the `payment` table
INSERT INTO payment (paymentID, paymentStatus, amount, SRN) 
VALUES 
('PAY001', TRUE, 100.00, 'SRN001'),
('PAY002', FALSE, 50.00, 'SRN002');

-- Insert sample data into the `venue` table
INSERT INTO venue (venueID, venueName, located, capacity, available) 
VALUES 
('VEN001', 'Main Hall', 'Building A', 200, TRUE),
('VEN002', 'Conference Room', 'Building B', 50, TRUE);

-- Insert sample data into the `club` table
INSERT INTO club (clubID, clubName, clubDescrip) 
VALUES 
('C001', 'Art Club', 'A club for art enthusiasts'),
('C002', 'Science Club', 'A club for science enthusiasts');

-- Step 1: Insert members without setting clubHeadID
INSERT INTO member (memberID, role_given, SRN, clubID)
VALUES 
('M001', 'President', 'SRN001', 'C001'),  -- Insert club head (President) without setting clubHeadID
('M002', 'Member', 'SRN002', 'C001');    -- Insert other member(s)

-- Step 2: Update the clubHeadID for other members after the President exists
UPDATE member SET clubHeadID = 'M001' WHERE memberID = 'M001';
UPDATE member SET clubHeadID = 'M001' WHERE memberID = 'M002';

-- Insert sample data into the `event` table
INSERT INTO event (eventID, eventName, eventDate, eventStartTime, eventEndTime, clubID, venueID) 
VALUES 
('EVT001', 'Art Exhibition', '2024-11-10', '10:00:00', '14:00:00', 'C001', 'VEN001'),
('EVT002', 'Science Fair', '2024-11-12', '09:00:00', '17:00:00', 'C002', 'VEN002');

-- Insert sample data into the `registration` table
INSERT INTO registration (registrationID, SRN, eventID, paymentID) 
VALUES 
('REG001', 'SRN001', 'EVT001', 'PAY001'),  -- John Doe registered for Art Exhibition
('REG002', 'SRN002', 'EVT002', 'PAY002');  -- Jane Smith registered for Science Fair

-- Insert sample data into the `venue_booking` table
INSERT INTO venue_booking (bookingID, venueID, eventID, bookingDate, bookingStartTime, bookingEndTime) 
VALUES 
('BOOK001', 'VEN001', 'EVT001', '2024-11-10', '10:00:00', '14:00:00'),  -- Main Hall booked for Art Exhibition
('BOOK002', 'VEN002', 'EVT002', '2024-11-12', '09:00:00', '17:00:00');  -- Conference Room booked for Science Fair
