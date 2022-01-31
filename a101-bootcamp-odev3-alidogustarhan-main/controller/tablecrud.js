const AWS = require('aws-sdk')
const uuidv4 = require('uuid');
const tableCrudService = require('../services/tablecrud')
const { createTable } = require('../services/tablecrud');
require('dotenv').config();

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    endpoint: "https://dynamodb.us-east-1.amazonaws.com"
});

let docClient = new AWS.DynamoDB.DocumentClient();
var table = "crud";

exports.createTableController = async (req,res) => {
    const response = await tableCrudService.createTable(); 
    res.send(response);
}


exports.add = async (req,res) => {
    const response = await tableCrudService.add(req.body); 
    res.send(response);
}

exports.fetchAll = async (req,res) => {
    const response = await tableCrudService.fetchAll();
    res.send(response); 
}

exports.fetchSingleProductid = async (req,res) => {
    const response = await tableCrudService.fetchSingleProducid(req.params); 
    res.send(response);
}


exports.fetchDiscount = async (req,res) => {
    const response = await tableCrudService.fetchAllDiscount(); 
    res.send(response);  
}


exports.update = async (req,res) => {
    const response = await tableCrudService.update(req.params,req.body);
    res.send(response);
}


exports.fetchDeleteDiscount = async (req,res,next) => {
    const response = await tableCrudService.fetchDeleteDiscount(req.params); 
         if( response.data.Item.isDiscount === 'false'){
            next()
         }else{
            res.send("BU ÜRÜNDE İNDİRİM OLDUGU İCİN SİLİNEMİYOR.")
         }   
}
exports.delete = async (req,res) => {
    const response = await tableCrudService.delete(req.params);
    res.send(response); 
}


