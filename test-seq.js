const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const moment = require('moment');
const { Op } = require('sequelize');
const { contains } = require('validator');
const {schEmail} = require('./email-sch')

const app = express();
const port = process.env.PORT || 3000;

// Replace the connection details with your own
const sequelize = new Sequelize('ltxczpzm', 'ltxczpzm', 'yrNyCOMQd-W8ZyAHSN3FHSuyiQglKbcD', {
  host: 'cornelius.db.elephantsql.com',
  dialect: 'postgres',
  ssl: true, // Add this line if your PostgreSQL requires SSL
  dialectOptions: {
    rejectUnauthorized: false, // Add this line if your PostgreSQL requires SSL
  },
});

const ScheduleEmail = sequelize.define('ScheduleEmails', {
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailbody: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  day: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  month: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  week: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  recurrent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  frequency: {
    type: DataTypes.INTEGER,
  },
},
{
    tableName: 'ScheduleEmails',
    freezeTableName: true, // Add this line
    timestamps: false,
  }
);

app.use(express.json());

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Database and tables synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

  app.post('/schedule', async (req, res) => {
    try {
      const newScheduledEmail = await ScheduleEmail.create(req.body);
      res.status(201).json(newScheduledEmail);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// GET API to retrieve all data
app.get('/getData', async (req, res) => {
  try {
    const allData = await ScheduleEmail.findAll();
    // schEmail('v');
    res.status(200).json(allData);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// GET API to retrieve emails scheduled for today
app.get('/getScheduledEmailsForToday', async (req, res) => {
  try {
    const tomorrow = moment().add(1, 'days');
    console.log(tomorrow, tomorrow.date(), tomorrow.month(), tomorrow.year())
    const scheduledEmails = await ScheduleEmail.findAll({
      where: {
        [Op.and]: [
          { year: tomorrow.year() },
          { month: tomorrow.month() + 1 }, // Months in Sequelize are 1-indexed
          { day: tomorrow.date() },
        ],
      },
    });

    res.status(200).json(scheduledEmails);
  } catch (error) {
    console.error('Error retrieving scheduled emails for today:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/schEmail/:id', async (req, res) => {
    try {
      const scheduledEmails = await ScheduleEmail.findAll({
        where: {
          id: req.params.id
        },
      });
      schEmail(scheduledEmails[0].dataValues.subject, scheduledEmails[0].dataValues.emailbody)
      res.status(200).json(scheduledEmails);
    } catch (error) {
      console.error('Error retrieving scheduled emails for today:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  


app.get('/', async (req, res) => {
    try {
      res.status(200).json({'msg': 'Wake up successful'});
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).send('Internal Server Error');
    }
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



