import GrupoRepository from "../Repository/GrupoRepository.js";

export const getAllGrupos = async (req, res) => {
    try {
        const list = await GrupoRepository.findAll();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los grupos' });
    }
};

export const getGrupo = async (req, res) => {
    try {
        const grupo = await GrupoRepository.findById(req.params.id);
        if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
        res.json(grupo);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el grupo' });
    }
}

export const getGrupoByMatricula = async (req, res) => {
    try {
        const grupo = await GrupoRepository.findByMatricula(req.params.matricula);
        if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
        res.json(grupo);
    } catch {
        res.status(500).json({ error: 'Error al obtener el grupo' });
    }
}

export const createGrupo = async (req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: 'Se requiere la información del grupo' });
        const grupo = await GrupoRepository.create(req.body);
        res.status(201).json(grupo);
    } catch (error){
        res.status(500).json({ error: 'Error al crear el grupo' });
    }
}

export const updateGrupo = async (req, res) => {
    try {
        const grupo = await GrupoRepository.update(req.params.id, req.body);
        if (!grupo) return res.status(404).json({ error: 'Grupo no encontrado' });
        res.json(grupo);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el grupo' });
    }
}

export const deleteGrupo = async (req, res) => {
    try {
        const ok = await GrupoRepository.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Grupo no encontrado' });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el grupo' });
    }
}

