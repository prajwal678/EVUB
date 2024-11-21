SHOW DATABASES;
CREATE DATABASE IF NOT EXISTS Event_Club_db;
USE Event_Club_db;

CREATE TABLE student(
	SRN VARCHAR(13),
	email VARCHAR (50),
    pwd VARCHAR(64),
    phone_no VARCHAR(10),
    firstName VARCHAR(10),
    lastName VARCHAR(10),
    token VARCHAR(255),
    PRIMARY KEY (SRN)
	);

CREATE TABLE payment(
    paymentID VARCHAR (10),
    paymentStatus BOOL,
    amount FLOAT,
    SRN VARCHAR(13),
    PRIMARY KEY (paymentID),
    FOREIGN KEY (SRN) REFERENCES student(SRN)
);

CREATE TABLE venue(
   venueID VARCHAR(10),
   venueName VARCHAR (30),
   located VARCHAR (20),
   capacity INT,
   available BOOL,
   PRIMARY KEY (venueID)
);

CREATE TABLE club(
    clubID VARCHAR (10),
    clubName VARCHAR (30),
    clubDescrip VARCHAR (255),
    PRIMARY KEY (clubID)
);

CREATE TABLE member(
   memberID VARCHAR (10),
   role_given VARCHAR (10),
   SRN VARCHAR(13),
   clubID VARCHAR(10),
   clubHeadID VARCHAR (10),
   PRIMARY KEY (memberID),
   FOREIGN KEY (SRN) REFERENCES student(SRN),
   FOREIGN KEY (clubID) REFERENCES club(clubID)
);

ALTER TABLE member ADD CONSTRAINT club_head_name FOREIGN KEY(clubHeadID) REFERENCES member(memberID);

CREATE TABLE event(
    eventID VARCHAR (10),
    eventName VARCHAR (20),
    eventDate DATE ,
    eventStartTime time ,
    eventEndTime time ,
    clubID VARCHAR (10),
    venueID VARCHAR(10),
    PRIMARY KEY (eventID),
    FOREIGN KEY (clubID) REFERENCES club(clubID),
    FOREIGN KEY (venueID) REFERENCES venue(venueID)
);


CREATE TABLE registration(
    registrationID VARCHAR (10),
    SRN VARCHAR (13),
    eventID VARCHAR (10),
    paymentID VARCHAR (10),
    PRIMARY KEY (registrationID) ,
    FOREIGN KEY (SRN) REFERENCES student(SRN),
    FOREIGN KEY (paymentID) REFERENCES payment(paymentID),
    FOREIGN KEY (eventID) REFERENCES event(eventID)
);


CREATE TABLE venue_booking(
    bookingID VARCHAR (10),
    venueID VARCHAR (10),
    eventID VARCHAR (10),
    bookingDate VARCHAR (10),
    bookingStartTime time,
    bookingEndTime time,
    PRIMARY KEY (bookingID),
    FOREIGN KEY (venueID) REFERENCES venue(venueID),
    FOREIGN KEY (eventID) REFERENCES event(eventID)
);

DELIMITER //
CREATE TRIGGER check_venue_availability BEFORE INSERT ON event
FOR EACH ROW
BEGIN
  DECLARE venue_busy INT;

  SELECT COUNT(*) INTO venue_busy
  FROM event
  WHERE venueID = NEW.venueID
    AND eventDate = NEW.eventDate
    AND ((NEW.eventStartTime BETWEEN eventStartTime AND eventEndTime)
         OR (NEW.eventEndTime BETWEEN eventStartTime AND eventEndTime));

  IF venue_busy > 0 THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Venue is not available at the selected time.';
  END IF;
END;
//
DELIMITER ;



DELIMITER //

CREATE PROCEDURE RegisterForEvent(
    IN p_SRN VARCHAR(13), 
    IN p_eventID VARCHAR(10), 
    OUT p_paymentID VARCHAR(10), 
    OUT p_status_message VARCHAR(255)
)
BEGIN
    DECLARE event_exists INT;
    DECLARE registration_exists INT;
    DECLARE registration_count INT;

    -- Generate a payment ID (simulated here)
    SET p_paymentID = CONCAT('PAY', LPAD(FLOOR(RAND() * 1000000), 7, '0'));

    -- Define a labeled block for handling LEAVE
    event_registration: BEGIN

        -- Check if the event exists
        SELECT COUNT(*) INTO event_exists
        FROM event
        WHERE eventID = p_eventID;

        IF event_exists = 0 THEN
            SET p_status_message = 'Event does not exist.';
            LEAVE event_registration;
        END IF;

        -- Check if the student is already registered for the event
        SELECT COUNT(*) INTO registration_exists
        FROM registration
        WHERE SRN = p_SRN AND eventID = p_eventID;

        IF registration_exists > 0 THEN
            SET p_status_message = 'Student is already registered for this event.';
            LEAVE event_registration;
        END IF;

        -- Insert the payment record into the payment table
        INSERT INTO payment (paymentID, SRN, amount, paymentStatus)
        VALUES (p_paymentID, p_SRN, 100, TRUE);

        -- Get the current count of records in the registration table
        SELECT COUNT(*) INTO registration_count
        FROM registration;

        -- Add the registration record
        INSERT INTO registration (registrationID, SRN, eventID, paymentID)
        VALUES (
            CONCAT('REG', LPAD(registration_count + 1, 7, '0')), 
            p_SRN, 
            p_eventID, 
            p_paymentID
        );

        SET p_status_message = 'Registration successful!';
    END event_registration;
END;
//

DELIMITER ;


