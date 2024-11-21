import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';

interface student {
    SRN: string;
    email: string;
    pwd: string;
    phone_no: string;
    firstName: string;
    lastName: string;
    token: string | null;
}

interface payment {
    paymentID: string;
    paymentStatus: boolean;
    amount: number;
    SRN: string;
}

interface venue {
    venueID: string;
    venueName: string;
    located: string;
    capacity : number;
    available: boolean
}

interface club {
    clubID: string;
    clubName: string;
    clubDescrip: string;
}

interface member {
    memberID: string;
    role_given: string;
    SRN: string;
    clubID: string;
    clubHeadID: string;
}

interface event {
    eventID: string;
    eventName: string;
    eventDate: Date;
    eventStartTime: string;
    eventEndTime: string;
    clubID: string;
    venueID: string;
}

interface registration {
    registrationID: string;
    SRN: string;
    eventID: string;
    paymentID: string;
}

interface venue_booking {
    bookingID: string;
    venueID: string;
    eventID: string;
    bookingDate: Date;
    bookingStartTime: string;
    bookingEndTime: string;
}

interface DecodedToken {
  SRN: string;
  email: string;
  iat?: number;
  exp?: number;
}

//////////////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5173;
const JWT_KEY = process.env.JWT_SECRET_KEY || 'default';

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};

// const authenticateToken = (req: Request, res: Response, next: Function) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
//       if (err) return res.status(403).json({ message: 'Forbidden' });
//       (req as any).user = user; // Attach user info to request object
//       next();
//   });
// };

class App {
    public app: express.Application;
    public connection: mysql.Connection | null = null;

    constructor() {
        this.app = express();
        this.connectToDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private async connectToDatabase() {
        try {
          this.connection = await mysql.createConnection(dbConfig);
          console.log('Connected to database');
        } catch (err) {
          console.error('Database connection failed:', err);
        }
    }

    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
    }

    private initializeRoutes() {
        // Register API
        this.app.post('/register', this.registerUser.bind(this));
        
        // Login API
        this.app.post('/login', this.loginUser.bind(this));
        
        // Protected Route
        this.app.get('/protected', this.protectedRoute.bind(this));
        
        // Events Filter
        this.app.get('/events/filter', this.filterEvents.bind(this));
        
        // Add Event
        this.app.post('/events/add', this.addEvent.bind(this));
        
        // Register for Event
        this.app.post('/events/register', this.registerForEvent.bind(this));
    }



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private async registerUser(req: Request, res: Response) {
        try {
          const { SRN, email, pwd, phone_no, firstName, lastName } = req.body;
    
          if (!pwd) {
            return res.status(400).json({ message: 'Password is required' });
          }
          const hashedPassword = await bcrypt.hash(pwd, 5);
          const token = jwt.sign({ SRN, email }, JWT_KEY, { expiresIn: '1h' });
          const query = `INSERT INTO student (SRN, email, pwd, phone_no, firstName, lastName, token) VALUES (?, ?, ?, ?, ?, ?, ?);`;
          
          if (!this.connection) {
            return res.status(500).json({ message: 'Database connection error' });
          }
    
          await this.connection.execute(query, [SRN, email, hashedPassword, phone_no, firstName, lastName, token]);
          
          res.status(201).json({ message: 'User registered successfully', token });
        } catch (error) {
          console.error('Unexpected error in register route:', error);
          res.status(500).json({ message: 'Internal server error' });
        }
    }

    private async loginUser(req: Request, res: Response) {
        try {
          const { email, pwd } = req.body;
    
          if (!this.connection) {
            return res.status(500).json({ message: 'Database connection error' });
          }
    
          const [results] = await this.connection.execute<mysql.RowDataPacket[]>(
            'SELECT * FROM student WHERE email = ?', 
            [email]
          );
    
          if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
          }
    
          const user = results[0] as student;
          const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
          
          if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
          }
    
          // Use existing token or create a new one if none exists
          let token = user.token;
          if (!token) {
            token = jwt.sign({ SRN: user.SRN, email: user.email }, JWT_KEY, { expiresIn: '1h' });
            
            await this.connection.execute(
              'UPDATE student SET token = ? WHERE SRN = ?', 
              [token, user.SRN]
            );
          }
    
          res.json({ message: 'Login successful', token });
        } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({ message: 'Error logging in' });
        }
    }

    private protectedRoute(req: Request, res: Response) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
    
        if (!token) return res.sendStatus(401);
    
        jwt.verify(token, JWT_KEY, (err, user) => {
          if (err) return res.sendStatus(403);
          res.json({ message: 'Protected route accessed', user });
        });
    }

    private async filterEvents(req: Request, res: Response) {
        try {
          const { clubName, eventDate, venueName, startTime, endTime } = req.query;
    
          if (!this.connection) {
            return res.status(500).json({ message: 'Database connection error' });
          }
    
          let query = `
            SELECT e.eventID, e.eventName, e.eventDate, e.eventStartTime, e.eventEndTime, 
                   c.clubName, v.venueName
            FROM event e
            JOIN club c ON e.clubID = c.clubID
            JOIN venue v ON e.venueID = v.venueID
            WHERE 1=1
          `;
    
          const params: any[] = [];
    
          if (clubName) {
            query += ` AND c.clubName = ?;`;
            params.push(clubName);
          }
    
          if (eventDate) {
            query += ` AND e.eventDate = ?;`;
            params.push(eventDate);
          } else {
            query += ` AND e.eventDate >= CURDATE();`;
          }
    
          if (venueName) {
            query += ` AND v.venueName = ?;`;
            params.push(venueName);
          }
          if (startTime) {
            query += ` AND e.eventStartTime >= ?;`;
            params.push(startTime);
          }
          if (endTime) {
            query += ` AND e.eventEndTime <= ?;`;
            params.push(endTime);
          }
    
          query += ` ORDER BY e.eventDate ASC, e.eventStartTime ASC;`;
    
          const [results] = await this.connection.execute(query, params);
          res.status(200).json({ events: results });
        } catch (error) {
          console.error('Database error:', error);
          res.status(500).json({ message: 'Error fetching filtered events' });
        }
    }
    
    private async addEvent(req: Request, res: Response) {
        try {
          const { eventName, eventDate, eventStartTime, eventEndTime, clubID, venueID } = req.body;
          const authHeader = req.headers['authorization'];
          const token = authHeader && authHeader.split(' ')[1];
    
          if (!token) {
            return res.status(401).json({ message: 'Authorization token is missing' });
          }
    
          if (!this.connection) {
            return res.status(500).json({ message: 'Database connection error' });
          }
    
          let decoded: DecodedToken;
          try {
            decoded = jwt.verify(token, JWT_KEY) as DecodedToken;
          } catch (err) {
            return res.status(403).json({ message: 'Invalid token' });
          }
    
          const memberID = decoded.SRN;
    
          // Verify if the logged-in user is the club head
          const [clubHeadResults] = await this.connection.execute<mysql.RowDataPacket[]>(
            'SELECT 1 FROM member WHERE memberID = ? AND clubID = ? AND memberID = clubHeadID',
            [memberID, clubID]
          );
    
          if (clubHeadResults.length === 0) {
            return res.status(403).json({ message: 'Only club heads are authorized to add events for this club' });
          }
    
          // Generate event ID
          const eventID = `E${Math.floor(1000 + Math.random() * 9000)}`;
    
          try {
            await this.connection.execute(
              'INSERT INTO event (eventID, eventName, eventDate, eventStartTime, eventEndTime, clubID, venueID) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [eventID, eventName, eventDate, eventStartTime, eventEndTime, clubID, venueID]
            );
    
            res.status(201).json({ message: 'Event added successfully', eventID });
          } catch (err: any) {
            if (err.sqlState === '45000') {
              return res.status(400).json({ message: 'The selected venue is not available for booking' });
            }
            throw err;
          }
        } catch (error) {
          console.error('Error adding event:', error);
          res.status(500).json({ message: 'Error adding event' });
        }
    }

    private async registerForEvent(req: Request, res: Response) {
        try {
          const { SRN, eventID } = req.body;
    
          if (!SRN || !eventID) {
            return res.status(400).json({ message: 'SRN and eventID are required' });
          }
    
          if (!this.connection) {
            return res.status(500).json({ message: 'Database connection error' });
          }
    
          // Call the MySQL procedure
          const [results] = await this.connection.query('CALL RegisterForEvent(?, ?, @paymentID, @status_message)', [SRN, eventID]);
          
          // Retrieve the output parameters
          const [outputResults] = await this.connection.query('SELECT @paymentID AS paymentID, @status_message AS statusMessage');
          
          const output = outputResults as { paymentID: string, statusMessage: string }[];
          const { paymentID, statusMessage } = output[0];
    
          // Return the status and payment ID to the user
          if (statusMessage === 'Registration successful!') {
            res.status(201).json({
              message: statusMessage,
              paymentID,
            });
          } else {
            res.status(400).json({
              message: statusMessage,
            });
          }
        } catch (error) {
          console.error('Database error:', error);
          res.status(500).json({ message: 'Error registering for event' });
        }
    }

    public start() {
        this.app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
        });
      }
    }
    
// Create and start the application
const app = new App();
app.start();