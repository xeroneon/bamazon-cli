const mysql = require("mysql");

const inquirer = require("inquirer");

const Table = require('cli-table');

let products = new Table({
  head: ['ID', 'Name', 'Department', 'Price', 'Stock']
  , colWidths: [40,40,40,40,40]
});

function productTable() {
  products = new Table({
    head: ['ID', 'Name', 'Department', 'Price', 'Stock']
    , colWidths: [40,40,40,40,40]
  });
}

function insertProducts(id, name, dep, price, stock) {
  products.push(
    [id, name, dep, price, stock]
  );
}


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'bamazonDB'
});

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  
  console.log('connected as id ' + connection.threadId);

  // buyProduct(1, 2);
  printProducts();
  inquirer.prompt([
    {
      type: "input",
      message: 'Enter the ID of the product you would like to buy',
      name: "product"
    },
    {
      type: 'input',
      message: 'How many would you like to buy?',
      name: 'amount'
    }
  ]).then(function(response) {
    buyProduct(response.product, response.amount);
  });
});


function printProducts() {

  connection.query("SELECT * FROM products", function(err, res) {
    // console.log(res);

    productTable();

    for( let i = 0; i < res.length; i++) {
      insertProducts(res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock);
    }
    console.log("\n" + products.toString());
  })
}

// printProducts();


function buyProduct(id, units) {
  let stock = 0;
  let price = 0;
  connection.query("SELECT * from products where item_id=?", id, function(err, res) {
    // console.log(res)
    stock = res[0].stock;
    price = res[0].price;
    // console.log(stock);
    if (stock < 1) {
      console.log("Not enough stock to buy that item");
      connection.end();
    }else {
      connection.query("UPDATE products SET stock=? WHERE item_id=?",[stock-units,id], function(err, res) {
        // if(err) return err;
        connection.end();
      })
      printProducts();
      console.log("\nYour total is " + price * units);
    }
  })
}