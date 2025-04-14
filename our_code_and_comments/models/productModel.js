const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, '../data/products.json');

//get all products
async function getAllProducts() {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data).products;
    } catch (err) {
        if (err.code === 'ENOENT') {
            //if the file doesnt exist, return empty array
            return [];
        }
        throw err;
    }
}

//get a single product by ID
async function getProductById(id) {
    const products = await getAllProducts();
    return products.find(product => product.id === parseInt(id));
}

//create a new product
async function createProduct(product) {
    const products = await getAllProducts();

    //generate new ID (max ID + 1)
    const newID = products.length > 0
    ? Math.max(...products.map(p => p.id)) + 1
    : 1;

    const newProduct = {id: newID, ...product};
    products.push(newProduct);

    await fs.writeFile(
        dataFile,
        JSON.stringify({products}, null, 2)
    );
    return newProduct;    

}

//update an existing product
async function updateProduct(id, updatedProduct) {
    const products = await getAllProducts();
    const index = products.findIndex(product => product.id === parseInt(id));

    if (index === -1) return null;

    products[index] = {...products[index], ...updatedProduct};
    
    await fs.writeFile(
        dataFile,
        JSON.stringify({products}, null, 2)
    );
    return products[index];
}

//delete a product
async function deleteProduct(id) {
    const products = await getAllProducts();
    const index = products.finxIndex(product => product.id === parseInt(id));

    if (index === -1) return false;

    products.splice(index, 1);

    await fs.writeFile(
        dataFile,
        JSON.stringify({products}, null, 2)
    );
    return true;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};