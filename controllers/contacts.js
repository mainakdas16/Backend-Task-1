require("dotenv").config();
const connectDB = require("../db/connect");
const pool = connectDB();

const axios = require("axios");

const freshSalesApiBaseUrl = 'https://jukol.myfreshworks.com/crm/sales/api';

const freshSalesApiKey = process.env.API_KEY;

const createContact = async (req, res) => {
    try {

        const {first_name, last_name, email, mobile_number, data_store} = req.body;

        if(data_store === "DATABASE") {
            const insertRow = await pool.query(
                "INSERT INTO `contacts` (`first_name`, `last_name`, `email`, `mobile_number`) VALUES (?, ?, ?, ?)", 
                [first_name, last_name, email, mobile_number]
            );
    
            res.status(201).json({contact_id: insertRow[0].insertId});
        } else {
            try {
                const response = await axios.post(
                    `${freshSalesApiBaseUrl}/contacts`,
                    {
                        'contact': {
                            "first_name": `${first_name}`,
                            "last_name": `${last_name}`,
                            "email": `${email}`,
                            "mobile_number": `${mobile_number}`,
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Token token=${freshSalesApiKey}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                res.json(response.data);
            } catch (error) {
                res.status(500).json({msg: error});
            }
        }

    } catch (error) {
        res.status(500).json({msg: error});
    }
}

const getContact = async (req, res) => {
    try {
        const {id: contact_id} = req.params;
        const {data_store} = req.body;

        if(data_store === "DATABASE") {
            const getRow = await pool.query(
                "SELECT * FROM `contacts` WHERE contact_id = ?",
                [contact_id]
            )
    
            if(getRow[0].length === 0) {
                return res.status(404).json({msg: "Contact doesn't exist.."});
            }
    
            const data = getRow[0];
            res.status(200).json({contact: data});
        } else {
            try {
                const response = await axios.get(
                    `${freshSalesApiBaseUrl}/contacts/${contact_id}`,
                    {
                        headers: {
                            'Authorization': `Token token=${freshSalesApiKey}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                res.json(response.data);
            } catch (error) {
                res.status(500).json({msg: error});
            }
        }
    } catch (error) {
        res.status(500).json({msg: error});
    }
}

const updateContact = async (req, res) => {
    try {
        const {id: contact_id} = req.params;
        const {new_email, new_mobile_number, data_store} = req.body;

        if(data_store === "DATABASE") {
            const getRow = await pool.query(
                "SELECT * FROM `contacts` WHERE contact_id = ?",
                [contact_id]
            )
    
            if(getRow[0].length === 0) {
                return res.status(404).json({msg: "Contact doesn't exist.."});
            }
    
            await pool.query(
                "UPDATE `contacts` SET `email` = ?, `mobile_number` = ? WHERE `contact_id` = ?",
                [new_email, new_mobile_number, contact_id]
            )
    
            const prevData = getRow[0];
            res.status(200).json({prevContact: prevData});
        } else {
            try {
                const response = await axios.patch(
                    `${freshSalesApiBaseUrl}/contacts/${contact_id}`,
                    {
                        'contact': {
                            "email": `${new_email}`,
                            "mobile_number": `${new_mobile_number}`,
                        }
                    },
                    {
                        headers: {
                            'Authorization': `Token token=${freshSalesApiKey}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                res.json(response.data);
            } catch (error) {
                res.status(500).json({msg: error});
            }
        }
    } catch (error) {
        res.status(500).json({msg: error});
    }
}

const deleteContact = async (req, res) => {
    try {
        const {id: contact_id} = req.params;
        const {data_store} = req.body;

        if(data_store === "DATABASE") {
            const getRow = await pool.query(
                "SELECT * FROM `contacts` WHERE contact_id = ?",
                [contact_id]
            )
    
            if(getRow[0].length === 0) {
                return res.status(404).json({msg: "Contact doesn't exist.."});
            }
    
            await pool.query(
                "DELETE FROM `contacts` WHERE `contact_id` = ?",
                [contact_id]
            )
    
            const deletedData = getRow[0];
            res.status(200).json({deletedContact: deletedData});
        } else {
            try {
                const response = await axios.delete(
                    `${freshSalesApiBaseUrl}/contacts/${contact_id}`,
                    {
                        headers: {
                            'Authorization': `Token token=${freshSalesApiKey}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );

                res.json(response.data);
            } catch (error) {
                res.status(500).json({msg: error});
            }
        }

    } catch (error) {
        res.status(500).json({msg: error});
    }
}

module.exports = {
    getContact,
    updateContact,
    createContact,
    deleteContact
}