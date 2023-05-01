import { Router } from "express";
import ProductManager from "../Managers/productManager.js";

const router = Router();
const manager = new ProductManager();

router.get('/', async (req,res)=>{
    try {
        const products = await manager.getProducts();
        res.render('products',{products})
    } catch (error) {
        res.status(500).send({status:"error", error: "Error al obtener productos"})
    }
})
router.get('/realTimeProducts', async(req,res)=>{
    const products = await manager.getProducts();
    res.render('realTimeProducts', {products});
})
export default router;