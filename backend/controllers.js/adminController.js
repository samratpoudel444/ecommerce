const connection = require("../database/conn");

const {v4: uuidv4}= require("uuid");
const { query } = require("express");


async function addProduct(req, resp, next)
{
    const id= uuidv4();
    console.log(req.body);
    const {product_Name,  Product_description, Product_price, imageURL,product_category,featured }= req.body;
    try{
        const db= await connection();
        const [result] = await db.query('insert into product values(?, ?, ?, ?, ?, ?, ?)',
        [id, product_Name, Product_description, Product_price, imageURL, product_category, featured]);
        console.log("ok")
        resp.status(200).send("product Added sucessfully");
    
    }
    catch(err)
    {
        console.log(err);
    }
}

async function deleteProduct(req, resp, next)
{
    try{
        const a= req.query.id;
        const db= await connection();
        const [result]= await db.query("delete from product where id= ?",[a]);
        if(result.affectedRows== 0)
        {
            return resp.status(401).send("unable to delete ");
        } 
        return resp.status(200).send("delete sucessfull");
        }
    catch(err)
    {
        console.log(err);
    }
}

async function showAllProduct(req, resp, next) {
    try {
      const db = await connection();
      const [result] = await db.query(`SELECT * FROM product`);
      
      if (result.length === 0) {
        return resp.status(400).send("No products available.");
      }
  
      return resp.status(200).send(result);
    } catch (err) {
      console.log(err);
      return resp.status(500).send("Server Error");
    }
  }


  async function updateProduct(req, resp, next)
  {
    try{
        const {id,product_Name,  Product_description, Product_price, imageURL,product_category,featured }= req.body;
        const db= await connection();
        const [query]=await db.query('update product set  product_Name=?  Product_description=? Product_price=? imageURL=?product_category=? featured=? where id= ?',[id,product_Name,  Product_description, Product_price, imageURL,product_category,featured] ) 

        return resp.status(200).send("Product updated Sucessfully");
    }
    catch(err)
    {   
        return resp.status(400).send(err);

    }
  }


module.exports={addProduct, showAllProduct, deleteProduct}