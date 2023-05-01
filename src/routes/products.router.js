import { Router } from "express";
import ProductManager from "../Managers/productManager.js";

const router = Router();
const manager = new ProductManager();
const products = manager.getProducts();

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const allProducts = await products;
  if (limit) {
    const limitProduct = allProducts.slice(0, limit);
    res.json(limitProduct);
  } else {
    res.json(allProducts);
  }
});

router.get(`/:pid`, async (req, res) => {
  const idProducts = req.params.pid;
  const allProducts = await products;
  const selected = allProducts.find((p) => p.id == idProducts);
  res.send(selected);
});
router.post("/", async (req, res) => {
  try {
    const newProduct = req.body;
    await manager.addProduct(newProduct);
    const products = await manager.getProducts();
    req.io.emit('products', products);
    res.send({ status: "succes", message: "product posted" });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:pId", async (req, res) => {
  const products_ = await products;
  const id = req.params.pId;
  const productIndex = products_.findIndex((p) => p.id == id);
  if (productIndex === -1) {
    return res
      .status(404)
      .send({ status: "error", error: "Product not found" });
  }
  products_.splice(productIndex, 1);
  manager.deleteProduct(products_);
  req.io.emit('products', products_);
  res.send({ status: "succes", message: "product deleted" });
});

router.put(`/:pId`, async (req, res) => {
  const allProducts = await products;
  const id = req.params.pId;
  const newContent = req.body;
  const productIndex = allProducts.findIndex((p) => p.id == id);
  if (productIndex === -1) {
    return res
      .status(404)
      .send({ status: "error", error: "Product not found" });
  }
  allProducts[productIndex] = newContent;
  manager.updateProduct(id, newContent);
  res.send({ status: "succes", message: "Product updated" });
});

export default router;
