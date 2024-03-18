// express middleware
import express from "express";
import bodyParser from "body-parser";
// to fetch data from external API
// import axios from "axios";
//connection to postgres database
import pg from "pg";


const app = express();
const port = 3000;

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"bookCovers",
    password:"mypg",
    port: 5432,
  });
  
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let items = [
    { id: 1, ISBN:9780385533225 },
    { id: 2, ISBN:9780385472579 },
  ];

app.get("/", async (req,res) =>{
    try {
        const result= await db.query("SELECT * FROM items");
        items =result.rows;
        res.render("index.ejs",{listItems : items});

    } catch(error){
        console.error("failed to make request:",error.message);
    }
});

app.post("/add", async (req, res) => {
    const item = req.body.newbook_ISBN;
    console.log(item);
    // items.push({ title: item });
    try {
      await db.query("INSERT INTO items (isbn) VALUES ($1)",[item]);
      res.redirect("/");
  
    } catch (error) {
      console.log(error)
    }
    
  });

  app.post("/delete", async(req, res) => {
    const id=req.body.removebook_Id;
    console.log(id);
    try {
      await db.query("DELETE FROM items WHERE id = ($1)",[id]);
      res.redirect("/");
  
    } catch (error) {
      console.log(error);
    }
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });