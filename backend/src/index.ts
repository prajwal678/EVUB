import dotenv from 'dotenv';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
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

dotenv.config();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5173;
const JWT_KEY = process.env.JWT_SECRET_KEY || 'default';

const dbConfig = {
  host: 'localhost',
  user: 'dbms_proj',
  password: '1234',
  database: 'Event_Club_db',
};

// console.log(dbConfig);


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
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private async connectToDatabase() {
      try {
          this.connection = await mysql.createConnection(dbConfig);
          console.log('Connected to database');
      } catch (err) {
          console.error('Database connection failed:', err);
          process.exit(1); // Terminate process if DB connection fails
      }
    }

    private initializeMiddlewares() {
        this.app.use(cors({
          origin: 'http://localhost:3000', // Update to match your frontend's URL
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          credentials: true,
        }));
        this.app.use(express.json());
    }

    // can do 
    // this.app.post('/route', (req, res) => this.method(req, res))
    // as well
    private initializeRoutes() {
      this.app.post('/register', (req, res) => this.registerUser(req, res));
      this.app.post('/login', (req, res) => this.loginUser(req, res));
      // this.app.get('/protected', (req, res) => this.protectedRoute(req, res));
      this.app.get('/events/filter', (req, res) => this.filterEvents(req, res));
      this.app.post('/events/add', (req, res) => this.addEvent(req, res));
      this.app.post('/events/register', (req, res) => this.registerForEvent(req, res));      
      this.app.post('/userprofile', (req, res) => this.getUserProfile(req, res));    
    }



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    private async registerUser(req: Request, res: Response): Promise<void> {
      try {
          const { SRN, email, pwd, phone_no, firstName, lastName, role } = req.body;

          if (!pwd) {
              res.status(400).json({ message: 'Password is required' });
              return;
          }

          const hashedPassword = await bcrypt.hash(pwd, 5);
          const token = jwt.sign({ SRN, email, role }, JWT_KEY, { expiresIn: '1h' });

          const query = `INSERT INTO student (SRN, email, pwd, phone_no, firstName, lastName, token) VALUES (?, ?, ?, ?, ?, ?, ?);`;

          if (!this.connection) {
              res.status(500).json({ message: 'Database connection error' });
              console.log(res)
              return;
          }
          await this.connection.execute(query, [SRN, email, hashedPassword, phone_no, firstName, lastName, token]);

          res.status(201).json({ message: 'User registered successfully', token });
      } catch (error) {
          console.error('Unexpected error in register route:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
    }

    private async loginUser(req: Request, res: Response): Promise<void> {
        try {
          const { email, pwd } = req.body;
    
          if (!this.connection) {
            res.status(500).json({ message: 'Database connection error' });
            return;
          }
    
          const [results] = await this.connection.execute<mysql.RowDataPacket[]>(
            'SELECT * FROM student WHERE email = ?', 
            [email]
          );
    
          if (results.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
          }
    
          const user = results[0] as student;
          const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
          
          if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
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


    private async getUserProfile(req: Request, res: Response): Promise<void> {
      try {
          const authHeader = req.headers['authorization'];
          if (!authHeader) {
            res.status(401).json({ message: 'Missing Authorization header' });
            return;
        }
        
          const token = authHeader && authHeader.split(' ')[1];
  
          if (!token) {
              res.status(401).json({ message: 'Unauthorized' });
              return;
          }
  
          let decoded: DecodedToken;
          try {
              decoded = jwt.verify(token, JWT_KEY) as DecodedToken;
          } catch (err) {
              res.status(403).json({ message: 'Invalid token' });
              return;
          }
  
          const { email } = decoded;
  
          if (!this.connection) {
              res.status(500).json({ message: 'Database connection error' });
              return;
          }
  
          const [results] = await this.connection.execute<mysql.RowDataPacket[]>(
              'SELECT email, firstName, lastName FROM student WHERE email = ?',
              [email]
          );
  
          if (results.length === 0) {
              res.status(404).json({ message: 'User not found' });
              return;
          }
  
          res.json(results[0]);
      } catch (error) {
          console.error('Error fetching user profile:', error);
          res.status(500).json({ message: 'Error fetching user profile' });
      }
    }
  


    // private protectedRoute(req: Request, res: Response) {
    //     const authHeader = req.headers['authorization'];
    //     const token = authHeader && authHeader.split(' ')[1];
    
    //     if (!token) return res.sendStatus(401);
    
    //     jwt.verify(token, JWT_KEY, (err, user) => {
    //       if (err) return res.sendStatus(403);
    //       res.json({ message: 'Protected route accessed', user });
    //     });
    // }

    // private async filterEvents(req: Request, res: Response): Promise<void> {
    //     try {
    //       const { clubName, eventDate, venueName, startTime, endTime } = req.query;
    
    //       if (!this.connection) {
    //         res.status(500).json({ message: 'Database connection error' });
    //         return;
    //       }
    
    //       let query = `
    //         SELECT e.eventID, e.eventName, e.eventDate, e.eventStartTime, e.eventEndTime, 
    //                c.clubName, v.venueName
    //         FROM event e
    //         JOIN club c ON e.clubID = c.clubID
    //         JOIN venue v ON e.venueID = v.venueID
    //         WHERE 1=1
    //       `;
    
    //       const params: any[] = [];
    
    //       if (clubName) {
    //         query += ` AND c.clubName = ?`;
    //         params.push(clubName);
    //       }
    
    //       if (eventDate) {
    //         query += ` AND e.eventDate = ?`;
    //         params.push(eventDate);
    //       } else {
    //         query += ` AND e.eventDate >= CURDATE()`;
    //       }
    
    //       if (venueName) {
    //         query += ` AND v.venueName = ?`;
    //         params.push(venueName);
    //       }
    //       if (startTime) {
    //         query += ` AND e.eventStartTime >= ?`;
    //         params.push(startTime);
    //       }
    //       if (endTime) {
    //         query += ` AND e.eventEndTime <= ?`;
    //         params.push(endTime);
    //       }
    
    //       query += ` ORDER BY e.eventDate ASC, e.eventStartTime ASC;`;
    
    //       const [results] = await this.connection.execute(query, params);
    //       res.status(200).json({ events: results });
    //     } catch (error) {
    //       console.error('Database error:', error);
    //       res.status(500).json({ message: 'Error fetching filtered events' });
    //     }
    // }


    // if doing based on mail
    private async filterEvents(req: Request, res: Response): Promise<void> {
      try {
          const { email, clubName, eventDate, venueName, startTime, endTime } = req.query;
          console.log('Filter events received with:', { email, clubName, eventDate, venueName, startTime, endTime });
  
          if (!email) {
              res.status(400).json({ message: 'Email is required' });
              return;
          }
  
          if (!this.connection) {
              res.status(500).json({ message: 'Database connection error' });
              return;
          }
  
          // Fetch user from the database using the email
          const [userResults] = await this.connection.execute(
              'SELECT * FROM users WHERE email = ?', [email]
          );
          console.log('User Results:', userResults);
  
          if ((userResults as any[]).length === 0) {
              res.status(404).json({ message: 'User not found' });
              return;
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
              query += ` AND c.clubName = ?`;
              params.push(clubName);
          }
  
          if (eventDate) {
              query += ` AND e.eventDate = ?`;
              params.push(eventDate);
          } else {
              query += ` AND e.eventDate >= CURDATE()`;
          }
  
          if (venueName) {
              query += ` AND v.venueName = ?`;
              params.push(venueName);
          }
  
          if (startTime) {
              query += ` AND e.eventStartTime >= ?`;
              params.push(startTime);
          }
  
          if (endTime) {
              query += ` AND e.eventEndTime <= ?`;
              params.push(endTime);
          }
  
          query += ` ORDER BY e.eventDate ASC, e.eventStartTime ASC;`;
  
          console.log('Executing query:', query);
          console.log('With parameters:', params);
  
          // Execute the query and get the results
          const [results] = await this.connection.execute(query, params);
          console.log('Query results:', results);
  
          if ((results as any[]).length === 0) {
              res.status(404).json({ message: 'No events found for the given filters' });
          } else {
              res.status(200).json({ events: results });
          }
      } catch (error) {
          console.error('Database error:', error);
          res.status(500).json({ message: 'Error fetching filtered events' });
      }
  }
  
  
    
    private async addEvent(req: Request, res: Response): Promise<void> {
        try {
          const { eventName, eventDate, eventStartTime, eventEndTime, clubID, venueID } = req.body;
          const authHeader = req.headers['authorization'];
          const token = authHeader && authHeader.split(' ')[1];
    
          if (!token) {
            res.status(401).json({ message: 'Authorization token is missing' });
            return;
          }
    
          if (!this.connection) {
            res.status(500).json({ message: 'Database connection error' });
            return;
          }
    
          let decoded: DecodedToken;
          try {
            decoded = jwt.verify(token, JWT_KEY) as DecodedToken;
          } catch (err) {
            res.status(403).json({ message: 'Invalid token' });
            return;
          }
    
          const memberID = decoded.SRN;
    
          // Verify if the logged-in user is the club head
          const [clubHeadResults] = await this.connection.execute<mysql.RowDataPacket[]>(
            'SELECT 1 FROM member WHERE memberID = ? AND clubID = ? AND memberID = clubHeadID',
            [memberID, clubID]
          );
    
          if (clubHeadResults.length === 0) {
            res.status(403).json({ message: 'Only club heads are authorized to add events for this club' });
            return;
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
              res.status(400).json({ message: 'The selected venue is not available for booking' });
              return;
            }
            throw err;
          }
        } catch (error) {
          console.error('Error adding event:', error);
          res.status(500).json({ message: 'Error adding event' });
        }
    }

    private async registerForEvent(req: Request, res: Response): Promise<void> {
        try {
          const { SRN, eventID } = req.body;
    
          if (!SRN || !eventID) {
            res.status(400).json({ message: 'SRN and eventID are required' });
            return;
          }
    
          if (!this.connection) {
            res.status(500).json({ message: 'Database connection error' });
            return;
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

    public async startServer() {
      await this.connectToDatabase(); // Ensure DB connection is established first
      this.app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
      });
  }
}

// Instantiate and start the server
const app = new App();
app.startServer();