import * as mongoose from 'mongoose';

export const ConsumoSchema = new mongoose.Schema({
    userId: {
        type: Number,
        ref: 'User',
        required: true
    },
    consumoAgua: {
        type: Number,
        required: true,
        min: 0
    },
    dataLeitura: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface Consumo extends mongoose.Document{
    id: string;
    userId: number;
    consumoAgua: number;
    dataLeitura: Date;
};