const AWS = require("aws-sdk");
const res = require("express/lib/response");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const validation = require("../services/tablecrud");

AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  endpoint: "https://dynamodb.us-east-1.amazonaws.com",
});

let docClient = new AWS.DynamoDB.DocumentClient();
var table = "crud";

var dynamodb = new AWS.DynamoDB();

exports.createTable = async (req, res) => {
  var params = {
    TableName: "crud",
    KeySchema: [
      { AttributeName: "productId", KeyType: "HASH" }, //Partition key
    ],
    AttributeDefinitions: [{ AttributeName: "productId", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  dynamodb.createTable(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to create table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log(
        "Created table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
    }
  });
};

exports.validate = async (obj) => {
  const res = require("express/lib/response");
  const Joi = require("joi");
  const { v4: uuidv4 } = require("uuid");

  const schema = Joi.object({
    productId: Joi.string(),
    stock: Joi.number(),
    productName: Joi.string(),
    isDiscount: Joi.bool(),
    categoryId: Joi.number(),
    categoryName: Joi.string(),
  });

  let values = schema.validate({
    productId: uuidv4(),
    stock: obj.stock,
    productName: obj.productName,
    isDiscount: obj.isDiscount,
    categoryId: obj.category.categoryId,
    categoryName: obj.category.categoryName,
  });
  if (
    typeof values.value.stock == "number" &&
    typeof values.value.productName == "string" &&
    typeof values.value.isDiscount == "boolean" &&
    typeof values.value.categoryId == "number" &&
    typeof values.value.categoryName == "string"
  ) {
    return values;
  } else {
    console.log(
      "-------------------------------------------------------------------------------------------------------------------------"
    );
    console.log(values);
    console.log(
      "YANLIŞ TİPTE VERİ GİRDİĞİNİZ İÇİN İŞLEM DURDURULDU.... HATANIZI YUKARIDAKİ ERROR OLARAK DÖNEN YÖNLENDİRMEYE GÖRE DÜZELTİNİZ..."
    );
  }
};

exports.add = async (params) => {
  let result = await validation.validate(params);
  if (result) {
    const items = {
      TableName: table,
      Item: {
        productId: uuidv4(),
        stock: params.stock,
        productName: params.productName,
        isDiscount: params.isDiscount,
        category: {
          categoryId: params.category.categoryId,
          categoryName: params.category.categoryName,
        },
      },
    };
    try {
      await docClient.put(items).promise();
      return {
        status: true,
        message: "VERİLER TABLONUZA EKLENDİ.",
      };
    } catch (err) {
      return {
        status: false,
        message: err,
      };
    }
  } else {
    let error =
      "EKLEMEK İSTEDİĞİNİZ VERİLERDE TİP UYUŞMAZLIĞI MEVCUTTUR. LÜTFEN TERMİNAL EKRANINIZDAKİ YÖNLENDİRMELER İLE VERİLERİNİZİN TİPLERİNİ DÜZELTİNİZ...";
    return error;
  }
};

exports.fetchAll = async () => {
  const items = {
    TableName: table,
  };
  try {
    const data = await docClient.scan(items).promise();
    return {
      status: true,
      data: data,
    };
  } catch (err) {
    return {
      status: false,
      message: err,
    };
  }
};

exports.fetchSingleProducid = async (params) => {
  var items = {
    TableName: table,
    Key: {
      productId: params.id,
    },
  };
  try {
    const data = await docClient.get(items).promise();
    return {
      status: true,
      data: data,
    };
  } catch (err) {
    return {
      status: false,
      message: err,
    };
  }
};

exports.fetchAllDiscount = async () => {
  const items = {
    TableName: table,
  };
  try {
    const data = await docClient.scan(items).promise();
    let arr = [];
     for(let i=0 ; i<data.Items.length ; i++){
         if(data.Items[i].isDiscount === "true"){
            arr.push(data.Items[i])
         }
    }
    return {
      status: true,
      data: arr,
    };
  } catch (err) {
    return {
      status: false,
      message: err,
    };
  }
};

exports.update = async (params, params1) => {
  var items = {
    TableName: table,
    Key: {
      productId: params.id,
    },
    UpdateExpression: "set stock = :stock",
    ExpressionAttributeValues: {
      ":stock": params1.stock,
    },
    ReturnValues: "UPDATED_NEW",
  };
  try {
    const data = await docClient.update(items).promise();
    return {
      status: true,
      data: data,
      message: "STOK GÜNCELLENDİ.",
    };
  } catch (err) {
    return {
      status: false,
      message: err,
    };
  }
};

exports.fetchDeleteDiscount = async (params) => {
  var items = {
    TableName: table,
    Key: {
      productId: params.id,
    },
  };
  try {
    const data = await docClient.get(items).promise();
    return {
      status: true,
      data: data,
    };
  } catch (err) {
    return {
      status: false,
      message: err,
    };
  }
};

exports.delete = async (params) => {
  var items = {
    TableName: table,
    Key: {
      productId: params.id,
    },
  };
  try {
    const response = await docClient.delete(items).promise();
    return {
      status: true,
      message: "ÜRÜN SİLİNDİ.",
    };
  } catch (err) {
    return {
      status: false,
      message: err,
    };
  }
};
