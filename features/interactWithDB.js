//jshint esversion: 8
const mongoose = require('mongoose');
require('dotenv').config();
const env = process.env;
const urlDB = env.urlDB; 

mongoose.connect(urlDB).then(()=> console.log('Connected to database!')).catch(err => console.log(err));

const boardComponentsSchema = new mongoose.Schema({
    name: String,
    data: [String],
    number: Number
});    

const boardComponent = new mongoose.model('wolvesville_datas', boardComponentsSchema);

const saveData = async function(name, data){
    let component = new boardComponent({
        name: name,
        data: data
    }); 
    return component.save();
};

const getData = async function(name){
    let filter = {
        name: name
    };
    let data = await boardComponent.findOne(filter);
    return data.data;
};

const updateData = async function(nameOfData, update){
    let filter = {
        name: nameOfData
    };
    let updateData = {
        data : update
    };
    return boardComponent.findOneAndUpdate(filter, updateData);
};


module.exports.save = saveData;
module.exports.get = getData;
module.exports.update = updateData;
