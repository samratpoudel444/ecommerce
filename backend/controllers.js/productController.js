const connection = require("../database/conn");

async function getFeaturedProduct(req, resp, next) {
  try {
    // Establishing a database connection
    const db = await connection();
    

    const [result] = await db.query("SELECT * FROM product WHERE Featured = 'yes'");

        console.log(result);
    if (result.length === 0) {
      return resp.status(400).send("No featured products available.");
    }

    // Send the featured products as the response
    return resp.status(200).send(result);

  } catch (err) {
    // Handle any errors
    console.error(err);
    return resp.status(500).send("Server Error");
  }
}


async function getOneProduct(req, resp, next)
{
    try {
        const {id}= req.query;
        console.log(id);
        // Establishing a database connection
        const db = await connection();
        
    
        const [result] = await db.query("SELECT * FROM product WHERE id = ?",[id]);
    
            console.log(result);
        if (result.length === 0) {
          return resp.status(400).send("No featured products available.");
        }
    
        // Send the featured products as the response
        return resp.status(200).send(result);
    
      } catch (err) {
        // Handle any errors
        console.error(err);
        return resp.status(500).send("Server Error");
      }   
}

async function getProductByCategory(req, resp, next)
{
  try{
    const{product_category}= req.query;
    const db= await connection();

    const[result]= await db.query("select product_Name, product_description, product_price, product_image, product_category,featured from product where  product_category= ?",[product_category])
    console.log(result);
    if (result.length === 0) {
      return resp.status(400).send("No featured products available.");
    }
    return resp.status(200).send(result);

  }
  catch(err)
  {
    console.log(err);
    return resp.status(500).send("server error")
  }
}
module.exports = { getFeaturedProduct, getOneProduct, getProductByCategory };
