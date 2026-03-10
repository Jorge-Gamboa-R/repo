require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// Conexión a Mongo
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log(JSON.stringify({
        level: "info",
        event: "database_connection",
        status: "success",
        message: "Mongo conectado",
        timestamp: new Date()
    }));
})
.catch(err => {
    console.error(JSON.stringify({
        level: "error",
        event: "database_connection",
        status: "failure",
        message: "Error conectando a Mongo",
        error: err.message,
        timestamp: new Date()
    }));
});

// Esquema con validación básica
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
});

const Item = mongoose.model("Item", ItemSchema);

// ============================
// CREAR (POST)
// ============================

app.post("/items", async (req, res) => {
    try {

        console.log(JSON.stringify({
            level: "info",
            event: "create_item_attempt",
            body: req.body,
            timestamp: new Date()
        }));

        if (!req.body.name) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }

        const item = new Item(req.body);
        await item.save();

        console.log(JSON.stringify({
            level: "info",
            event: "item_created",
            itemId: item._id,
            timestamp: new Date()
        }));

        res.status(201).json(item);

    } catch (error) {

        console.error(JSON.stringify({
            level: "error",
            event: "create_item_error",
            error: error.message,
            timestamp: new Date()
        }));

        res.status(500).json({ error: "Error al crear item" });
    }
});

// ============================
// LEER TODOS (GET)
// ============================

app.get("/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener items" });
    }
});

// ============================
// ACTUALIZAR (PUT)
// ============================

app.put("/items/:id", async (req, res) => {
    try {

        if (!req.body.name) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }

        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!item) {
            return res.status(404).json({ error: "Item no encontrado" });
        }

        console.log(JSON.stringify({
            level: "info",
            event: "update_item",
            itemId: req.params.id,
            timestamp: new Date()
        }));

        res.status(200).json(item);

    } catch (error) {
        res.status(500).json({ error: "Error al actualizar item" });
    }
});

// ============================
// ELIMINAR (DELETE)
// ============================

app.delete("/items/:id", async (req, res) => {
    try {

        const item = await Item.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ error: "Item no encontrado" });
        }

        console.log(JSON.stringify({
            level: "info",
            event: "delete_item",
            itemId: req.params.id,
            timestamp: new Date()
        }));

        res.status(200).json({ message: "Item eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ error: "Error al eliminar item" });
    }
});


// ============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});