import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema({
    common_name: {type: String, required: true},
    img_url: {type: String, required: true},
    description: {type: String, required: true},
    kingdom: {type: String},
    phylum: {type: String},
    subphylum: {type: String},
    class: {type: String},
    infraclass: {type: String},
    order: {type: String},
    suborder: {type: String},
    infraorder: {type: String},
    superorder: {type: String},
    family: {type: String},
    subfamily: {type: String},
    superfamily: {type: String},
    genus: {type: String},
    subgenus: {type: String},
    species: {type: String},
    'subspecies of': {type: String},
})

export const AnimalModel = mongoose.model('Mammal', AnimalSchema)
export const getAnimals = (sample_size: number) => AnimalModel.aggregate([{ $sample: { size: sample_size } }]);
export const getAnimalById = (id: string) => AnimalModel.findById(id)
export const getAnimalByFilter = (query: Record<string, any>) => AnimalModel.find(query)
export const updateAnimalById = (id: string, values: Record<string, any>) => AnimalModel.findByIdAndUpdate(id, values)
