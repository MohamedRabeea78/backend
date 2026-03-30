const j = require('joi');

const addItem = {
    body: j.object().keys({
        vId: j.string().guid().required(),
        q: j.number().integer().min(1).default(1)
    })
};

const updateItem = {
    body: j.object().keys({
        vId: j.string().guid().required(),
        q: j.number().integer().min(1).required()
    })
};

const removeItem = {
    params: j.object().keys({
        vId: j.string().guid().required()
    })
};

module.exports = { addItem, updateItem, removeItem };