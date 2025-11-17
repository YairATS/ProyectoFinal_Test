import ContactoRepository from "../Repository/ContactoRepository.js";

export const getAllContactos = async (req, res) => {
    try {
        const list = await ContactoRepository.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los contactos' });
    }
};

export const getContacto = async (req, res) => {
    try {
        const contacto = await ContactoRepository.findById(req.params.id);
        if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
        res.json(contacto);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el contacto' });
    }
}


export const createContacto = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: 'Se requiere la información del contacto' });
        const contacto = await ContactoRepository.create(req.body);
        res.status(201).json(contacto);
    } catch (error){
        res.status(500).json({ error: 'Error al crear el contacto' });
    }
}

export const updateContacto = async (req, res) => {
    try {
        const contacto = await ContactoRepository.update(req.params.id, req.body);
        if (!contacto) return res.status(404).json({ error: 'Contacto no encontrado' });
        res.json(contacto);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el contacto' });
    }
}

export const deleteContacto = async (req, res) => {
    try {
        const ok = await ContactoRepository.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Contacto no encontrado' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el contacto' });
    }
}

